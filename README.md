# glamor-tachyons

> A tool for using Tacyhons with glamor or other css-in-js libraries

## Background

<details>
In 2016 and 2017, this is how we've been using Tachyons at Credit Karma:

```js
const styles = {
  header: 'mv4 f3',
  main: 'ba br1 pa2'
}

export default () => {
  <div>
    <header className={styles.header}></header>
    <div className={styles.main}></div>
  </div>
}
```

We found that this helps with readability and consolidates some of the business logic that tends to work its way into the `className` prop of stateful components.

In general, it helps with reuse and cuts down on duplication of idential Tachyons `className` strings, but in several ways it's less than ideal:

1. Lacks strong enforcement. There's no garauntee that every tachyons class will make it into your `styles` object.
2. Relies on an external systems. We load Tachyons through a Sass build pipeline in Webpack, so shared modules tend to depend on Tachyons implicitly to avoid duplicating it in downstream builds. Sad!
3. Reusable components require lots of extra work. If you want to reuse a component but alter some it's tacyhons classes
4. Anything goes when Tachyons can't support what you're trying to do. Inline styles, individual Sass files, and other imported sass/css modules are all used as work arounds across our projects.

On top of that, there are a few recent trends in CSS / browser performance that are hard to do in our current setup.

* Removing unused styles from the payload
* Inlining styles in the `<head>` to avoid blocking the render while CSS downloads
* CSS-in-JS techniques are gaining traction and libraries are becoming battle-hardened
</details>

## Installation

Install with `npm`:

```shell
npm install --save glamor-tachyons
```

For usage with glamor, be sure to install that too.

```shell
npm install --save glamor
```

## Usage

In it's simplest form, `glamor-tachyons` changes Tachyons classes into JavaScript objects:

```js
import { tachyons } from 'glamor-tachyons'

tachyons('mt2 pink')
// => { marginTop: '1rem', color: '#ff80cc' }
```

Although [glamor]() is in the name, it's not required by glamor-tachyons. They're meant to go together, but there's nothing specific to glamor apart from producing output that it (and other CSS-in-JS libraries) can use.

To use with glamor, simply pass the output of `tachyons()` to one of glamor's APIs. It's easy, give it a shot!

```js
import { tachyons } from 'glamor-tachyons'
import { css } from 'glamor'

export default () =>
  <h1 className={css(tachyons('f-headline red'))}>
```

And if you're repeating that pattern all over the place, you can wrap those calls in another function to keep things tidy:

```js
const t = (classNames) => css(tachyons(classNames))

export default () => 
  <div>
    <h1 className={t('f-headline red')}>
    <h1 className={t('fw6 underline')}>
  </div>
```

`glamor-tachyons` can also change entirs objects containing Tachyons class strings with the `wrap` method.

```js
import { tachyons, wrap } from 'glamor-tachyons'
import { css } from 'glamor-tachyons'

wrap({
  header: 'mt2'
}, css)
// => {
//   header: css({ marginTop: '1rem' })
// }
```

Tachyons also has global styles that it needs in order to do it's thing. We didn't forget about those. The `reset()` method will pass each line of the Tachyons reset and global styles to a callback that works with [glamor.insertRule]().

```js
import { reset } from 'glamor-tachyons'
import { insertRule } from 'glamor'

reset({ insertRule })
```

So to tie that all together, glamor and glamor-tachyons lets a component seemlessly and declaratively manage CSS composed by Tachyons classes. The following example, when server rendered will include an inline `<style>` tag featuring _only_ the styles for the tachyons classes referenced and the global reset.

```jsx
import { wrap, reset } from 'glamor-tachyons'
import { css, insertRule } from 'glamor'

reset({ insertRule })

const styles = wrap({
  header: 'mv4 f3',
  main: 'ba br1 pa2'
}, css)

export default () => {
  <div>
    <header className={styles.header}></header>
    <div className={styles.main}></div>
  </div>
}
```

## API


## Notes / Open Questions

* Where does the Tachyons source go?
  * Tachyons is added to your JavaScript bundle in the form of a modular data structure
  * Difficult to get around this
    * maybe use a webpack plugin at build time to change the class strings directly into js and strip the dependency?
    * maybe use a webpack loader to pre-process and inline an object of Tachyons classes by file name?
    * or that webpack plugin that lets your inlne output that exec'ed at build time could work. Shit just use that if you don't want the extra 20kb.
* Does this support inline styles?
  * Possibly, but it's not extensively tested. Use glamor for that.
* What about the tachyons reset and global styles?
  * included, but a separate API


Research / Prior work:
```
https://github.com/hugozap/reverse-tachyons
https://github.com/raphamorim/native-css
https://github.com/Khan/aphrodite
```