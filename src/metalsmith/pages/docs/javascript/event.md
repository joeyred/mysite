---
title: Event
category: javascript
sub_category: utilities
extends: ../../../layouts/doc.pug
description: >
  A global utility for registering global event listeners and registering callbacks to
  those single listeners.
---

## Overview

The Event utility module is meant to allow for isolated UI modules to have access to
defined event listeners and be able to hook callbacks to those event listeners, without
having to create their own duplicate event listener.

This is all based on using two main methods. The `registerGlobalEventListener()` method
to add an event to the `events` namespace, and construct a new instance of `EventListener`
on that new key. Doing so will expose the second main method, `registerCallback()`, which
can be used by modules to add callbacks to that event with a single listener.

## How to Use

This is a rather simple utility to implement. In a module, instead of creating an event
listener for an event multiple modules would add their own listener to, first use the
`registerGlobalEventListener()` method.

### Registering the global event listener

#### The Basic Use

```js
Gingabulous.registerGlobalEventListener('scroll', document);
```

#### How it Might Look in a Module

```js
class MyModule {  
  events() {
    Gingabulous.registerGlobalEventListener('scroll', document);
  }
}
```

You don't have to worry about checking if that event already exists in the namespace, as
the method does that on it's own. If you would like, you can wrap your own conditional
around the method call checking for the event to save it from being called at all if it
has, but this is purely a preference, and shouldn't impact speed of execution without it.

### Registering a callback function to a defined event

The next step is then adding the callback function the module requires to be fired upon
the event being triggered.

#### The Basic Use

```js
function myCallback() {
  console.log('My callback fired!');
}

Gingabulous.events.scroll.registerCallback(myCallback);
```
#### How it Might Look in a Module

```js
class MyModule {
  constructor() {
    this.events();
  }
  myCallback() {
    console.log('My callback fired!');
  }
  events() {
    Gingabulous.registerGlobalEventListener('scroll', document);

    Gingabulous.events.scroll.registerCallback(myCallback);
  }
}
```

## API

### `registerGlobalEventListener(name, element, listener)`

- `name` - *String* - The name of the lister. This is used for the name of the key the
`EventListener` instance will be constructed on, as well as the value of the actual event
the listener will be placed on, if no value is passed to the `listener` param.
- `element` - *Node* - the element to place the listener on.
- `listener` - *String* - OPTIONAL - The event name to be passed to the `addEventListener`
method.

### `registerCallback(callback)`

- `callback` - *Function* - The function to be fired when the event is triggered.
