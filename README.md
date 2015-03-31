# multiplex-templates
Embed components in other components!

[![Build Status](https://travis-ci.org/nymag/multiplex-templates.svg)](https://travis-ci.org/nymag/multiplex-templates)
[![Code Climate](https://codeclimate.com/github/nymag/multiplex-templates/badges/gpa.svg)](https://codeclimate.com/github/nymag/multiplex-templates)

## Install

```
npm install --save multiplex-templates
```

## Usage

### render a template

```js
var multiplex = require('multiplex-templates')();

multiplex.render('path/to/template.ext', data);
```

This will render a template. The templating engine it uses is determined by the template's extension.

e.g.

```
components/paragraph/template.jade
templates/header.nunjucks
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
{{ embed('path/to/tpl.nunjucks', data) | safe }}
```

**Jade:**

```jade
section#foo
  p.embedded
    != embed('path/to/tpl.jade', data)
```

The `data` you pass in is then used to render the child template. You can optionally pass in additional data:

**Nunjucks:**

```
{{ embed('path/to/tpl.mustache', data, defaults) | safe }}
```

**Jade:**

```jade
section#foo
  p.embedded
    != embed('path/to/tpl.ejs', data, defaults)
```

Properties in the `data` object will overwrite properties of the same name in the `defaults` object, as this uses lodash's fast `_.defaults()` method.

## Tests

```
npm test
```