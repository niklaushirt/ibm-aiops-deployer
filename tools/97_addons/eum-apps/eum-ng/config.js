/**
 * load config specified in env var
 */

let config = null;

if (process.env.CONFIG) {
    try {
        config = require(`./${process.env.CONFIG}`);
    } catch(err) {
        console.log('ERROR config not found:', process.env.CONFIG);
        console.log(err);
        process.exit(1);
    }
} else {
    console.log('ERROR environment variable CONFIG not defined');
    process.exit(1);
}

module.exports = config;
