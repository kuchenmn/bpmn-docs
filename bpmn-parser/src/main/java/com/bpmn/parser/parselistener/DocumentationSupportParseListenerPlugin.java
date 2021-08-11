package com.bpmn.parser.parselistener;

import org.camunda.bpm.engine.impl.bpmn.parser.BpmnParseListener;
import org.camunda.bpm.engine.impl.cfg.AbstractProcessEnginePlugin;
import org.camunda.bpm.engine.impl.cfg.ProcessEngineConfigurationImpl;

import java.util.ArrayList;
import java.util.List;

public class DocumentationSupportParseListenerPlugin extends AbstractProcessEnginePlugin {

    @Override
    public void preInit(ProcessEngineConfigurationImpl processEngineConfiguration) {

        // get all existing preParseListeners
        List<BpmnParseListener> preParseListeners = processEngineConfiguration.getCustomPreBPMNParseListeners();

        if(preParseListeners == null) {

            // if no preParseListener exists, create new list
            preParseListeners = new ArrayList<BpmnParseListener>();
            processEngineConfiguration.setCustomPreBPMNParseListeners(preParseListeners);
        }

        // add new BPMN Parse Listener
        preParseListeners.add(new DocumentationSupportParseListener());
    }
}
