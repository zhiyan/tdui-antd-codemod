const { printOptions } = require('./utils/config');
const { addSubmoduleImport, removeEmptyModuleImport } = require('./utils');
const { markDependency } = require('./utils/marker');

module.exports = (file, api, options) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const TDUI = 'td-ui';

  function handleChange(j, root) {
    let hasChanged = false;

    root
      .find(j.Identifier)
      .filter(
        path =>
          path.node.name === 'Icon' &&
          path.parent.node.type === 'ImportSpecifier' &&
          path.parent.parent.node.source.value === TDUI,
      )
      .forEach(path => {
        hasChanged = true;
        const importedComponentName = path.parent.node.imported.name;
        const pkgName = path.parent.parent.node.source.value;

        // remove old imports
        const importDeclaration = path.parent.parent.node;
        importDeclaration.specifiers = importDeclaration.specifiers.filter(
          specifier =>
            !specifier.imported ||
            specifier.imported.name !== importedComponentName,
        );

        const localComponentName = path.parent.node.local.name;
        addSubmoduleImport(j, root, {
          moduleName: 'td-icon',
          importedName: importedComponentName,
          localName: localComponentName,
          before: pkgName,
        });

        markDependency('td-icon');
      });

    return hasChanged;
  }

  let hasChanged = false;
  hasChanged = handleChange(j, root) || hasChanged;

  if (hasChanged) {
    removeEmptyModuleImport(j, root, TDUI);
  }

  return hasChanged
    ? root.toSource(options.printOptions || printOptions)
    : null;
};
