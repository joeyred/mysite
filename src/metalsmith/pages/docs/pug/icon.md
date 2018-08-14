---
title: Icon
category: pug
sub_category: mixins
extends: ../../../layouts/doc.pug
description: >
  A mixin for generating an imbedded SVG icon
---

## Overview

This mixin is meant to generate an svg icon element.

```jade
+icon(name)
```

## Params

- `name` - the name of the icon to output.

## How to Use

Just pass the name of the icon you want to output. If the icon doesn't exist an error
element will be outputted instead.

### Available Icons

### Basic

- `menu`
- `close`
- `check`
- `arrow-left`
- `arrow-right`

### Social Media

- `behance`
- `codepen`
- `facebook`
- `twitter`
- `github`
- `instagram`
- `linkedin`
- `pinterest`
- `stackoverflow`
- `youtube`
- `vimeo`

### Specialized

- `info`
- `code`
