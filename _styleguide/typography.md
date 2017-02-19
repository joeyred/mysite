---
class: typography
title: Typography
order: 3
---

## Headings

# H1 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, obscuris et malesuada fames.

## H2 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, obscuris et malesuada fames.

### H3 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, obscuris et malesuada fames.

#### H4 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, obscuris et malesuada fames.

##### H5 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, obscuris et malesuada fames.

###### H6 Heading

Quae vero auctorem tractata ab fiducia dicuntur. Mercedem aut nummos unde unde extricat, amaras. Ab illo tempore, ab est sed immemorabili. Inmensae subtilitatis, obscuris et malesuada fames.

## Blockquotes

### Single Line Blockquote:

> I like to say memorable things!  

### Multi-line Blockquote with Cite Reference:

> People think focus means saying yes to the thing you’ve got to focus on. But that’s not
> what it means at all. It means saying no to the hundred other good ideas that there are.
> You have to pick carefully. I’m actually as proud of the things we haven’t done as the
> things I have done. Innovation is saying no to 1,000 things.
>
<cite>Steve Jobs – Apple Worldwide Developers’ Conference, 1997</cite>

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
2. Item 2
  * Item 2a
  * Item 2b
3. Item 3

# Code

## Inline

Here is an example of using inline `code`. Using `npm init` will initialize a Node.js project and create a `package.json` file.

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
.info-bar {
  @include category-color-classes;

  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
  div > span {
    display: block;
    padding: $info-bar-padding_vertical $info-bar-padding_horizontal;
    line-height: $line-height_base;
    font-size: $info-bar-font_size;
  }
  .category {
    flex: auto;
    // margin: auto;

  }
  .publish-date {
    // flex: 0 1 auto;
    text-align: right;
    background-color: $info-bar-date_background-color;
    color: $info-bar-date_text-color;
    // margin: auto;
  }
}

h1, h2, h3, h4, h5, h6 {
  font-family: $font-heading_family;
  font-weight: $font-heading_weight;
  color: $font-heading_color;
}
```

## JavaScript

```javascript
'use strict';

function Inject(documentPath, contentTarget, options) {
  this.options = this.getOptions(options || {});
  this.xhr = new XMLHttpRequest();
  this.debug = new Debug('Inject', true);
  this.$contentContainer = $('[' + this.options.injectContentAttr + ']');
  this.documentPath = documentPath;
  this.contentTarget = contentTarget;
  this.status = 'no content';
  this.updateStatusAttr();
}

Inject.prototype = {
  constructor: Inject,

  defaults: {
    injectContentAttr:  'data-inject',
    contentLoadedValue: 'loaded'
  },
  getOptions: function(options) {
    return $.extend(true, this.defaults, options);
  },
  getStatusAttr: function() {
    return this.options.injectContentAttr + '-status';
  },
  contentHasLoaded: function() {
    if (this.$contentContainer.attr(this.getStatusAttr()) === this.options.contentLoadedValue) {
      return true;
    }
    return false;
  },
  updateStatus: function(status) {
    this.status = status;
    this.updateStatusAttr();
  },
  updateStatusAttr: function() {
    this.$contentContainer.attr(this.getStatusAttr(), this.status);
  },
  contentIsReady: function() {
    return this.xhr.readyState === 4;
  },
  getContent: function() {
    var $response = $(this.xhr.responseText);
    this.debug.functionReturn('getContent', $response);
    return $response.find(this.contentTarget);
  },
  injectContent: function() {
    this.debug.values('injectContent', {readyState: this.xhr.readyState});
    if (this.contentIsReady()) {
      // Inject Content
      this.$contentContainer.append(this.getContent());
      // Update Status
      this.updateStatus(this.options.contentLoadedValue);
    }
  },
  event: function() {
    if (!this.contentHasLoaded()) {
      this.xhr.onreadystatechange = this.injectContent.bind(this);
      this.xhr.open('GET', this.documentPath);
      this.xhr.send();
    }
  }
};
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