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

_module.albumById = function (req, res) {
    let index_view = 'index';
    let id = req.params.id;
    promise.all([
        __models.albums_photos.find({
            where: {
                albums_id: id,
                type: 'extralarge'
            }
        }),
        __models.albums.find({
            where: {
                id: id
            },
            include: [
                {
                    model: __models.artists
                }
            ]
        }),
        __models.albums_tracks.findAll({
            where: {
                albums_id: id
            }
        }),
        __models.albums_tags.findAll({
            where: {
                albums_id: id
            },
            include: [
                {
                    model: __models.tags
                }
            ]
        })
    ]).then(function(results){
        _module.render(req, res, index_view, {
            photo: results[0],
            album: results[1],
            tracks: results[2],
            tags: results[3]
        }, function (err, html) {
            console.log(err);
            res.send(html);
        });
    });

};

module.exports = _module;
