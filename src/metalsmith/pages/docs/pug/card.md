---
title: Card
category: pug
sub_category: mixins
extends: ../../../layouts/doc.pug
description: >
  An expandable card with a thumbnail, title, tags, and description.
---

## Overview

The card mixin is meant to take a data object and turn it into a full card component.
The mixin was written to take a file object from a collection, thus making it ideal for
iteration.

```pug
+card(data, classes, horizontal)
```
## Params
### The Data Object

This mixin is only set up to handle certain pieces of metadata. Including more in
the object than this mixin uses won't hurt anything, the extra bits just won't be used.

#### What is actually used in the mixin

- `data.path` - *String* - The relative filepath of the post this card represents.
- `data.type` - *String* - The type of post this card represents.
- `data.title` - *String* - The title of the card.
- `data.description` - *String* - Description for the card.
- `data.thumbnail` - *Object* - Object containing data for the thumbnail.
- `data.thumbnail.image` - *String* - image path for the `src` attribute of the `img` element.
- `data.thumbnail.title` - *String* - title of the image for the `title` attribute.
- `data.thumbnail.description` - *String* - description of the image for the `alt` attribute.
- `data.tags` - *Array* - array of tags for the represented post.
- `data.api` - *Object* - an object containing API specific data.
- `data.api.namespace` - *String* - the namespace to use to generate the proper `data-inject` value.

### Other Params

- `classes` - *String* - any css classes that should be added to the parent element.
- `horizontal` - *Boolean* - whether the card should have a horizontal or vertical
layout. *NOTE*: This defaults to `true`, but as of now there are no styles to handle
a vertical layout should this be set to `false`.

## How To Use

Due to the way the mixin is set up to take a big data object, it's best to use
collection data and iterate over it. Blow is an example of the kind of data this
mixin takes.

### Pug

```pug
-
  var data = {
    path: '/projects/example.html',
    type: 'project',
    title: 'Example',
    description: 'A fun description of stuff.',
    thumbnail: {
      image: 'path/to/image.png',
      title: 'Example Preview',
      description: 'A preview of the Example Post'
    },
    tags: ['foo', 'bar'],
    api: {
      namespace: 'projects'
    }
  }

+card(data, 'a-sepcial-class')
```

### Output

```html
<div class="card horizontal a-special-class" data-card>
  <!-- Options Bar -->
  <div class="card-options-bar">
    <button class="icon-button" data-card-close>
      <!-- Icon Content... -->
    </button>
    <button class="button" data-inject="projects.example">
      See More
    </button>
  </div>
  <!-- Card Cover -->
  <div class="card-cover">
    <!-- Thumbnail -->
    <div class="card-thumbnail">
      <img src="path/to/image.png" title="Example Preview" alt="A preview of the Example Post" />
    </div>
    <!-- Info -->
    <div class="card-info">
      <!-- Title -->
      <h3>Example</h3>
      <!-- Tags -->
      <div class="tags-container">
        <ul class="tags">
          <li>foo</li>
          <li>bar</li>
        </ul>
      </div>
    </div>
  </div>
  <!-- Description Content Container -->
  <div class="bottom-container">
    <p>
      A fun description of stuff.
    </p>
  </div>
</div>
```

## Notes

- *The `horizontal` param, while handling the boolean passed to it just fine, currently
creates a css class output that will basically break it if you pass `false` to it. The
styles were originally written, but have since been removed after the component had a
major style overhaul. The vertical version of a card is still planned to happen, but not
until it's actually needed.*
