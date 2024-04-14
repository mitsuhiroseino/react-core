const { publishToLocal } = require('@visue/dev');
publishToLocal('./build', '../../local', { editPackageJson: { dependencies: { '@visue/core': '../core', '@visue/web-core': '../web-core', } } });
