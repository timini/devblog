import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (config) {
  config.addPlugin(HtmlBasePlugin);
  config.addPassthroughCopy("style.css");
  config.addPassthroughCopy("images");
  config.ignores.add("README.md");

  config.addFilter("readableDate", (date) =>
    new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
  );
  config.addFilter("isoDate", (date) => new Date(date).toISOString().slice(0, 10));
  config.addFilter("pad3", (n) => String(n).padStart(3, "0"));
  config.addFilter("slug", (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-"));

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
