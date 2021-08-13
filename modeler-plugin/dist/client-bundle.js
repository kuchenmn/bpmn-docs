/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/DocumentationGeneratorPlugin.js":
/*!************************************************!*\
  !*** ./client/DocumentationGeneratorPlugin.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var os__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! os */ "./node_modules/os-browserify/browser.js");




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

    fileContent += "# "+ processName + " - " + processDefinitionKey + os__WEBPACK_IMPORTED_MODULE_0__.EOL;

    //Process Summary

    if(elements.process != undefined && elements.process.documentation != undefined){
        fileContent +=  elements.process.documentation + os__WEBPACK_IMPORTED_MODULE_0__.EOL
    }

    let humanRessources = getHR(elements.tasks);
    let lanes = getNames(elements.lanes);
    let startEvents = getNames(elements.startEvents);
    let endEvents = getNames(elements.endEvents);
    let nrOfTasks = elements.tasks.length;

    fileContent += os__WEBPACK_IMPORTED_MODULE_0__.EOL + "## Process Summary" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
    fileContent += "| Category           | Values                |" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
    fileContent += "| ------------------ | --------------------- |" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
    if(humanRessources.length > 0){
        fileContent += "| **Participants**   | " + humanRessources + " |" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
    }
    fileContent += "| **Start Event(s)** | " + startEvents   + " |" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
    fileContent += "| **End Event(s)**   | " + endEvents     + " |" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
    fileContent += "| **Tasks**          | " + nrOfTasks     + " |" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;

    //Technical Documentation

    fileContent += os__WEBPACK_IMPORTED_MODULE_0__.EOL + "## Technical Documentation" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
    fileContent += os__WEBPACK_IMPORTED_MODULE_0__.EOL + "### Prerequisites" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;

    // Java Classes / Delegates
    let javaClasses = getJavaClasses(elements.tasks)
    if(javaClasses.length > 0){
        fileContent += "#### Java Classes / Delegates" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        javaClasses.forEach(function (javaClass) {
            fileContent += " - " + javaClass + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        })
    }

    // Topics to Subscribe
    let topicsToSubscribe = getTopicsToSubscribe(elements.tasks)
    if(topicsToSubscribe.length > 0){
        fileContent += os__WEBPACK_IMPORTED_MODULE_0__.EOL + "#### Topics to Subscribe" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        topicsToSubscribe.forEach(function (topic) {
            fileContent += " - " + topic + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        })
    }

    // DMNs
    let dmns = getDMNs(elements.tasks)
    if(dmns.length > 0){
        fileContent += os__WEBPACK_IMPORTED_MODULE_0__.EOL + "#### DMNs" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        dmns.forEach(function (dmn) {
            fileContent += " - " + dmn + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        })
    }

    // Form Keys
    let formKeys = getFormKeys(elements.tasks)
    if(formKeys.length > 0){
        fileContent += os__WEBPACK_IMPORTED_MODULE_0__.EOL + "#### Forms" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        formKeys.forEach(function (formKey) {
            fileContent += " - " + formKey + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        })
    }

    // User Tasks
    let userTasks = getUserTasks(elements.tasks)
    if(userTasks.length > 0){
        fileContent += os__WEBPACK_IMPORTED_MODULE_0__.EOL + "### User Tasks" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        fileContent += "| Name | ID | Assignee | Candidate Users | Candidate Groups | formKey / formFields |" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        fileContent += "|-|-|-|-|-|-|" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        userTasks.forEach(function (userTask) {
            fileContent += "|" + userTask.name;
            fileContent += "|" + userTask.id;
            fileContent += "|" + userTask.assignee;
            fileContent += "|" + userTask.candidateUsers;
            fileContent += "|" + userTask.candidateGroups;
            fileContent += "|" + userTask.formKey;
            fileContent += "|" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        });
    }

    // Service Tasks
    let serviceTasks = getServiceTasks(elements.tasks)
    if(serviceTasks.length > 0){
        fileContent += os__WEBPACK_IMPORTED_MODULE_0__.EOL + "### Service Tasks" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        fileContent += "| Name | ID | Bahavior |" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        fileContent += "|-|-|-|" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        serviceTasks.forEach(function (serviceTask) {
            fileContent += "|" + serviceTask.name;
            fileContent += "|" + serviceTask.id;
            fileContent += "|" + serviceTask.behavior;
            fileContent += "|" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        });
    }

    // Script Tasks
    let scriptTasks = getScriptTasks(elements.tasks)
    if(serviceTasks.length > 0){
        fileContent += os__WEBPACK_IMPORTED_MODULE_0__.EOL + "### Script Tasks" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        fileContent += "| Name | ID | Script Format | Script / Resource |" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        fileContent += "|-|-|-|-|" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        scriptTasks.forEach(function (scriptTask) {
            fileContent += "|" + scriptTask.name;
            fileContent += "|" + scriptTask.id;
            fileContent += "|" + scriptTask.scriptFormat;
            fileContent += "|" + (scriptTask.script != undefined ? scriptTask.script : scriptTask.resource);
            fileContent += "|" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        });
    }

    // Business Rule Tasks
    let businessRuleTasks = getBusinessRuleTasks(elements.tasks)
    if(businessRuleTasks.length > 0){
        fileContent += os__WEBPACK_IMPORTED_MODULE_0__.EOL + "### Business Rule Tasks" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        fileContent += "| Name | ID | DecisionRef | Result Variable | Map Decision Result |" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        fileContent += "|-|-|-|-|-|" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        businessRuleTasks.forEach(function (task) {
            fileContent += "|" + task.name;
            fileContent += "|" + task.id;
            fileContent += "|" + task.decisionRef;
            fileContent += "|" + task.resultVariable;
            fileContent += "|" + task.mapDecisionResult;
            fileContent += "|" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        });
    }

    // Element Documentation
    if(elements.documentations.length > 0){
        fileContent += os__WEBPACK_IMPORTED_MODULE_0__.EOL + "## Element Documentation" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        elements.documentations.forEach(function (documentationElement) {
            fileContent += "**" + documentationElement.name + " - " ;
            fileContent += documentationElement.$type.replace("bpmn:", "") + "**\\" + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
            fileContent += documentationElement.documentation[0].text + os__WEBPACK_IMPORTED_MODULE_0__.EOL + os__WEBPACK_IMPORTED_MODULE_0__.EOL;
        })
    }

    // End
    downloadFile(fileContent);

};

