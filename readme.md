# landing-page-sass-boilerplate

This gulp boilerplate allows to quick develop multiple single page HTML landing pages.

- Sass + Bootstrap.
- Vendors css and js.
- Automaticly inline styles and scripts (as included in the HTML and not as an external file).
- BrowserSync to preview html files and components files.

## Requirements

- Node.js

## Installation

In the root folder (where the package.json file is) run this command to install all the dependencies.

```
npm install
```
## How to use

### Gulp Tasks

#### gulp (default)

This task start the develop server for the page templates and for the components.

```
gulp
```

#### gulp build

This task complies and copy the html files in the ```src/``` folder to the ```dist/``` folder.

```
gulp build
```


### Pages templates

In ```src/``` folder, use ```index.html``` file as a blank template. Copy it and rename as needed.

Any html file in this folder will be included in the final build.

### SCSS

In ```src/scss/``` folder you will find multiple scss files you can use to write the different styles for the site.

All the scss files are already included in ```styles.scss``` file.

```
/src/scss
|   styles.scss
|   _content.scss
|   _globals.scss
|   _helpers.scss
|   _layout.scss
|   _mixins.scss
|   _variables.scss
|   
\---components
        _cmp_blank_1.scss
```

By default the scss will include Bootstrap variables and mixins, but you can add your own too.


#### HTML/SCSS components

1. Clone the blank html template on ```src/components/cmp_blank.html``` and rename it to the new component name (ex.: cmp_module_1.html).
    > **Note**:  In order to provide a real preview of your module, this html template includes all the css and js and basic layout that the final page use.
2. Clone the blank scss template on ```src/scss/components/_cmp_blank_1.scss``` and rename it to the same name (ex.: _cmp_module_1.scss).
3. Include the new module scss file to ```styles.scss```file.

```
@import 'components/cmp_blank_1';
@import 'components/cmp_module_1'; /* Your new component */
```
4. Run gulp task default to start the live server.
```
gulp
```
5. Now you can edit the css and html files and live preview your changes.

> Please folow the [BEM] standar for the classes naming conventions.




[BEM]: https://seesparkbox.com/foundry/bem_by_example





