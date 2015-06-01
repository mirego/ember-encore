[DEPRECATION NOTICE] This project is no longer maintained.

We strongly suggest you migrate your app to [ember-cli-encore](https://github.com/mirego/ember-cli-encore).

# EmberEncore

[![Bower version](https://badge.fury.io/bo/ember-encore.svg)](http://badge.fury.io/bo/ember-encore)
[![Code Climate](http://img.shields.io/codeclimate/github/mirego/ember-encore.svg)](https://codeclimate.com/github/mirego/ember-encore)

`EmberEncore` is an adapter and a serializer to use with the [Encore](https://github.com/mirego/encore) gem.

## Usage

### With ember-cli

First, you need to import the initializer to register EmberEncore with Ember:

```js
// app.js
import 'ember-encore/initializer';
```

Then configure your application adapter to use EmberEncore:

```js
// adapters/application.js
import Adapter from 'ember-encore/adapter';
export default Adapter.extend({
  // EmberEncore’s adapter extends the DS.RESTAdapter
  // so you can use all the same options here
});
```

## Building the library

- Run `npm install -g grunt-cli` to install Grunt
- Run `npm install` to install build dependencies
- Run `grunt`

## License

`EmberEncore` is © 2014 [Mirego](http://www.mirego.com) and may be freely distributed under the [New BSD license](http://opensource.org/licenses/BSD-3-Clause).
See the [`LICENSE.md`](https://github.com/mirego/ember-encore/blob/master/LICENSE.md) file.

## About Mirego

[Mirego](http://mirego.com) is a team of passionate people who believe that work is a place where you can innovate and have fun. We're a team of [talented people](http://life.mirego.com) who imagine and build beautiful Web and mobile applications. We come together to share ideas and [change the world](http://mirego.org).

We also [love open-source software](http://open.mirego.com) and we try to give back to the community as much as we can.
