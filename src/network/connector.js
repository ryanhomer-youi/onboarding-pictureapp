import { createFrontendConnector } from '@crudlio/crudl-connectors-base';
import { createAxiosBackendConnector } from './axiosConnector';
import { crudToHttp, url } from '@crudlio/crudl-connectors-base/lib/middleware';

const { baseUrl, accessKey } = require('../../config');

// CRUD mappings
const mapping = {
  create: 'post',
  read: 'get',
  update: 'put',
  delete: 'delete',
};

// middleware to add authorization header
const authorization = next => {
  const addAuthorizationHeader = (req) => {
    req.headers = {
      ...req.headers,
      Authorization: `Client-ID ${accessKey}`,
    };
    return req;
  };

  return {
    create: req => next.create(addAuthorizationHeader(req)),
    read: req => next.read(addAuthorizationHeader(req)),
    update: req => next.update(addAuthorizationHeader(req)),
    delete: req => next.delete(addAuthorizationHeader(req)),
  };
};

// create connector
const baseConnector = urlPath => {
  const backendConnector = createAxiosBackendConnector({ baseURL: baseUrl });
  let connector = createFrontendConnector(backendConnector);
  connector = connector.use(crudToHttp(mapping));
  connector = connector.use(url(urlPath));
  connector = connector.use(authorization);
  return connector;
};

export { baseConnector };
