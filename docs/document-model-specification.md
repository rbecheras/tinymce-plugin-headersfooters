# Document's Model Specification

## Abstract Layout Model

> @todo insert image: abstract model layout

## Abstract's layout elements

- Page canvas
- Header bloc
- Body bloc
- Footer bloc

## Significant page dimensions

> @todo insert image: colored layout dimensions

- format:
    - height
    - width
- margins:
    - margin top
    - margin right
    - margin bottom
    - margin left
- header:
    - header height
    - header width
    - header margins
        - header margin right
        - header margin bottom
        - header margin left
- footer:
    - footer height
    - footer width
    - footer margins
        - footer margin top
        - footer margin right
        - footer margin left
- body:
    - body border
        - body border style
        - body border width
        - body border color

## Editor Model

### Editor Layout

> @todo insert image: editor model layout

#### Summary of the editor's layout elements:

- Page Wrapper (`div.page-wrapper`)
- Page Panel (`div.page-panel`)
- Header Wrapper (`div.header-wrapper`)
- Header Panel (`div.header-panel`)
- Body Panel (`div.body-panel`)
- Footer Wrapper (`div.footer-wrapper`)
- Footer Panel (`div.footer-panel`)

#### HTML Layout

```html
<div class="page-wrapper">
  <div class="page-panel">
    <div class="header-wrapper">
      <textarea class="header-panel"></textarea>
    </div>

    <textarea class="body-panel"></textarea>

    <div class="footer-wrapper">
      <textarea class="footer-panel"></textarea>
    </div>
  </div>
</div>
```

### Configurable dimensions


Summary of the dimensions defined by the user and predefined with a default value, configurable by custom formats :

> NOTE: Only 'mm' is currently supported for all format dimensions

```js
var pageFormat = {
  height, width,
  margins: { top, right, bottom, left },
  header: {
    height,
    margins: { left, right, bottom },
    border: { color, style, width }
  },
  footer: {
    height,
    margins: { top, left, right },
    border: { color, style, width }
  },
  body: {
    border: { color, style, width }
  }
}
```




#### CSS rules

```css
div.page-wrapper {
  background: gray;
  height: auto;
  margin: 0;
  padding: 2cm 0;
  width: 100%;
}

div.page-panel {
  background: white;
  border: 0;
  box-sizing: border-box;
  height: '<format.height>';
  margin: 0 auto;
  padding-top: '<format.margins.top>';
  padding-right: '<format.margins.right>';
  padding-bottom: '<format.margins.bottom>';
  padding-left: '<format.margins.left>';
  width: '<format.width>';
}

div.header-wrapper {
  border: 0;
  box-sizing: border-box;
  height: '<format.header.height + format.header.margins.bottom>';
  margin: 0;
  padding: 0;
  width: 100%;
}

div.header-panel {
  border-color: '<format.header.border.color>'; /* TODO: split it to top/right/bottom/left */
  border-style: '<format.header.border.style>'; /* TODO: split it to top/right/bottom/left */
  border-width: '<format.header.border.width>'; /* TODO: split it to top/right/bottom/left */
  box-sizing: border-box;
  height: '<format.header.height>';
  margin-top: 0;
  margin-right: '<format.header.margins.right>';
  margin-bottom: '<format.header.margins.bottom>';
  margin-left: '<format.header.margins.left>';
  padding: 0;
  width: 100%;
}

div.body-wrapper {
  border: 0;
  box-sizing: border-box;
  height: auto;
  margin: 0;
  padding: 0;
  width: 100%;
}

div.body-panel {
  border-color: '<format.body.border.color>';
  border-style: '<format.body.border.style>';
  border-width: '<format.body.border.width>';
  box-sizing: border-box;
  height: '<calculateBodyHeight()>';
  margin: 0;
  padding: 0;
  width: 100%;
}

div.footer-wrapper {
  border: 0;
  box-sizing: border-box;
  height: '<format.footer.height + format.footer.margins.top>';
  margin: 0;
  padding: 0;
  width: 100%;
}

div.footer-panel {
  border-color: '<format.footer.border.color>'; /* TODO: split it to top/right/bottom/left */
  border-style: '<format.footer.border.style>'; /* TODO: split it to top/right/bottom/left */
  border-width: '<format.footer.border.width>'; /* TODO: split it to top/right/bottom/left */
  box-sizing: border-box;
  height: '<format.footer.height>';
  margin-top: '<format.footer.margins.top>';
  margin-right: '<format.footer.margins.right>';
  margin-bottom: 0;
  margin-left: '<format.footer.margins.left>';
  padding: 0;
  width: 100%;
}
```
