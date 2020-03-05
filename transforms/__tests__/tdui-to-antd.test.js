jest.mock('../tdui-to-antd', () => {
  return Object.assign(require.requireActual('../tdui-to-antd'), {
    parser: 'babylon',
  });
});

const tests = ['basic'];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const testUnit = 'tdui-to-antd';

describe(testUnit, () => {
  tests.forEach(test =>
    defineTest(__dirname, testUnit, null, `${testUnit}/${test}`),
  );
});
