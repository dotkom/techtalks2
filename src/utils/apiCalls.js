import awsconfig from '../aws-exports';

const apiHost = awsconfig.aws_cloud_logic_custom[0].endpoint;

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
