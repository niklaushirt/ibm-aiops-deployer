"use strict";

const debug = require('debug')('load-gen:main');
const pino = require('pino');
const http = require('http');
const https = require('https');
const fs = require('fs');
const liburl = require('url');
const lodash = require('lodash');
const {JSONPath} = require('jsonpath-plus');
const uuid = require('uuid');
const CronAllowedRange = require('cron-allowed-range');
// copied from weasel
const createTrie = require('./trie');
const config = require('./config');
const beaconTypeKeys = Object.freeze([ 'pl', 'err', 'xhr', 'pc', 'cus' ]);


/**
 * GLOBALS
 */
// beacon templates
var templates = {};
// number of loopers to run
var loopers = 0;
// logger
var logger = pino({
    level: 'info'
});


function start() {
    debug('Starting load generator');
    loadTemplates().then((data) => {
        // fire off loopers via throttle
        throttle();
        setInterval(throttle, 60000);
    }).catch((err) => {
        logger.error({
            msg: 'start',
            error: err
        });
        throw err;
    });
}

/**
 * control how many loopers are running
 */
function throttle() {
    let maxLoopers = 0;
    let now = new Date();
    config.load.forEach((l) => {
        let range = new CronAllowedRange(l.cron, process.env.TZ);
        if (range.isDateAllowed(now)) {
            maxLoopers = Math.max(l.load, maxLoopers);
        }
    });
    debug('max loopers', maxLoopers);
    // fire up extra loopers
    for (let i = loopers + 1; i <= maxLoopers; i++) {
        setTimeout(looper, lodash.random(config.pace.min, config.pace.max), i);
    }
    loopers = maxLoopers;
}

/**
 * loop through pages
 */
function looper(id) {
    const user = config.users[lodash.random(0, config.users.length - 1)];
    const sid = getID();

    let delay = 0;
    config.pages.forEach((page) => {
        setTimeout(() => {
            debug(id, page.title);
            if (!(page.weightpct >= lodash.random(1, 100))) {
                debug('not enough weight', page.weightpct);
                return;
            }
            // start with page load
            // make a clone of the beacon template
            let beacon = lodash.cloneDeep(templates.pl);
            makeRequest('http://localhost:8000' + page.path).then((reqData) => {
                // update beacon template
                beacon.p = page.title;
                beacon.r = new Date().getTime();
                beacon.ts = 0 - lodash.random(100, 250);
                beacon.pl = beacon.t = getID();
                beacon.sid = sid;
                if (! lodash.isEmpty(reqData.bt)) {
                    beacon.bt = reqData.bt;
                } else {
                    // remove stale correlation
                    delete beacon.bt;
                }

                beacon.d = reqData.duration + lodash.random(100, 250);
                beacon.u = config.site + page.path;
                beacon.l = config.site + page.path;
                beacon.ui = user.id;
                beacon.un = user.name;
                beacon.ue = user.email;
                beacon.ul = user.language;
                // add user metadata
                let metaKeys = Object.keys(user.meta);
                for (let i = 0; i < metaKeys.length; i++) {
                    let beaconKey = 'm_' + metaKeys[i];
                    beacon[beaconKey] = user.meta[metaKeys[i]];
                }

                // some extra meta data
                if (page.title === 'Cart') {
                    beacon.m_items = lodash.random(1, 6);
                }

                mungeResources(beacon.res).then((data, err) => {
                    // demo scenario big slow image
                    // inject slow image load from CDN
                    let duration = 2200 + lodash.random(0, 100);
                    // Date uses env var TZ
                    let h = new Date().getHours();
                    //TODO - make this a configuration item?
                    if (page.path === '/' && h >= 13 && h <= 14) {
                        // inject image
                        beacon.res['https://cdn.acme.net/images/big-splash.png'] = [
                            0, // 0 - start time
                            duration, // 1 - duration
                            1, // 2 - initiator
                            3, // 3 - cache type
                            4404019, // 4 - encoded size
                            4404019, // 5 - decoded size
                            4404120, // 6 - transfer size
                            10, // 7 - redirect
                            0, // 8 - app cache
                            7, // 9 - dns
                            8, // 10 - ssl
                            2, // 11 - tcp
                            12, // 12 - request time
                            13, // 13 - response time
                            0, // 14 - correlation
                            102 // 15 - first byte
                        ];
                        beacon.d = beacon.d + duration;
                    }

                    postBeacon(beacon, user);
                });

                // error generation
                if (shouldGenerateBeacon(page.error, user)) {
                    setTimeout(generateErrorBeacon, lodash.random(50, 300), page, user, beacon.pl, sid);
                }

                // custom event generation
                if (shouldGenerateBeacon(page.custom, user)) {
                    setTimeout(generateCustomEventBeacon, lodash.random(50, 300), page, user, beacon.pl, sid);
                }

                // ajax calls
                if (! lodash.isEmpty(page.ajax)) {
                    doAjax(page, user, beacon.pl, sid);
                }

                // page transition
                if (! lodash.isEmpty(page.transitions)) {
                    setTimeout(generateTransitionBeacon, lodash.random(1000, 5000),page, user, beacon.pl, sid);
                }
            }).catch((err) => {
                console.log('Error', err);
            }); // makeRequest
        }, delay); // setTimeout
        delay += lodash.random(config.pace.min, config.pace.max);
    });
    // do it all again
    if (id <= loopers) {
        setTimeout(looper, delay, id);
    }
}

