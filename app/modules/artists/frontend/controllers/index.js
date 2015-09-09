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
    let id = req.params.id;
    promise.all([
        //artists
        __models.artists.find({
            where: {
                id: id
            },
            include: [
                {
                    model: __models.artists_photos,
                    attributes: ['url'],
                    where: {
                        type: 'extralarge'
                    }
                }
            ]
        }),
        //related tags
        __models.artists_tags.findAll({
            where: {
                artists_id: id
            },
            include: [
                {
                    model: __models.tags
                }
            ],
            limit: 10
        }),
        // top albums
        __models.albums.findAll({
            where: {
                artists_id: id,
                playcount: {
                    $gt: 25000
                }
            },
            include: [
                {
                    model: __models.albums_photos,
                    where: {
                        type: 'large'
                    },
                    attributes: ['url']
                }
            ],
            order: 'playcount DESC',
            limit: 18
        }),
        //similar artists
        __models.sequelize.query(
            'SELECT ' +
            'ar.id, ' +
            'ar.name, ' +
            'ar.uri, ' +
            'ap.url ' +
            'FROM artists_similar ars, ' +
            'artists ar, ' +
            'artists_photos ap ' +
            'WHERE ' +
            'ars.similar_artist_id = ar.id AND ' +
            'ars.similar_artist_id = ap.artists_id AND ' +
            'ap.type = \'large\' AND ' +
            'ars.artists_id = ' + id +
            ' ORDER BY ar.listeners DESC ' +
            'LIMIT 10',
            { type: sequelize.QueryTypes.SELECT }
        )
    ]).then(function(data){
        _module.render(req, res, index_view, {
            artistInfo: data[0],
            tags:data[1],
            albums: data[2],
            similars: data[3]
        }, function (err, html) {
            console.log(err);
            res.send(html);
        });
    });

};


module.exports = _module;
