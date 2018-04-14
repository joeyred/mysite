'use strict';

!function() {

// class Animate {
//   constructor(element, classPrefix) {
//     this.element = element;
//     this.classPrefix = classPrefix;
//   }
// }

const animationStep = (element, classes, durration, callback) => {
  const {base, current} = classes;
  const previous = classes.previous || false;

  if (!classes.previous) {
    element.classList.add(`${base}_${current}_transition`);
    element.classList.add(`${base}_${current}_animate`);

    if (callback) {
      callback(element);
    }
  }
  if (classes.previous) {
    if (durration !== 0) {
      setTimeout(
        function() {
          element.classList.remove(`${base}_${previous}_transition`);
          element.classList.remove(`${base}_${previous}_animate`);

          element.classList.add(`${base}_${current}_transition`);
          element.classList.add(`${base}_${current}_animate`);

          if (callback) {
            callback(element);
          }
        },
        durration
      );
    } else {
      element.classList.remove(`${base}_${previous}_transition`);
      element.classList.remove(`${base}_${previous}_animate`);

      element.classList.add(`${base}_${current}_transition`);
      element.classList.add(`${base}_${current}_animate`);

      if (callback) {
        callback(element);
      }
    }
    console.log('animation fired!');
  }
};

// [{String}, {Number}, {Function}]
// ['stage-name', 300, callback]
const animationSeries = (element, baseAnimationClass, ...steps) => {
  let durration = 0;
  let totalDurration = 0;
  let callback;
  let i = 0;
  const baseClass = `animation_${baseAnimationClass}`;
  element.classList.add('animation_in-progress');
  // steps.push([''])
  for (i; i < steps.length; i++) {
    console.log(durration);
    callback = steps[i][2] || false;
    if (i === 0) {
      animationStep(element, {base: baseClass, current: steps[i][0]}, durration, callback);
    } else {
      animationStep(
        element,
        {
          base:     baseClass,
          current:  steps[i][0],
          previous: steps[i - 1][0]
        },
        durration,
        callback
      );
    }
    durration = steps[i][1];
    totalDurration += durration;
    // if (i > 0) {
    //   animationStep(
    //     element,
    //     {
    //       base:     baseClass,
    //       current:  steps[i][0],
    //       previous: steps[i - 1][0]
    //     },
    //     durration,
    //     callback
    //   );
    //   durration = steps[i][1];
    // }
  }
  setTimeout(
    () => {
      element.classList.remove('animation_in-progress')
    }, totalDurration);

};

// function animate(element, classPrefix, durration, delay = false) {
//   const classes = {
//     base: `animation-${classPrefix}`,
//     inProgress: `animation-${classPrefix}_in-progress`
//   }
//   element.classList.add(`animation-${classPrefix}`);
//   if (delay) {
//     setTimeout(() => {
//
//     }, delay);
//   }
// }



const registerAnimation = (name, callback) => {
  Gingabulous.animations[name] = callback;
};

Gingabulous.animations = {};
Gingabulous.animations.registerAnimation = registerAnimation;
Gingabulous.animations.animationSeries = animationSeries;


}();
