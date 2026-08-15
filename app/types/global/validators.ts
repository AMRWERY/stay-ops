export interface ValidationContext {
  field?: string;
  name?: string;
  label?: string;
  value?: any;
  form?: Record<string, any>;
}

export type ValidatorFn = (
  value: any,
  ctx?: ValidationContext,
) => true | string;