/**
 * POST beacon to backend
 */
function postBeacon(beacon, user) {
    let options = {
        method: 'POST',
        headers: {
            'content-type': 'text/plain;charset=UTF-8',
            'x-forwarded-for': user.ip,
            'user-agent': user.userAgent
        }
    };

    let be = [];
    if (process.env.BACKENDS) {
        be = process.env.BACKENDS.split(',');
    }
    // report to named backends or all if not defined
    for (let destination in config.reporting) {
        if (be.length != 0 && lodash.indexOf(be, destination) == -1) {
            continue;
        }
        let api_url = process.env.API_URL;

        logger.info({
            msg: 'sending beacon',
            destination: destination,
            url: api_url
        });
        beacon.k = process.env.API_KEY;
        //beacon.k = config.reporting[destination].apiKey;
        
        const body = lineEncode(beacon);
        let req = https.request(api_url, options, (res) => {
            logger.info({
                msg: 'beacon sent',
                destination: destination,
                statusCode: res.statusCode
            });
            res.on('end', () => {
                logger.info({
                    msg: 'end',
                    destination: destination,
                    statusCode: res.statusCode
                });
            });
        });
        req.on('error', (e) => {
            logger.error(e);
        });
        req.write(body);
        req.end();
    };
}

/**
 * Encode beacon as key<tab>val<newline>
 */
function lineEncode(beacon) {
    const encodePart = (part) => {
        return String(part)
            .replace(/\\/g, '\\\\')
            .replace(/\n/g, '\\n')
            .replace(/\t/g, '\\t');
    };

    let body = '';
    for (let key in beacon) {
        if (beacon.hasOwnProperty(key)) {
            let val = '';
            if (key === 'res') {
                // encode as trie
                let trie = createTrie();
                for (let key in beacon.res) {
                    // array to string
                    trie.addItem(key, beacon.res[key].join());
                }
                val = JSON.stringify(trie.toJs());
            } else {
                val = beacon[key];
            }
            if (val != null) {
                body += '\n' + encodePart(key) + '\t' + encodePart(val);
            }
        }
    }
    // strip off leading \n
    return body.substring(1);
}

/**
 * call for tracing
 */
async function makeRequest(url) {
    let ret = {};
    let headers = {};

    ret.url = url;
    const startTime = new Date().getTime();
    await httpGET(url).then((data) => {
        headers = data;
    }).catch((err) => {
        logger.error({
            msg: url,
            error: err
        });
    });
    ret.duration = new Date().getTime() - startTime;

    // correlation uuid
    ret.bt = parseTrace(headers);

    // request sizes
    if (headers.hasOwnProperty('content-length')) {
        ret.bodylength = parseInt(headers['content-length']);
        ret.txlength = ret.bodylength + headerSize(headers);
    } else {
        ret.bodylength = 0;
        ret.txlength = 0;
    }

    debug('makeRequest', ret);
    return ret;
}

