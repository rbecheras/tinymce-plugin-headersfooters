# Tinymce Plugin HeadersFooters

A plugin for tinymce WYSIWYG HTML editor that allow to insert headers and footers

## Dependencies

- [tinymce](https://www.tinymce.com)

## Installation

    bower install tinymce-plugin-headersfooters

## Post-install

You can create a bower Post-install hook, or make the symlinks manually to bind the vendor plugins to tinymce.

    echo "Installing tinymce-plugin-headersfooters ..."
    rm public/lib/tinymce/plugins/headersfooters 2> /dev/null
    ln -s ../../tinymce-plugin-headersfooters public/lib/tinymce/plugins/headersfooters && echo "> OK."

## Plugin Settings

### Template Layout (`angular/ui-tinymce`)

Note the required elements:

- `class="edit-doc-page-outer-wrapper"` and `class="edit-doc-page-inner-wrapper` divs
- `class="edit-doc-page-header"`, `class="edit-doc-page-body"` and `class="edit-doc-page-footer"`

```html
<div class="edit-doc-page-outer-wrapper">

  <div class="edit-doc-page-inner-wrapper">

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

Note the required params:

- `plugins: 'headersfooters'`
- `'headersfooters_type': 'header'|'body'|'footer'`
- `'headersfooters_outerWrapperClass': '<as_used_in_tempate>'`
- `'headersfooters_outerWrapperClass': '<as_used_in_tempate>'`
- `'content_css': "body { margin: '0 auto' })"`

```js
const tinymce = require('tinymce')

const commonOptions = {
  'headersfooters_outerWrapperClass': 'edit-doc-page-outer-wrapper', // as defined in your template
  'headersfooters_innerWrapperClass': 'edit-doc-page-inner-wrapper', // as defined in your template
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

## Events

### HeadersFootersPlugin events on window.body

| Event Name | Description |
| ---------- | ----------- |
| HeadersFooters:NewPageAppending | Fires when the paginator is appending a new page |
| HeadersFooters:NewPageAppended | Fires when a new page has been appended |
| HeadersFooters:PageRemoving | Fires when the paginator is removing a page |
| HeadersFooters:PageRemoved | Fires when a page has been removed |
| HeadersFooters:Format:AppliedToBody | Fires when the current format is applied |

### HeadersFootersPlugin events on editor

None event is fired yet on editor.

### Core or official plugins events

The tinymce editors emit several events.

> [Tinymce Editor Events](https://www.tinymce.com/docs/advanced/events)

| Event Name | Native / Core / Plugin | Description |
| ---------- | ---------------------- | ----------- |
| Click | native | Fires when the editor is clicked. |
| DblClick | native | Fires when the editor is double clicked. |
| MouseDown | native | Fires when a mouse button is pressed down inside the editor. |
| MouseUp | native | Fires when a mouse button is released inside the editor. |
| MouseMove | native | Fires when the mouse is moved within the editor. |
| MouseOver | native | Fires when a new element is being hovered within the editor. |
| MouseOut | native | Fires when a element is no longer being hovered within the editor. |
| MouseEnter | native | Fires when mouse enters the editor. |
| MouseLeave | native | Fires when mouse leaves the editor. |
| KeyDown | native | Fires when a key is pressed within the the editor. |
| KeyPress | native | Fires when a key is pressed within the the editor. |
| KeyUp | native | Fires when a key is released within the the editor. |
| ContextMenu | native | Fires when the context menu is invoked within the editor. |
| Paste | native | Fires when a paste is done within within the the editor. |
| Init | core | Fires when the editor is initialized. |
| Focus | core | Fires when the editor is focused. |
| Blur | core | Fires when the editor is blurred. |
| BeforeSetContent | core | Fires before contents being set to the editor. |
| SetContent | core | Fires after contents been set to the editor. |
| GetContent | core | Fires after the contents been extracted from the editor. |
| PreProcess | core | Fires when the contents in the editor is being serialized. |
| PostProcess | core | Fires when the contents in the editor is being serialized. |
| NodeChange | core | Fires when selection inside the editor is changed. |
| Undo | core | Fires when the contents has been undo:ed to a previous state. |
| Redo | core | Fires when the contents has been redo:ed to a previous state. |
| Change | core | Fires when undo level is added to the editor. |
| Dirty | core | Fires when editor contents is being considered dirty. |
| Remove | core | Fires when the editor is removed. |
| ExecCommand | core | Fires after a command has been executed. |
| PastePreProcess | paste | Fires when contents gets pasted into the editor. |
| PastePostProcess | paste | Fires when contents gets pasted into the editor. |
