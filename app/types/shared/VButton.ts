import type { RouteLocationRaw } from "vue-router";

/** Target of a link-flavoured button, handed to <nuxt-link-locale>. */
export type ButtonTo = RouteLocationRaw | string;

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "link"
  /** No colours, padding or gap — the caller styles it entirely with `class`. */
  | "plain";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export type ButtonRounded = "none" | "sm" | "md" | "lg" | "full" | "card";

export type ButtonType = "button" | "submit" | "reset";