/**
 * Call all localhost resources
 */
function mungeResources(res) {
    return new Promise((resolve, reject) => {
        const site = new URL(config.site);
        let ret = {};
        let promises = [];

        // resources can be fetch in parallel
        for (let r in res) {
            let url = new URL(r);
            // TODO - look up value for localhost:8000
            if (url.host === 'localhost:8000') {
                // really call the backend to get a trace
                promises.push(makeRequest(r));
            }
        }
        Promise.all(promises).then((data) => {
            data.forEach((reqData) => {
                // swap in new entry to resources
                let url = new URL(reqData.url);
                url.host = site.host;
                url.port = site.port;
                let timings = res[reqData.url];
                //random call from cache or validated or full load
                generateTimingForResource(timings, reqData);
                res[url.href] = timings;
                delete res[reqData.url];
            });
            resolve();
        }).catch((err) => {
            logger.error({
                msg: 'resource error',
                error: err
            });
        });
    });
}

function generateTimingForResource(timings, reqData) {
    let seed = lodash.random(1,10);
    if (seed % 10 == 0) {
        generateTimingForFullLoadResource(timings, reqData);
    } else if (seed % 10 == 1) {
        generateTimingForValidatedResource(timings);
    } else {
        generateTimingForCachedResource(timings);
    }
}

/**
 * generate resource-timing for full loaded resource
 */
function generateTimingForFullLoadResource(timings, reqData) {
    timings[1] = reqData.duration + 100;
    timings[3] = 3; // cache type full load
    timings[4] = timings[5] = reqData.bodylength;
    timings[6] = reqData.txlength;
    timings[8] = lodash.random(0,10);     //random appCache time
    timings[9] = lodash.random(0,10);     //random dns time
    timings[10] = lodash.random(0,10);    //random tcp time
    timings[12] = lodash.random(0,50);    //random request time    
    timings[15] = timings[8] + timings[9] + timings[10] + timings[12]; //ttfb
    timings[13] = timings[1] - timings[15]; // response time = duration - ttfb
    timings[14] = reqData.bt;
}

/**
 * generate resource-timing for validated resource
 * TBD should http response code be changed to 304?
 */
function generateTimingForValidatedResource(timings) {
    timings[3] = 2; // cache type is validated
    timings[6] = 300; // suppose validation payload size is constant
    timings[15] = timings[12] = lodash.random(1,20);    //random request time
    timings[13] = 1; // response time = 1 as validation should be really quick
    timings[1] = timings[13] + timings[15];
}

/**
 * generate resource-timing for cached resource
 */
function generateTimingForCachedResource(timings) {
    timings[3] = 1;  // cache type is cached
    timings[6] = 0;  // no transfer size if resource is cached
    timings[15] = timings[12] = 1; 
    timings[13] = lodash.random(1,5); // response time
    timings[1] = timings[13] + timings[15];
}

/**
 * server-timing: intid;desc=xxxxxx
 */
function parseTrace(headers) {
    let bt = null;
    if (headers.hasOwnProperty('server-timing')) {
        const idx = headers['server-timing'].lastIndexOf('=') + 1;
        bt = headers['server-timing'].substring(idx);
    }

    return bt;
}

/**
 * calculate size of headers
 * key: value \n
 */
function headerSize(headers) {
    let size = 0;

    Object.keys(headers).forEach((k) => {
        size += `${k}: ${headers[k]}`.length + 1;
    });

    return size;
}

/**
 * Check to see if a custom event or error should be generated
 * weightpct is % of triggers
 * Next if an property is defined it must match the user
 * If a property is not defined it is an assumed match
 */
