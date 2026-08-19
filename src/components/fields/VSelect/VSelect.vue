<template>
  <VMenu
    v-model:is-show-dropdown="isShowDropdown"
    class="v-select"
    :anchor-element="fieldRefElement"
    :dropdown-offset="dropdownOffset"
    :hover-append-arrow="hoverAppendArrow"
    @close-without-focus="menuClickOutsideHandler"
    @focusin:dropdown="dropdownFocusinHandler"
  >
    <template #control="{ keydownHandler }">
      <slot
        name="control"
        v-bind="controlSlotProps"
        :displayed-model="displayedModel"
        :keydown="
          (event: KeyboardEvent) => {
            (fieldKeydownHandler(event), keydownHandler(event));
          }
        "
        :mousedown-control="fieldMousedownControlHandler"
        :is-show-dropdown="isShowDropdown"
      >
        <VTextField
          ref="fieldRef"
          v-bind="filteredTextFieldProps"
          v-model:focused="isFocusedProxy"
          class="v-select__field"
          :class="{
            'v-select__field--active': isDirty,
          }"
          readonly
          :clearable="isNotClearable ? false : isDirty"
          :cursor="cursor"
          :dirty="isDirty"
          :model-value="displayedModel"
          :placeholder="placeholderText"
          :hover-append-arrow="hoverAppendArrow"
          :is-tooltip-messages="isTooltipMessages"
          @click:clear="textFieldClickClearHandler"
          @keydown="[fieldKeydownHandler($event), keydownHandler($event)]"
          @mousedown:control="fieldMousedownControlHandler"
        >
          <template #default>
            <div
              class="v-select__selection"
              :class="{ 'v-select__selection--column': hoverAppendArrow }"
            >
              <div v-if="isDirty" class="v-select__selection-text">
                {{
                  !displayedModel && customPlaceholder ? "-" : displayedModel
                }}
              </div>
            </div>
          </template>
          <template #append-inner>
            <VIcon
              v-if="!hoverAppendArrow"
              class="v-select__dropdown-icon"
              :class="{
                'v-select__dropdown-icon--active': isShowDropdown,
              }"
              icon-name="arrow-down-3"
              inert
            />
            <div
              v-else
              class="v-select__column-dropdown-icon"
              :class="{
                'v-select__column-dropdown-icon--active': isShowDropdown,
              }"
            />
          </template>
        </VTextField>
      </slot>
    </template>
    <template #dropdown="{ fieldWidth }">
      <div
        class="v-select__menu"
        :class="{
          'v-select__menu--large': menuVariation === 'large',
          'v-select__menu--column': hoverAppendArrow,
        }"
        :style="{
          minWidth: hoverAppendArrow
            ? `${Math.min(parseFloat((fieldWidth || '0') as string) - 2)}px`
            : `${Math.max(parseFloat(fieldWidth || '0'), 200)}px`,
          maxWidth: menuMaxWidth,
        }"
      >
        <template v-if="isAsyncSearchable">
          <CustomScrollbar
            v-if="showChosen && localModel?.length"
            class="v-select__chosen-options-wrapper"
            always
          >
            <VList class="v-select__chosen-options">
              <VChip
                v-for="option in localModel"
                :key="option.id"
                class="v-select__chosen-option"
                variation="input"
                :text="option.value"
                :title="option.value"
              >
                <template #end>
                  <IconButton
                    class="v-select__chosen-option-remove-button"
                    icon-group="navigation"
                    icon-name="cancel"
                    mode="button"
                    variation="circle"
                    @click="removeChosenOption(option as T)"
                  />
                </template>
              </VChip>
            </VList>
          </CustomScrollbar>
          <div v-if="isAsyncSearchable" class="v-select__menu-header">
            <VTextField
              v-model="search"
              class="v-select__options-search-field"
              autofocus
              placeholder="Введите минимум 3 символа для поиска"
              prepend-inner-icon="magnifier-input"
            />
          </div>
        </template>

        <CustomScrollbar
          v-if="filteredOptions?.length"
          class="v-select__menu-list-wrapper"
          always
        >
          <VList class="v-select__menu-list">
            <SelectListItem
              v-if="isShowImmaginaryAllOption"
              class="v-select__menu-list-item"
              :active="isImmaginaryAllOptionActive"
              :multiple="multiple"
              :value="IMAGINARY_ALL_ITEM.value"
              @click="localModel = null"
            />
            <SelectListItem
              v-for="option in filteredOptions"
              :key="option.id"
              class="v-select__menu-list-item"
              :class="{
                'v-select__menu-list-item--group-end': option.groupEnd === true,
              }"
              :active="getElementActivity(option)"
              :disabled="option.props?.disabled || option.disabled"
              :multiple="multiple"
              :value="option.value"
              @click="menuItemClickHandler(option)"
            />
            <LazyBlock
              v-if="isCanLoadMore"
              :key="lazyBlockKey"
              class="v-select__lazy-block"
              @intersecting="lazyBlockIntersectHandler"
            />
          </VList>
        </CustomScrollbar>
        <div
          v-if="optionsListPlaceholderText"
          class="v-select__list-placeholder-text"
          :class="{
            'v-select__list-placeholder-text--loading': isFetchingOptions,
          }"
        >
          {{ optionsListPlaceholderText }}
        </div>

        <VButton
          v-if="isShowApplyButton"
          class="v-select__apply-button"
          :disabled="isModelsEqual || isFetchingOptions"
          :is-loading="isFetchingOptions"
          @click="applyButtonClickHandler"
          >Применить</VButton
        >
      </div>
    </template>
  </VMenu>
