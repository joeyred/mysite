---
title: Pane
category: pug
sub_category: mixins
extends: ../../../layouts/doc.pug
description: >
  Create a pane component complete with optional API and responsive functionality.
---

## Overview

Generates a pane component to be used with the `Panes` and `Pane` UI modules.

```jade
+pane(id, position, classes, dataAtts)
```

## Params

- `id` - *String* - the ID for the pane that will be passed to the `data-pane`
attribute.
- `position` - *String* - position of the pane off-canvas. accepts: `above`, `below`,
`right`, `left`.
- `classes` - *String* - any css classes to be added to the parent element.
- `dataAtts` - *Object* - data attributes pertaining to module extensions, such as the `Responsive`, or `Inject` extension modules.
- `dataAtts.api` - *String* - The filename of the api file.
- `dataAtts.responsive` - *String* - breakpoint string keys to populate the value of
the `data-responsive` attribute.

## How to Use

All this mixin requires is the `id` and `position` params to output a useable
component. For the content of the pane, simply pass markup to the block of the mixin.

### Basic Usage

#### Pug

```jade
+pane('example', 'right')
  article.example-stuff
    h3 Hello
    p This is content.
```

#### Output

```html
<div class="pane right" data-pane="example">
  <!-- Pane Header -->
  <div class="pane-header">
    <div class="top-bar">
      <div class="left">
        <button class="icon-button" data-pane-close>
          <!-- Close Icon -->
        </button>
      </div>
    </div>
    <!-- Pane Content -->
    <div class="pane-content">
      <!-- Block Contents -->
      <article class="example-stuff">
        <h3>Hello</h3>
        <p>
          This is content.
        </p>
      </article>
    </div>
  </div>
</div>
```
