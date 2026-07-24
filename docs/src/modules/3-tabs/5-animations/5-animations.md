# Creating Animations

You might find yourself in the position of creating something that needs to change or update constantly. A simple
example would be the hollusion rune from the `rune` bundle:

<p align="center">
  <img src="./hollusion.gif">
  </img>
</p>

A more complicated example with the `physics_2d` bundle that also displays stats about its simulation:

```js
import { make_ground, set_gravity, make_vector, add_circle_object, update_world } from 'physics_2d';

// Run this code at sourceacademy.org to see the tab in action!
const gravity = make_vector(0, -9.8);
set_gravity(gravity);

make_ground(0, 1);

const pos = make_vector(0, 100);
const velc = make_vector(0, 0);
add_circle_object(pos, 0, velc, 10, false);

for (let i = 0; i < 10; i = i + 1) {
  update_world(1/60);
}
```

## `glAnimation`

`glAnimations` are a way of representing animations that rely on WebGL. To create your own `glAnimation`, you simply
need to instantiate the abstract class and override the `getFrame` method:

```ts twoslash
import { glAnimation } from '@sourceacademy/modules-lib/types';

export class CustomAnimation extends glAnimation {
  public override getFrame(timestamp: number) {
    return {
      draw: () => {
        console.log('frame drawn at', timestamp);
      }
    };
  }
}
```

The `getFrame` method should return an `AnimFrame`, which is an object with a single `draw` method that can be used
to draw objects onto a `canvas` element:

### Displaying `glAnimations` using `AnimationCanvas`

`AnimationCanvas` is a React component that can be used to render `glAnimations`. It also provides a start/stop button, auto looping toggle and time slider (similar to that of a Youtube Video). It also automatically handles any errors that might get thrown in the process of rendering an animation.

Simply pass the `glAnimation` as a prop:

```tsx twoslash
// @jsx: react-jsx
import type { glAnimation } from '@sourceacademy/modules-lib/types';
import AnimationCanvas from '@sourceacademy/modules-lib/tabs/AnimationCanvas';

type Props = {
  animation: glAnimation;
};

export function DisplayAnimation({ animation }: Props) {
  return <AnimationCanvas animation={animation} />;
}
```

## `useAnimation`

If the `AnimationCanvas` doesn't fit your needs, you can use the `useAnimation` hook directly.

In the case of the hollusion rune, the animation is simple and doesn't require pause or scrolling functionality:

```tsx twoslash
// @jsx: react-jsx
import type { DrawnHollusionRune } from '@sourceacademy/bundle-rune/functions';
import WebGLCanvas from '@sourceacademy/modules-lib/tabs/WebGLCanvas';
import { useRef } from 'react';
// ---cut---
import { useAnimation } from '@sourceacademy/modules-lib/tabs/useAnimation';

interface Props {
  rune: DrawnHollusionRune;
};

/**
 * Canvas used to display Hollusion runes
 */
export default function HollusionCanvas({ rune }: Props) {
  // We memoize the render function so that we don't have
  // to reinitialize the shaders every time
  const renderFuncRef = useRef<(time: number) => void>(undefined);

  const { setCanvas } = useAnimation({
    async callback({ timestamp, canvas }) {
      if (renderFuncRef.current === undefined) {
        renderFuncRef.current = await rune.draw(canvas);
      }
      renderFuncRef.current(timestamp);
    },
    autoStart: true
  });

  return <WebGLCanvas ref={canvas => {
    if (canvas) {
      setCanvas(canvas);
    }
  }} />;
}
```

The hook provides functionality like starting, stopping and setting the animation to an arbitrary timestamp:

```ts twoslash
// @noErrors: 2554
import { useAnimation } from '@sourceacademy/modules-lib/tabs/useAnimation';

const { start, stop, isPlaying, changeTimestamp } = useAnimation();
```

The hook itself also automatically handles things like auto start on component mount and stopping the animation on component dismount.

## `requestAnimationFrame`

If `useAnimation` still doesn't meet your needs, you can get the browser to render your animations using `requestAnimationFrame` directly.

> [!INFO] requestAnimationFrame vs setInterval
>
> Javascript does actually have a way to schedule a callback that executes "regularly": `setInterval`. However, there are several reasons why `setInterval`
> doesn't work very well for rendering animations. `requestAnimationFrame` is still the best option for **animations** specifically.

You provide `requestAnimationFrame` with a callback that it schedules and then eventually calls with the timestamp at the moment the
callback is being executed:

