"use strict";

const express = require('express');
const router = express.Router();
const pino = require('pino');
const debug = require('debug')('front-end:pages');
const http = require('http');
const config = require('../config');

var logger = pino({
    level: 'info'
});

// Health check
router.get('/health', (req, res, next) => {
    res.send('OK');
});

// GET config
router.get('/config', (req, res, next) => {
    res.json(req.app.get('config'));
});

// get agent settings
var agentCfg = {};
if (config.agent === 'internal') {
    agentCfg.key = 'secret';
    agentCfg.url = '/beacon/report';
} else {
    if (config.reporting.hasOwnProperty(config.agent)) {
        agentCfg.key = process.env.API_KEY;
        agentCfg.url = process.env.API_URL;
    } else {
        throw new Error(config.agent + ' not found');
    }
}
debug('agent config', agentCfg);

// make all the pages
config.pages.forEach((page) => {
    var ajax = [];
    page.ajax.forEach((a) => {
        ajax.push(a.call);
    });
    var tra = [];
    page.transitions.forEach((t) => {
        tra.push(t);
    });
    router.get(page.path, (req, res, next) => {
        let backend = [];
        let page = findPage(req.path);
        if (page !== null) {
            debug('found page', page.title);
            backend = page.backend;
        }

        backendCall(backend).then((data) => {
            res.render('index', {
                title: page.title,
                ajax: ajax,
                error: page.error,
                pages: req.app.get('config').pages,
                transitions: tra,
                agentCfg: agentCfg
            });
        }).catch((err) => {
            logger.error({
                msg: 'Backend Error',
                error: err
            });
            res.status(500).send('backend error');
        });
    });
});

/**
 * get page object for the given path
 */
function findPage(path) {
    let page = null;
    for (let i = 0; i < config.pages.length; i++) {
        if (config.pages[i].path === path) {
            page = config.pages[i];
            break;
        }
    }

    return page;
}

/**
 * call all backend urls in array
 */
function backendCall(backends) {
    return new Promise((resolve, reject) => {
        let promises = [];

        backends.forEach((b) => {
            promises.push(httpGET(b));
        });
        Promise.all(promises).then((data) => {
            // don't need the data really
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}

/**
 * promise wrapper
 */
function httpGET(url) {
    return new Promise((resolve, reject) => {
        debug('httpGET', url);
        const req = http.request(url, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 299) {
                    // send the headers back
                    resolve(body);
                } else {
                    reject(res.statusCode);
                }
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}


module.exports = router;
