"use strict";

const express = require('express');
const router = express.Router();
const debug = require('debug')('front-end:fragment');
const lodash = require('lodash');
const http = require('http');
const fs = require('fs');
const config = require('../config');

// GET health page
router.get('/health', (req, res, next) => {
    res.send('OK');
});

// make all the transition endpoints
var endpoints = [];
config.pages.forEach((page) => {
    page.transitions.forEach((t) => {
        endpoints.push(t);
    });
});

// loose duplicates
endpoints = endpoints.filter((val, idx, self) => {
    return self.indexOf(val) === idx;
});
debug('fragment endpoints', endpoints);

endpoints.forEach((ep) => {
    var ajax = [];
    ep.ajax.forEach((a) => {
        ajax.push(a.call);
    });
    router.get(ep.path, (req, res, next) => {
        // choose an image to include
        var images = fs.readdirSync('public/images/products');
        res.render('fragment', {
            title: ep.title,
            ajax: ajax,
            error: ep.error,
            image: '/images/products/' + images[lodash.random(0, images.length - 1)]
        });
    });
});

module.exports = router;
