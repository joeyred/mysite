---
title: Titled Callout
category: pug
sub_category: mixins
extends: ../../../layouts/doc.pug
description: >
  This is an example of how a markdown file might be handled.
---

## Overview

This mixin generates a Titled Callout component.

```pug
+titledCallout(title, color, expandable, breakpoints, animation)
```

### Params

- `title` - *String* - The title to be displayed.
- `color` - *String* - The color class to be applied to the parent element
- `expandable` - *Boolean* - Whether or not the component can expand and collapse using the `Expand`
  JavaScript module.
- `breakpoints` - *String* - The breakpoint string to pass to the `data-responsive` attribute.
- `animation` - *String* - animation to use according to registered animations via the `Animate`
  JavaScript utility module.


## How To Use


The bare minimum to make a pane output properly is the `title`, and `color`, params.


### Basic Example

#### pug

```pug
+titledCallout('This is an Example', 'red')
  p The content goes right here, since this mixin can handle a content block
```

#### Result

```html
<div class="titled-callout red">
  <div class="titled-callout-heading">
    <h2>This is an Example</h2>
  </div>
  <div class="titled-callout-content-wrapper">
    <div class="titled-callout-content">
      <p>
        The content goes right here, since this mixin can handle a content block
      </p>
    </div>
  </div>
</div>
```

### Advanced Example

#### Pug

```pug
+titledCallout('This is an Example', 'red', true, 'lg-down', 'animationName')
  p The content goes right here, since this mixin can handle a content block
```

#### Result

```html
<div class="titled-callout red expandable" data-expand="active" data-responsive="lg-down" data-animation="animationName">
  <div class="titled-callout-heading">
    <h2>This is an Example</h2>
    <button class="icon-button" data-expand-close>
      <!-- Close Icon -->
    </button>
  </div>
  <div class="titled-callout-content-wrapper expandable-content" data-expand-close>
    <div class="titled-callout-content">
      <p>
        The content goes right here, since this mixin can handle a content block
      </p>
    </div>
  </div>
</div>
```
