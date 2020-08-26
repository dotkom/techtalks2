// this might be changeable to use environment variables, but is not too hard to change as is.
// can be this so long as proxy works, but will be easier to handle if proxy has to be dropped in prod
// might also need to set up CORS in order to fetch directly from localhost:9000
// const apiHost = 'http://localhost:3000';
const apiHost = '/api';

export const post = async (url, request) => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    ...request,
  };
  return fetch(`${apiHost}${url}`, options);
};

export const patch = async (url, request) => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...request,
  };
  return fetch(`${apiHost}${url}`, options);
};

export const get = async (url) => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'GET',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(`${apiHost}${url}`, options);
};

export const del = async (url) => {
  const token = localStorage.getItem('token');
  const options = {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return fetch(`${apiHost}${url}`, options);
};
