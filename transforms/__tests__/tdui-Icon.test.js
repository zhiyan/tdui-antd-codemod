jest.mock('../tdui-Icon', () => {
  return Object.assign(require.requireActual('../tdui-Icon'), {
    parser: 'babylon',
  });
});

const tests = ['basic', 'autoRemove'];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const testUnit = 'tdui-Icon';

describe(testUnit, () => {
  tests.forEach(test =>
    defineTest(__dirname, testUnit, null, `${testUnit}/${test}`),
  );
});