```ts
function callback(timestamp: number) {
  console.log('Callback was called at', timestamp);
}

requestAnimationFrame(callback); // callback will get executed some time in the future
```

Every call to `requestAnimationFrame` only executes the callback once, so to get multiple calls you need to call it recursively:

```ts
function callback(timestamp: number) {
  console.log('Callback was called at', timestamp);
  requestAnimationFrame(callback);
}

requestAnimationFrame(callback);
```

`requestAnimationFrame` doesn't allow you to specify when the callback will get executed or the interval between executions, so the only
way to achieve a (mostly) stable framerate is to check the difference between the timestamps and not draw a frame if not enough time has
passed:

```ts
let prevTimestamp: number | null = null;
const frameDuration = 1000 / 24; // at 24 FPS

function callback(timestamp: number) {
  if (prevTimestamp === null || timestamp - prevTimestamp > frameDuration) {
    drawFrame();
  }
  prevTimestamp = timestamp;
  requestAnimationFrame(callback);
}
requestAnimationFrame(callback);
```

Every call to `requestAnimationFrame` returns an ID. You can use this to make sure that you haven't scheduled the same callback multiple
times at once:

```ts
let prevTimestamp: number | null = null;
let reqId: number | null = null;;
const frameDuration = 1000 / 24; // at 24 FPS

function callback(timestamp: number) {
  if (prevTimestamp === null || timestamp - prevTimestamp > frameDuration) {
    drawFrame();
  }
  prevTimestamp = timestamp;

  reqId = requestAnimationFrame(callback);
}

// Don't schedule the animation twice
if (reqId !== null) {
  reqId = requestAnimationFrame(callback);
}
```

This request ID can also be uses to cancel the request with `cancelAnimationFrame`. This is particularly useful as a teardown step in React.
You should always cancel any pending animations when the component becomes unmounted.

```ts
import { useEffect, useRef } from 'react';

const frameDuration = 1000 / 24; // at 24 FPS

export function AnimatedComponent() {
  const reqId = useRef<number | null>(null);
  const prevTimestamp = useRef<number | null>(null);

  function callback(timestamp: number) {
    if (prevTimestamp.current === null || timestamp - prevTimestamp.current > frameDuration) {
      drawFrame();
    }
    prevTimestamp.current = timestamp;
    reqId.current = requestAnimationFrame(callback);
  }

  useEffect(() => {
    // Start the animation on mount
    reqId.current = requestAnimationFrame(callback);

    // Cancel the animation on unmount
    return () => {
      if (reqId.current !== null) {
        cancelAnimationFrame(reqId.current);
      }
    };
  }, []);

}
```

## Error Handling

If your animation is dependent on the result of cadet code, you should take care to ensure that errors are handled appropriately. For
example, Rune animations require that the cadet return a Rune for every timestamp provided:

```ts
type RuneAnimation = (t: number) => Rune;
```

But Source doesn't have the ability to enforce this at runtime, so a cadet might accidentally return something that isn't a rune:

```ts twoslash
// @errors: 2614 7006
import { animate_rune, heart } from '@sourceacademy/bundle-rune';

animate_rune(1, 60, t => t < 60 ? heart : 0);
```

`AnimationCanvas` automatically handles displaying any errors that get thrown while rendering the animation. `useAnimation` provides an `errored` property
on its return object that you can check. If you're doing your animations manually, then you should implement those checks on your own:

```tsx {8,12-17}
import { useEffect, useRef, useState } from 'react';

const frameDuration = 1000 / 24; // at 24 FPS

export function AnimatedComponent() {
  const reqId = useRef<number | null>(null);
  const prevTimestamp = useRef<number | null>(null);
  const [errored, setErrored] = useState<Error | null>(null);

  function callback(timestamp: number) {
    if (prevTimestamp.current === null || timestamp - prevTimestamp.current > frameDuration) {
      try {
        drawFrame();
      } catch (error) {
        setErrored(error);
        return;
      }
    }
    prevTimestamp.current = timestamp;
    reqId.current = requestAnimationFrame(callback);
  }

  useEffect(() => {
    // Start the animation on mount
    reqId.current = requestAnimationFrame(callback);

    // Cancel the animation on unmount
    return () => {
      if (reqId.current !== null) {
        cancelAnimationFrame(reqId.current);
      }
    };
  }, []);

  return errored ? <p> An error occurred: {errored} </p> : <p>Animation</p>;
}
```
