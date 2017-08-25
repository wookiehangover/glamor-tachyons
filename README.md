# Tachyons for css-in-js

This is how we've been using Tachyons at Credit Karma:

```js
const styles = {
  header: 'mv4 f3',
  main: 'ba br1 pa2'
}

const Component = () => {
  <div>
    <header className={styles.header}></header>
    <div className={styles.main}></div>
  </div>
}
```

While this helps promote reuse and cuts down on duplication of idential Tachyons `className` strings, it's less than ideal in a couple of areas:

1. Lacks strong enforcement — there's nothing stopping you from adding `className="blah"` to an element.
2. Naming conventions are ad hoc
3. Reusable components require extra work and documenations

```jsx
import { tachyons } from 'glamor-tachyons'
import { css } from 'glamor'

const styles = {
  header: css(tacyhons('mv4 f3')),
  main: css(tachyons('ba br1 pa2'))
}

const Component = () => {
  <div>
    <header className={styles.header}></header>
    <div className={styles.main}></div>
  </div>
}
```

```js
import { buildStyles } from 'glamor-tachyons'
import { css } from 'glamor'

const styles = buildStyles({
  header: 'mv4' // => css(tachyons('mv4'))
}, css)
```

Maybe it's just one api?

```js
import { tachyons } from 'glamor-tachyons'
import { css } from 'glamor-tachyons'

tachyons('mt2')
// => { marginTop: '1rem' }

tachyons('mt2', css)
// => css({ marginTop: '1rem' })

tachyons({
  header: 'mt2'
}, css)
// => {
//   header: css({ marginTop: '1rem' })
// }
```


* Does this support inline styles?
  no, use glamor for that
* What about the tachyons reset and global styles?
  included, but a separate API


Research:

https://github.com/hugozap/reverse-tachyons
https://github.com/raphamorim/native-css
https://github.com/Khan/aphrodite
