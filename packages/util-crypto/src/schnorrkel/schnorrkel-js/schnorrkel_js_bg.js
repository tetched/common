
const imports = {};
imports['./schnorrkel_js'] = require('./schnorrkel_js');
const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);

module.exports = wasmInstance.exports;