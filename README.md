# byline-embed
Embed components in other components!

[![Build Status](https://travis-ci.org/nymag/byline-embed.svg)](https://travis-ci.org/nymag/byline-embed)
[![Code Climate](https://codeclimate.com/github/nymag/byline-embed/badges/gpa.svg)](https://codeclimate.com/github/nymag/byline-embed)

## Install

```
npm install --save byline-embed
```

## Usage

```js
var embed = require('byline-embed');

// render a component
embed.render('component-name', data);

// render a layout
embed.render('component-name', data, 'layout');

// it exposes the instances of the templating engines
var env = embed.engines.nunjucks;

env.addGlobal('key', 'value');
```

## Tests

```
npm test
```