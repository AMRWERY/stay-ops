import type { ValidationContext, ValidatorFn } from "@/types/global/validators";

/** Human readable name for a field, preferring its label over its path. */
const fieldName = (ctx?: ValidationContext) =>
  ctx?.label || ctx?.name || ctx?.field || "This field";

/** True for values that count as "not filled in". */
export const isEmptyValue = (value: any): boolean => {
  if (value === null || value === undefined || value === false) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "number") return Number.isNaN(value);
  return false;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const formRules = {
  required(message?: string): ValidatorFn {
    return (value, ctx) =>
      isEmptyValue(value) ? message || `${fieldName(ctx)} is required` : true;
  },

  email(message?: string): ValidatorFn {
    return (value) => {
      if (isEmptyValue(value)) return true;
      return EMAIL_RE.test(String(value))
        ? true
        : message || "Enter a valid email address";
    };
  },

  minLength(length: number, message?: string): ValidatorFn {
    return (value, ctx) => {
      if (isEmptyValue(value)) return true;
      return String(value).length >= length
        ? true
        : message || `${fieldName(ctx)} must be at least ${length} characters`;
    };
  },

  maxLength(length: number, message?: string): ValidatorFn {
    return (value, ctx) => {
      if (isEmptyValue(value)) return true;
      return String(value).length <= length
        ? true
        : message || `${fieldName(ctx)} must be at most ${length} characters`;
    };
  },

  min(limit: number, message?: string): ValidatorFn {
    return (value, ctx) => {
      if (isEmptyValue(value)) return true;
      return Number(value) >= limit
        ? true
        : message || `${fieldName(ctx)} must be ${limit} or more`;
    };
  },

  max(limit: number, message?: string): ValidatorFn {
    return (value, ctx) => {
      if (isEmptyValue(value)) return true;
      return Number(value) <= limit
        ? true
        : message || `${fieldName(ctx)} must be ${limit} or less`;
    };
  },

  numeric(message?: string): ValidatorFn {
    return (value, ctx) => {
      if (isEmptyValue(value)) return true;
      return !Number.isNaN(Number(value))
        ? true
        : message || `${fieldName(ctx)} must be a number`;
    };
  },

  integer(message?: string): ValidatorFn {
    return (value, ctx) => {
      if (isEmptyValue(value)) return true;
      return Number.isInteger(Number(value))
        ? true
        : message || `${fieldName(ctx)} must be a whole number`;
    };
  },

  pattern(regex: RegExp, message?: string): ValidatorFn {
    return (value, ctx) => {
      if (isEmptyValue(value)) return true;
      return regex.test(String(value))
        ? true
        : message || `${fieldName(ctx)} is not in a valid format`;
    };
  },

  url(message?: string): ValidatorFn {
    return (value) => {
      if (isEmptyValue(value)) return true;
      try {
        new URL(String(value));
        return true;
      } catch {
        return message || "Enter a valid URL";
      }
    };
  },

  oneOf(allowed: any[], message?: string): ValidatorFn {
    return (value, ctx) => {
      if (isEmptyValue(value)) return true;
      return allowed.includes(value)
        ? true
        : message || `${fieldName(ctx)} is not an allowed value`;
    };
  },

  /**
   * Cross-field equality, e.g. a password confirmation:
   *   composeRules(formRules.required(), formRules.sameAs('password'))
   */
  sameAs(otherField: string, message?: string): ValidatorFn {
    return (value, ctx) => {
      const other = ctx?.form?.[otherField];
      return value === other ? true : message || `Does not match ${otherField}`;
    };
  },
};

/** Runs rules in order and stops at the first failure. */
export const composeRules = (...rules: ValidatorFn[]): ValidatorFn => {
  return (value, ctx) => {
    for (const rule of rules) {
      const result = rule(value, ctx);
      if (result !== true) return result;
    }
    return true;
  };
};
