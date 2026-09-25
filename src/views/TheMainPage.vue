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

const generalNewsTestData = {
  generalNews: [
    {
      id: "001",
      title: "tГлавная новость",
      image: "../src/images/examples/example0.jpg",
      main: true,
      link: "/test/news/001",
      type: "Тип 12",
    },
    {
      id: "002",
      title: "tНовость",
      image: "../src/images/examples/example1.jpg",
      link: "/test/news/002",
      type: "Тип 2",
    },
    {
      id: "003",
      title: "tНовость с более длинным заголовком",
      image: "../src/images/examples/example1.jpg",
      link: "/test/news/003",
      type: "Тип 2",
    },
    {
      id: "004",
      title: "tНовость с еще более длинным заголовком",
      image: "../src/images/examples/example2.jpg",
      link: "/test/news/004",
      type: "Тип 2",
    },
    {
      id: "005",
      title: "tНовость с еще более длинным-длинным заголовком",
      image: "../src/images/examples/example1.jpg",
      link: "/test/news/005",
      type: "Тип 1",
    },
    {
      id: "006",
      title:
        "tНовость с еще более длинным-длинным заголовком, прям более длинным",
      image: "../src/images/examples/example2.jpg",
      link: "/test/news/006",
      type: "Тип 3",
    },
    {
      id: "007",
      title:
        "tНовость с еще более длинным-длинным заголовком, прям еще более длинным",
      image: "../src/images/examples/example1.jpg",
      link: "/test/news/007",
      type: "Тип 2",
    },
    {
      id: "008",
      title:
        "tНовость с еще более длинным-длинным заголовком, прям еще более длинным",
      image: "../src/images/examples/example0.jpg",
      link: "/test/news/008",
      type: "Тип 2",
    },
    {
      id: "009",
      title:
        "tНовость с еще более длинным-длинным заголовком, прям еще более длинным. Длиннее всех предыдущих",
      image: "../src/images/examples/example0.jpg",
      link: "/test/news/009",
      type: "Тип 2",
    },
    {
      id: "010",
      title:
        "tНовость с еще более длинным-длинным заголовком, прям еще более длинным. Длиннее всех предыдущих намного",
      image: "../src/images/examples/example2.jpg",
      link: "/test/news/010",
      type: "Тип 2",
    },
  ],
};

const getContent = async () => {
  const { execute, data } = useAxios<{ generalNews: GeneralNewsData }>(
    "public/responses/mainPageTestData.json",
    { method: "GET" },
  );

  await execute({});

  mainPageData.value = data.value?.generalNews
    ? { generalNews: data.value.generalNews }
    : generalNewsTestData;
};

getContent();
</script>

<style scoped lang="scss"></style>