DocumentationGeneratorPlugin.$inject = [ 'elementRegistry', 'editorActions', 'canvas', 'modeling' ];

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    __init__: ['documentationGeneratorPlugin'],
    documentationGeneratorPlugin: ['type', DocumentationGeneratorPlugin]
});

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerClientPlugin": () => (/* binding */ registerClientPlugin),
/* harmony export */   "registerClientExtension": () => (/* binding */ registerClientExtension),
/* harmony export */   "registerBpmnJSPlugin": () => (/* binding */ registerBpmnJSPlugin),
/* harmony export */   "registerBpmnJSModdleExtension": () => (/* binding */ registerBpmnJSModdleExtension),
/* harmony export */   "registerDmnJSModdleExtension": () => (/* binding */ registerDmnJSModdleExtension),
/* harmony export */   "registerDmnJSPlugin": () => (/* binding */ registerDmnJSPlugin),
/* harmony export */   "getModelerDirectory": () => (/* binding */ getModelerDirectory),
/* harmony export */   "getPluginsDirectory": () => (/* binding */ getPluginsDirectory)
/* harmony export */ });
/**
 * Validate and register a client plugin.
 *
 * @param {Object} plugin
 * @param {String} type
 */
function registerClientPlugin(plugin, type) {
  var plugins = window.plugins || [];
  window.plugins = plugins;

  if (!plugin) {
    throw new Error('plugin not specified');
  }

  if (!type) {
    throw new Error('type not specified');
  }

  plugins.push({
    plugin: plugin,
    type: type
  });
}

/**
 * Validate and register a client plugin.
 *
 * @param {import('react').ComponentType} extension
 *
 * @example
 *
 * import MyExtensionComponent from './MyExtensionComponent';
 *
 * registerClientExtension(MyExtensionComponent);
 */
function registerClientExtension(component) {
  registerClientPlugin(component, 'client');
}

/**
 * Validate and register a bpmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerBpmnJSPlugin(BpmnJSModule);
 */
function registerBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.modeler.additionalModules');
}

/**
 * Validate and register a bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerBpmnJSModdleExtension(moddleDescriptor);
 */
function registerBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.modeler.moddleExtension');
}

/**
 * Validate and register a dmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerDmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerDmnJSModdleExtension(moddleDescriptor);
 */
function registerDmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'dmn.modeler.moddleExtension');
}

/**
 * Validate and register a dmn-js plugin.
 *
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerDmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const DmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerDmnJSPlugin(DmnJSModule, [ 'drd', 'literalExpression' ]);
 * registerDmnJSPlugin(DmnJSModule, 'drd')
 */
function registerDmnJSPlugin(module, components) {

  if (!Array.isArray(components)) {
    components = [ components ]
  }

  components.forEach(c => registerClientPlugin(module, `dmn.modeler.${c}.additionalModules`)); 
}

/**
 * Return the modeler directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getModelerDirectory() {
  return window.getModelerDirectory();
}

/**
 * Return the modeler plugin directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getPluginsDirectory() {
  return window.getPluginsDirectory();
}

/***/ }),

/***/ "./node_modules/os-browserify/browser.js":
/*!***********************************************!*\
  !*** ./node_modules/os-browserify/browser.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DocumentationGeneratorPlugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DocumentationGeneratorPlugin */ "./client/DocumentationGeneratorPlugin.js");
var registerBpmnJSPlugin = __webpack_require__(/*! camunda-modeler-plugin-helpers */ "./node_modules/camunda-modeler-plugin-helpers/index.js").registerBpmnJSPlugin;

//var DocumentationGeneratorPlugin = require('./DocumentationGeneratorPlugin');


registerBpmnJSPlugin(_DocumentationGeneratorPlugin__WEBPACK_IMPORTED_MODULE_0__.default);
console.log(_DocumentationGeneratorPlugin__WEBPACK_IMPORTED_MODULE_0__.default.documentationGeneratorPlugin)
})();

/******/ })()
;
//# sourceMappingURL=client-bundle.js.map