</template>

<script lang="ts">
import { type ExtractPropTypes, type PropType } from "vue";

import { deepEqual } from "fast-equals";
import { omit } from "lodash";

import { propsFactory } from "@/utils";

import VChip from "@components/VChip";
import IconButton from "@components/buttons/IconButton";
import VButton from "@components/buttons/VButton";
import { getVMenuProps } from "@components/dropdowns/VMenu";
import {
  type VTextFieldEmits,
  filterVTextFieldProps,
  getVTextFieldProps,
} from "@fields/VTextField";
export type SelectOption = {
  disabled?: boolean;
  groupEnd?: boolean;
  id: number | string;
  props?: {
    disabled: boolean;
  };
  value: string;
};

export type ModelValue<T extends SelectOption = SelectOption> = T[] | null;
export type Options<T extends SelectOption = SelectOption> = T[] | null;

const IMAGINARY_ALL_ITEM = {
  id: "imaginary_all",
  value: "Все",
};

export const getProps = propsFactory({
  ...omit(getVTextFieldProps(), ["modelValue", "type"]),
  ...pick(getVMenuProps(), ["dropdownOffset"]),
  multiple: Boolean,
  showChosen: {
    type: Boolean,
    default: true as const,
  },
  asyncDataPath: {
    type: String,
  },
  asyncDataPayload: {
    type: Object as PropType<Record<string, any> | null>,
    default: null,
  },
  menuVariation: String as PropType<"large">,
  hoverAppendArrow: {
    type: Boolean,
    default: false,
  },
  preloadOptions: {
    type: Boolean,
    default: false,
  },
  preloadOptionsCount: {
    type: Number,
    default: 20,
  },
  menuMaxWidth: String,
  immediate: {
    type: Boolean,
    default: true,
  },
  mockAllOption: {
    type: Boolean,
    default: false,
  },
  customPlaceholder: {
    type: Boolean,
    default: false,
  },
});
export type Props = ExtractPropTypes<ReturnType<typeof getProps>> & {
  modelValue: ModelValue;
  options: Options;
};
export type Emits = Omit<VTextFieldEmits, "update:model-value">;
</script>

<script setup lang="ts" generic="T extends SelectOption = SelectOption">
import {
  type ComponentPublicInstance,
  computed,
  ref,
  toValue,
  watch,
} from "vue";

import { useDebounceFn } from "@vueuse/core";
import { pick, uniqBy } from "lodash";

import { useAxios } from "@hooks/useAxios";

import LazyBlock from "@components/LazyBlock";
import SelectListItem from "@components/SelectListItem";
import VIcon from "@components/VIcon";
import VList from "@components/VList";
import VMenu from "@components/dropdowns/VMenu";
import CustomScrollbar from "@components/scroll/CustomScrollbar";
import VTextField from "@fields/VTextField";

const props = defineProps({
  ...getProps(),
});
const emit = defineEmits<Emits>();
const filteredTextFieldProps = filterVTextFieldProps(props);

const proxiedModel = defineModel("modelValue", {
  type: Array as PropType<ModelValue<T> | null>,
  default: null,
});
const localModel = ref<ModelValue<T> | null>(null);

const isModelsEqual = computed(() => {
  return deepEqual(proxiedModel.value, localModel.value);
});

watch(
  proxiedModel,
  () => {
    if (!isModelsEqual.value) {
      localModel.value = proxiedModel.value;
    }
  },
  { immediate: true },
);

