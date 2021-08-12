var registerBpmnJSPlugin = require('camunda-modeler-plugin-helpers').registerBpmnJSPlugin;

var DocumentationGeneratorPlugin = require('./DocumentationGeneratorPlugin');
registerBpmnJSPlugin(DocumentationGeneratorPlugin);