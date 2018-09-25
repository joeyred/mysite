---
title: Skill
category: pug
sub_category: mixins
extends: ../../../layouts/doc.pug
description: >
  Generate a skill progress bar component.
---

## Overview

Generate a titled progress bar, meant for displaying skill proficiencies.

```pug
+skill(title, rating, color)
```

## Params

- `title` - *String* - The title of the skill.
- `rating` - *Number* - Skill rating out of 100.
- `color` - *String* - Color class to be applied to the element.

## How to Use

Simply include the params and the component will output the proper markup. The only
optional param is `color`.

### Basic

#### Pug

```pug
+skill('Example', 80, blue)
```

#### Output

```html
<div class="skill blue">
  <span class="title">Example</span>
  <div class="rating">
    <div class="meter" style="width: 80%"></div>
  </div>
</div>
```
