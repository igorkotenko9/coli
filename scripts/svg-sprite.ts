import path from "path";

import consola from "consola";
import fg from "fast-glob";
import fs from "fs-extra";
import { format } from "prettier";
import SVGSpriter from "svg-sprite";

export interface Options {
  /**
   * Input directory
   *
   * @default 'src/assets/images/svg/*.svg'
   */
  icons?: string;
  /**
   * Output directory
   *
   * @default 'src/public/images'
   */
  outputDir?: string;

  /**
   * sprite-svg {@link https://github.com/svg-sprite/svg-sprite/blob/main/docs/configuration.md#sprite-svg-options|options}
   */
  sprite?: SVGSpriter.Config;
}

const normalizePath = (filePath: string) => {
  const normalizedPath = path.posix
    .normalize(filePath)
    .replaceAll("\\", "/")
    .replace(/^\//, "");

  return normalizedPath;
};

const getPathFromRoot = (filePath: string) => {
  return normalizePath(
    normalizePath(filePath).replace(normalizePath(root), ""),
  );
};

const ICONS_BASE_NAME = "icons";
const root = process.cwd();

const isSvg = (path: string) => /\.svg$/.test(path);

const generatePathId = (iconsRoot: string, dirPath: string) => {
  return normalizePath(dirPath) === normalizePath(iconsRoot)
    ? ICONS_BASE_NAME
    : normalizePath(path.basename(dirPath));
};

const generateSvgIds = async (
  filesData: Map<
    string,
    {
      name: string;
      parent: string;
    }
  >,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  const filesNamesMap = new Map<
    string,
    | {
        parent: string;
        path: string;
      }
    | {
        parent: string;
        path: string;
      }[]
  >();

  for (const [path, value] of filesData.entries()) {
    const fileName = value.name;

    if (filesNamesMap.has(fileName)) {
      const previousValue = filesNamesMap.get(fileName);

      if (!previousValue) continue;

      const newValue = Array.isArray(previousValue)
        ? [
            ...previousValue,
            {
              path,
              parent: value.parent,
            },
          ]
        : [
            previousValue,
            {
              path,
              parent: value.parent,
            },
          ];

      filesNamesMap.set(fileName, newValue);
    } else {
      filesNamesMap.set(fileName, {
        path,
        parent: value.parent,
      });
    }
  }

  const mappedIcons = new Map<
    string,
    {
      id: string;
      path: string;
    }[]
  >();

  for (const [name, value] of filesNamesMap.entries()) {
    if (Array.isArray(value)) {
      for (const item of value) {
        const id = `${name}--${item.parent}`;

        mappedIcons.set(item.parent, [
          ...(mappedIcons.get(item.parent) || []),
          {
            id,
            path: item.path,
          },
        ]);
      }
    } else {
      const id = name;

      mappedIcons.set(value.parent, [
        ...(mappedIcons.get(value.parent) || []),
        {
          id,
          path: value.path,
        },
      ]);
    }
  }

  const idsMap = new Map<string, string[]>();

  for (const [key, value] of mappedIcons.entries()) {
    for (const item of value) {
      idsMap.set(key, [...(idsMap.get(key) || []), item.id]);
    }
  }

  const svgIds: Map<string, string> = new Map();

  for (const [, value] of mappedIcons.entries()) {
    for (const item of value) {
      svgIds.set(item.path, item.id);
    }
  }

  const mappedIdsString = JSON.stringify(Object.fromEntries(idsMap), null, 2);

  await fs.outputFile(
    `${root}/src/generated/icons.ts`,
    await format(
      /*ts*/
      `
        export const ICONS_MAP = ${mappedIdsString} as const;\n
        export type IconsIds = (typeof ICONS_MAP)[keyof typeof ICONS_MAP][number];
      `,
      {
        parser: "babel-ts",
      },
    ),
  );

  return svgIds;
};

function generateConfig(
  options: Options & {
    idsMap: Map<string, string>;
    outputDir: string;
    outputFileName: string;
  },
) {
  const { outputDir, outputFileName, idsMap } = options;

  return {
    dest: normalizePath(path.resolve(root, outputDir)),
    mode: {
      symbol: {
        sprite: `../${outputFileName}.svg`,
      },
    },
    svg: {
      xmlDeclaration: false,
    },
    shape: {
      id: {
        generator: (fileName: string, file: any) => {
          const filePath = getPathFromRoot(file.path);

          return idsMap.get(filePath);
        },
      },
      transform: [
        {
          svgo: {
            plugins: [
              {
                name: "preset-default",
                params: {
                  overrides: {
                    convertColors: false,
                  },
                },
              },
              {
                type: "visitor",
                name: "replace-values",
                fn: () => {
                  return {
                    element: {
                      enter: (node: any) => {
                        if (node.name !== "svg" && node.name !== "symbol") {
                          if (
                            node.attributes.fill &&
                            node.attributes.fill !== "currentColor" &&
                            node.attributes.fill !== "none"
                          ) {
                            node.attributes.fill = "currentColor";
                          }
                          if (
                            node.attributes.stroke &&
                            node.attributes.stroke !== "currentColor" &&
                            node.attributes.stroke !== "none"
                          ) {
                            node.attributes.stroke = "currentColor";
                          }
                        }
                      },
                    },
                  };
                },
              },
              "removeXMLNS",
            ],
          },
        },
      ],
    },
    ...options.sprite,
  };
}

async function generateSvgSprite(
  options: Options & {
    iconsRoot: string;
    idsMap: Map<string, string>;
    outputDir: string;
    sourceDir: string;
  },
) {
  const { sourceDir, outputDir, iconsRoot, idsMap } = options;

  const outputFileName = generatePathId(iconsRoot, sourceDir);

  const spriter = new SVGSpriter(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    generateConfig({
      ...options,
      outputDir,
      outputFileName,
      idsMap,
    }),
  );
  const entries = await fg(`${sourceDir}/*.svg`);

  for await (const entry of entries) {
    if (isSvg(entry)) {
      try {
        const fileName = path.basename(entry);

        const svgContentString = await fs.readFile(entry, { encoding: "utf8" });

        spriter.add(normalizePath(entry), fileName, svgContentString);
      } catch (error) {
        console.log("Ошибка при добавлении файла в спрайт", error);
      }
    }
  }

  const { result } = await spriter.compileAsync();

  const spriteContents = result.symbol.sprite.contents.toString("utf8");

  return {
    path: result.symbol.sprite.path,
    content: spriteContents,
  };
}

export async function generateSvgSprites(
  options?: Options & {
    iconsSource: string;
    outputDir: string;
  },
) {
  consola.start("Start sprite generation...");

  try {
    const { iconsSource, outputDir } = {
      iconsSource: "./src/assets/icons",
      outputDir: "./public/images/icons/generated/sprites",
      ...options,
    };

    const entries = await fg(`${iconsSource}/**/*.svg`);

    const foldersPathes = Array.from(
      new Set(entries.map((element) => normalizePath(path.dirname(element)))),
    );

    const filesData = new Map<
      (typeof entries)[number],
      { name: string; parent: string }
    >();

    for (const entry of entries) {
      const dirPath = normalizePath(path.dirname(entry));

      const parentName = generatePathId(iconsSource, dirPath);
      const normalizedEntry = normalizePath(entry);

      filesData.set(normalizedEntry, {
        name: path.parse(entry).name,
        parent: parentName,
      });
    }

    const idsMap = await generateSvgIds(filesData);

    const spritesMap = new Map<any, any>();

    for await (const folderPath of foldersPathes) {
      const generatedSprite = await generateSvgSprite({
        sourceDir: folderPath,
        outputDir,
        iconsRoot: iconsSource,
        idsMap,
      });

      spritesMap.set(generatedSprite.path, generatedSprite.content);
    }

    for await (const [path, content] of spritesMap.entries()) {
      await fs.outputFile(path, content, { encoding: "utf8" });
    }

    consola.success("Sprites generated successfully");
  } catch (error) {
    consola.error("Error while generating sprites", error);
  }
}