watch(
  localModel,
  () => {
    if (!isModelsEqual.value && props.immediate) {
      proxiedModel.value = toValue(localModel) as ModelValue<T>;
    }
  },
  { immediate: true },
);

const isShowDropdown = ref<boolean>(false);

watch(isShowDropdown, () => {
  if (isShowDropdown.value && !isModelsEqual.value) {
    localModel.value = toValue(proxiedModel);
  }
});

const isShowImmaginaryAllOption = computed<boolean>(() => {
  return Number(filteredOptions.value?.length) > 1 && props.mockAllOption;
});

const isDisplayImmaginaryAllOptionAsInputValue = computed<boolean>(() => {
  return Boolean(
    props.mockAllOption &&
    (Number(filteredOptions.value?.length) > 0 ||
      isShowImmaginaryAllOption.value ||
      props.asyncDataPath),
  );
});

const isImmaginaryAllOptionActive = computed<boolean>(() => {
  return !localModel.value?.length;
});

const displayedModel = computed<string>(() => {
  if (!proxiedModel.value?.length) return "";

  return proxiedModel.value.length > 1
    ? `Выбрано: ${proxiedModel.value.length}`
    : (proxiedModel.value[0]?.value ?? "");
});

const placeholderText = computed(() => {
  return (
    (isDisplayImmaginaryAllOptionAsInputValue.value &&
      IMAGINARY_ALL_ITEM.value) ||
    props.placeholder
  );
});

const proxiedOptions = defineModel("options", {
  type: Array as PropType<Options<T> | null>,
  default: null,
});

const fieldRef = ref<
  ComponentPublicInstance | Element | InstanceType<typeof VTextField> | null
>(null);
const fieldRefElement = computed<HTMLElement | null>(() => {
  if (!fieldRef.value) return null;

  if ("fieldRef" in fieldRef.value) {
    return fieldRef.value?.fieldRef?.$el;
  } else if ("$el" in fieldRef.value) {
    return fieldRef.value?.$el;
  } else if (fieldRef.value) {
    return fieldRef.value;
  }

  return null;
});

const isFocused = ref<boolean>(false);
const isFocusedProxy = computed({
  get: () => {
    return typeof props.focused === "boolean" ? props.focused : isFocused.value;
  },
  set: (value: boolean) => {
    isFocused.value = value;

    if (typeof props.focused === "boolean") {
      emit("update:focused", value);
    }
  },
});

const search = ref<null | string>(null);

const isFetchingOptions = ref<boolean>(false);

const isAsyncSearchable = computed<boolean>(() => {
  return Boolean(props.asyncDataPath && props.name);
});

let lazyBlockIntersectHandler: () => void;

const isCanLoadMore = ref<boolean>(false);
const lazyBlockKey = ref<number>(0);
const shouldPreloadOptions = computed<boolean>(() =>
  Boolean(
    isAsyncSearchable.value &&
    props.preloadOptions &&
    props.preloadOptionsCount,
  ),
);

if (props.asyncDataPath && props.name) {
  const {
    execute: fetchOptions,
    data: optionsData,
    abort: abortOptionsFetch,
  } = useAxios<{
    canLoadMore: boolean;
    list: T[] | null;
  }>(
    props.asyncDataPath,
    {
      method: "post",
    },
    {
      onError: () => {
        isFetchingOptions.value = false;
      },
    },
  );

  const updateOptions = async () => {
    const _search = toValue(search);

    isFetchingOptions.value = true;

    await fetchOptions({
      data: {
        field: props.name,
        search: search.value,
        offset: Number(proxiedOptions.value?.length) + 1,
        limit: props.preloadOptionsCount,
        ...props.asyncDataPayload,
      },
    });

    lazyBlockKey.value++;
    isCanLoadMore.value = Boolean(optionsData.value?.canLoadMore);

    if (optionsData.value && _search === search.value) {
      proxiedOptions.value = uniqBy(
        [...(proxiedOptions.value || []), ...(optionsData.value?.list || [])],
        "id",
      );
    }

    isFetchingOptions.value = false;
  };

  const updateOptionsDebounced = useDebounceFn(updateOptions, 1000);

  watch(
    search,
    (newValue, oldValue) => {
      const newSearch = toValue(newValue);
      const oldSearch = toValue(oldValue);
      const newSearchLength = newSearch?.length || 0;
      const oldSearchLength = oldSearch?.length || 0;

      const isSearchCleaned = !newSearch && oldSearchLength > 0;

      const shouldFetchNewOptions =
        (newSearch && newSearchLength >= 3) ||
        (isSearchCleaned && shouldPreloadOptions.value);

      const shouldCancelFetching =
        (newSearchLength > 0 && newSearchLength < 3 && oldSearchLength >= 3) ||
        (isSearchCleaned && !shouldPreloadOptions.value);

      if (shouldFetchNewOptions) {
        proxiedOptions.value = null;
        isFetchingOptions.value = true;
        updateOptionsDebounced();
      } else if (shouldCancelFetching) {
        abortOptionsFetch();
        isFetchingOptions.value = false;
        if (isSearchCleaned) {
          proxiedOptions.value = null;
        }
      }
    },
    {
      immediate: true,
    },
  );

  watch(
    isShowDropdown,
    (newValue) => {
      if (newValue && shouldPreloadOptions.value) {
        updateOptions();
      }
    },
    {
      once: true,
    },
  );

  lazyBlockIntersectHandler = () => {
    if (!isFetchingOptions.value && Boolean(proxiedOptions.value?.length)) {
      updateOptionsDebounced();
    }
  };
}

