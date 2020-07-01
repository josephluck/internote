module.exports = function (api) {
  api.cache(true);

  const presets = ["next/babel"];

  const plugins = [
    ["styled-components", { ssr: true, displayName: true, preprocess: false }],
  ];

  return {
    presets,
    plugins,
  };
};
