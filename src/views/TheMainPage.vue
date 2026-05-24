<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="the-main-page">
    <div class="the-main-page__block">
      <VTitle class="the-main-page__title" variation="h1">Новости</VTitle>
      <div class="the-main-page__news">
        <BaseIsland
          title="Старт «Мандалорца и Грогу» в США стал антирекордом для «Звездных войн» эпохи Disney"
        >
          <template #main-image
            ><VImage
              class="aside-navbar-logo__icon"
              src="../src/images/examples/themanthelorian.jpg"
          /></template>
          <VHtmlText
            text="<p>Фильм «Мандалорец и Грогу» возглавил прокат США в уикенд ко Дню поминовения, заработав в стартовую пятницу $33 миллиона (включая $12 млн с превью-показов). Проект вернул вселенную «Звездных войн» в кинотеатры после семилетнего перерыва, но показал самый слабый старт с момента перехода франшизы под контроль компании Disney.</p><p>По оценкам аналитиков, кассовые сборы нового фильма режиссера Джона Фавро за классическую трехдневку (пятница — воскресенье) составят $81–82 миллиона. Итоговые сборы за полный четырехдневный праздничный уикенд ожидаются в районе $91–96 миллионов.</p><p>Для любого другого кинопроекта это был бы отличный старт, но для вселенной Star Wars текущие сборы знаменуют антирекорд франшизы эпохи Disney. Картина уступает даже результатам спин-оффа «Хан Соло. Звездные войны: Истории», который в 2018 году собрал $35,4 млн в первый день и $103 млн за четыре дня.</p><p>Смягчает ситуацию бюджет проекта: в отличие от прошлых блокбастеров Lucasfilm, производство «Мандалорца и Грогу» обошлось всего в $165 млн (не считая маркетинга). Это значительно меньше бюджетов последних номерных эпизодов, что существенно снижает порог окупаемости для студии. При этом высокий зрительский рейтинг на Rotten Tomatoes (88%) может скорректировать прогнозы и обеспечить картине стабильный прокат в последующие недели.</p>"
        /></BaseIsland>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VHtmlText from "@components/VHtmlText/VHtmlText.vue";
import VImage from "@components/VImage";
import VTitle from "@components/VTitle/VTitle.vue";
import BaseIsland from "@components/islands/BaseIsland/BaseIsland.vue";
</script>

<style scoped lang="scss">
.the-main-page {
  &__block {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__title {
    color: var(--app-color-primary-light);
  }
}
</style>
