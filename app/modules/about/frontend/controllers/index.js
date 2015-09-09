/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';
/**
 * Module dependencies.
 */

let util = require('util'),
    config = require(__base + 'config/config.js'),
    _ = require('lodash'),
    promise = require('bluebird'),
    sequelize = require('sequelize');

let _module = new FrontModule;

_module.index = function (req, res) {
    _module.render(req, res, 'index', {});
   // res.send('Hello World');
};

module.exports = _module;
