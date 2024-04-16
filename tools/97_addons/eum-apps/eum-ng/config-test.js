// Configuration

module.exports = {
    // get the key and the endpoint from the EUM configuration dashboard
    // Multiple key endpoint pairs will report the same data to each
    reporting: {
        test: {
            apiKey: 'XIZGGVT1TX2O-0OFeT2Yig',
            url: 'https://eum-pink-saas.instana.rocks/'
        },
        // demo-test
        testpink: {
            apiKey: 'MfiYBD4HTByb8PB2mVVmnQ',
            url: 'https://eum-pink-saas.instana.rocks/'
        },
        preview: {
            apiKey: '3DO1SU0LRa-2S_bNc5sZDw',
            url: 'https://eum-peach-saas.instana.rocks/'
        },
        staging: {
            apiKey: 'WIU_H3HESuuyENRsh5tM3g',
            url: 'https://eum-peach-saas.instana.rocks/'
        },
        release: {
            apiKey: 'h_TxI-AGSZqVd5tVKjDXKw',
            url: 'https://eum-magenta-saas.instana.rocks/'
        },
        playwithdemo: {
            apiKey: 'Oem4h0KNSF6mrI8iZtxXVA',
            url: 'https://eum-pink-saas.instana.rocks'
        }
    },
    // agent setting, where to send the beacons
    // set to a reporting entry above or internal
    agent: 'internal',
    // what site to pretend to be
    // include the port number if required
    // NOTE no trailing slash
    site: 'http://robotshop.instana.com',
    // how many requests to make in parallel
    // be careful what you wish for
    // cron - min 0-59, hour 0-23, day 1-31, month 1-12, day of week 0-6 Sun-Sat
    // maximum matching value for load used
    load: [
        {
            cron: '* * * * *',
            load: 1
        }
    ],
    // click rate for load, delay between pages in ms
    pace: {
        min: 1000,
        max: 5000
    },
    // Array of pages, they will be called in array order
    pages: [
        {
            title: 'Home',
            path: '/',
            // page weight in %
            // 100 == page is called every time
            // 0 == page is not called
            weightpct: 100,
            // array of backend calls
            // empty array for none
            backend: [ ],
            // array of ajax calls this page will make
            // empty array for none
            // each array member is an object with the following properties
            // call: the endpoint that the page will call e.g. /foo
            // backend: If this call should continue elsewhere e.g. https://www.paypal.com/
            //          empty string '' for none
            ajax: [
                {
                    call: '/promo',
                    backend: ''
                }
            ],
            // an object for a JS Error on page, has the properties
            // text: The text for the error
            // weightpct: error weight in %
            // 100 == error happens every time
            // 0 == error never happens
            // language: matches current user language e.g. en_GB
            // userAgent: regexp pattern matches current userAgent
            // meta: matches user metadata e.g. status: 'gold'
            // If the user fields are not defined then all will match
            error: { },
            // an object for a Custom Event, has the properties
            // name: The custom event name
            // weightpct: error weight in %
            // 100 == error happens every time
            // 0 == error never happens
            // language: matches current user language e.g. en_GB
            // userAgent: regexp pattern matches current userAgent
            // meta: matches user metadata e.g. status: 'gold'
            // If the user fields are not defined then all will match
            custom: {
                name: 'Login',
                weightpct: 40
            },
            // page transitions
            // nested pages, no recurse
            transitions: [
                {
                    title: 'Offers',
                    path: '/offers',
                    weightpct: 100,
                    ajax: [
                        {
                            call: '/offers',
                            backend: ''
                        }
                    ],
                    error: { }
                }
            ]
        },
        {
            title: 'Products',
            path: '/products',
            weightpct: 100,
            backend: [],
            ajax: [
                {
                    call: '/products',
                    backend: 'http://web.robot-shop:8080/api/catalogue/products'
                }
            ],
            error: {
                text: 'index out of bounds',
                stackTrace: 'queryProductList@http://robotshop.instana.com/js/main.min.js:1:400\n@http://robotshop.instana.com/js/main.min.js:1:35\ndispatch@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:43336\nadd/y.handle@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:41320\nEventListener.handleEvent*add@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:41787\nSe/<@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:40381\neach@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:3003\neach@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:1481\nSe@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:40357\non@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:46867\n@http://robotshop.instana.com/js/main.min.js:1:13\n',
                weightpct: 10
            },
            transitions: []
        },
        {
            title: 'Cart',
            path: '/cart',
            weightpct: 75,
            backend: [],
            ajax: [
                {
                    call: '/cartview',
                    backend: 'http://web.robot-shop:8080/api/cart/cart/user'
                }
            ],
            error: {},
            transitions: [
                {
                    title: 'Discount Code',
                    path: '/discount',
                    weightpct: 50,
                    ajax: [],
                    error: {}
                }
            ]
        },
        {
            title: 'Check Out',
            path: '/checkout',
            weightpct: 50,
            backend: [],
            ajax: [
                {
                    call: '/cart-total',
                    backend: ''
                }
            ],
            error: {},
            transitions: []
        },
        {
            title: 'Delivery',
            path: '/delivery',
            weightpct: 25,
            backend: [
                'http://web.robot-shop:8080/api/shipping/codes'
            ],
            ajax: [],
            error: {
                text: 'undefined has no properties',
                stackTrace: 'getDeliveryStatus@http://robotshop.instana.com/js/main.min.js:2:36\n@http://robotshop.instana.com/js/main.min.js:1:91\ndispatch@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:43336\nadd/y.handle@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:41320\nEventListener.handleEvent*add@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:41787\nSe/<@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:40381\neach@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:3003\neach@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:1481\nSe@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:40357\non@http://robotshop.instana.com/js/jquery-3.6.3.min.js:2:46867\n@http://robotshop.instana.com/js/main.min.js:1:69\n',
                weightpct: 100,
                userAgent: 'Macintosh.+Safari'
            },
            transitions: []
        },
        {
            title: 'Payment',
            path: '/payment',
            weightpct: 10,
            backend: [],
            ajax: [
                {
                    call: '/pay',
                    backend: 'https://www.paypal.com/'
                }
            ],
            error: {},
            custom: {
                name: 'Payment Declined',
                weightpct: 10
            },
            transitions: []
        }
    ],
    // Array of users, the more the merrier
    users: [
        {
            "id": "817909e7-3bbe-4dcc-951c-88d5bb16bcbb",
            "name": "Tommy Hugin",
            "email": "thugin0@google.ru",
            "ip": "63.227.85.200",
            "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:21.0.0) Gecko/20121011 Firefox/64.0",
            "language": "en-US",
            "network": "DSL",
            "meta": { "status": "gold" }
        }, {
            "id": "88f57c01-82c9-4f7e-b870-8a921f638bd2",
            "name": "Eddi Pink",
            "email": "epink1@desdev.cn",
            "ip": "184.107.201.217",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/73",
            "language": "en-US",
            "network": "Good3G",
            "meta": { "status": "silver" }
        }, {
            "id": "eca5f0f0-db2c-4392-b978-5ccbb6453091",
            "name": "Ava Berger",
            "email": "aberger@woothemes.com",
            "ip": "51.140.128.23",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/74",
            "language": "en-GB",
            "network": "DSL",
            "meta": { "status": "bronze" }
        }, {
            "id": "3bcb9707-3641-4003-8141-f61ce554d405",
            "name": "Jessika Horsten",
            "email": "jhorsten@tripadvisor.com",
            "ip": "163.172.221.197",
            "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_2 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Version/11.0 Mobile/15C114 Safari/604.1",
            "language": "nl-NL",
            "network": "WiFi",
            "meta": { "status": "gold" }
        }, {
            "id": "11bde395-15af-43dc-a50b-b07fb3fd7eb1",
            "name": "Olivier Laberge",
            "email": "olaberge@dedecms.com",
            "ip": "185.126.66.126",
            "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:21.0.0) Gecko/20121011 Chrome/74.0",
            "language": "fr-FR",
            "network": "Good3G",
            "meta": { "status": "silver" }
        }, {
            "id": "56e5020f-32bc-44ea-8697-20034adcdf75",
            "name": "Stefan Kimmich",
            "email": "skimmich@fastcompany.com",
            "ip": "87.191.130.0",
            "userAgent": "Mozilla/5.0 (X11; Ubuntu 18.10; Linux x86_64; rv:24.0) Gecko/20100101 Firefox/63.0",
            "language": "de-DE",
            "network": "DSL",
            "meta": { "status": "bronze" }
        }, {
            "id": "ddd29778-f465-4b8e-8cfc-768f7a11c0a4",
            "name": "Berto Genovese",
            "email": "bgenovese@ustream.tv",
            "ip": "188.92.188.20",
            "userAgent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_14) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/12 Safari/533.20.27",
            "language": "it-IT",
            "network": "Regular3G",
            "meta": { "status": "gold" }
        }, {
            "id": "f75a9958-a2db-46ab-b905-1475111b243d",
            "name": "Miguele Ribas",
            "email": "mribas@behance.net",
            "ip": "92.187.29.107",
            "userAgent": "Mozilla/5.0 (X11; Ubuntu 18.10; Linux x86_64; rv:24.0) Gecko/20100101 Firefox/64.0.2",
            "language": "es-ES",
            "network": "DSL",
            "meta": { "status": "silver" }
        }, {
            "id": "56d890a5-568c-4840-9d66-31ef037e8d7f",
            "name": "Willie Murray",
            "email": "wmurray@prnewswire.com",
            "ip": "113.121.243.22",
            "userAgent": "Mozilla/5.0 (iPhone; U; CPU iPhone OS 12.1.3 like Mac OS X; zh-tw) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/12.0 Mobile/8G4 Safari/6533.18.5",
            "language": "zh-cn",
            "network": "Good3G",
            "meta": { "status": "bronze" }
        }, {
            "id": "444cac86-223a-44ac-997c-e8a21f768d59",
            "name": "Laura Santos",
            "email": "lsantos@etsy.com",
            "ip": "177.21.244.6",
            "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:21.0.0) Gecko/20121011 Firefox/63.0.3",
            "language": "pt-br",
            "network": "Regular2G",
            "meta": { "status": "gold" }
        }, {
            "id": "6a122569-212f-4fa7-b722-eedfcebb64da",
            "name": "Mirko Mirkovic",
            "email": "mmirkovic@sbb.net",
            "ip": "82.117.198.150",
            "userAgent": "Mozilla/5.0 (X11; Ubuntu 18.10; Linux x86_64; rv:24.0) Gecko/20100101 Firefox/64.0.2",
            "language": "sr-sp",
            "network": "Regular4G",
            "meta": { "status": "silver" }
        }, {
            "id": "9bd0a586-54fc-466e-b21a-525005ab31fb",
            "name": "Raphael Mundford",
            "email": "rmundfordb@rambler.ru",
            "ip": "45.55.27.157",
            "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.80",
            "language": "en-US",
            "network": "Regular3G",
            "meta": { "status": "bronze" }
        }, {
            "id": "f797f9d1-9488-4a62-ba1b-13012ca1fe57",
            "name": "Natty Safhill",
            "email": "nsafhillc@usda.gov",
            "ip": "195.140.213.214",
            "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20121011 Chrome/73.0",
            "language": "en-GB",
            "network": "Regular4G",
            "meta": { "status": "silver" }
        }, {
            "id": "9e57f63c-906e-496a-a039-5110fb35efdb",
            "name": "Jack Rassel",
            "email": "jrassel@europa.eu",
            "ip": "209.58.157.175",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1 Safari/605.1.15",
            "language": "en-US",
            "network": "Regular2G",
            "meta": { "status": "bronze" }
        }, {
            "id": "d2575bc1-0a34-4e40-8f8d-10eead645dd4",
            "name": "Dolph McMylor",
            "email": "dmcmylore@japanpost.jp",
            "ip": "159.203.161.211",
            "userAgent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_14; zh-cn) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/12 Safari/533.20.27",
            "language": "en-US",
            "network": "Regular4G",
            "meta": { "status": "silver" }
        }, {
            "id": "8233cf28-f0e6-4150-9b55-d115bfe00eee",
            "name": "Alyda Costall",
            "email": "acostallf@unicef.org",
            "ip": "107.152.242.204",
            "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/74",
            "language": "en-US",
            "network": "Regular2G",
            "meta": { "status": "bronze" }
        }, {
            "id": "24bebb7e-6f75-44c7-9083-6cd1b8e8ecc0",
            "name": "Derby Hattoe",
            "email": "dhattoeg@boston.com",
            "ip": "13.54.109.131",
            "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20121011 Chrome/74.0",
            "language": "en-GB",
            "network": "WiFi",
            "meta": { "status": "diamond" }
        }, {
            "id": "362e0a6e-5b3a-11eb-8f33-cf9fc0e388ce",
            "name": "Richard Frost",
            "email": "rfrost@voda.co.za",
            "ip": "169.1.172.78",
            "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20121011 Chrome/74.0",
            "language": "en-US",
            "network": "Regular2G",
            "meta": { "status": "silver" }
        }
    ]
};

