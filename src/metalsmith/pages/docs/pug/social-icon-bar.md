---
title: Social Icon Bar
category: pug
sub_category: mixins
extends: ../../../layouts/doc.pug
description: >
  Generate an icon bar containing all icons whose names are passed to the mixin.
---

## Overview

This mixin outputs an icon bar for social media icons. Each of these icons are
hyperlinks as well. The links are automatically populated from the `config.yml` file.
As long as the key in the `social` object in that file matches an icon name passed to
the mixin, the value of the config key will populate the `href` attribute.

```jade
+socialIconBar(...icons)
```

## Params

- `...icons` - *Rest* - pass as many icon name string params as you want. This is what will be used to populate the icon bar.

## How to Use

```jade
+socialIconBar('facebook', 'twitter', 'github', 'stackoverflow')
```

```html
<div class="icon-bar">
  <a href="link/to/facebook/profile" target="_blank" class="icon">
    <!-- Facebook Icon -->
  </a>
  <a href="link/to/twitter/profile" target="_blank" class="icon">
    <!-- Twitter Icon -->
  </a>
  <a href="link/to/github/profile" target="_blank" class="icon">
    <!-- Github Icon -->
  </a>
  <a href="link/to/stackoverflow/profile" target="_blank" class="icon">
    <!-- Stack Overflow Icon -->
  </a>
</div>
```
