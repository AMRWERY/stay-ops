export interface OptionItem {
  label: string;
  value: any;
  disabled?: boolean;
}

export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "datetime-local"
  | "time"
  | "month"
  | "week"
  | "color"
  | "file"
  | "range"
  | "textarea"
  | "select"
  | "checkbox"
  | "switch"
  | "radio";

export type InputSize = "sm" | "md" | "lg";

export type InputVariant = "default" | "filled" | "flushed" | "outlined";
