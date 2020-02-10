---
title: "Blog Post Test"
date: 2018-10-2
permalink: posts/test/
author: brianhayes
description: >
  This is a test post to make sure things are working. Still don't know exactly
  what the design will be. Hopefully this will make things easier to figure out.  
featured: false
tags:
  - javascript
  - scss
  - webDevelopment
  - test
thumbnail:
  image:
  title:
  description:
---

## Heading 2

Ambitioni dedisse scripsisse iudicaretur. Tityre, tu patulae recubans sub tegmine fagi dolor. Inmensae subtilitatis, obscuris et malesuada fames. Cum ceteris in veneratione tui montes, nascetur mus.

Prima luce, cum quibus mons aliud consensu ab eo. Sed haec quis possit intrepidus aestimare tellus. Phasellus laoreet lorem vel dolor tempus vehicula. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Unam incolunt Belgae, aliam Aquitani, tertiam.

### Heading 3

```js
class ConfigParser {
  constructor(paths, config, handlers) {
    const {src, build, dist} = paths;
    const splitConfig = splitObjectByKeys(config, ['source', 'destination']);
    const dir = splitConfig.splitTo;
    const options = splitConfig.splitFrom;
    this.paths = {
      ...paths,
      dir: {
        src: dir.source,
        dest: dir.destination
      }
    };
    this.src = src;
    this.build = build;
    this.dist = dist;
    this.dir = {
      src: dir.source,
      dest: dir.destination
    };
    this.handlers = handlers || {};
    this.options = options || {};
  }

  handlePath(base, dir) {
    const {getPath} = this.handlers;
    if (getPath) {
      return getPath(base, dir);
    }
    return `${base}/${dir}`;
  }
  handleSrcPath(base, dir) {
    return this.handlePath(base, dir);
  }
  handleDestPath(base, dir) {
    return this.handlePath(base, dir);
  }

  handleOptions() {
    const {getOptions} = this.handlers;

    if (getOptions) {
      return getOptions(this.options, this.paths);
    }

    return {
      ...this.options
    };
  }

  output() {
    const {src, dest} = this.dir;
    return {
      PATH: {
        src: this.handleSrcPath(this.src, src),
        build: this.handleDestPath(this.build, dest),
        dist: this.handleDestPath(this.dist, dest)
      },
      OPTIONS: this.handleOptions()
    };
  }
}
```

Morbi odio eros, volutpat ut pharetra vitae, lobortis sed nibh. Ut enim ad minim veniam, quis nostrud exercitation. Quae vero auctorem tractata ab fiducia dicuntur. Curabitur blandit tempus ardua ridiculus sed magna. Nec dubitamus multa iter quae et nos invenerat.

Cum sociis natoque penatibus et magnis dis parturient. Quis aute iure reprehenderit in voluptate velit esse. Etiam habebis sem dicantur magna mollis euismod.

### Heading 3

Quam temere in vitiis, legem sancimus haerentia. Mercedem aut nummos unde unde extricat, amaras. Quisque placerat facilisis egestas cillum dolore. Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Vivamus sagittis lacus vel augue laoreet rutrum faucibus.

#### Heading 4

Prima luce, cum quibus mons aliud consensu ab eo. Integer legentibus erat a ante historiarum dapibus. Mercedem aut nummos unde unde extricat, amaras.

Mercedem aut nummos unde unde extricat, amaras. Salutantibus vitae elit libero, a pharetra augue. Ab illo tempore, ab est sed immemorabili. Quo usque tandem abutere, Catilina, patientia nostra? Etiam habebis sem dicantur magna mollis euismod.

Petierunt uti sibi concilium totius Galliae in diem certam indicere. Curabitur blandit tempus ardua ridiculus sed magna. Nihil hic munitissimus habendi senatus locus, nihil horum? Me non paenitet nullum festiviorem excogitasse ad hoc. Integer legentibus erat a ante historiarum dapibus.

## Next Section (H2)

```css
@keyframes spin_pulse {
  0% {
    transform: none;
  }
  50% {
    transform: rotate(360deg) scale(1);
  }
  70% {
    transform: rotate(360deg) scale(1.2);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}
```
