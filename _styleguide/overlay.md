---
class: overlay
title: Overlay
order: 5
---

<div class="titled-callout">
  <div class="titled-callout-title">
    <h2>Overview</h2>
  </div>
  <div class="titled-callout-inner">
    <p>
      A overlay window can be created with the addition of data attributes to HTML elements.
      Documents can also be loaded via AJAX though document attributes added to the inner
      overlay element.
    </p>
  </div>
</div>

## Code Example

```html
<!-- The Modal Open Button -->
<button class="icon-button overlay-open" data-overlay-open="exampleOverlay">
  <span class="icon menu">
    Open Me!
  </span>
</button>

<!-- The Modal Window -->
<div class="overlay" data-overlay="exampleOverlay">

  <div class="overlay-header">

    <!-- Use the topbar to properly align the close button -->
    <div class="top-bar">
      <!-- Left Section -->
      <div class="left">
        <button class="icon-button overlay-close" data-overlay-close="exampleOverlay">
          <span class="icon close">
            <!-- Icons can be brought in from the `icons` object in `sites` -->
            {{ site.icons.close }}
          </span>
        </button>
      </div>
    </div>

  </div>

  <!-- Modal Window Content -->
  <div class="overlay-inner">

    Content...

  </div>

</div>
```

## Demo


<button class="button overlay-open" data-overlay-open="exampleOverlay">
  <span>
    Open Me!
  </span>
</button>

<!-- TODO Add Code and Demo for Loading an AJAX Document -->
