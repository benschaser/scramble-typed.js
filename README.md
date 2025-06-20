# scramble-typed.js v1.1.3

A pure-js typing-in text scramble effect for unique and engaging animations. Inspired by typed.js.

## Install

### HTML Script Source

Link the script in the `head` element of an HTML page.

```html
<script src="https://cdn.jsdelivr.net/npm/scramble-typed@1.1/dist/scramble-typed.umd.min.js"></script>
```

### Or use NPM

```bash
npm install scramble-typed
```

And import the ScrambleTyped object into frameworks like React and Vue.

```js
import ScrambleTyped from "scramble-typed";
```

## Get Started

Create a new ScrambleTyped object and target an element in the DOM by passing in the id of the element as the first argument and an options object as the second.

```js
const hello = new ScrambleTyped("#target-element-id", {
  //options
});
```

## Options

### Text

By default, ScrambleTyped uses the inner text contents of the target element and its children, however, you can set the final text to be something else entirely. Note that if the target node has any children at all, the text option will be ignored.

You can also customize the set of characters that are randomly scrambled through by setting the `charset` to a string of characters.

```js
const hello = new ScrambleTyped("#target-element-id", {
  text: "You don't have to be a hacker to look like one.",
  charset: "abcABC123",
});
```

### Timing

ScrambleTyped has 3 different timing parameters: the typing speed, the scramble speed, and the scramble duration.

1. `typeSpeed` determines the interval between the initial typing in of each character. (in milliseconds)
2. `scrambleSpeed` dictates the interval between each 'scramble' of a character. (in milliseconds)
3. `scrambleDuration` determines how long each character will 'scramble' for after they are typed in. (in milliseconds)

```js
const hello = new ScrambleTyped("#target-element-id", {
  typeSpeed: 50,
  scrambleSpeed: 100,
  scrambleDuration: 200,
});
```

By default, every ScrambleTyped object clears any inner text content of the target element and starts the animation upon construction. However, if you would like to start the animation at a later time, set `useStartTrigger` to `true`, which allows you to start the animation on your own using the `start()` method on the object. Note that the target element's content will be cleared upon object construction regardless so that it's ready to be animated.

```js
const hello = new ScrambleTyped("#target-element-id", {
  useStartTrigger: true,
});

//wait 2 seconds before starting the animation
setTimeout(() => {
  hello.start();
}, 2000);
```

### Scramble Classes

To maximize visual customizability, ScrambleTyped allows you to add an array of classes to the characters that are in the 'scrambling state'. These classes are added on character type-in and removed once the scramble duration expxires and the actual character is displayed.

```js
const hello = new ScrambleTyped("#target-element-id", {
  scrambleClasses: ['scrambling'];
});
```

In your CSS:

```css
.scrambling {
  opacity: 0.5;
}
```

### Callbacks

You can hook into the start and end events by defining the `onStart` and `onEnd` functions.

```js
const hello = new ScrambleTyped("#target-element-id", {
  onStart: () => {
    functionToBeRunOnStart();
  },
  onEnd: () => {
    functionToBeRunOnEnd();
  },
});
```

# Documentation

### Full Options List

|                      |                                                                                                                                                |
| -------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------- |
|             **text** | `string` - the content to be scrambled<br>_Default: innerText_                                                                                 |
|          **charset** | `string` - defines the list of characters to randomly pull from<br>_Default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'_ |
|        **typeSpeed** | `number` - determines how fast the characters type in (in milliseconds)<br>_Default: 50_                                                       |
|    **scrambleSpeed** | `number` - specifies the speed at which characters are scrambled (in milliseconds)<br>_Default: 100_                                           |
| **scrambleDuration** | `number` - determines how long letters scramble before settling onto their actual character (in milliseconds)<br>_Default: 500_                |
|   **preserveSpaces** | `bool` - when set to `true`, whitespaces do not scramble<br>_Default: false_                                                                   |
|     **restoreOnEnd** | `bool` - when set to `true`, dissolves separate `span` elements into natural HTML innerText once animation completes<br>_Default: true_        |
|  **scrambleClasses** | `string[]` - array of classes to be added to characters that are in the scramble state                                                         |
|  **useStartTrigger** | `bool` - when set to true, waits until `start()` method is called to begin the animation<br>_Default: false_                                   |
|          **onStart** | `function` - custom callback function triggered when animation starts                                                                          |
|            **onEnd** | `function` - custom callback function triggered when animation ends                                                                            |

### Methods

`start()` - beings animation
