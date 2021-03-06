---
class: typography
title: Typography
order: 3
---

## Headings

# H1 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde 
extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, 
obscuris et malesuada fames.

## H2 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde 
extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, 
obscuris et malesuada fames.

### H3 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde 
extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, 
obscuris et malesuada fames.

#### H4 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde 
extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, 
obscuris et malesuada fames.

##### H5 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde 
extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, 
obscuris et malesuada fames.

###### H6 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde 
extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, 
obscuris et malesuada fames.

## Blockquotes

### Single Line Blockquote:

> I like to say memorable things!  

### Multi-line Blockquote with Cite Reference:

> People think focus means saying yes to the thing you’ve got to focus on. But that’s not
> what it means at all. It means saying no to the hundred other good ideas that there are.
> You have to pick carefully. I’m actually as proud of the things we haven’t done as the
> things I have done. Innovation is saying no to 1,000 things.
> <cite>Steve Jobs – Apple Worldwide Developers’ Conference, 1997</cite>



## Tables

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

## Unordered Lists (Nested)

* Item 1
* Item 2
  * Item 2.1
  * Item 2.2

## Ordered List (Nested)

1. Item 1
    1. Item 1.1
    2. Item 1.2
2. Item 2
3. Item 3

# Code

## Inline

Here is an example of using inline `code`. Using `npm init` will initialize a Node.js 
project and create a `package.json` file.

## HTML

```html
<article class="post">
  <header class="post-header">
    <div class="content post-header-inner">
      <h1>Fixed backgrounds on a mobile browser without using JavaScript!</h1>

      <time class="post-date">October 6th 2016</time>

      <div class="post-meta">

        <span class="author">by <span class="author-name">Joey Hayes</span></span>

      </div>
    </div>
  </header>

  <div class="post-content">
    <div class="content">

      <p>
        Quid securi etiam tamquam eu fugiat nulla pariatur. Cum ceteris in veneratione
        tui montes, nascetur mus. Quisque placerat facilisis egestas cillum dolore.
        Ambitioni dedisse scripsisse iudicaretur. Quisque ut dolor gravida, placerat
        libero vel, euismod.
      </p>

    </div>
  </div>
</article>
```
## Pug

```pug
extends ../layouts/default.pug

block panes
  +pane('pen', 'above', 'pen-pane', {api: 'api'})
    .carousel-panes(data-carousel-panes='')
      //- Center
      .pane.carousel-center
        .container
          .block.sm-12(data-inject-bind='demo')
      //- Left
      .pane.carousel-left
        .container
          .block.sm-12(data-inject-bind='details')
      //- Right
      .pane.carousel-right
        .container
          .block.sm-12(data-inject-bind='code.markup')
        .container
          .block.sm-12(data-inject-bind='code.styles')
        .container
          .block.sm-12(data-inject-bind='code.scripts')
    .fixed-bottom-bar
      .nav-bar
        button.icon-button(data-panes-nav='left')
          +icon('info')
        button.icon-button(data-panes-nav='center')
          +icon('menu')
        button.icon-button(data-panes-nav='right')
          +icon('code')
      .pane-carousel-title-bar.container.sm-row.sm-nowrap
        .block.sm-12
          h4 Details
        .block.sm-12
          h4 Demo
        .block.sm-12
          h4 Code
```
## CSS

```css
.post::before {
  content: ' ';
  display: block;
  background-image: url("/assets/imgs/image.png");
  background-position: center;
  background-size: cover;
  height: 100vh;
  width: 100vw;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  z-index: -10;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "rucksack", sans-serif;
  font-weight: 300;
  color: #FF664E;
}
```

## SCSS

```scss
mixin generate-close-icon-colors {
  $_palette: map-keys($color-palette);

  @each $_color in $_palette {
    $_color-value: map-get($color-palette, $_color);
    &.#{$_color} {
      .icon-button {
        svg {
          fill: $_color-value;
        }
      }
    }
  }
}

@mixin generate-animation-border-color-classes {
  $_palette: map-keys($color-palette);

  @each $_color in $_palette {
    $_color-value: map-get($color-palette, $_color);
    &.#{$_color} {
      .animation_border-left {
        background: $_color-value;
      }
    }
  }
}

////
/// Base Styles
///

.titled-callout {
  @include generate-animation-border-color-classes;
  @include generate-close-icon-colors;

  .expandable-content {
    overflow: hidden;
  }
  &[data-expand="inactive"] {
    .expandable-content {
      overflow: inherit;
    }
  }
}



.titled-callout[data-responsive-state="active"] {
  will-change: transform;
  transform: none;
  ////
  /// Base Styles
  ///
  &[data-expand] {
    // Content
    // ======================= //
    .expandable-content {
      will-change: transform;
    }
    // Border
    // ======================= //
    .animation_border-left {
      position: absolute;
      width: $titled-callout_border-left-size;
      will-change: height;
    }
    // Icon
    // ======================= //
    .icon-button {
      svg {
        rect:nth-child(3) {
          will-change: transform;
        }
        rect:nth-child(2) {
          will-change: transform;
        }
      }
    }
  }
}
```

## JavaScript

```javascript
!function() {
class EventListener {
  constructor(element, listener) {
    this.element = element;
    this.listener = listener;
    this.callbacks = [];
    this.registered = false;
  }
  _handler() {
    if (this.callbacks.length > 0) {
      for (let i = 0; i < this.callbacks.length; i++) {
        this.callbacks[i]();
      }
    }
  }
  _registerEventListener() {
    this.element.addEventListener(this.listener, () => this._handler());
  }
  registerCallback(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    } else {
      throw new TypeError(`callback must be a function, not a ${typeof callback}`);
    }
    if (this.callbacks.length > 0 && !this.registered) {
      this._registerEventListener();
      this.registered = true;
    }
  }
}

const registerGlobalEventListener = function(name, element, listener) {
  listener = name || listener;
  if (Gingabulous.events[name] === undefined) {
    Gingabulous.events[name] = new Gingabulous.EventListener(element, listener);
  }
};

Gingabulous.events = {};
Gingabulous.registerGlobalEventListener = registerGlobalEventListener;
Gingabulous.EventListener = EventListener;
}();
```

## php

```php
<?php
/**
 * Takes in values that correspond to config settings array and returns a sting with
 * the correct html class.
 *
 * @since  0.1.0
 *
 * @param  string $section the key value for the proper array within the `$classes` array.
 * @param  string $element the element that is the name of the key in the section array.
 * @return string          The HTML classes as pulled from the config.
 */
function genfound_markup_config( $section, $element ) {

	// Include correct file path for currently supported grid
	include_once( get_stylesheet_directory() . '/inc/foundation/config/' . genfound_get_grid() );

	$classes = genfound_grid_config_settings();

	$output = $classes[$section][$element];

	return ' ' . $output;
}
```
