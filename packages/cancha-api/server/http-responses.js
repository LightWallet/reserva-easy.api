const validationError = err => Promise.resolve({ status: 422, resp: err });
const ok = () => ({
  status: 200,
  resp: 'OK'
});

const failure = reason => ({
  status: 400,
  resp: reason
});

const notFound = () =>
  Promise.resolve({
    status: 404,
    resp: 'Not found'
  });

const loginFailed = () =>
  Promise.resolve({
    status: 400,
    resp: 'Failed to log in'
  });

const unknownError = err => {
  return {
    status: 500,
    resp: err
  };
};

module.exports = {
  failure,
  validationError,
  ok,
  notFound,
  loginFailed,
  unknownError
};
