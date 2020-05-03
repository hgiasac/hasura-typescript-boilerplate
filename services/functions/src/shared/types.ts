export const STATUS_INACTIVE = "inactive";
export const STATUS_ACTIVE = "active";
export const STATUS_DISABLED = "disabled";
export const STATUS_DELETED = "deleted";

export const STATUSES = [
  STATUS_ACTIVE,
  STATUS_INACTIVE,
  STATUS_DISABLED,
  STATUS_DELETED
];

export type Status
  = typeof STATUS_ACTIVE
  | typeof STATUS_INACTIVE
  | typeof STATUS_DISABLED
  | typeof STATUS_DELETED;
