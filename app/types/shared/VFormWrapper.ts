import type { Component } from "vue";

/**
 * Description of a single field when VFormWrapper renders a form from a schema.
 * Every key other than the ones listed here is forwarded to the rendered
 * component as a prop (label, type, placeholder, options, rules, ...).
 */
export interface FormFieldConfig {
  /** Field path in the form values, e.g. "email" or "guest.name". */
  name: string;
  /** Component to render. Defaults to VInput. Accepts a global component name. */
  component?: string | Component;
  /** How many grid columns the field spans. */
  colSpan?: number | "full";
  /** Extra classes on the rendered field. */
  class?: string;
  /** Render the field only when this returns true for the current values. */
  if?: (values: Record<string, any>) => boolean;
  [key: string]: any;
}
