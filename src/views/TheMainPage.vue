<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="the-main-page">
    <div class="the-main-page__block">
      <GeneralNews
        class="the-main-page__general-news"
        :general-news-data="mainPageData?.generalNews"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

import { useAxios } from "@hooks/useAxios";

import { type GeneralNewsData } from "@components/news/GeneralNews";
import GeneralNews from "@components/news/GeneralNews/GeneralNews.vue";

type MainPageData = {
  generalNews: GeneralNewsData;
};
</script>

<script setup lang="ts">
const mainPageData = ref<MainPageData>();

const mainPageTestData = {
  generalNews: [
    {
      id: "001",
      title:
        "Старт «Мандалорца и Грогу» в США стал антирекордом для «Звездных войн» эпохи Disney",
      image: "../src/images/examples/themanthelorian.jpg",
      main: true,
      link: "/test/news/001",
      type: "Кино",
    },
    {
      id: "002",
      title:
        "Критики снова промахнулись? «Очень страшное кино 6» установило рекорд франшизы и возглавило прокат",
      image: "../src/images/examples/4U05-IntLVFq-n8JzOoV4Q.jpeg",
      link: "/test/news/002",
      type: "Кино",
    },
    {
      id: "003",
      title:
        "Страница Alien: Isolation 2 появилась в Steam - в игре заявлена полная русская озвучка",
      image: "../src/images/examples/fe4Am4HczELSXRupulDEdQ.jpeg",
      link: "/test/news/003",
      type: "Игры",
    },
    {
      id: "004",
      title:
        "Тарантино раскритиковал современное кино: «Я презираю нынешние фильмы - Голливуд стал безвкусной фабрикой»",
      image: "../src/images/examples/D6VeP0TQgB8p5dI2Cm_Tcw.png",
      link: "/test/news/004",
      type: "Кино",
    },
    {
      id: "005",
      title: "В сеть утекли бонусы за предзаказ Halo: Campaign Evolved",
      image: "../src/images/examples/ij9mwatuQiQMm-nGelcWfg.png",
      link: "/test/news/005",
      type: "Игры",
    },
    {
      id: "006",
      title:
        "«Ведьмак 3» официально получит третье сюжетное дополнение - «Баллады прошлого». Геральт вернется уже в 2027 году",
      image: "../src/images/examples/jjTFWX9qQtxAA2JylWBE9Q.png",
      link: "/test/news/006",
      type: "Игры",
    },
    {
      id: "007",
      title:
        "Клинт Иствуд наконец завершил режиссёрскую карьеру в возрасте 96 лет",
      image: "../src/images/examples/5e4mP3YDX91B32LAcJ3Mog.webp",
      link: "/test/news/007",
      type: "Кино",
    },
    {
      id: "008",
      title:
        "На съемках третьего сезона «Дома Дракона» для одного дубля подожгли сразу 23 касакадера",
      image:
        "../src/images/examples/5Q0zHwnoo-6DA1zj-IThr97Ef3QPaJ6fnhEvsLigwcncrADuanYJZ1F54f3NEAQakK5qfPoDd_eIZSF8mJX4sbxg.jpg",
      link: "/test/news/008",
      type: "Сериалы",
    },
    {
      id: "009",
      title: "«Одиссея» получила возрастной рейтинг R",
      image:
        "../src/images/examples/i4CWnwZjiSnt4G_UHgMr8SiwFRBpkukgsXnck3nxjE8jnnf_n2ImDLvD5zQUMQAJDGCgJxO_SvgtS9_wxNAbXxxh.jpg",
      link: "/test/news/009",
      type: "Кино",
    },
    {
      id: "010",
      title:
        "3 июня в «Кинопорту» покажут «Невероятные приключения итальянцев в России» Эльдара Рязанова",
      image:
        "../src/images/examples/xRTniSwT8KdTddPPuP1FPRaImC54cacS2zFnH6JGQUba9n_RFF4mj9jVEwMOkmss-n14ozNaxP9ay0_OIGyFjqhr.jpg",
      link: "/test/news/010",
      type: "Кино",
    },
  ],
};

const getContent = async () => {
  const { execute, data } = useAxios<{ mainPageData: MainPageData }>(
    "/mainPageTestData",
    { method: "GET" },
  );
  await execute();
  if (data.value) {
    //Логика при успешном выполнении запроса
  } else {
    mainPageData.value = mainPageTestData;
  }
};

getContent();
</script>

<style scoped lang="scss"></style>
