const { addSubmoduleImport } = require('./utils');
const { printOptions } = require('./utils/config');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const BEFORE = 'Loading';
  const AFTER = 'Spin';

  const mapping = new Map([
    ['text', 'tip'],
    ['loading', 'spinning'],
  ]);

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

        if (localComponentName === BEFORE) {
          root
            .findJSXElements(localComponentName)
            .find(j.JSXIdentifier, {
              name: localComponentName,
            })
            .forEach(nodePath => {
              nodePath.node.name = AFTER;

              addSubmoduleImport(j, root, {
                moduleName: pkgName,
                importedName: AFTER,
              });
            });

          root
            .findJSXElements(AFTER)
            .find(j.JSXAttribute, {
              name: {
                type: 'JSXIdentifier',
                name: 'text',
              },
            })
            .filter(nodePath => nodePath.parent.node.name.name === AFTER)
            .forEach(nodePath => {
              nodePath.node.name = 'tip';
            });

          root
            .findJSXElements(AFTER)
            .find(j.JSXAttribute, {
              name: {
                type: 'JSXIdentifier',
                name: 'loading',
              },
            })
            .filter(nodePath => nodePath.parent.node.name.name === AFTER)
            .forEach(nodePath => {
              nodePath.node.name = 'spinning';
            });
        } else {
          addSubmoduleImport(j, root, {
            moduleName: pkgName,
            importedName: AFTER,
            localName: localComponentName,
          });
        }
      });

    return hasChanged;
  }

  let hasChanged = false;
  hasChanged = handleChange(j, root) || hasChanged;

  return hasChanged
    ? root.toSource(options.printOptions || printOptions)
    : null;
};