function shouldGenerateBeacon(beaconConfig, user) {
    let filterCount = 0;

    if (! lodash.isEmpty(beaconConfig) && beaconConfig.weightpct >= lodash.random(1, 100)) {
        // count up propeties to be matched
        ['language', 'userAgent', 'meta'].forEach((p) => {
            if (beaconConfig[p]) {
                filterCount++;
            }
        });

        if (beaconConfig.language === user.language) {
            filterCount--;
        }
        if (beaconConfig.userAgent) {
            // RegEx
            let patt = new RegExp(beaconConfig.userAgent)
            if (patt.exec(user.userAgent) !== null) {
                // matched
                filterCount--;
            }
        }
        if (beaconConfig.meta && lodash.isMatch(beaconConfig.meta, user.meta)) {
            filterCount--;
        }

        return filterCount === 0;
    }
    return false;
}


/**
 * make ajax calls
 * TODO - payload size and cache type to full load
 */
function doAjax(page, user, pl, sid) {
    let promises = [];

    page.ajax.forEach((ajax) => {
        let url = 'http://localhost:8000/api' + ajax.call;
        promises.push(makeRequest(url));
    });

    Promise.all(promises).then((data) => {
        data.forEach((reqData) => {
            let beacon = lodash.cloneDeep(templates.xhr);
            beacon.p = page.title;
            beacon.r = new Date().getTime();
            beacon.ts = lodash.random(100, 500);
            beacon.t = getID();
            beacon.pl = pl; // correlation to page load
            beacon.sid = sid;
            if (! lodash.isEmpty(reqData.bt)) {
                beacon.bt = reqData.bt;
            } else {
                delete beacon.bt;
            }
            beacon.d = reqData.duration + lodash.random(100, 250);
            let url = new URL(reqData.url);
            let site = new URL(config.site);
            url.host = site.host;
            url.port = site.port;
            beacon.u = url.href;
            beacon.l = config.site + page.path;
            beacon.ui = user.id;
            beacon.un = user.name;
            beacon.ue = user.email;
            beacon.ul = user.language;
            // ajax request
            beacon['s_ty'] = 3; // full load
            beacon['s_eb'] = beacon['s_db'] = reqData.bodylength;
            beacon['s_ts'] = reqData.txlength;
            // add user metadata
            let metaKeys = Object.keys(user.meta);
            for (let i = 0; i < metaKeys.length; i++) {
                let beaconKey = 'm_' + metaKeys[i];
                beacon[beaconKey] = user.meta[metaKeys[i]];
            }
            debug('posting ajax beacon');
            postBeacon(beacon, user);
        });
    }).catch((err) => {
        logger.error({
            msg: 'Ajax error',
            error: err
        });
    });
}

/**
 * page change or transitions
 */
function generateTransitionBeacon(page, user, pl, sid) {
    page.transitions.forEach((t) => {
        if (t.weightpct >= lodash.random(1, 100)) {
            makeRequest('http://localhost:8000/fragment' + t.path).then((reqData) => {
                let beacon = lodash.cloneDeep(templates.pc);
                beacon.p = t.title;
                beacon.r = new Date().getTime();
                beacon.ts = beacon.r;
                beacon.l = config.site + page.path;
                beacon.sid = sid;
                beacon.pl = pl;
                beacon.ui = user.id;
                beacon.un = user.name;
                beacon.ue = user.email;
                beacon.ul = user.language;
                // add user metadata
                let metaKeys = Object.keys(user.meta);
                for (let i = 0; i < metaKeys.length; i++) {
                    let beaconKey = 'm_' + metaKeys[i];
                    beacon[beaconKey] = user.meta[metaKeys[i]];
                }
                debug('posting transition beacon');
                postBeacon(beacon, user);

                // ajax calls for transition
                if (! lodash.isEmpty(t.ajax)) {
                    doAjax(t, user, pl, sid);
                }
                // errors for transition
                if (shouldGenerateBeacon(t.error, user)) {
                    setTimeout(generateErrorBeacon, lodash.random(50, 300), t, user, pl, sid);
                }
            }).catch((err) => {
                logger.err({
                    msg: 'transition',
                    error: err
                });
            }) // makeRequest;
        }
    });
}

/**
 * make and send an error
 */
