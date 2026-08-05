export const API_MESSAGE_KEY = {
  COMMON: {
    SUCCESS: "api.message.common.success",
    BAD_REQUEST: "api.message.common.badRequest",
    VALIDATION_FAILED: "api.message.common.validationFailed",
    UNAUTHORIZED: "api.message.common.unauthorized",
    FORBIDDEN: "api.message.common.forbidden",
    NOT_FOUND: "api.message.common.notFound",
    CONFLICT: "api.message.common.conflict",
    TOO_MANY_REQUESTS: "api.message.common.tooManyRequests",
    INTERNAL_ERROR: "api.message.system.error.internal",
  },
  VALIDATION: {
    REQUIRED: "api.message.validation.required",
    INVALID_FORMAT: "api.message.validation.invalidFormat",
    OUT_OF_RANGE: "api.message.validation.outOfRange",
    NOT_FOUND: "api.message.validation.notFound",
    INACTIVE: "api.message.validation.inactive",
    INVALID: "api.message.validation.invalid",
    DUPLICATE: "api.message.validation.duplicate",
  },
} as const;

const API_MESSAGE_TEXT: Record<string, string> = {
  [API_MESSAGE_KEY.COMMON.SUCCESS]: "Thành công",
  [API_MESSAGE_KEY.COMMON.BAD_REQUEST]: "Yêu cầu không hợp lệ",
  [API_MESSAGE_KEY.COMMON.VALIDATION_FAILED]: "Dữ liệu không hợp lệ",
  [API_MESSAGE_KEY.COMMON.UNAUTHORIZED]: "Bạn chưa đăng nhập",
  [API_MESSAGE_KEY.COMMON.FORBIDDEN]: "Bạn không có quyền thực hiện thao tác này",
  [API_MESSAGE_KEY.COMMON.NOT_FOUND]: "Không tìm thấy dữ liệu",
  [API_MESSAGE_KEY.COMMON.CONFLICT]: "Dữ liệu đã tồn tại",
  [API_MESSAGE_KEY.COMMON.TOO_MANY_REQUESTS]: "Bạn thao tác quá nhanh",
  [API_MESSAGE_KEY.COMMON.INTERNAL_ERROR]: "Đã có lỗi hệ thống",
  [API_MESSAGE_KEY.VALIDATION.REQUIRED]: "Trường này là bắt buộc",
  [API_MESSAGE_KEY.VALIDATION.INVALID_FORMAT]: "Định dạng không hợp lệ",
  [API_MESSAGE_KEY.VALIDATION.OUT_OF_RANGE]: "Giá trị nằm ngoài phạm vi cho phép",
  [API_MESSAGE_KEY.VALIDATION.NOT_FOUND]: "Không tìm thấy dữ liệu",
  [API_MESSAGE_KEY.VALIDATION.INACTIVE]: "Dữ liệu đang không hoạt động",
  [API_MESSAGE_KEY.VALIDATION.INVALID]: "Dữ liệu không hợp lệ",
  [API_MESSAGE_KEY.VALIDATION.DUPLICATE]: "Dữ liệu bị trùng lặp",
};

export type FeatureKey = "users" | "referrers" | "provinces";

const FEATURE_LABEL: Record<FeatureKey, string> = {
  users: "Người dùng",
  referrers: "Người giới thiệu",
  provinces: "Tỉnh",
};

type FeatureMessageKey = "duplicate" | "conflict" | "notFound" | "invalid";

const FEATURE_MESSAGE_TEMPLATE: Record<
  FeatureMessageKey,
  (label: string) => string
> = {
  duplicate: (label) => `${label} bị trùng lặp`,
  conflict: (label) => `${label} đã tồn tại`,
  notFound: (label) => `Không tìm thấy ${label.toLowerCase()}`,
  invalid: (label) => `${label} không hợp lệ`,
};

export function getFeatureLabel(feature: FeatureKey) {
  return FEATURE_LABEL[feature];
}

export function getFeatureMessage(
  feature: FeatureKey,
  key: FeatureMessageKey,
) {
  return FEATURE_MESSAGE_TEMPLATE[key](getFeatureLabel(feature));
}

export function getFeatureDuplicateMessage(feature: FeatureKey) {
  return getFeatureMessage(feature, "duplicate");
}

export function getApiMessageText(messageKey?: string) {
  if (!messageKey) {
    return "";
  }

  return API_MESSAGE_TEXT[messageKey.trim()] ?? "";
}
