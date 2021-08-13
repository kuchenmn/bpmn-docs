'use strict';

//const os = require("os");
//const fs = require("fs");
import * as os from 'os';
//import * as fs from 'fs';

console.log(os);

function DocumentationGeneratorPlugin(elementRegistry, editorActions, canvas, modeling) {
    this._elementRegistry = elementRegistry;
    this._modeling = modeling;

    let self = this;

    editorActions.register({
        createDocumentation: function() {
            self.createDocumentation();
        }
    });
}

function downloadFile(content){
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', "mytest.md");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function seperateElements(_elements) {
    let elements = {
        lanes: [],
        participants: [] ,
        tasks: [],
        startEvents: [] ,
        endEvents: []

    }
    Object.keys(_elements).forEach(function(key) {
        if(_elements[key].element.businessObject != null && _elements[key].element.type != "label")
        {
            if(_elements[key].element.businessObject.$type.includes("EndEvent")) {
                elements.endEvents.push(_elements[key].element.businessObject)
            }

            if(_elements[key].element.businessObject.$type.includes("StartEvent")) {
                elements.startEvents.push(_elements[key].element.businessObject)
            }

            if(_elements[key].element.businessObject.$type.includes("Task")) {
                elements.tasks.push(_elements[key].element.businessObject)
            }


            if(_elements[key].element.businessObject.$type.includes("Participant")) {
                elements.participants.push(_elements[key].element.businessObject)
            }

            if(_elements[key].element.businessObject.$type.includes("Lane")) {
                elements.lanes.push(_elements[key].element.businessObject)
            }
        }
    });
    return elements;
}

function getNames(elements) {
    let result = "";
    elements.forEach(function (element) {
        result += element.name + ", ";
    });
    if (result.length > 1){
        result = result.substr(0, result.length - 2)
    }
    return result;
}

// Todo: handle no-pool-doku and multi-process doku better
function getProcessName(participants) {
    if(participants.length > 1){
        return "Multi-Process-Doku";
    }
    if(participants.length == 1){
        return participants[0].name;
    }
    return "No-Pool-Doku";
}

function getProcessDefinitionKey(elements) {
    return undefined;
}

function getFormKeys(tasks){
    let formKeys = [];
    tasks.forEach(function (task) {
        if(task.$type.includes("UserTask") && task.formKey != undefined){
            if(!formKeys.includes(task.formKey)){
                formKeys.push(task.formKey);
            }
        }
    });
    return formKeys;
}

function getJavaClasses(tasks){
    let javaClasses = [];
    tasks.forEach(function (task) {
        if(task.$type.includes("ServiceTask") && task.class != undefined){
            if(!javaClasses.includes(task.class)){
                javaClasses.push(task.class);
            }
        }
        if(task.$type.includes("ServiceTask") && task.delegateExpression != undefined){
            if(!javaClasses.includes(task.delegateExpression)){
                javaClasses.push(task.delegateExpression);
            }
        }
    });
    return javaClasses;
}

function getTopicsToSubscribe(tasks){
    let topics = [];
    tasks.forEach(function (task) {
        if(task.$type.includes("ServiceTask") && task.topic != undefined){
            if(!topics.includes(task.topic)){
                topics.push(task.topic);
            }
        }
    });
    return topics;
}

function getDMNs(tasks){
    let dmns = [];
    tasks.forEach(function (task) {
        if(task.$type.includes("BusinessRuleTask") && task.decisionRef != undefined){
            if(!dmns.includes(task.decisionRef)){
                dmns.push(task.decisionRef);
            }
        }
    });
    return dmns;
}

function getHR(tasks){
    let hrs = [];
    tasks.forEach(function (task) {
        if(task.$type.includes("UserTask") && task.assignee != undefined){
            if(!hrs.includes(task.assignee)){
                hrs.push(task.assignee);
            }
        }
        if(task.$type.includes("UserTask") && task.candidateUsers != undefined){
            if(!hrs.includes(task.candidateUsers)){
                hrs.push(task.candidateUsers);
            }
        }
        if(task.$type.includes("UserTask") && task.candidateGroups != undefined){
            if(!hrs.includes(task.candidateGroups)){
                hrs.push(task.candidateGroups);
            }
        }
    });
    hrs = hrs.toString();
    hrs = hrs.substr(0, hrs.length);
    hrs = hrs.replace(",", ", ");
    return hrs;
}

DocumentationGeneratorPlugin.prototype.createDocumentation = function() {
    let elements = seperateElements(this._elementRegistry._elements);
    let fileContent = "";

    console.log(elements);

    //Header
    let processName = getProcessName(elements.participants);
    let processDefinitionKey = getProcessDefinitionKey(elements);

    fileContent += "# "+ processName + " - " + processDefinitionKey + os.EOL;

    //Process Summary
    let humanRessources = getHR(elements.tasks);
    let lanes = getNames(elements.lanes);
    let startEvents = getNames(elements.startEvents);
    let endEvents = getNames(elements.endEvents);
    let nrOfTasks = elements.tasks.length;

    fileContent += os.EOL + "## Process Summary" + os.EOL;
    fileContent += "| Category           | Values                |" + os.EOL;
    fileContent += "| ------------------ | --------------------- |" + os.EOL;
    if(humanRessources.length > 0){
        fileContent += "| **Participants**   | " + humanRessources + " |" + os.EOL;
    }
    fileContent += "| **Start Event(s)** | " + startEvents   + " |" + os.EOL;
    fileContent += "| **End Event(s)**   | " + endEvents     + " |" + os.EOL;
    fileContent += "| **Tasks**          | " + nrOfTasks     + " |" + os.EOL;

    //Technical Documentation

    fileContent += os.EOL + "## Technical Documentation" + os.EOL;
    fileContent += os.EOL + "### Prerequisites" + os.EOL;

    // Java Classes / Delegates
    let javaClasses = getJavaClasses(elements.tasks)
    if(javaClasses.length > 0){
        fileContent += "#### Java Classes / Delegates" + os.EOL;
        javaClasses.forEach(function (javaClass) {
            fileContent += " - " + javaClass + os.EOL;
        })
    }

    // Topics to Subscribe
    let topicsToSubscribe = getTopicsToSubscribe(elements.tasks)
    if(topicsToSubscribe.length > 0){
        fileContent += os.EOL + "#### Topics to Subscribe" + os.EOL;
        topicsToSubscribe.forEach(function (topic) {
            fileContent += " - " + topic + os.EOL;
        })
    }

    // DMNs
    let dmns = getDMNs(elements.tasks)
    if(dmns.length > 0){
        fileContent += os.EOL + "#### DMNs" + os.EOL;
        dmns.forEach(function (dmn) {
            fileContent += " - " + dmn + os.EOL;
        })
    }

    // Form Keys
    let formKeys = getFormKeys(elements.tasks)
    if(formKeys.length > 0){
        fileContent += os.EOL + "#### Forms" + os.EOL;
        formKeys.forEach(function (formKey) {
            fileContent += " - " + formKey + os.EOL;
        })
    }


    // End
    console.log(fileContent);

    downloadFile(fileContent);

};

DocumentationGeneratorPlugin.$inject = [ 'elementRegistry', 'editorActions', 'canvas', 'modeling' ];

export default {
    __init__: ['documentationGeneratorPlugin'],
    documentationGeneratorPlugin: ['type', DocumentationGeneratorPlugin]
};