function generateErrorBeacon(page, user, pl, sid) {
    let beacon = lodash.cloneDeep(templates.err);

    beacon.s = beacon.t = getID();
    beacon.sid = sid;
    beacon.pl = pl;
    beacon.ts = new Date().getTime();
    beacon.r = lodash.random(100, 250);
    beacon.l = config.site + page.path;
    beacon.e = page.error.text;
    beacon.st = page.error.stackTrace;
    beacon.p = page.title;

    beacon.ui = user.id;
    beacon.un = user.name;
    beacon.ue = user.email;
    beacon.ul = user.language;

    // add user metadata
    let metaKeys = Object.keys(user.meta);
    for (let i = 0; i < metaKeys.length; i++) {
        let beaconKey = 'm_' + metaKeys[i];
        beacon[beaconKey] = user.meta[metaKeys[i]];
    }

    debug('posting error beacon');
    postBeacon(beacon, user);
}

/**
 * make and send a custom event
 */
function generateCustomEventBeacon(page, user, pl, sid) {
    let beacon = lodash.cloneDeep(templates.cus);

    beacon.n = page.custom.name
    beacon.s = beacon.t = getID();
    beacon.sid = sid;
    beacon.pl = pl;
    beacon.ts = new Date().getTime();
    beacon.r = lodash.random(100, 250);
    beacon.l = config.site + page.path;
    beacon.p = page.title;

    beacon.ui = user.id;
    beacon.un = user.name;
    beacon.ue = user.email;
    beacon.ul = user.language;

    beacon.d = lodash.random(1, 100)

    // add user metadata
    let metaKeys = Object.keys(user.meta);
    for (let i = 0; i < metaKeys.length; i++) {
        let beaconKey = 'm_' + metaKeys[i];
        beacon[beaconKey] = user.meta[metaKeys[i]];
    }

    debug('posting custom beacon');
    postBeacon(beacon, user);
}


/**
 * Promise wrapper
 * TODO - enhance to include response sizes: body & total
 * body from headers
 * total body + headers size
 */
function httpGET(url) {
    return new Promise((resolve, reject) => {
        const req = http.request(url, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                // send the headers back
                resolve(res.headers);
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}

/**
 * load beacon templates
 * this must complete before anything else
 */
async function loadTemplates() {
    for (let ty of beaconTypeKeys) {
        await loadTemplate(ty).then((data) => {
            templates[ty] = data;
        }).catch((err) => {
            logger.error({
                msg: 'load templates',
                error: err
            });
            throw err;
        });
    }
}

function loadTemplate(ty) {
    return new Promise((resolve, reject) => {
        const filename = `beacons/beacon-${ty}.json`;
        debug('loading', filename);
        fs.readFile(filename, (err, data) => {
            // this is fatal
            if (err) throw err;
            let template = JSON.parse(data);
            if (template.ty === 'pl') {
                debug('parse inner json trie');
                let flatres = {};
                let res = JSON.parse(template.res);
                // array of paths to values
                propertiesToArray(res).forEach((path) => {
                    let val = JSONPath({
                        path: path,
                        json: res,
                        wrap: false
                    });
                    // value stored as an array with a single element
                    val = val[0];
                    // to make accessing fields easier, make an array
                    val = val.split(',');
                    // store value with flattened path
                    flatres[JSONPath.toPathArray(path).join('')] = val;
                });

                template.res = flatres;
            }
            resolve(template);
        });
    });
}

/**
 * Get JSONPath for all properties
 * Used to unpack the resources trie
 */
function propertiesToArray(obj) {
    const isObject = (val) => {
        return typeof val === 'object' && !Array.isArray(val);
    }

    const addDelimiter = (a, b) => {
        // JSONPath syntax
        return a ? `${a}['${b}']` : `$['${b}']`;
    }

    const paths = (obj = {}, head = '') => {
        return Object.entries(obj)
            .reduce((product, [key, value]) => 
                {
                    let fullPath = addDelimiter(head, key)
                    return isObject(value) ?
                        product.concat(paths(value, fullPath))
                    : product.concat(fullPath)
                }, []);
    }

    return paths(obj);
}

/**
 * trace id is 16 chars
 */
function getID() {
    return uuid.v4().replace(/-/g, '').substring(0, 15);
}

/**
 * Exports
 */
module.exports = {
    start: start
};
