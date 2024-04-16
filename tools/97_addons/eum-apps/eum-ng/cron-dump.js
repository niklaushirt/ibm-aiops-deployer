'use strict';

const CronAllowedRange = require('cron-allowed-range');
const config = require('./config');

const now = new Date();

for (let hours = 0; hours <= 23; hours++) {
    for (let mins = 0; mins <= 59; mins += 5) {
        let tick = new Date(now.getYear(), now.getMonth(), now.getDate(), hours, mins, 0, 0);
        let maxLoopers = 0;
        config.load.forEach((l) => {
            let range = new CronAllowedRange(l.cron, process.env.TZ);
            if (range.isDateAllowed(tick)) {
                maxLoopers = Math.max(l.load, maxLoopers);
            }
        });
        console.log(tick.toTimeString(), maxLoopers);
    }
}
