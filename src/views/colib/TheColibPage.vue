<template>
  <div class="the-colib-page">
    <div class="the-colib-page__alert">
      <VIcon class="the-colib-page__alert-icon" icon-name="alert" />Сейчас здесь
      примерное представление того как будет выглядеть раздел. Веду работу над
      тем, чтобы реализовать раздел как SPA
    </div>

    <div class="the-colib-page__components-list">
      <div class="the-colib-page__components-list-block">
        <VTitle variation="h3">Кнопки</VTitle>
        <div class="the-colib-page__components-list-item">
          <VAccordion
            class="the-colib-page__components-list-item-accordion"
            accordion-name="VButton"
            ><template #content>
              <div class="the-colib-page__components-description">
                <VTitle
                  class="the-colib-page__components-description-title"
                  variation="subtitle-1"
                  >VButton - это компонент базовой кнопки</VTitle
                >
                <div class="the-colib-page__components-description-text">
                  //Здесь должно быть подробное описание//
                </div>
                <div class="the-colib-page__components-examples">
                  <div class="the-colib-page__components-example">
                    <div class="the-colib-page__components-example-description">
                      Основной цвет
                    </div>
                    <VButton>Кнопка</VButton>
                  </div>
                  <div class="the-colib-page__components-example">
                    <div class="the-colib-page__components-example-description">
                      Ацентный цвет
                    </div>
                    <VButton variation="accent">Кнопка</VButton>
                  </div>
                  <div class="the-colib-page__components-example">
                    <div class="the-colib-page__components-example-description">
                      Вспомогательный цвет
                    </div>
                    <VButton variation="supporting">Кнопка</VButton>
                  </div>
                  <div class="the-colib-page__components-example">
                    <div class="the-colib-page__components-example-description">
                      Кнопка заблокирована
                    </div>
                    <VButton disabled>Кнопка</VButton>
                  </div>
                  <div class="the-colib-page__components-example">
                    <div class="the-colib-page__components-example-description">
                      Кнопка c иконкой
                    </div>
                    <VButton icon-name="plus">Кнопка</VButton>
                  </div>
                </div>
              </div>
            </template></VAccordion
          >
        </div>
        <div class="the-colib-page__components-list-item">
          <VAccordion
            class="the-colib-page__components-list-item-accordion"
            accordion-name="IconButton"
            ><template #content>
              <div class="the-colib-page__components-description">
                <VTitle
                  class="the-colib-page__components-description-title"
                  variation="subtitle-1"
                  >IconButton - это интерактивная иконка</VTitle
                >
                <div class="the-colib-page__components-description-text">
                  //Здесь должно быть подробное описание//
                </div>
                <div class="the-colib-page__components-examples">
                  <div class="the-colib-page__components-example">
                    <div class="the-colib-page__components-example-description">
                      Базовая
                    </div>
                    <IconButton />
                  </div>
                  <div class="the-colib-page__components-example">
                    <div class="the-colib-page__components-example-description">
                      Упрощенная
                    </div>
                    <IconButton variation="simplified" />
                  </div>
                  <div class="the-colib-page__components-example">
                    <div class="the-colib-page__components-example-description">
                      Круглая
                    </div>
                    <IconButton variation="circle" />
                  </div>
                  <div class="the-colib-page__components-example">
                    <div class="the-colib-page__components-example-description">
                      Заблокированная
                    </div>
                    <IconButton disabled />
                  </div>
                  <div class="the-colib-page__components-example">
                    <div class="the-colib-page__components-example-description">
                      Активированная
                    </div>
                    <IconButton is-active />
                  </div>
                </div>
              </div> </template
          ></VAccordion>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VAccordion from "@components/VAccordion/VAccordion.vue";
import VIcon from "@components/VIcon/VIcon.vue";
import VTitle from "@components/VTitle/VTitle.vue";
import IconButton from "@components/buttons/IconButton/IconButton.vue";
import VButton from "@components/buttons/VButton/VButton.vue";
</script>

<style scoped lang="scss">
.the-colib-page {
  padding: 32px 48px;

  &__alert {
    display: flex;
    gap: 4px;
    align-items: center;

    padding-block: 32px;

    color: var(--app-color-red-norm);
  }

  &__alert-icon {
    width: 32px;
    height: 32px;
  }

  &__components-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__components-list-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__components-list-item-accordion {
    padding: 12px;

    border-radius: 12px;
    box-shadow: 0 0 0 1px var(--app-color-primary-norm);
  }

  &__components-description {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__components-examples {
    display: flex;
    gap: 32px;
  }

  &__components-example {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;

    width: max-content;
  }
}
</style>
