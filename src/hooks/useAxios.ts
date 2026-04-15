import { computed, toValue } from "vue";

import {
  type UseAxiosOptions as _UseAxiosOptions,
  useAxios as _useAxios,
} from "@vueuse/integrations/useAxios";
import { useCookies } from "@vueuse/integrations/useCookies";
import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { chain, cloneDeep, merge, pick } from "lodash";
import pLimit from "p-limit";

import router from "@/router";
import { useMetaStore } from "@/stores/meta";
import { useNotificationsStore } from "@/stores/notifications";

export type BitrixError = {
  code: number | string;
  customData?: {
    csrf?: string;
  } | null;
  message: string;
};
type BitrixErrors = BitrixError[];
type ResponseStatus = "error" | "success";
type ResponseMeta = {
  h1?: null | string;
  title?: null | string;
  type?: null | string;
};
type ResponseData<T> = {
  data: {
    mainData: T;
    metaData: ResponseMeta;
  } | null;
  errors: BitrixErrors | null;
  status: ResponseStatus;
};

const errorsTypes = ["soft", "hard"] as const;

type ErrorsTypes = (typeof errorsTypes)[number];

type HardErrors = AxiosError | Error;
type SoftErrors = BitrixError[];

type ErrorHandler = (
  error: HardErrors | SoftErrors,
  type: ErrorsTypes | null,
) => void;

interface ToastOptions {
  message?: string;
  title?: string;
}
interface ErrorToastOptions extends ToastOptions {
  notify?: Partial<Record<ErrorsTypes, boolean>> | boolean;
}
interface SuccessToastOptions extends ToastOptions {
  notify?: boolean;
}

interface NotificationToastOptions {
  error?: ErrorToastOptions;
  success?: SuccessToastOptions;
}
interface UseAxiosOptions extends Omit<_UseAxiosOptions, "onError"> {
  notificationToast?: NotificationToastOptions;
  onError?: ErrorHandler;
}

const parallelRequestsLimit = pLimit(1);
const instance = axios.create({});

instance.interceptors.request.use((config) => {
  return parallelRequestsLimit(() => {
    const cookies = useCookies();

    const token = cookies.get("APP_SESSION_ID");
    config.headers["X-Bitrix-Csrf-Token"] = token;
    return config;
  });
});

const addErrorNotification = (options: {
  errors?: BitrixError[] | null;
  message?: null | string;
  title?: string;
}) => {
  const notificationsStore = useNotificationsStore();

  notificationsStore.addNotification({
    variation: "negative",
    title: options?.title || "Произошла ошибка сетевого запроса",
    text: options?.message,
    errors: options.errors,
  });
};

const isAxiosError = (error: unknown): error is AxiosError => {
  return axios.isAxiosError(error);
};
const isError = (error: unknown): error is Error => {
  return Boolean(error instanceof Error);
};
const isBitrixError = (error: unknown): error is BitrixError | BitrixErrors => {
  return Array.isArray(error)
    ? error.every((item) => typeof item.code === "number")
    : Boolean(chain(error).isPlainObject().has("code"));
};
const getErrorType = (error: unknown): ErrorsTypes | null => {
  return axios.isAxiosError(error) || isError(error)
    ? "hard"
    : isBitrixError(error)
      ? "soft"
      : null;
};

