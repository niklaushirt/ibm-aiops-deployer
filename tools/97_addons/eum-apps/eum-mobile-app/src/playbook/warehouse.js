module.exports = (user) => [
  {
    type: 'sessionStart',
    view: 'Products'
  },
  {
    type: 'httpRequest',
    timeOffset: [15, 30],
    correlation: 'list-products',
    url: 'https://rs-catalog/list-product',
    fake: {
      duration: [500, 1000],
      statusCode: 'auto'
    }
  },
  {
    type: '@group',
    times: [3, 8],
    items: [
      {
        type: 'viewChange',
        timeOffset: [2000, 3000],
        view: 'Product Details'
      },
      {
        type: 'httpRequest',
        timeOffset: [1, 15],
        correlation: 'get-product',
        url: 'https://rs-catalog/product/PB-1',
        fake: {
          duration: [500, 1000],
          statusCode: 'auto'
        }
      },
      {
        type: 'viewChange',
        timeOffset: [2000, 3000],
        view: 'Products'
      },
      {
        type: 'httpRequest',
        timeOffset: [15, 30],
        correlation: 'list-products',
        url: 'https://rs-catalog/list-product',
        fake: {
          duration: [500, 1000],
          statusCode: 'auto'
        }
      }
    ]
  },

  {
    type: 'viewChange',
    timeOffset: [3000, 4000],
    view: 'Product Details',
    abortChance: 0.1
  },
  {
    type: 'httpRequest',
    timeOffset: [1, 15],
    correlation: 'get-product',
    url: 'https://rs-catalog/product/PB-2',
    fake: {
      duration: [500, 1000],
      statusCode: 'auto'
    }
  },
  {
    type: 'customEvent',
    timeOffset: [1500, 3000],
    eventName: 'tracking.showImageCarousel',
    chance: 0.9,
    meta: {
      numberOfImages: 5,
      premiumImagePackage: true
    }
  },
  {
    type: 'customEvent',
    timeOffset: [1500, 3000],
    eventName: 'Add to cart',
    abortChance: 0.25,
  },
  {
    type: 'httpRequest',
    timeOffset: [5, 15],
    method: 'PUT',
    correlation: 'add-cart',
    url: 'https://rs-cart/add-cart',
    // No API exists that we could call
    fake: {
      duration: [500, 1500],
      statusCode: 204
    }
  },

  {
    type: 'viewChange',
    timeOffset: [10, 300],
    view: 'Cart'
  },
  {
    type: 'httpRequest',
    timeOffset: [5, 100],
    correlation: 'get-cart',
    url: 'https://rs-cart/cart',
    fake: {
      duration: [500, 1500],
      statusCode: 200
    }
  },

  {
    type: 'customEvent',
    timeOffset: [2000, 4000],
    eventName: 'Check Out',
    abortChance: 0.5
  },
  {
    type: 'httpRequest',
    timeOffset: [5, 100],
    correlation: 'update-cart',
    url: 'https://rs-cart/checkout',
    fake: {
      duration: [500, 1500],
      statusCode: 200
    }
  },

  {
    type: 'viewChange',
    timeOffset: [4000, 10000],
    view: 'Delivery',
    abortChance: 0.5
  },
  {
    type: 'httpRequest',
    timeOffset: 5,
    method: 'POST',
    url: 'https://rs-cart/update-cart',
    correlation: 'update-cart',
    fake: {
      duration: [500, 1000],
      statusCode: 200
    }
  },

  {
    type: 'viewChange',
    timeOffset: [4000, 10000],
    view: 'Payment',
    abortChance: user.abortChances.payment || 0.5
  },
  {
    type: 'httpRequest',
    timeOffset: 5,
    method: 'POST',
    correlation: 'post-pay',
    url: 'https://rs-payment/pay',
    errorChance: 0.3,
    fake: {
      duration: [1800, 2500],
      statusCode: 'auto'
    }
  },

  {
    type: 'viewChange',
    timeOffset: [100, 500],
    view: 'Confirmation'
  },

  {
    type: 'customEvent',
    timeOffset: [4000, 5000],
    eventName: 'Order created',
    meta: {
      numberOfImages: 5,
      premiumImagePackage: true
    }
  }
];
