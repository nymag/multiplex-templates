# byline-embed
Embed components in other components!

[![Build Status](https://travis-ci.org/nymag/byline-embed.svg)](https://travis-ci.org/nymag/byline-embed)
[![Code Climate](https://codeclimate.com/github/nymag/byline-embed/badges/gpa.svg)](https://codeclimate.com/github/nymag/byline-embed)

## Install

```
npm install --save byline-embed
```

## Usage

### render a component

```js
var embed = require('byline-embed');

embed.render('component-name', data);
```

This will render a component. It will look in `components/[name]/template.[extension]`. 

e.g.

```
components/entry/template.jade
components/coolparagraph/template.nunjucks
```

You can also pass `'component'` explicitly as the third arg.

### render a layout

```js
embed.render('component-name', data, 'layout');
```

This will look in your root-level layouts folder, e.g.

```
layouts/index/template.nunjucks
layouts/archive/template.jade
```

### Engines

Currently we support these engines:

* nunjucks
* jade
* mustache (coming soon!)
* es6 template literals (coming soon!)

The Embed Service exposes the instances of the templating engines, so you can add mixins/filters/globals/etc into them:

```js
var env = embed.engines.nunjucks;

env.addGlobal('key', 'value');
```

## Tests

```
npm test
```