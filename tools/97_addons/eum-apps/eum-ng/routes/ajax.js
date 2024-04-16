"use strict";

const express = require('express');
const router = express.Router();
const debug = require('debug')('front-end:ajax');
const lodash = require('lodash');
const http = require('http');
const https = require('https');
const config = require('../config');

// GET health page
router.get('/health', (req, res, next) => {
    res.send('OK');
});

// make all the ajax endpoints
var endpoints = [];
config.pages.forEach((page) => {
    // page ajax calls
    page.ajax.forEach((a) => {
        endpoints.push(a);
    });
    // fragment ajax calls
    page.transitions.forEach((t) => {
        t.ajax.forEach((a) => {
            endpoints.push(a);
        });
    });
});

// loose duplicates
endpoints = endpoints.filter((val, idx, self) => {
    return self.indexOf(val) === idx;
});
debug('ajax endpoints', endpoints);

endpoints.forEach((ep) => {
    router.get(ep.call, (req, res, next) => {
        // check for call through to backend
        var backend = false;
        endpoints.forEach((e) => {
            if(lodash.startsWith(e.backend, 'http') && e.call == req.path) {
                // make the call
                backend = true;
                const transport = lodash.startsWith(e.backend, 'https') ? https : http;
                debug('making http request', e.backend);
                const r = transport.request(e.backend, (resp) => {
                    var body = '';

                    resp.on('data', (chunk) => {
                        body += chunk;
                    });
                    resp.on('end', () => {
                        if (resp.statusCode >= 200 && resp.statusCode <= 299) {
                            res.send(body);
                        } else {
                            res.status(resp.statusCode).send(body);
                        }
                    });
                });

                r.on('error', (e) => {
                    debug('request error', e);
                    res.status(500).send('request error');
                });

                r.end();
            }
        });
        // backend was not called return default payload
        // TODO - better payload
        if(!backend) {
            res.json(endpoints);
        }
    });
});

module.exports = router;
