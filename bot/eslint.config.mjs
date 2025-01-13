import antfu from "@antfu/eslint-config";

export default antfu(
  {
    type: "app",
    typescript: true,
    formatters: true,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
    lessOpinionated: true,
    ignores: ["node_modules/"],
  },
  {
    rules: {
      "no-console": ["off"],
      "antfu/no-top-level-await": ["off"],
      "style/comma-dangle": "off",
    },
  }
);
