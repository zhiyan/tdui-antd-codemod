jest.mock('../tdui-Loading-to-antd-Spin', () => {
  return Object.assign(require.requireActual('../tdui-Loading-to-antd-Spin'), {
    parser: 'babylon',
  });
});

const tests = ['basic'];

const defineTest = require('jscodeshift/dist/testUtils').defineTest;

const testUnit = 'tdui-Loading-to-antd-Spin';

describe(testUnit, () => {
  tests.forEach(test =>
    defineTest(
      __dirname,
      testUnit,
      {
        console,
      },
      `${testUnit}/${test}`,
    ),
  );
});
