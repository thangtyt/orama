/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';
/**
 * Module dependencies.
 */

let util = require('util'),
    config = require(__base + 'config/config.js'),
    _ = require('lodash');

let _module = new FrontModule;

_module.index = function (req, res) {
    let index_view = 'index';
    _module.render(req, res, index_view, {
        user: req.user || null
    });
};


module.exports = _module;
