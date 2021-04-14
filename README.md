# SMART APP

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## FUNCTION

Transfer ring/kton between Darwinia Smart account and Darwinia account.

## USAGE

Feel free to clone this repo to your local machine, under the folder, run `npm install` or `yarn install`(recommended) to install dependencies, now you can:

```bash
yarn start
```

Runs the app in the development mode. Open [http://localhost:3009](http://localhost:3009) to view it in the browser.

```bash
yarn build
```

Build the app, source file will be located in `./build` folder.

In addition to the two commands above, you can also use the following commands to assist development

`yarn lint` - Lint TS files

`yarn stylelint` - Lint the CSS files, includes SCSS or LESS file

`yarn format` - Use prettier to format all TS files in the src directory.

`yarn i18next:scanner` - Scan all labels need to translated.

### THEMES AND CSS

#### Antd

JSON files under `./src/theme/` folder are all used to config theme variables of antd for different network.

Antd global variables are locate in `./src/theme/vars.less`.

If you want to override the antd global style, pls write in `./src/index.less`.

##### PROJECT CSS

This project use [tailwind css](https://www.tailwindcss.com) to avoid writing too much style code, but sometimes we still need to write some custom styles, place it in `./src/index.scss`.