const isNotClearable = computed<boolean>(() => props.clearable === false);
const isDirty = computed<boolean>(() => {
  return (
    Boolean(proxiedModel.value?.length) ||
    props.dirty ||
    props.customPlaceholder
  );
});
const isShowApplyButton = computed<boolean>(() => {
  return Boolean(!props.immediate);
});

const getElementActivity = (option: T) => {
  return Boolean(
    localModel.value?.find((modelOption) => modelOption.id === option.id),
  );
};

const filteredOptions = computed<T[] | null>(() => {
  if (props.showChosen) return toValue(proxiedOptions);

  const options = toValue(proxiedOptions) || [];
  const activeOptions = toValue(localModel) || [];

  const withoutChosen = options.filter((option) => {
    return !activeOptions.some((modelOption) => modelOption.id === option.id);
  });

  return (withoutChosen?.length && withoutChosen) || null;
});

watch(
  () => props.multiple,
  () => {
    proxiedModel.value = null;
  },
);

const menuItemClickHandler = (item: T): void => {
  if (props.multiple) {
    const newModel: T[] = localModel.value
      ? [...(localModel.value as T[])]
      : [];
    const isAlreadyInArray: boolean = newModel.some(
      (option) => option.id === item.id,
    );

    if (isAlreadyInArray) {
      const index: number = newModel.findIndex(
        (option) => option.id === item.id,
      );
      newModel.splice(index, 1);
    } else {
      newModel.push(item);
    }

    localModel.value = newModel.length === 0 ? null : [...newModel];
  } else {
    const firstElementInModelId = localModel.value?.[0]?.id;

    localModel.value = item?.id === firstElementInModelId ? null : [item];

    if (props.immediate) {
      isShowDropdown.value = false;
    }
  }
};

const dropdownFocusinHandler = () => {
  isFocused.value = true;
};

const fieldMousedownControlHandler = () => {
  if (props.disabled) return;

  isShowDropdown.value = !isShowDropdown.value;
};

const menuClickOutsideHandler = () => {
  isShowDropdown.value = false;
  isFocused.value = false;
};

const fieldKeydownHandler = (event: KeyboardEvent) => {
  const { key } = event;
  const validKeys = ["Enter", " ", "ArrowDown", "ArrowUp", "Home", "End"];
  const dropdownKeys = ["Enter", "ArrowDown", " "];
  const hideKeys = ["Escape", "Tab"];

  if (!key || props.readonly) return;

  if (validKeys.includes(key)) {
    event.preventDefault();
  }

  if (dropdownKeys.includes(key)) {
    isShowDropdown.value = true;
  }

  if (hideKeys.includes(key)) {
    isShowDropdown.value = false;
  }
};

const textFieldClickClearHandler = () => {
  proxiedModel.value = null;
  emit("click:clear");
};

const optionsListPlaceholderText = computed(() => {
  const _search = toValue(search);
  const _isLoading = toValue(isFetchingOptions);
  const _isAsyncSearchable = toValue(isAsyncSearchable);
  const searchLength = _search?.length || 0;
  const hasShowedOptions = Boolean(toValue(filteredOptions)?.length);

  if (hasShowedOptions) return null;
  if (!_isAsyncSearchable) return "Элементы отсутствуют";

  if (_isLoading && searchLength < 3) return "Загрузка элементов";

  if (_isLoading) return "Поиск по заданным параметрам";
  return searchLength >= 3 ? "Ничего не найдено" : null;
});

