export { fr, frCopy } from "./fr";
export type { LanguageCode, LocaleContent, QuizQuestion, Theme, ThemeId } from "./types";

export const languages = [
  { code: "FR" as const, native: "Français", active: true, direction: "ltr" as const },
  { code: "PL" as const, native: "Polski", active: false, direction: "ltr" as const },
  { code: "PT" as const, native: "Português", active: false, direction: "ltr" as const },
  { code: "AR" as const, native: "العربية", active: false, direction: "rtl" as const },
];
