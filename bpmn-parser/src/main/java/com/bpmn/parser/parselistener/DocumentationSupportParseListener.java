package com.bpmn.parser.parselistener;

import net.steppschuh.markdowngenerator.rule.HorizontalRule;
import net.steppschuh.markdowngenerator.table.Table;
import net.steppschuh.markdowngenerator.text.emphasis.BoldText;
import net.steppschuh.markdowngenerator.text.heading.Heading;
import org.camunda.bpm.engine.impl.bpmn.parser.AbstractBpmnParseListener;
import org.camunda.bpm.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.camunda.bpm.engine.impl.task.TaskDefinition;
import org.camunda.bpm.engine.impl.util.xml.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Map;

public class DocumentationSupportParseListener extends AbstractBpmnParseListener {
    private final Logger LOGGER = LoggerFactory.getLogger(DocumentationSupportParseListener.class.getName());
    public record Task(String id, String name, String behavior){}

    @Override
    public void parseProcess(Element processElement, ProcessDefinitionEntity processDefinition) {
        LOGGER.info("In DocumentationSupportListener...parsing Process");
        File file = new File("./doco.md");
        StringBuilder stringBuilder = new StringBuilder()
                .append(new Heading(processDefinition.getName(),1)).append("\n")
                .append(new BoldText(processDefinition.getDescription())).append("\n")
                .append(new HorizontalRule()).append("\n");
//      Tasks
        stringBuilder.append(new Heading("User Tasks ", 3)).append("\n")
                .append(new HorizontalRule()).append("\n");
        Table.Builder tableBuilder = new Table.Builder()
                .withRowLimit(7)
                .addRow("Key", "Assignee", "Candidate Users", "Candidate Groups");

        for (Map.Entry<String, TaskDefinition> entry : processDefinition.getTaskDefinitions().entrySet()) {
            TaskDefinition taskDefinition = entry.getValue();
            tableBuilder.addRow(taskDefinition.getKey(), taskDefinition.getAssigneeExpression(), taskDefinition.getCandidateUserIdExpressions(), taskDefinition.getCandidateGroupIdExpressions());
        }
        stringBuilder.append(tableBuilder.build()).append("\n");

//        Activities
        stringBuilder.append(new Heading("Activities ", 3)).append("\n")
                .append(new HorizontalRule()).append("\n");
        tableBuilder = new Table.Builder()
                .withRowLimit(7)
                .addRow("Name", "ID", "Behavior");

        for (Element element : processElement.elements("serviceTask")) {
                String taskType = element.attribute("http://camunda.org/schema/1.0/bpmn:delegateExpression");
                if (taskType == null) {
                    taskType = element.attribute("http://camunda.org/schema/1.0/bpmn:type"); // = external
                }
                element.attribute("name");
                tableBuilder.addRow(element.attribute("name"), element.attribute("id"), taskType);
        }
        stringBuilder.append(tableBuilder.build());


        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.append(stringBuilder);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
