const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackPlugin,
  useBabelRc,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require('customize-cra');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getThemeVariables } = require('antd/dist/theme');

module.exports = override((config, env) => {
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  })(config, env);
  useBabelRc()(config, env);
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      ...getThemeVariables({
        dark: true, // Enable dark mode
        compact: false, // Enable compact mode
      }),
      // '@primary-color': '#74FBFD', // primary color for all components
      // '@secondary-color': '#6aff00', // primary color for all components
      '@link-color': '#74FBFD', // link color #1890ff #82BEE4
      '@link-hover-color': '#82BEE4',
      '@background-color-light': ' #23213A',
      // '@success-color': '#52c41a', // success state color
      // '@warning-color': '#faad14', // warning state color
      // '@error-color': '#f5222d', // error state color
      // '@font-size-base': '14px', // major text font size
      // '@heading-color': 'rgba(0, 0, 0, 0.85)', // heading text color
      // '@text-color': 'rgba(0, 0, 0, 0.65)', // major text color
      // '@text-color-secondary': 'rgba(0, 0, 0, 0.45)', // secondary text color
      // '@disabled-color': 'rgba(0, 0, 0, 0.25)', // disable state color
      // '@border-radius-base': '4px', // major border radius
      // '@border-color-base': '#d9d9d9', // major border color
      // '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // major shadow for layers},
      // '@layout-header-background': '#ffffff',
    },
  })(config, env);

  return config;
});
