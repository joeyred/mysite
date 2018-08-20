---
title: Card
category: javascript
sub_category: UI Modules
extends: ../../../layouts/doc.pug
description: >
  An expandable card, great for post archives.
---

## How to Use

To create an expandable card, an element but have a parent with a `.card` class, and `data-card` attribute, a child element with a `data-card-close`, and the last direct child element with a `.bottom-container` class. 

### Pug

A pug mixin exists to generate a card element. [See the card mixin doc for more.](docs/pug/card/)

**NOTE:** *The mixin currently only supports the horizontal version of a card*

### Horizontal

```html
<div class="card horizontal" data-card>
  <!-- Options Bar -->
  <div class="card-options-bar">
    <button class="icon-button" data-card-close>
      <!-- Icon Content... -->
    </button>
    <a class="button" href="#">
      See More
    </a>
  </div>
  <!-- Card Cover -->
  <div class="card-cover">
    <!--- Content for the always visible part of the card. -->
  </div>
  <div class="bottom-container">
    <!-- Content for the collapsed part of the card -->
  </div>
</div>
```

### Vertical

This is currently not supported.
