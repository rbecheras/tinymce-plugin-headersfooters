# headersfooters

A plugin for tinymce WYSIWYG HTML editor that allow to insert headers and footers - requires tinymce-plugin-paginate

## Dependencies

- tinymce
- noneditable tinymce native plugin
- [tinymce-plugin-paginate](https://github.com/sirap-group/tinymce-plugin-paginate)

## Installation

    bower install tinymce-plugin-headersfooters

## Post-install

You can create a bower Post-install hook, or make the symlinks manually to bind the vendor plugins to tinymce.

    echo "Installing tinymce-plugin-paginate ..."
    rm public/lib/tinymce/plugins/paginate 2> /dev/null
    ln -s ../../tinymce-plugin-paginate public/lib/tinymce/plugins/paginate && echo "> OK."

    echo "Installing tinymce-plugin-headersfooters ..."
    rm public/lib/tinymce/plugins/headersfooters 2> /dev/null
    ln -s ../../tinymce-plugin-headersfooters public/lib/tinymce/plugins/headersfooters && echo "> OK."

## Plugin Settings

### Template Layout (`angular/ui-tinymce`)

> Note the required elements:
>
> - `class="edit-doc-page-wrapper"` and `class="edit-doc-page` divs
> - `class="edit-doc-page-header"`, `class="edit-doc-page-body"` and `class="edit-doc-page-footer"`

```html
<div class="edit-doc-page-wrapper">

  <div class="edit-doc-page">

    <div  class="edit-doc-page-header">
      <textarea data-ui-tinymce="mceOptions.header" data-ng-model="doc.header"></textarea>
    </div>

    <div class="edit-doc-page-body">
      <textarea data-ui-tinymce="mceOptions.body" data-ng-model="doc.body"></textarea>
    </div>

    <div class="edit-doc-page-footer">
      <textarea data-ui-tinymce="mceOptions.footer" data-ng-model="doc.footer"></textarea>
    </div>

  </div>

</div>
```

### Editor Config

> Note the required params:
>
> - `plugins: 'headersfooters'`
> - `'headersfooters_type': 'header'|'body'|'footer'`

```js
const tinymce = require('tinymce')

const commonOptions = {
  'headersfooters_formats': 'A4 A5', // in 'A1', 'A2', 'A3', 'A4', 'A5'
  'headersfooters_custom_formats': [
    {
      name: 'Custom_Format_1',
      width: '200mm',
      height: '150mm'
    },
    {
      name: 'Custom_Format_2',
      width: '255mm',
      height: '410mm'
    }
  ],
  'headersfooters_default_format': 'A4' // the name of the format used by default for a new doc
}

// header setup
var hOpts = {
  selector: 'textarea.header', // change this value according to your HTML to create the header
  plugins: 'headersfooters',
  'headersfooters_type': 'header'
}

// body setup
var bOpts = {
  selector: 'textarea.body', // change this value according to your HTML to create the body
  plugins: 'headersfooters',
  'headersfooters_type': 'body'
}

// footer setup
var fOpts = {
  selector: 'textarea.footer', // change this value according to your HTML to create the footer
  plugins: 'headersfooters',
  'headersfooters_type': 'footer'
}

// add common  options then setup each editor
;[hOpts, bOpts, fOpts].forEach(options => {
  options['headersfooters_formats'] = commonOptions['headersfooters_formats']
  options['headersfooters_custom_formats'] = commonOptions['headersfooters_custom_formats']
  options['headersfooters_default_format'] = commonOptions['headersfooters_default_format']

  tinymce.init(options)
})
```
