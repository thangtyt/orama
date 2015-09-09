'use strict';

let _ = require('lodash'),
    config = require(__base + 'config/config.js'),
    promise = require('bluebird');

let _module = new FrontModule;

module.exports.index = function (req, res) {
    // Get page
    let page = req.params.page;
    if (page == undefined) {
        page = 1;
    }

    promise.all(
            [
                // Find all posts
                __models.posts.findAndCountAll({
                    include: [
                        {
                            model: __models.user,
                            attributes: ['id', 'display_name', 'user_login', 'user_email', 'user_image_url']
                        }
                    ],
                    attributes: ['id', 'categories', 'alias', 'title', 'intro_text', 'full_text', 'image', 'created_by', 'created_at'],
                    where: "type = 'post'",
                    order: "posts.id desc",
                    limit: config.pagination.number_item,
                    offset: (page - 1) * config.pagination.number_item
                }),

                // Find all categories
                __models.categories.findAndCountAll({
                    attributes: ['id', 'parent', 'alias', 'name', 'description'],
                    where: "published = 1 AND id <> 1",
                    order: "id,parent ASC"
                })
            ]
        ).then(function (results) {
            let totalPage = Math.ceil(results[0].count / config.pagination.number_item);

            // Render view
            _module.render(req, res, 'index.html', {
                totalPage: totalPage,
                currentPage: page,
                posts: results[0].rows,
                categories: results[1].rows
            });
        });
};