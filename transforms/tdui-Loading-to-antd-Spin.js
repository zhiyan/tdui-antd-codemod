/* eslint-disable no-param-reassign, no-shadow */
const { addSubmoduleImport } = require('./utils');
const { printOptions } = require('./utils/config');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const BEFORE = 'Loading';
  const AFTER = 'Spin';

  function handleChange(j, root) {
    let hasChanged = false;

    root
      .find(j.Identifier)
      .filter(
        path =>
          path.node.name === BEFORE &&
          path.parent.node.type === 'ImportSpecifier' &&
          path.parent.parent.node.source.value === 'td-ui',
      )
      .forEach(path => {
        hasChanged = true;
        const pkgName = path.parent.parent.node.source.value;
        const localComponentName = path.parent.node.local.name;

        const importDeclaration = path.parent.parent.node;
        importDeclaration.specifiers = importDeclaration.specifiers.filter(
          specifier =>
            !specifier.imported || specifier.imported.name !== BEFORE,
        );

        root
          .findJSXElements(localComponentName)
          .find(j.JSXAttribute, {
            name: {
              type: 'JSXIdentifier',
              name: 'text',
            },
          })
          .filter(
            nodePath => nodePath.parent.node.name.name === localComponentName,
          )
          .forEach(nodePath => {
            nodePath.node.name = 'tip';
          });

        root
          .findJSXElements(localComponentName)
          .find(j.JSXAttribute, {
            name: {
              type: 'JSXIdentifier',
              name: 'loading',
            },
          })
          .filter(
            nodePath => nodePath.parent.node.name.name === localComponentName,
          )
          .forEach(nodePath => {
            nodePath.node.name = 'spinning';
          });

        addSubmoduleImport(j, root, {
          moduleName: pkgName,
          importedName: AFTER,
          localName: localComponentName,
        });
      });

    return hasChanged;
  }

  let hasChanged = false;
  hasChanged = handleChange(j, root) || hasChanged;

  return hasChanged
    ? root.toSource(options.printOptions || printOptions)
    : null;
};
