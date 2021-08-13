var registerBpmnJSPlugin = require('camunda-modeler-plugin-helpers').registerBpmnJSPlugin;

//var DocumentationGeneratorPlugin = require('./DocumentationGeneratorPlugin');

import DocumentationGeneratorPlugin from "./DocumentationGeneratorPlugin";
registerBpmnJSPlugin(DocumentationGeneratorPlugin);
console.log(DocumentationGeneratorPlugin.documentationGeneratorPlugin)