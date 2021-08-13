'use strict';

module.exports = function(electronApp, menuState) {
    return [{
                label: 'Create documentation',
                enabled: function() {
                    return menuState.bpmn;
                },
                action: function() {
                    electronApp.emit('menu:action', 'createDocumentation');
                }
            },
            {
                label: 'Download documentation',
                enabled: function() {
                    return menuState.bpmn;
                },
                action: function() {
                    electronApp.emit('menu:action', 'download');
                }
            }
        ];
};