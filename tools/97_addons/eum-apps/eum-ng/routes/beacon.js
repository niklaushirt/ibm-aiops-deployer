"use strict";

const express = require('express');
const router = express.Router();
const debug = require('debug')('front-end:beacon');
const fs = require('fs');

// GET health
router.get('/health', (req, res, next) => {
    debug('Healthy');
    res.send('OK');
});


// GET beacon
router.get('/report', (req, res, next) => {
    debug('cookies', req.cookies);
    saveBeacon(req.query);
    res.sendStatus(201);
});

// POST beacon
router.post('/report', (req, res, next) => {
    debug('cookies', req.cookies);
    saveBeacon(req.body);
    res.sendStatus(201);
});

function saveBeacon(beacon) {
    // different files for different beacon types
    // pl, xhr, err, ...
    //debug('beacon', beacon);
    var filename = `beacons/beacon-${beacon.ty}.json`;
    fs.writeFile(filename, JSON.stringify(beacon), (err) => {
        if (err) {
            debug('Error', err);
        } else {
            debug('beacon saved', filename);
        }
    });
}


module.exports = router;
