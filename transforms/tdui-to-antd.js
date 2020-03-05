const { printOptions } = require('./utils/config');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  function renameImportModule(j, root) {
    let hasChanged = false;

    root
      .find(j.ImportDeclaration, { source: { value: 'td-ui' } })
      .at(0)
      .replaceWith(({ node }) => {
        hasChanged = true;
        return j.importDeclaration(node.specifiers, j.literal('antd'));
      });

    return hasChanged;
  }

  let hasChanged = false;
  hasChanged = renameImportModule(j, root) || hasChanged;

  return hasChanged
    ? root.toSource(options.printOptions || printOptions)
    : null;
};
