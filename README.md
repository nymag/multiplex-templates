# multiplex-templates
Embed components in other components!

[![Build Status](https://travis-ci.org/nymag/multiplex-templates.svg)](https://travis-ci.org/nymag/multiplex-templates)
[![Code Climate](https://codeclimate.com/github/nymag/multiplex-templates/badges/gpa.svg)](https://codeclimate.com/github/nymag/multiplex-templates)

## Install

```
npm install --save multiplex-templates
```

## Usage

### render a component

```js
var multiplex = require('multiplex-templates')();

multiplex.render('component-name', data);
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
multiplex.render('component-name', data, 'layout');
```

This will look in your root-level layouts folder, e.g.

```
layouts/index/template.nunjucks
layouts/archive/template.jade
```

### Engines

We support [all of the engines that consolidate.js supports](https://github.com/tj/consolidate.js#supported-template-engines).

This module exposes the instances of the templating engines, so you can add mixins/filters/globals/etc onto them:

```js
var env = multiplex.engines.nunjucks;

env.addGlobal('key', 'value');
```

You can also instantiate your own engines (and configure them however you like) and pass them into multiplex-templates.

```js
var env = require('nunjucks').configure('.', { watch: false }),
  jadeEnv = require('jade'), // so cool, doesn't need config (⌐■_■)
  multiplex = require('multiplex-templates')({
    nunjucks: env,
    jade: jadeEnv
  });

// multiplex.engines.nunjucks === env
```

## Cross-engine Embedding

To embed a template, call the `embed` function in the parent template, passing in the name of the template you want to embed, plus (optionally) data and defaults objects. The `embed` function is available in all templating languages that allow functions inside template locals.

**Nunjucks:**

```
{{ embed('name', data) | safe }}
```

**Jade:**

```jade
section#foo
  p.embedded
    != embed('name', data)
```

The `data` you pass in is then used to render the child template. You can optionally pass in additional data:

**Nunjucks:**

```
{{ embed('name', data, defaults) | safe }}
```

**Jade:**

```jade
section#foo
  p.embedded
    != embed(data, 'name', defaults)
```

Properties in the `data` object will overwrite properties of the same name in the `defaults` object, as this uses lodash's fast `_.defaults()` method.

## Tests

```
npm test
```