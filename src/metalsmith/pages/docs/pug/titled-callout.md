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

```jade
+titledCallout(title, color, expandable, breakpoints, animation)
```

## How To Use

### Options

- `title` - The title to be displayed.
- `color` - The color class to be applied to the parent element
- `expandable` - Whether or not the component can expand and collapse using the `Expand`
  JavaScript module.
- `breakpoints` - The breakpoint string to pass to the `data-responsive` attribute.
- `animation` - animation to use according to registered animations via the `Animate`
  JavaScript utility module.

### Basic Example

#### pug

```jade
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
