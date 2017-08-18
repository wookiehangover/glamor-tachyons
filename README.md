# Tachyons for css-in-js

This is how we've been using tachyons at Credit Karma:

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

While this helps promote reuse and cuts down on duplication of idential class strings, it's less than ideal in a couple of areas.

1. Lacks strong enforcement — there's nothing stopping you from adding `className="blah"` to an element.
2. Naming conventions are ad hoc
3. Reusable components require extra work

```jsx
const styles = {
  header: 'mv4 f3'
}
```

* should this support inline styles
* what to do about the reset


Research:

https://github.com/hugozap/reverse-tachyons
https://github.com/raphamorim/native-css
https://github.com/Khan/aphrodite
