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

    let index_view = 'index';
    let key = req.query.s || '';
    key = '%' + key.replace(/\s+/g, '%') + '%';

    __models.artists.findAll({
        where: {
            name :  {
                $ilike : key
            }
        },
        include: [
            {
                model: __models.artists_photos,
                attributes: ['url'],
                where: {
                    type: 'large'
                }
            }
        ],
        order: 'listeners DESC',
        limit: 30
    }).then(function(ar){
        _module.render(req, res, index_view, {
            artists: ar
        }, function (err, html) {
            console.log(err);
            res.send(html);
        });
    });
};


module.exports = _module;
