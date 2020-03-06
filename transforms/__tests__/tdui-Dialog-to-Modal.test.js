jest.mock('../tdui-Dialog-to-Modal', () => {
  return Object.assign(require.requireActual('../tdui-Dialog-to-Modal'), {
    parser: 'babylon',
  });
});

const tests = ['basic', 'alias-import'];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const testUnit = 'tdui-Dialog-to-Modal';

describe(testUnit, () => {
  tests.forEach(test =>
    defineTest(__dirname, testUnit, null, `${testUnit}/${test}`),
  );
});
