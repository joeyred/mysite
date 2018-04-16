!function() {
// const animationStep = (timestamp, start) => {
//   start = start ? start : timestamp;
//   let progress = timestamp - start;
//
//   if (progress === duration)
// };

const animationSeries = (element, baseCSSClass, hooks, ...steps) => {
  let stepIndex = 0;
  let start = null;
  let stepStart = null;
  let classes = {
    base:     baseCSSClass,
    current:  null,
    previous: null
  };
  let duration = {
    current:      0,
    previousStep: null,
    total:        0
  };
  let stepsFired = [];

  // Loop through the steps and put together whatever values may be needed.
  for (let i = 0; i < steps.length; i++) {
    // Get total duration
    duration.total += steps[i][1];

    stepsFired.push(false);
  }
  console.log(duration.total);

  // Aniamtion Step
  function animationStep(timestamp) {
    start = start ? start : timestamp;
    stepStart = stepStart ? stepStart : timestamp;
    // let stepProgress = Math.round(timestamp - stepStart);
    let progress = timestamp - start;
    // Set in prgress
    element.classList.add('animation_in-progress');

    // HOOK: Before Each Frame
    if (hooks && hooks.beforeEachFrame) {
      hooks.beforeEachFrame(element);
    }

    // Secret loop hiding in the loop that is itself the same loop.
    //
    // Loopception
    //
    // Written and directed by Christopher Nolan
    if (progress >= duration.current && stepsFired[stepIndex] === false) {
      // HOOK: Before Each Step
      if (hooks && hooks.beforeEachStep) {
        hooks.beforeEachStep(element);
      }
      console.log('step happened');
      console.log(duration.current, progress);
      let callback = steps[stepIndex][2] || false;
      classes.current = steps[stepIndex][0];
      // Remove classes if previous ones exist
      if (!!classes.previous) {
        element.classList.remove(`animation_${classes.base}_${classes.previous}_transition`);
        element.classList.remove(`animation_${classes.base}_${classes.previous}_animate`);
      }
      // Add classes for this animation step
      element.classList.add(`animation_${classes.base}_${classes.current}_transition`);
      element.classList.add(`animation_${classes.base}_${classes.current}_animate`);
      if (callback) {
        callback(element);
      }
      // Set previous properties for the next step to use
      classes.previous = steps[stepIndex][0];
      stepsFired[stepIndex] = true;
      // only add to the durration as long as it isnt the last step.
      if (stepIndex !== steps.length) {
        duration.current += steps[stepIndex][1];
        // console.log(duration.current);
      }
      if (hooks && hooks.afterEachStep) {
        hooks.afterEachStep(element);
      }
      // Up the step index
      stepIndex++;
    }

    // HOOK: afterEachFrame
    if (hooks && hooks.afterEachFrame) {
      hooks.afterEachFrame(element);
    }
    // Invoke the next frame as long as the total duration of the animation series
    // hasn't been exceded.
    if (progress < duration.total) {
      window.requestAnimationFrame(animationStep);
    } else {
      // HOOK: after
      if (hooks && hooks.after) {
        hooks.after(element);
      }
      element.classList.remove('animation_in-progress');
    }
  }
  // HOOK: Before
  if (hooks && hooks.before) {
    hooks.before(element);
  }
  window.requestAnimationFrame(animationStep);
};

const registerAnimation = (name, callback) => {
  if (Gingabulous.animations[name]) {
    throw new Error(
      'YA DUN FUCKED UP BITCH, THEMS NAMES IS RESEVRED. READ THE SIGN DUMMY.'
    );
  } else {
    Gingabulous.animations[name] = callback;
  }
};

Gingabulous.animations = {};
Gingabulous.registerAnimation = registerAnimation;
Gingabulous.animationSeries = animationSeries;
}();
