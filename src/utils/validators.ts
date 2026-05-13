import { type ComputedRef, type MaybeRef, toValue } from "vue";

import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/ru";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import minMax from "dayjs/plugin/minMax";
import utc from "dayjs/plugin/utc";
const dayjsPlugins = [minMax, isSameOrAfter, isSameOrBefore, utc];
for (const plugin of dayjsPlugins) {
  dayjs.extend(plugin);
}

import {
  email as emailBase,
  helpers,
  required as requiredBase,
} from "@vuelidate/validators";

export const required = helpers.withMessage(
  "Пожалуйста, заполните это поле",
  requiredBase,
);

export const isChecked = (value: boolean) => value;

export const codeSPU = helpers.withMessage(
  "Введите корректный код СПУ",
  (value: string) => !helpers.req(value) || /^\d{3}-\d{3}$/.test(value),
);

export const isUnique = (
  errorMessage: string,
  validList: ComputedRef<string[]>,
) => {
  return helpers.withMessage(errorMessage, (value: null | string) => {
    if (!value) {
      return true;
    }

    const valueInLowerCase = value.toLowerCase();
    const listInLowerCase = validList.value.map((value: string) => {
      return value.toLowerCase();
    });
    const listInLowerCaseWithoutCurrentValue = listInLowerCase.toSpliced(
      listInLowerCase.indexOf(valueInLowerCase),
      1,
    );
    return !listInLowerCaseWithoutCurrentValue.includes(valueInLowerCase);
  });
};

const regExDates = /(?:\d{2}\.){2}\d{4}/g;
const regExSingleDate = /^(?:\d{2}\.){2}\d{4}$/;
const regExRangeDate = /^(?:\d{2}\.){2}\d{4}(?:\s-\s(?:\d{2}\.){2}\d{4})?$/;

const isDateComplete = (value: string, isRange?: boolean) => {
  return isRange ? regExRangeDate.test(value) : regExSingleDate.test(value);
};

const getCurrentDate = (value: string) => {
  const wrappedDate = dayjs(value, "DD.MM.YYYY", "ru", true);

  return wrappedDate;
};

const checkMinMaxDate = (options: {
  currentDate: Date | Dayjs;
  maxDate?: Date | Dayjs;
  minDate?: Date | Dayjs;
}) => {
  const resultArr: boolean[] = [];

  const currentDate = dayjs(options.currentDate);

  if (options.minDate) {
    const minDate = dayjs(options.minDate);
    resultArr.push(currentDate.valueOf() >= minDate.valueOf());
  }

  if (options.maxDate) {
    const maxDate = dayjs(options.maxDate);
    resultArr.push(currentDate.valueOf() <= maxDate.valueOf());
  }

  return !resultArr.includes(false);
};

const checkMinMax = (
  value: string,
  minMaxDate?: MaybeRef<Date | undefined>,
  checkingtype: "max" | "min" = "min",
  isRange?: MaybeRef<boolean>,
): boolean => {
  const isRangeValue = toValue(isRange);
  const minMaxDateValue = toValue(minMaxDate);

  if (!isDateComplete(value, isRangeValue)) return true;

  if (isRangeValue) {
    const datesArr = value.match(regExDates);

    if (datesArr && datesArr.length > 0) {
      const datesArrBoolean: boolean[] = datesArr.map((item) =>
        checkMinMaxDate({
          currentDate: getCurrentDate(item),
          [`${checkingtype}Date`]: minMaxDateValue,
        }),
      );

      return datesArr.length === 2
        ? datesArrBoolean[0] === true && datesArrBoolean[1] === true
        : datesArrBoolean[0] === true;
    }
    return true;
  } else {
    const selectedDate = getCurrentDate(value);
    return checkMinMaxDate({
      currentDate: selectedDate,
      [`${checkingtype}Date`]: minMaxDateValue,
    });
  }
};

export const checkMaxDate = (
  errorMessage: MaybeRef<string>,
  maxDate?: MaybeRef<Date | undefined>,
  isRange?: MaybeRef<boolean>,
) => {
  return helpers.withMessage(
    () => toValue(errorMessage),
    (value: string): boolean => {
      return checkMinMax(value, maxDate, "max", isRange);
    },
  );
};

export const checkMinDate = (
  errorMessage: MaybeRef<string>,
  minDate?: MaybeRef<Date | undefined>,
  isRange?: MaybeRef<boolean>,
) => {
  return helpers.withMessage(
    () => toValue(errorMessage),
    (value: string): boolean => {
      return checkMinMax(value, minDate, "min", isRange);
    },
  );
};

export const dateValidate = (
  errorMessage: MaybeRef<string>,
  isRange?: MaybeRef<boolean>,
) => {
  return helpers.withMessage(
    () => toValue(errorMessage),
    (value: string): boolean => {
      const checkDate = (dateString: string) => {
        const selectedDate = getCurrentDate(dateString);
        return !helpers.req(dateString) || Boolean(selectedDate.valueOf());
      };
      const dateComplited = isDateComplete(value, toValue(isRange));

      if (dateComplited) {
        if (toValue(isRange)) {
          const datesArr = value.match(regExDates);
          if (datesArr && datesArr.length > 0) {
            const datesArrBoolean: boolean[] = datesArr.map((date) =>
              checkDate(date),
            );

            return datesArr.length === 2
              ? !helpers.req(value) ||
                  (datesArrBoolean[0] === true && datesArrBoolean[1] === true)
              : !helpers.req(value) || datesArrBoolean[0] === true;
          }
        } else {
          return !helpers.req(value) || checkDate(value);
        }
      }

      return !helpers.req(value) || false;
    },
  );
};

export const email = helpers.withMessage("Введите корректный email", emailBase);

export const checkEmailSymbols = helpers.withMessage(
  "Разрешен ввод цифр 0-9, символов латинского алфавита A-Z, a-z, и спец. символов",
  (value: string) => {
    return (
      !helpers.req(value) ||
      /^[\w!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~«»№-]+$/.test(value)
    );
  },
);
