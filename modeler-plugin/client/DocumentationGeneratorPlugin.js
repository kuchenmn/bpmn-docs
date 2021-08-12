'use strict';

function DocumentationGeneratorPlugin(elementRegistry, editorActions, canvas, modeling) {
    this._elementRegistry = elementRegistry;
    this._modeling = modeling;

    var self = this;

    editorActions.register({
        createDocumentation: function() {
            self.createDocumentation();
        }
    });
}

DocumentationGeneratorPlugin.prototype.createDocumentation = function() {
    var self = this;
    var elements = this._elementRegistry._elements;

    console.log(elements);

    // Number of Flow Elements
    var nrOfFlowElements = 0;
    Object.keys(elements).forEach(function(key) {
        if(elements[key].element.businessObject != null &&
            elements[key].element.type != "label" &&
            elements[key].element.businessObject.$type.includes("Event") ||
            elements[key].element.businessObject.$type.includes("Task") ||
            elements[key].element.businessObject.$type.includes("Gateway"))
        {
            nrOfFlowElements++;
        }
    });
    console.log("Number of Flow Elements: " + nrOfFlowElements);

    // Start Events
    console.log("");
    console.log("Start Events");
    Object.keys(elements).forEach(function(key) {
        if(elements[key].element.businessObject != null &&
            elements[key].element.type != "label" &&
            elements[key].element.businessObject.$type.includes("StartEvent"))
        {
            console.log(elements[key].element.businessObject.id + ": " + elements[key].element.businessObject.name + "(" + elements[key].element.businessObject.$type + ")");
        }
    });

    //End Events
    console.log("");
    console.log("End Events");
    Object.keys(elements).forEach(function(key) {
        if(elements[key].element.businessObject != null &&
            elements[key].element.type != "label" &&
            elements[key].element.businessObject.$type.includes("EndEvent"))
        {
            console.log(elements[key].element.businessObject.id + ": " + elements[key].element.businessObject.name + "(" + elements[key].element.businessObject.$type + ")");
        }
    });

    //Tasks
    console.log("");
    console.log("Tasks");
    Object.keys(elements).forEach(function(key) {
        if(elements[key].element.businessObject != null &&
            elements[key].element.type != "label" &&
            elements[key].element.businessObject.$type.includes("Task"))
        {
            console.log(elements[key].element.businessObject.id + ": " + elements[key].element.businessObject.name + "(" + elements[key].element.businessObject.$type + ")");
        }
    });



    // save file
    /*
    const fs = require('fs');
    fs.writeFile("/tmp/test", "Hey there!", function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    */
};

DocumentationGeneratorPlugin.$inject = [ 'elementRegistry', 'editorActions', 'canvas', 'modeling' ];

module.exports = {
    __init__: ['documentationGeneratorPlugin'],
    documentationGeneratorPlugin: ['type', DocumentationGeneratorPlugin]
};