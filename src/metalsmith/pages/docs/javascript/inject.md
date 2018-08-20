---
title: Inject
category: javascript
sub_category: extensions
extends: ../../../layouts/doc.pug
description: >
  A UI Module extension utility meant to add methods for injecting dynamic content
  via AJAX.
---

## Overview

This module is meant to add usable methods and data attributes to a UI module for
injecting dynamic content into specified containers.

## How to Use

### In a Module

This module is meant to be constructed inside a UI modules constructor, and passed
the `element` DOM object passed to the UI modules constructor. This gives access to
the exposed methods of the Inject module, as well as all availbale data attributes.

The example below shows the simplist way to extend a UI module with the Inject module:

```js
class Example {
  constructor(element, options) {
    this.inject = new Gingabulous.Inject(element);
  }
}
```

### In Markup

The Inject module automatically adds the ability to use new data attributes. The
attributes listed are the default values.

- `data-inject-api` - This attribute is used to get the file the API should come from. This is currently meant for JSON files only, and while an external URL could be passed, it has only been used to pull local files.  
- `data-inject-container` -
- `data-inject-content`
- `data-inject-bind`

### API

#### `updateContent(key)`

This module has one method to be used within the parent UI module it is extending.
The method takes a single argument, `key`, which must be a string of the object key,
or the chain.

*NOTE: do not include the parent object of the chain.
Just the cahin within the object.*
