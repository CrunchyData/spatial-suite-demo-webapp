# Crunchy Data PostGIS Day Demo - Web Client

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

Run `npm install` the first time to fetch and install dependencies.

Run `npm start` to run the app in development mode. More info in the [Available Scripts](#npm-start) section.

When ready to deploy, run [`npm run build`](#npm-run-build) to compile/bundle the app.

## Project Info

### Folder Structure

- `public/` - Contains a few static assets, including the `index.html` template. We may never need to touch this directory again, except maybe to add a `favicon.ico`. [More info](https://create-react-app.dev/docs/using-the-public-folder)
- `src/` - Contains our app code
  - `api/` - Modules to handle API requests
  - `components/` - Components to be reused across multiple views
  - `views/` - Our "views". These are the "page" components that render when the user selects a different page in the header nav.

### State Management

There are no third-party state management libraries in use at this time. This project is small enough to use React's built-in state management.

### UI Framework

This project uses [PatternFly](https://www.patternfly.org/v4/) for UI components.

PatternFly an opinionated UI framework and design guidelines.<br />
(This may seem somewhat familiar to anyone who has used Material-UI components with Google's Material Design guidelines.)

The PatternFly React library gives us components for nearly _everything_. For example, [there is even a `<Text>` component](https://www.patternfly.org/v4/documentation/react/components/text/) just for placing text onto a page (which is required for "heading" elements [e.g. `<h1>`] to display properly). While working on this project, you may find it useful to reference the PatternFly documentation quite often at first.

### CSS

Local component CSS goes in [CSS Modules](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/). This is a simple solution that gives us "locally-scoped" CSS, so there's no need for other methods, such as BEM.

This project has SASS installed, so feel free to use it when convenient.

#### A note about PatternFly and CSS

For this project (or any project that uses PatternFly), it is best to use [PatternFly's global CSS variables](https://www.patternfly.org/v4/documentation/react/overview/css-variables/) whenever possible. This helps to maintain a cohesive and consistent UI (colors, fonts, spacing, transitions, etc.) and UX.

For example, you might add a background and border to a component like this:

```css
/* MyComponent.module.css */

.myComponent {
  background-color: var(--pf-global--BackgroundColor--100);
  border-width: var(--pf-global--BorderWidth--md);
  border-style: solid;
  border-color: var(--pf-global--BorderColor--100);
}
```

### Style Guide

We mostly follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript), with some modifications.

The style is enforced using ESLint, so it is highly recommended to use an ESLint plugin with your editor.

ESLint rules can be found in `.eslintrc.js`.

### Recommended Editor Plugins

#### [ESLint](https://eslint.org/docs/user-guide/integrations#editors)

ESLint helps maintain consistent styles and best practices. This plugin is recommended because it helps to enforce our styles and can prevent unsafe code.

Our ESLint configuration can be found in `.eslintrc.js`.

#### [EditorConfig](https://editorconfig.org/#download)

EditorConfig automatically applies formatting settings found in `.editorconfig`.

#### [TypeScript](https://www.typescriptlang.org/)

Although this project is not written in TypeScript, many third part libraries (including PatternFly) provide TypeScript type definitions.

Installing the TypeScript extension into your editor makes your editor "type-aware". This is great for things like autocompletion/IntelliSense and, depending on your settings, design-time safety checks.

You may notice some [TypeScript syntax inside JSDoc annotations](https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc) in this project.

_Note: If using Visual Studio Code (open source, runs everywhere), the TypeScript extension is already included and enabled by default._

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make edits.

You will also see some lint errors in the console. The lint errors in the console are from a minimal set of ESLint rules included with create-react-app. They do not include our custom configuration. It is recommended to use an ESLint plugin in your editor.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md)

## Related Projects

Service layer: https://github.com/CrunchyData/spatial-suite-rest-demo

## Deployment

http://frontend-scfire.openshift-pousty-apps.gce-containers.crunchydata.com/

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