interface ErrorHandlerData {
  notificationToast?: NotificationToastOptions;
  onError?: ErrorHandler;
}
const defaultErrorHandler = (options?: ErrorHandlerData, error?: unknown) => {
  const _error = cloneDeep(error);
  const _errorType = getErrorType(_error);

  const isErrorByAxios = isAxiosError(_error);
  const isErrorByBitrix = isBitrixError(_error);
  const isSimpleError = isError(_error);

  const isHardError = _errorType === "hard";
  const isSoftError = _errorType === "soft";

  const _options: ErrorHandlerData = merge(
    {
      notificationToast: {
        error: {
          notify: true,
        },
      },
    },
    options,
  );

  const errorToastOptions = _options.notificationToast;
  const errorToastNotifyOptions = errorToastOptions?.error?.notify;

  const isNotifyOptionBoolean = typeof errorToastNotifyOptions === "boolean";

  const isShowToastOnHardError = isNotifyOptionBoolean
    ? errorToastNotifyOptions
    : Boolean(errorToastNotifyOptions?.hard);
  const isShowToastOnSoftError = isNotifyOptionBoolean
    ? errorToastNotifyOptions
    : Boolean(errorToastNotifyOptions?.soft);

  const isShowToast =
    (isHardError && isShowToastOnHardError) ||
    (isSoftError && isShowToastOnSoftError);

  const errorMessageFromAxiosOrSimpleError =
    isErrorByAxios || isSimpleError ? _error.message : null;

  const errorMessageFromBitrixError = isErrorByBitrix
    ? "Пожалуйста, повторите попытку позже."
    : null;

  const errorMessage =
    errorToastOptions?.error?.message ||
    errorMessageFromAxiosOrSimpleError ||
    errorMessageFromBitrixError;

  options?.onError?.(
    _error as typeof isAxiosError extends true
      ? AxiosError
      : typeof isSimpleError extends true
        ? Error
        : BitrixError[],
    _errorType,
  );

  if (isShowToast) {
    const errors = isErrorByBitrix
      ? Array.isArray(_error)
        ? _error
        : [_error]
      : null;

    addErrorNotification({
      message: errorMessage,
      errors: errors,
    });
  }
};

let isUnlogining = false;

const createAuthorizationError = () => {
  if (import.meta.env.DEV) {
    addErrorNotification({
      title: "Информация для разработчиков.",
      message:
        "Проблемы с авторизацией. Проверьте запросы или авторизуйтесь повторно. Страница не будет перезагружена автоматически.",
    });
  } else if (!isUnlogining) {
    addErrorNotification({
      message:
        "Вы будете перенаправлены на страницу авторизации. Пожалуйста, авторизуйтесь снова.",
    });

    isUnlogining = true;
    setTimeout(() => {
      window.location.href = "/";
      isUnlogining = false;
    }, 2000);
  }
};

const defaultSuccessHandler = async <T>(
  options: {
    notificationToast?: NotificationToastOptions;
    onError?: ErrorHandler;
    onSuccess?: (data?: ResponseData<T>, toast?: SuccessToastOptions) => void;
  } = {},
  data?: ResponseData<T>,
) => {
  if (data?.status === "error" && data?.errors?.length) {
    console.warn("Bitrix errors:", data.errors);
    defaultErrorHandler(
      {
        onError: options.onError,
        notificationToast: options.notificationToast,
      },
      data.errors,
    );

    if (
      !isUnlogining &&
      data.errors.some(
        (item: BitrixError) =>
          item.code === "invalid_csrf" ||
          item.code === 401 ||
          item.code === "invalid_authentication",
      )
    ) {
      createAuthorizationError();
    } else if (data.errors.some((item: BitrixError) => item.code === 403)) {
      router.replace({ name: "403" });
    }
  }

  if (data && !data.errors?.length) {
    if (options.onSuccess) {
      options.onSuccess(data, options.notificationToast?.success);
    }

    if (data.data?.metaData) {
      const metaStore = useMetaStore();

      metaStore.setMeta(data.data.metaData);
    }
  }
};

export function useAxios<T = any, R = AxiosResponse<T>, D = any>(
  url: string,
  config: AxiosRequestConfig<D>,
  options: Omit<UseAxiosOptions, "immediate"> = {},
  substringUrl: null | string = "/api/v1",
) {
  const _options = merge({}, options, {
    immediate: false,
  } as const);

  const onErrorOptions = pick(_options, ["onError", "notificationToast"]);

  const onSuccessOptions = pick(_options, [
    "onSuccess",
    "onError",
    "notificationToast",
  ]);

  _options.onError = defaultErrorHandler.bind(null, onErrorOptions);
  _options.onSuccess = defaultSuccessHandler.bind(null, onSuccessOptions);

  const finalUrl = substringUrl ? `${substringUrl}${url}` : url;

  const result = _useAxios<ResponseData<T>, R, D>(
    finalUrl,
    config,
    instance,
    _options as _UseAxiosOptions,
  );

  const requestData = computed<T | undefined>(() => {
    const requestData = toValue(result.data);

    return requestData?.data?.mainData;
  });

  return {
    ...result,
    data: requestData,
    softErrors: computed<BitrixErrors | null | undefined>(
      () => result.data.value?.errors,
    ),
  };
}
