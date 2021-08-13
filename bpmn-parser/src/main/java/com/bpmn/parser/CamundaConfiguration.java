package com.bpmn.parser;

import com.bpmn.parser.parselistener.DocumentationSupportParseListenerPlugin;
import org.camunda.bpm.engine.impl.cfg.ProcessEnginePlugin;
import org.camunda.bpm.spring.boot.starter.configuration.Ordering;
import org.camunda.connect.plugin.impl.ConnectProcessEnginePlugin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

@Configuration
public class CamundaConfiguration {

    @Bean
    @Order(Ordering.DEFAULT_ORDER + 1)
    public static ProcessEnginePlugin documentationSupportParserPlugin() {
        return new DocumentationSupportParseListenerPlugin();
    }

    @Bean
    public static ProcessEnginePlugin connectProcessEnginPlugin(){
        return new ConnectProcessEnginePlugin();
    }
}
