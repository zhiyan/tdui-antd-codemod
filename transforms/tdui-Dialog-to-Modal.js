const {
  parseStrToArray,
  removeEmptyModuleImport,
  addSubmoduleImport,
} = require('./utils');
const { printOptions } = require('./utils/config');

const modalMethodNames = ['info', 'success', 'error', 'warning', 'confirm'];

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const antdPkgNames = parseStrToArray(options.antdPkgNames || 'antd');
  const BEFORE = 'Dialog';
  const AFTER = 'Modal';

  function renameDialogToModal(j, root) {
    let hasChanged = false;

    root
      .find(j.Identifier)
      .filter(
        path =>
          path.node.name === BEFORE &&
          path.parent.node.type === 'ImportSpecifier' &&
          antdPkgNames.includes(path.parent.parent.node.source.value),
      )
      .forEach(path => {
        hasChanged = true;
        const antdPkgName = path.parent.parent.node.source.value;
        hasChanged = true;
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
                moduleName: antdPkgName,
                importedName: AFTER,
              });
            });

          root
            .find(j.CallExpression, {
              callee: {
                object: {
                  type: 'Identifier',
                  name: localComponentName,
                },
                property: {
                  type: 'Identifier',
                },
              },
            })
            .filter(nodePath =>
              modalMethodNames.includes(nodePath.node.callee.property.name),
            )
            .forEach(nodePath => {
              nodePath.node.callee.object.name = AFTER;

              addSubmoduleImport(j, root, {
                moduleName: antdPkgName,
                importedName: AFTER,
              });
            });
        } else {
          addSubmoduleImport(j, root, {
            moduleName: antdPkgName,
            importedName: AFTER,
            localName: localComponentName,
          });
        }
      });

    return hasChanged;
  }

  let hasChanged = false;
  hasChanged = renameDialogToModal(j, root) || hasChanged;

  if (hasChanged) {
    antdPkgNames.forEach(antdPkgName => {
      removeEmptyModuleImport(j, root, antdPkgName);
    });
  }

  return hasChanged
    ? root.toSource(options.printOptions || printOptions)
    : null;
};
