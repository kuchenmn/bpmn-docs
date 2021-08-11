package com.bpmn.parser.delegate;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class ServiceTaskOneDelegate implements JavaDelegate {
    private final Logger LOGGER = LoggerFactory.getLogger(ServiceTaskOneDelegate.class.getName());
    @Override
    public void execute(DelegateExecution execution) throws Exception {
        LOGGER.info("Doing Service Task 1...");
    }
}
