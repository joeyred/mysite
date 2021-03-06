---
title: Animate
category: javascript
sub_category: utilities
extends: ../../../layouts/doc.pug
description: >
  Small set of utilities for complex/custom animations.
---


## Overview

This module adds two methods and a namespace to the Gingabulous global object.

- `registerAnimation()` - A function for registering custom globally accessable
animation functions meant to contain functionality to be executed durring the
animation process.

- `animationSeries()` - A function for creating custom multi-step animations that go
beyond what CSS transitions or keyframe animations can accomplish.

- `animations` - Object literal meant to serve as a namespace for
`registerAnimation()` to add custom functions to.

**PLEASE NOTE:** This module is very bare compared to extension modules. This keeps
everything extreamely lean, however it becomes the developers responsibility to
properly impliment these methods and write the proper conditionals and attribute
checking/getting.

## How to Use

### Registering Animation Functions

To register an animation fucntion simply call `registerAnimation()` and pass it the
name you wish for the animation object key, and the function to be executed.

**Example:**

```js
Gingabulous.registerAnimation('exampleAnimation', (element) => {
  // custom functionality here
});
```

It's recommended that this be defined in your `app.js` file, or whatever such custom
site functionality file **before** the initialization function is executed for the
library.

### Multi-Step Animations

the `animationSeries()` method takes 4 required arguments, with the 4th being the, at
least, one step of animation.

- `element` - The DOM node that will be animated.
- `baseCSSClass` - The base CSS class name that will be used to generate the animation
CSS classes.
- `hooks` - an object that can contain optional hooks for callbacks to be executed
throughout the animation process.
- `steps` - this argument is handles as a rest param, thus allowing for as many steps
passed as required.

#### The Hook Object

There are several hooks where a callback function can be applied in the animation
process. This can be useful to execute functions that affect elements, or modules
outside of the original scope of the passed DOM node object.

**Available Hooks:**
- `before` - Occures before the first frame of the entire animation series.
- `beforeEachFrame`- Occures before every frame throughout the series.
- `beforeEachStep` - Occures before each animation step in the series.
- `afterEachFrame` - Occures after each frame throughout the series.
- `afterEachStep` - Occures after each step in the series.
- `after` - Occures after the very last frame in the entire animation series.

#### A Step Array

The step argument takes an array. Each array passed is considered a step.

The array has two required arguments and a third optional argument that is a callback.

- `stepClassName` - The name of the step to be used in generating the CSS class
applied to the element.
- `stepDurration` - The durration, in frames, of the animation step.
- `callback` - an optional callback function to be executed at the end of the step.
The `element` argument is passed down to the callback by default.

**Example:**

```js
Gingabulous.animationSeries(
  document.querySelector('.example'),
  'example',
  false,
  [
    'step-1',
    600
  ],
  [
    'step-2',
    200
  ],
  [
    'final',
    200,
    element => {
      // Stuff to do for the final step.
    }
  ]
);
```


### Implimenting in a UI module

For a UI component to use these utilities the module must get the value of the passed
element's `data-animate` attribute, and use that value to access the animation
method in the `animations` namespace.

**Simplest Example:**

```js
class ExampleUIModule {
  constructor(element, options) {
    this.animationFunc = element.getAttribute('data-animation');
  }
}
```
However, it is not recommended to approach things this way. Instead, check if the
attribute exists before trying to get anything from it.

**Recommended Example:**

```js
class ExampleUIModule {
  constructor(element, options) {
    this.animationFunc = element.hasAttribute('data-animation') ?
      element.getAttribute('data-animation') :
      false;
  }
}
```

The next step is to execute the proper animation method in the modules events methods
that require the animation. It is also recommended here that all function calls are
inside the proper conditional statements.

**Recommended Example:**

```js
class ExampleUIModule {
  constructor(element, options) {
    this.element = element;
    this.animationFunc = element.hasAttribute('data-animation') ?
      element.getAttribute('data-animation') :
      false;
  }
  _event() {
    if (!!this.animationFunc) {
      Gingabulous.animations[this.animationFunc](this.element);
    }
  }
}
```