const removeChosenOption = (option: T) => {
  if (localModel.value === null || !localModel.value?.length) return;

  localModel.value = localModel.value.filter((item) => item.id !== option.id);
};

const applyButtonClickHandler = () => {
  proxiedModel.value = localModel.value as T[];
  isShowDropdown.value = false;
};

const controlSlotProps = computed(() => {
  return {
    setTrigger: (
      value:
        | ComponentPublicInstance
        | Element
        | InstanceType<typeof VTextField>
        | null,
    ) => {
      fieldRef.value = value;
    },
  };
});

defineExpose({
  isFocused,
  vSelectTextFieldRef: fieldRef,
});
</script>

<style scoped lang="scss">
@use "@style/mixins" as mixins;

@keyframes dotty {
  0% {
    content: "\2008\2008\2008";
  }

  25% {
    content: ".\2008\2008";
  }

  50% {
    content: "..\2008";
  }

  75% {
    content: "...";
  }

  100% {
    content: "\2008\2008\2008";
  }
}

.v-select {
  &__field {
    --v-field-cursor: pointer;
    position: relative;

    display: var(--v-select-display);

    height: var(--v-select-height);

    /* stylelint-disable-next-line selector-max-compound-selectors */
    :deep(input) {
      position: absolute;
      top: var(--input-padding-top);

      flex-basis: 0;
      flex-grow: 0;
      align-self: flex-start;

      width: 100%;

      background-color: transparent;
      opacity: 1;

      transition: none;

      pointer-events: none;
      caret-color: transparent;
    }

    &--active {
      /* stylelint-disable-next-line selector-max-compound-selectors */
      :deep(input) {
        opacity: 0;
      }
    }
  }

  &__dropdown-icon {
    flex-shrink: 0;

    width: 24px;
    height: 24px;

    color: currentcolor;

    transition-property: rotate;
    transition-duration: var(--app-transition-duration-1);
    transition-timing-function: var(--app-transition-timing-function);

    &--active {
      rotate: 180deg;
    }
  }

  &__column-dropdown-icon {
    display: none;

    &::after {
      content: "";

      position: absolute;
      top: calc(50% + 10px);
      left: calc(50% - 4px);

      width: 0;
      height: 0;
      border-width: 5px 3px 0;

      border-color: var(--app-color-secondary-dark) transparent transparent;
      border-style: solid;
    }

    &--active {
      display: block;

      &::after {
        border-width: 0 3px 5px;

        border-color: transparent transparent var(--app-color-secondary-dark);
      }
    }
  }

  &__menu {
    display: flex;
    flex-direction: column;
    gap: 20px;

    width: 260px;
    padding-block: 20px;

    &--large {
      width: 600px;
      height: 440px;
    }

    &--column {
      width: auto;
    }
  }

  &__chosen-options-wrapper {
    flex-shrink: 0;

    height: auto;
    max-height: 150px;
  }

  &__chosen-options {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    gap: 4px;

    max-width: 100%;
    height: max-content;
    padding-inline: 20px;
  }

  &__chosen-option {
    --v-chip-text-line-clamp: 2;

    max-width: 100%;

    overflow: hidden;
  }

  &__menu-header {
    display: flex;
    justify-content: center;

    padding-inline: 20px;

    background-color: var(--app-color-white);
  }

  &__menu-list-wrapper {
    position: relative;

    flex-grow: 1;

    max-height: 300px;
  }

  &__menu-list {
    position: relative;

    display: flex;
    flex-direction: column;

    width: 100%;
    max-width: 100vw;
  }

  &__list-placeholder-text {
    position: relative;

    padding-inline: 20px;

    color: var(--app-color-gray-stroke);
    text-align: center;
    @include mixins.body-2;

    &--loading {
      &::after {
        content: "";

        animation: dotty steps(1, end) 1s infinite;
      }
    }
  }

  &__selection {
    display: inline-flex;
    align-items: center;

    max-width: 100%;
    margin-inline-end: 2px;

    line-height: inherit;
    letter-spacing: inherit;

    &--column {
      flex-direction: column;

      margin-inline-end: 2px;
    }
  }

  &__selection-text {
    white-space: nowrap;

    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__options-search-field {
    position: relative;
    z-index: 1;

    flex-grow: 1;
  }

  &__apply-button {
    margin-inline: 15px;
  }

  /* stylelint-disable selector-max-compound-selectors */
  &:hover .v-select__column-dropdown-icon {
    display: block;
  }

  &__menu-list-item {
    &--group-end {
      box-shadow: 0 1px 0 0 #c6c2de;
    }
  }
}
</style>
