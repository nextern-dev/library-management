import { getRequestConfig } from "next-intl/server";


export default getRequestConfig(async ({ requestLocale }) => {
  const locales = ["en", "fa"];

  const locale = (await requestLocale) || "en";
  const validLocale = locales.includes(locale) ? locale : "en";
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default,
  };
});
