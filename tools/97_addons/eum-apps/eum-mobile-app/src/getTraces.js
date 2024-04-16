/* eslint-disable no-restricted-syntax, no-prototype-builtins */

const fetch = require('node-fetch');
const _ = require('lodash');
const config = require('./config');
const traceDump = require('./trace-dump.json');

const cachedData = new Map();
const cacheConfig = {
  age: 5 * 60 * 1000,
  retrievalSize: 50,
  windowSize: 10 * 60 * 1000
};

exports.getTraces = async (url, opt) => {
  if (!opt.apiserver || !opt.apitoken) {
    return null;
  }

  const now = new Date().getTime();

  let record = cachedData.get(url);
  if (!record || record.timestamp + cacheConfig.age < now) {
    const resultArr = await queryTrace(opt);
    record = {
      timestamp: now,
      data: parseAllTraces(resultArr)
    };
    cachedData.set(url, record);
  }

  return record.data;
};

function parseAllTraces(resultArr) {
  if (config.debug) {
    return traceDump;
  }
  if (!resultArr || !resultArr.length) {
    return null;
  }
  const dataSet = {};
  resultArr.forEach(({ name, data }) => {
    dataSet[name] = parseTraces(data);
  });

  return dataSet;
}

function parseTraces(data) {
  if (!data || !data.items || !data.items.length) {
    return null;
  }
  return data.items.map(it => ({
    id: it.trace.id,
    label: it.trace.label,
    duration: it.trace.duration
  }));
}

const defaultBadCallsFilters = [
  {
    name: 'call.is_root',
    operator: 'EQUALS',
    entity: 'NOT_APPLICABLE',
    value: true
  },
  {
    name: 'call.error.count',
    operator: 'GREATER_THAN',
    entity: 'NOT_APPLICABLE',
    value: 0
  }
];

const defaultGoodCallsFilters = [
  {
    name: 'call.is_root',
    operator: 'EQUALS',
    entity: 'NOT_APPLICABLE',
    value: true
  },
  {
    name: 'call.error.count',
    operator: 'EQUALS',
    entity: 'NOT_APPLICABLE',
    value: 0
  }
]

async function queryTrace(opt) {
  if (!opt.queries) {
    return null;
  }
  const apiserver = _.trimEnd(opt.apiserver, '/');

  const now = new Date().getTime();
  const queryPromises = [];

  Object.keys(opt.queries).forEach(name => {
    const query = opt.queries[name];
    const inputFilters = [
      {
        name: 'service.name',
        operator: 'EQUALS',
        entity: 'DESTINATION',
        value: query.service
      }
    ];
    if (query.endpoint) {
      inputFilters.push({
        name: 'endpoint.name',
        operator: 'EQUALS',
        entity: 'DESTINATION',
        value: query.endpoint
      });
    }
    if (query.callname) {
      inputFilters.push({
        name: 'call.name',
        operator: 'EQUALS',
        entity: 'NOT_APPLICABLE',
        value: query.callname
      });
    }
    queryPromises.push(sendQuery(apiserver, opt.apitoken, name, {
      pagination: {
        retrievalSize: cacheConfig.retrievalSize
      },
      tagFilters: [
        ...defaultGoodCallsFilters,
        ...inputFilters
      ],
      timeFrame: {
        to: now,
        windowSize: cacheConfig.windowSize
      }
    }));
    if (query.simulateErrors) {
      queryPromises.push(sendQuery(apiserver, opt.apitoken, `${name}-bad`, {
        pagination: {
          retrievalSize: cacheConfig.retrievalSize
        },
        tagFilters: [
          ...defaultBadCallsFilters,
          ...inputFilters
        ],
        timeFrame: {
          to: now,
          windowSize: cacheConfig.windowSize
        }
      }));
    }
  });

  return Promise.all(queryPromises);
}

async function sendQuery(apiserver, apitoken, name, filter) {
  const url = `${apiserver}/api/application-monitoring/analyze/traces`;
  const headers = {
    'Content-Type': 'application/json',
    // fallback user agent header to avoid detection as bot
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
    authorization: `apiToken ${apitoken}`
  };

  if (config.debug) {
    console.log(`@trace ${name} ${apiserver}`);
    return { name };
  }

  const now = new Date().toISOString();

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(filter),
      headers
      // timeout: 10000
    });
    if (!response.ok) {
      console.error(`[${now}] Failed to load traces from ${url}. Received status code: ${response.status}`);
      console.error(await response.text());
    } else {
      const data = await response.json();
      console.log(`[${now}] query [${name}] ${url} got records ${(data && data.items) ? data.items.length : 0}.`);
      return { name, data };
    }
  } catch (e) {
    console.log(e);
    // we are shutting down some environments from time to time. Avoid log spam.
    if (e.code !== 'ENETUNREACH') {
      console.error(`[${now}] Failed to load traces from ${url}: ${e}`);
    }
  }
  return null;
}
