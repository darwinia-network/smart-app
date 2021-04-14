const AntDesignThemePlugin = require('antd-theme-webpack-plugin');
const path = require('path');
// const fs = require('fs');
const CracoAntDesignPlugin = require('craco-antd');
const { getLessVars } = require('antd-theme-generator');
const themeVariables = getLessVars(path.join(__dirname, './src/theme/vars.less'));
const defaultVars = getLessVars('./node_modules/antd/lib/style/themes/default.less');
const darkVars = {
  ...getLessVars('./node_modules/antd/lib/style/themes/dark.less'),
  '@primary-color': defaultVars['@primary-color'],
  '@picker-basic-cell-active-with-range-color': 'darken(@primary-color, 20%)',
};
const lightVars = {
  ...getLessVars('./node_modules/antd/lib/style/themes/compact.less'),
  '@primary-color': defaultVars['@primary-color'],
};

// just for dev purpose, use to compare vars in different theme.
// fs.writeFileSync('./ant-theme-vars/dark.json', JSON.stringify(darkVars));
// fs.writeFileSync('./ant-theme-vars/light.json', JSON.stringify(lightVars));
// fs.writeFileSync('./ant-theme-vars/theme.json', JSON.stringify(themeVariables));

const options = {
  antDir: path.join(__dirname, './node_modules/antd'),
  stylesDir: path.join(__dirname, './src'),
  varFile: path.join(__dirname, './src/theme/vars.less'),
  themeVariables: Array.from(
    new Set([...Object.keys(darkVars), ...Object.keys(lightVars), ...Object.keys(themeVariables)])
  ),
  indexFileName: './public/index.html',
  generateOnce: false,
  publicPath: '',
  customColorRegexArray: [],
};
const themePlugin = new AntDesignThemePlugin(options);

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeThemeLessPath: path.join(__dirname, 'src/theme/vars.less'),
      },
    },
  ],
  webpack: {
    plugins: {
      add: [themePlugin],
    },
  },
};
