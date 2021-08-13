'use strict';

import * as os from 'os';

function DocumentationGeneratorPlugin(elementRegistry, editorActions, canvas, modeling) {
    this._elementRegistry = elementRegistry;
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
    element.setAttribute('download', "documentation.md");

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
        endEvents: [],
        documentations: []
    }
    Object.keys(_elements).forEach(function(key) {
        if(_elements[key].element.businessObject != null && _elements[key].element.type != "label")
        {
            if(_elements[key].element.businessObject.$type.includes("Process")) {
                elements.process = _elements[key].element.businessObject;
            }

            if(_elements[key].element.businessObject.$type.includes("EndEvent")) {
                elements.endEvents.push(_elements[key].element.businessObject);
            }

            if(_elements[key].element.businessObject.$type.includes("StartEvent")) {
                elements.startEvents.push(_elements[key].element.businessObject);
            }

            if(_elements[key].element.businessObject.$type.includes("Task")) {
                elements.tasks.push(_elements[key].element.businessObject);
            }

            if(_elements[key].element.businessObject.$type.includes("Participant")) {
                elements.participants.push(_elements[key].element.businessObject);
            }

            if(_elements[key].element.businessObject.$type.includes("Collaboration")) {
                elements.collaboration = _elements[key].element.businessObject;
            }

            if(_elements[key].element.businessObject.$type.includes("Lane")) {
                elements.lanes.push(_elements[key].element.businessObject);
            }

            if(_elements[key].element.businessObject.documentation != undefined
                && !_elements[key].element.businessObject.$type.includes("Process")
                && !_elements[key].element.businessObject.$type.includes("Collaboration"))
            {
                elements.documentations.push(_elements[key].element.businessObject);
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

function getProcessName(elements) {
    if(elements.participants.length > 1){
        return "Collaboration";
    }
    if(elements.participants.length == 1){
        return elements.participants[0].name;
    }
    if(elements.process != undefined){
        return elements.process.name;
    }
    return undefined;
}

function getProcessDefinitionKey(elements) {
    if(elements.participants.length > 1){
        return elements.collaboration.id;
    }
    if(elements.participants.length == 1){
        return elements.participants[0].id;
    }
    if(elements.process != undefined){
        return elements.process.id;
    }
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

function getUserTasks(tasks) {
    let userTasks = [];
    tasks.forEach(function (task) {
        if(task.$type.includes("UserTask")){
            userTasks.push(task);
        }
    });
    return userTasks;
}

function getServiceTasks(tasks) {
    let serviceTasks = [];
    tasks.forEach(function (task) {
        if(task.$type.includes("ServiceTask")){
            if(task.class != undefined){
                task.behavior = task.class;
            }
            else if(task.topic != undefined){
                task.behavior = "external (topic = " + task.topic + ")";
            }
            else if(task.delegateExpression != undefined){
                task.behavior = task.delegateExpression;
            }
            serviceTasks.push(task);
        }
    });
    return serviceTasks;
}

function getScriptTasks(tasks) {
    let scriptTasks = [];
    tasks.forEach(function (task) {
        if(task.$type.includes("ScriptTask")){
            scriptTasks.push(task);
        }
    });
    return scriptTasks;
}

function getBusinessRuleTasks(tasks) {
    let businessRuleTasks = [];
    tasks.forEach(function (task) {
        if(task.$type.includes("BusinessRuleTask")){
            businessRuleTasks.push(task);
        }
    });
    return businessRuleTasks;
}

DocumentationGeneratorPlugin.prototype.createDocumentation = function() {
    let elements = seperateElements(this._elementRegistry._elements);
    let fileContent = "";

    //Header
    let processName = getProcessName(elements);
    let processDefinitionKey = getProcessDefinitionKey(elements);

    fileContent += "# "+ processName + " - " + processDefinitionKey + os.EOL;

    //Process Summary

    if(elements.process != undefined && elements.process.documentation != undefined){
        fileContent +=  elements.process.documentation + os.EOL
    }

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

    // User Tasks
    let userTasks = getUserTasks(elements.tasks)
    if(userTasks.length > 0){
        fileContent += os.EOL + "### User Tasks" + os.EOL;
        fileContent += "| Name | ID | Assignee | Candidate Users | Candidate Groups | formKey / formFields |" + os.EOL;
        fileContent += "|-|-|-|-|-|-|" + os.EOL;
        userTasks.forEach(function (userTask) {
            fileContent += "|" + userTask.name;
            fileContent += "|" + userTask.id;
            fileContent += "|" + userTask.assignee;
            fileContent += "|" + userTask.candidateUsers;
            fileContent += "|" + userTask.candidateGroups;
            fileContent += "|" + userTask.formKey;
            fileContent += "|" + os.EOL;
        });
    }

    // Service Tasks
    let serviceTasks = getServiceTasks(elements.tasks)
    if(serviceTasks.length > 0){
        fileContent += os.EOL + "### Service Tasks" + os.EOL;
        fileContent += "| Name | ID | Bahavior |" + os.EOL;
        fileContent += "|-|-|-|" + os.EOL;
        serviceTasks.forEach(function (serviceTask) {
            fileContent += "|" + serviceTask.name;
            fileContent += "|" + serviceTask.id;
            fileContent += "|" + serviceTask.behavior;
            fileContent += "|" + os.EOL;
        });
    }

    // Script Tasks
    let scriptTasks = getScriptTasks(elements.tasks)
    if(serviceTasks.length > 0){
        fileContent += os.EOL + "### Script Tasks" + os.EOL;
        fileContent += "| Name | ID | Script Format | Script / Resource |" + os.EOL;
        fileContent += "|-|-|-|-|" + os.EOL;
        scriptTasks.forEach(function (scriptTask) {
            fileContent += "|" + scriptTask.name;
            fileContent += "|" + scriptTask.id;
            fileContent += "|" + scriptTask.scriptFormat;
            fileContent += "|" + (scriptTask.script != undefined ? scriptTask.script : scriptTask.resource);
            fileContent += "|" + os.EOL;
        });
    }

    // Business Rule Tasks
    let businessRuleTasks = getBusinessRuleTasks(elements.tasks)
    if(businessRuleTasks.length > 0){
        fileContent += os.EOL + "### Business Rule Tasks" + os.EOL;
        fileContent += "| Name | ID | DecisionRef | Result Variable | Map Decision Result |" + os.EOL;
        fileContent += "|-|-|-|-|-|" + os.EOL;
        businessRuleTasks.forEach(function (task) {
            fileContent += "|" + task.name;
            fileContent += "|" + task.id;
            fileContent += "|" + task.decisionRef;
            fileContent += "|" + task.resultVariable;
            fileContent += "|" + task.mapDecisionResult;
            fileContent += "|" + os.EOL;
        });
    }

    // Element Documentation
    if(elements.documentations.length > 0){
        fileContent += os.EOL + "## Element Documentation" + os.EOL;
        elements.documentations.forEach(function (documentationElement) {
            fileContent += "**" + documentationElement.name + " - " ;
            fileContent += documentationElement.$type.replace("bpmn:", "") + "**\\" + os.EOL;
            fileContent += documentationElement.documentation[0].text + os.EOL + os.EOL;
        })
    }

    // End
    downloadFile(fileContent);

};

DocumentationGeneratorPlugin.$inject = [ 'elementRegistry', 'editorActions', 'canvas', 'modeling' ];

export default {
    __init__: ['documentationGeneratorPlugin'],
    documentationGeneratorPlugin: ['type', DocumentationGeneratorPlugin]
};