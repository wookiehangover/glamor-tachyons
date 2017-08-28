# glamor-tachyons

> A tool for using Tacyhons with glamor or other css-in-js libraries

## Background

<details>
In 2016 and 2017, we've been using Tachyons for a good portion of our CSS at Credit Karma. With a large number of people across different teams all working on different pieces of the product in parallel, we've found some useful patterns for improving the developer experience of using Tachyons. Here's what an average component might look like:

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

We started using this "page object" pattern to not repeat identical Tachyons `className` strings. The pattern helps with readability, especially when navigating another team's project. It can consolidate some of the business logic that stateful components often have around `className`. It's less cognative load than our previous approach (webpack + sass + extract text plugin) and doesn't require an extra build step.

It's less cognative load than our previous approach (webpack + sass + extract text plugin) and doesn't require an extra build step. Plus, it makes overridding styling for a shared component much easier to add.

But in several ways this pattern is less than ideal:

1. **Lacks strong enforcement.** There's no garauntee that every tachyons class will make it into your `styles` object.
2. **Relies on an external systems.** We load Tachyons through a Sass build pipeline in Webpack, so shared modules tend to depend on Tachyons implicitly to avoid duplicating it in downstream builds. Sad!
3. **Reusable components require extra work.** If you want to reuse a component but alter some it's tacyhons classes, you need to expose extra props and provide a good way of merging them. No matter how you do it, there's more work to add a consistent, well-documented api.
4. **Anything goes when Tachyons can't support what you're trying to do.** Inline styles, individual Sass files, and other imported sass/css modules are all used as work arounds across our projects.

On top of that, there are a few recent trends in CSS / browser performance that are hard to do in our current setup.

* Removing unused styles from the payload
* Inlining styles in the `<head>` to avoid blocking the render while CSS downloads
* CSS-in-JS techniques are gaining traction and libraries are becoming battle-hardened

Not to mention that our page object pattern is already CSS-in-JS! The natural conclusion was to survey the CSS-in-JS landscape and attempt to augment our in-house solution with some updated tooling under the hood.
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
// => { fontSize: '5rem', color: '#ff80cc' }
```

`glamor-tachyons` can also convert entire objects containing Tachyons class strings with the `wrap` method.

```js
import { tachyons, wrap } from 'glamor-tachyons'

wrap({
  h1: 'f-headline red',
  h2: 'fw6 underline'
})
// => {
//   h1: { fontSize: '5rem', color: '#ff80cc' },
//   h2: { fontWeight: 600, textDecoration: 'underline' }
// }
```

Although [glamor](https://github.com/threepointone/glamor) is in the name, it's not required by glamor-tachyons. They're meant to go together, but there's nothing specific to glamor apart from producing output that it (and other CSS-in-JS libraries) can use.

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

Tachyons also has global styles that it needs in order to do it's thing. We didn't forget about those. The `reset()` method will pass each line of the Tachyons reset and global styles to a callback that works with [glamor.insertRule](https://github.com/threepointone/glamor/blob/6634946ed433bca8098a507022250717f8029029/src/reset.js#L1), similarly to glamor's own reset.

```js
import { reset } from 'glamor-tachyons'
import { insertRule } from 'glamor'

reset({ insertRule })
```

Together, `glamor` and `glamor-tachyons` let a component seemlessly and declaratively manage CSS composed by Tachyons classes. The following example, when server rendered, will include an inline `<style>` tag comprising the styles for _only_ the Tachyons classes referenced in the component and the global reset.

```js
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

### `tachyons(className): object`

### `wrap(styles, [callback]): object`

### `reset(glamor): void`

## Notes / Open Questions

* Where does the Tachyons source go?
  * Tachyons is added to your JavaScript bundle in the form of a modular data structure
  * Difficult to get around this
    * maybe use a webpack plugin at build time to change the class strings directly into js and strip the dependency?
    * maybe use a webpack loader to pre-process and inline an object of Tachyons classes by file name?
    * or that webpack plugin that lets your inlne output that exec'ed at build time could work. Shit just use that if you don't want the extra 20kb.


Research / Prior work:
```
https://github.com/quora/parsecss
https://github.com/hugozap/reverse-tachyons
https://github.com/raphamorim/native-css
https://github.com/Khan/aphrodite
```