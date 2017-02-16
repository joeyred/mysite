---
class: grid
title: The Grid
order: 1
---

<div class="titled-callout">
  <div class="titled-callout-title">
    <h2>Overview</h2>
  </div>
  <div class="titled-callout-inner">
    <p>
      This is a flexbox based grid using <strong>containers</strong> that contain
      <strong>blocks</strong>. If there is to be a <code>max-width</code> applied, then it
      should be applied to containers. This system also uses <strong>wrappers</strong> to
      properly display backgrounds that are not restricted by a maximum width and so are
      effectively full width.
    </p>
  </div>
</div>

## Media Query Prefixes

All of the modifier classes that can be applied with the `wrapper`, `container`, and
`block` have a media query prefix.

- `sm` for small screens and up.
- `md` for medium screens and up.
- `lg` for large screens and up.
- `xl` for extra-large screens and up.

### Code Example

```html
<div class="container sm-nowrap md-wrap">
  <div class="block">

    Content...

  </div>
</div>
```

## Fixed Block Widths

This grid can give **blocks** a fixed width based on 12 units per row. The classes used
are based on the media query you want affected, and how many units you want the **block**
to occupy. For instance, the `sm-12` class will give the block a 100% width for small
screens and up.

### Code Example

```html
<div class="wrapper">
  <div class="container">
    <div class="block sm-12 md-6 lg-4">

      Content...

    </div>
    <div class="block sm-12 md-6 lg-4">

      Content...

    </div>
    <div class="block sm-12 lg-4">

      Content...

    </div>
  </div>
</div>   
```

### 12 Columns Per Row Fixed Width Blocks

<div class="sg-grid-example wrapper">
  <div class="container sm-no-gutters sg-example">
    <div class="block sm-12">12</div>
  </div>

  <div class="container sm-no-gutters sg-example">
    <div class="block sm-6">6</div>
    <div class="block sm-6">6</div>
  </div>

  <div class="container sm-no-gutters sg-example">
    <div class="block sm-4">4</div>
    <div class="block sm-4">4</div>
    <div class="block sm-4">4</div>
  </div>

  <div class="container sm-no-gutters sg-example">
    <div class="block sm-3">3</div>
    <div class="block sm-3">3</div>
    <div class="block sm-3">3</div>
    <div class="block sm-3">3</div>
  </div>

  <div class="container sm-no-gutters sg-example">
    <div class="block sm-2">2</div>
    <div class="block sm-2">2</div>
    <div class="block sm-2">2</div>
    <div class="block sm-2">2</div>
    <div class="block sm-2">2</div>
    <div class="block sm-2">2</div>
  </div>

  <div class="container sm-no-gutters sg-example">
    <div class="block sm-1">1</div>
    <div class="block sm-1">1</div>
    <div class="block sm-1">1</div>
    <div class="block sm-1">1</div>
    <div class="block sm-1">1</div>
    <div class="block sm-1">1</div>
    <div class="block sm-1">1</div>
    <div class="block sm-1">1</div>
    <div class="block sm-1">1</div>
    <div class="block sm-1">1</div>
    <div class="block sm-1">1</div>
    <div class="block sm-1">1</div>
  </div>
</div>

### Mixed Examples

<div class="sg-grid-example wrapper">
  <div class="container sm-no-gutters sg-example">
    <div class="block sm-4">
      4
    </div>
    <div class="block sm-4">
      4
    </div>
    <div class="block sm-4">
      4
    </div>
  </div>

  <div class="container sm-no-gutters sg-example">
    <div class="block sm-3">
      3
    </div>
    <div class="block sm-6">
      6
    </div>
    <div class="block sm-3">
      3
    </div>
  </div>

  <div class="container sm-no-gutters sg-example">
    <div class="block sm-2">
      2
    </div>
    <div class="block sm-8">
      8
    </div>
    <div class="block sm-2">
      2
    </div>
  </div>

  <div class="container sm-no-gutters sg-example">
    <div class="block sm-1">
      1
    </div>
    <div class="block sm-4">
      4
    </div>
    <div class="block sm-2">
      2
    </div>
    <div class="block sm-4">
      4
    </div>
    <div class="block sm-1">
      1
    </div>
  </div>
</div>
