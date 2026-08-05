import { getApiMessageText } from "@/constants/message.constant";

type ApiErrorResponse = {
  messageKey?: string;
  message?: string;
};

type ApiErrorWithResponse = {
  response?: {
    data?: ApiErrorResponse;
  };
};

export function getApiErrorMessageKey(error: unknown) {
  if (
    typeof error !== "object" ||
    error === null ||
    !("response" in error) ||
    typeof (error as ApiErrorWithResponse).response !== "object" ||
    (error as ApiErrorWithResponse).response === null
  ) {
    return "";
  }

  const messageKey = (error as ApiErrorWithResponse).response?.data?.messageKey?.trim();

  return messageKey ?? "";
}

export function getApiErrorDescription(
  error: unknown,
  fallbackDescription: string,
) {
  const messageKey = getApiErrorMessageKey(error);

  return getApiMessageText(messageKey) || fallbackDescription;
}
