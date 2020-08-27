// this might be changeable to use environment variables, but is not too hard to change as is.
// can be this so long as proxy works, but will be easier to handle if proxy has to be dropped in prod
// might also need to set up CORS in order to fetch directly from localhost:9000
// const apiHost = 'http://localhost:3000';
const apiHost = '/api';

export const post = async (url, request) => {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    ...request,
  };
  return fetch(`${apiHost}${url}`, req);
};

export const get = async (url) => {
  const req = {
    mode: 'no-cors',
  };
  return fetch(`${apiHost}${url}`, req);
};

export const del = async (url) => {
  const req = {
    method: 'GET',
    mode: 'no-cors',
  };
  return fetch(`${apiHost}${url}`, req);
};

export const blippGet = async (url, token) => {
  console.log(token);
  const req = {
    method: 'GET',
    headers: {
      'x-blipp-token': token,
    },
  };
  return fetch(`${apiHost}/db/blipp${url}`, req);
};

export const blippPost = async (url, request, token) => {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-blipp-token': token,
    },
    ...request,
  };
  return fetch(`${apiHost}/db/blipp${url}`, req);
};
