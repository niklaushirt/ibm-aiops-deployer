module.exports = {
  debug: false,
  numberOfConcurrentUsers: 1,
  reportingTargets: {
    // demo-eu-cluster
    demoeu: {
      'https://eum-blue-saas.instana.io/mobile': {
        keys: ['es6xLJX0SR6alQLut94LtA'],
        playbook: 'warehouse',
        apiserver: process.env.API_URL,
        apitoken: process.env.API_KEY,
        crashStartInterval: ['3:37:23'],
        crashEndInterval: ['6:37:24'],
        queries: {
          'list-products': {
            service: 'nginx-web',
            endpoint: 'upstream catalogue'
          },
          'get-product': {
            service: 'nginx-web',
            endpoint: 'upstream catalogue'
          },
          'get-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'add-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'update-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'post-pay': {
            simulateErrors: true,
            service: 'nginx-web',
            endpoint: 'upstream payment'
          }
        }
      }
    },
    // demo-us-cluster has three backends : demous,partner,ibmdemo
    demous: {
      // demous
      'https://eum-red-saas.instana.io/mobile': {
        keys: ['Sk1nfmctSSSkgNSVcb7g7g'],
        playbook: 'warehouse',
        apiserver: 'https://demous-instana.instana.io',
        apitoken: process.env.APITOKEN,
        crashStartInterval: ['3:49:5'],
        crashEndInterval: ['6:49:6'],
        queries: {
          'list-products': {
            service: 'nginx-web',
            callname: 'GET /api/catalogue/products'
          },
          'get-product': {
            service: 'nginx-web',
            endpoint: 'upstream catalogue'
          },
          'get-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'add-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'update-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'post-pay': {
            simulateErrors: true,
            service: 'nginx-web',
            endpoint: 'upstream payment'
          }
        }
      }
    },
    partner: {
      // partner
      'https://eum-blue-saas.instana.io/mobile': {
        keys: ['yfnZ4kWESD-VkepWLvCQhQ'],
        playbook: 'warehouse',
        apiserver: 'https://demo-partner.instana.io',
        apitoken: process.env.APITOKEN,
        crashStartInterval: ['3:49:46'],
        crashEndInterval: ['6:49:47'],
        queries: {
          'list-products': {
            service: 'nginx-web',
            callname: 'GET /api/catalogue/products'
          },
          'get-product': {
            service: 'nginx-web',
            endpoint: 'upstream catalogue'
          },
          'get-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'add-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'update-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'post-pay': {
            simulateErrors: true,
            service: 'nginx-web',
            endpoint: 'upstream payment'
          }
        }
      }
    },
    ibmdemo: {
      // IBM demo
      'https://eum-orange-saas.instana.io/mobile': {
        keys: ['7wC-tNPbRxSyyQCVC_n4pw'],
        playbook: 'warehouse',
        apiserver: 'https://ibmdemo-instanaibm.instana.io',
        apitoken: process.env.APITOKEN,
        crashStartInterval: ['3:49:26'],
        crashEndInterval: ['6:49:27'],
        queries: {
          'list-products': {
            service: 'nginx-web',
            callname: 'GET /api/catalogue/products'
          },
          'get-product': {
            service: 'nginx-web',
            endpoint: 'upstream catalogue'
          },
          'get-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'add-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'update-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'post-pay': {
            simulateErrors: true,
            service: 'nginx-web',
            endpoint: 'upstream payment'
          }
        }
      }
    },
    // k8s-demo-cluster
    k8s: {
      'https://eum-red-saas.instana.io/mobile': ['yn3_i6oLSeS29pPixhHgxQ'],
      // test
      'https://eum-pink-saas.instana.rocks/mobile': ['V5iJOvvnQ6isz4OF5ggp3g']
    },
    //k8s-demo-cluster-release
    release: {
      'https://eum-magenta-saas.instana.rocks/mobile': {
        keys: ['_sxWPDpNR_2hWuhDPd_zAQ'],
        playbook: 'warehouse',
        apiserver: 'https://release-instana.instana.rocks',
        apitoken: process.env.APITOKEN,
        crashStartInterval: ['20:31:39'],
        crashEndInterval: ['21:11:34'],
        queries: {
          'list-products': {
            service: 'nginx-web',
            endpoint: 'upstream catalogue'
          },
          'get-product': {
            service: 'nginx-web',
            endpoint: 'upstream catalogue'
          },
          'get-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'add-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'update-cart': {
            service: 'nginx-web',
            endpoint: 'upstream cart'
          },
          'post-pay': {
            simulateErrors: true,
            service: 'nginx-web',
            endpoint: 'upstream payment'
          }
        }
      }
    },
    marketingtemp: {
      'https://eum-blue-saas.instana.io/mobile': ['uRonPuVRR5Sqd5DhJxSt3g']
    },
    pink: {
      'https://eum-pink-saas.instana.rocks/mobile': {
        keys: ['Q6H6YLnTT72vzqR2IrA9sA'],
        playbook: 'warehouse',
        apiserver: 'https://test-instana.pink.instana.rocks',
        apitoken: process.env.APITOKEN,
        crashStartInterval: ['20:31:39'],
        crashEndInterval: ['21:11:34'],
        queries: {
          'list-products': {
            service: 'rs-catalogue',
            callname: 'GET /products'
          },
          'get-product': {
            service: 'rs-catalogue',
            callname: 'GET /product/:sku'
          },
          'get-cart': {
            service: 'rs-cart',
            endpoint: 'GET /cart/:id'
          },
          'add-cart': {
            service: 'rs-cart',
            endpoint: 'GET /add/:id/:sku/:qty'
          },
          'update-cart': {
            service: 'rs-cart',
            endpoint: 'GET /update/:id/:sku/:qty'
          },
          'post-pay': {
            simulateErrors: true,
            service: 'payment',
            endpoint: 'POST /pay/{id}'
          }
        }
      }
    },
    // demo-ibmsystems
    ibmsystems: {
      'https://eum-orange-saas.instana.io/mobile': {
        keys: ['OCK-jCgaQ2iEiPx0EHr5Hg'],
        playbook: 'warehouse',
        apiserver: 'https://demo-ibmsystems.instana.io',
        apitoken: process.env.APITOKEN,
        crashStartInterval: ['20:31:39'],
        crashEndInterval: ['21:11:34'],
        queries: {
          'list-products': {
            service: 'rs-catalogue',
            endpoint: 'GET /products'
          },
          'get-product': {
            service: 'rs-catalogue',
            endpoint: 'GET /product/:sku'
          },
          'get-cart': {
            service: 'rs-cart',
            endpoint: 'GET /cart/:id'
          },
          'add-cart': {
            service: 'rs-cart',
            endpoint: 'GET /add/:id/:sku/:qty'
          },
          'update-cart': {
            service: 'rs-cart',
            endpoint: 'GET /update/:id/:sku/:qty'
          },
          'post-pay': {
            simulateErrors: true,
            service: 'payment',
            endpoint: 'POST /pay/{id}'
          }
        }
      }
    },
    // demo-test
    testpink: {
      // test
      'https://eum-pink-saas.instana.rocks/mobile': {
        keys: ['gWH6DDO9RjSf0HZ8YkwMWg'],
        playbook: 'warehouse',
        apiserver: 'https://test-instana.pink.instana.rocks',
        apitoken: process.env.APITOKEN,
        crashStartInterval: ['20:31:39'],
        crashEndInterval: ['21:11:34'],
        queries: {
          'list-products': {
            service: 'rs-catalogue',
            endpoint: 'GET /products'
          },
          'get-product': {
            service: 'rs-catalogue',
            endpoint: 'GET /product/:sku'
          },
          'get-cart': {
            service: 'rs-cart',
            endpoint: 'GET /cart/:id'
          },
          'add-cart': {
            service: 'rs-cart',
            endpoint: 'GET /add/:id/:sku/:qty'
          },
          'update-cart': {
            service: 'rs-cart',
            endpoint: 'GET /update/:id/:sku/:qty'
          },
          'post-pay': {
            simulateErrors: true,
            service: 'payment',
            endpoint: 'POST /pay/{id}'
          }
        }
      }
    }
  },
  services: {
    shop: `http://web.robot-shop:8080`
  }
};
