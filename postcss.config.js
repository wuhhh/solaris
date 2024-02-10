module.exports = {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": "postcss-nesting",
    "tailwindcss": {},
    "autoprefixer": {},
    "postcss-pxtorem": {
      rootValue: 16,
      unitPrecision: 5,
      propWhiteList: [
        "*",
        "!border",
        "!border-width",
        "!border-top-width",
        "!border-right-width",
        "!border-bottom-width",
        "!border-left-width",
      ],
    },
  },
};
