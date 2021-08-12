package com.bpmn.parser.parselistener;

import com.bpmn.parser.domain.MarkdownDoc;
import com.bpmn.parser.domain.Task;
import net.steppschuh.markdowngenerator.rule.HorizontalRule;
import net.steppschuh.markdowngenerator.table.Table;
import net.steppschuh.markdowngenerator.text.emphasis.BoldText;
import net.steppschuh.markdowngenerator.text.heading.Heading;
import org.camunda.bpm.engine.delegate.Expression;
import org.camunda.bpm.engine.impl.bpmn.parser.AbstractBpmnParseListener;
import org.camunda.bpm.engine.impl.core.model.Properties;
import org.camunda.bpm.engine.impl.persistence.entity.ProcessDefinitionEntity;
import org.camunda.bpm.engine.impl.pvm.process.ActivityImpl;
import org.camunda.bpm.engine.impl.pvm.process.Lane;
import org.camunda.bpm.engine.impl.pvm.process.LaneSet;
import org.camunda.bpm.engine.impl.task.TaskDefinition;
import org.camunda.bpm.engine.impl.util.xml.Element;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DocumentationSupportParseListener extends AbstractBpmnParseListener {
    private final Logger LOGGER = LoggerFactory.getLogger(DocumentationSupportParseListener.class.getName());

    @Override
    public void parseProcess(Element processElement, ProcessDefinitionEntity processDefinition) {
        LOGGER.info("In DocumentationSupportListener...parsing Process");
        // First - parse the processDefinition and build the Markdown object
        MarkdownDoc markdownDoc = new MarkdownDoc();
        markdownDoc.setProcessName(processDefinition.getName());
        markdownDoc.setProcessKey(processDefinition.getKey());
        markdownDoc.setDocumentation(processDefinition.getDescription());
        // Summary
        Map<String, String> summary = new HashMap<>();
        //get participants from lanes
        StringBuilder participants = new StringBuilder();
        List<LaneSet> laneSets = processDefinition.getLaneSets();
        for (LaneSet laneSet : laneSets) {
            List<Lane> lanes = laneSet.getLanes();
            for (Lane lane : lanes) {
                participants.append(lane.getName()).append(",");
            }
        }

        //Tasks
        Map<String, TaskDefinition> taskDefinitionMap = processDefinition.getTaskDefinitions();
        summary.put("Tasks", String.valueOf(taskDefinitionMap.size()));
        List<Task> tasks = new ArrayList<>();
        List<String> forms = new ArrayList<>();
        for (Map.Entry<String, TaskDefinition> entry : processDefinition.getTaskDefinitions().entrySet()) {
            Task task = new Task();
            TaskDefinition taskDefinition = entry.getValue();
            task.setKey(taskDefinition.getKey());
            if (taskDefinition.getAssigneeExpression() != null) {
                participants.append("Assignees: [" ).append(taskDefinition.getAssigneeExpression()).append("]").append(",");
                task.setAssignee(taskDefinition.getAssigneeExpression().getExpressionText());
            }
            if (taskDefinition.getCandidateGroupIdExpressions().size() > 0) {
                participants.append("Groups: " ).append(taskDefinition.getCandidateGroupIdExpressions()).append(",");
                task.setCadidateGroups(taskDefinition.getCandidateGroupIdExpressions().toString());
            }
            if (taskDefinition.getCandidateUserIdExpressions().size() > 0) {
                participants.append("Candidate Users: " ).append(taskDefinition.getCandidateUserIdExpressions()).append(",");
                task.setCadidateUsers(taskDefinition.getCandidateUserIdExpressions().toString());
            }
            if (taskDefinition.getFormKey() != null) {
                forms.add(taskDefinition.getFormKey().getExpressionText());
                task.setFormKey(taskDefinition.getFormKey().getExpressionText());
            }
            tasks.add(task);
        }
        if (participants.length() > 0) {
            participants.deleteCharAt(participants.lastIndexOf(","));
            summary.put("Participants", participants.toString());
        }
        markdownDoc.setSummary(summary);
        markdownDoc.setUserTasks(tasks);

        //Service Tasks
        List<ActivityImpl> activities = processDefinition.getActivities();
        for (ActivityImpl activity : activities) {
            String activityId = activity.getActivityId();
            Properties properties = activity.getProperties();
            Map<String, Object> propMap = properties.toMap();
            propMap.toString();
        }

        // Next, build the StringBuilder object to populate the md file
        String pathname = "./" + processDefinition.getKey() + ".md";
        File file = new File(pathname);
        // Header
        StringBuilder stringBuilder = new StringBuilder()
                .append("# ").append(markdownDoc.getProcessName()).append(" - ").append(markdownDoc.getProcessKey()).append("\n");
        // Process Summary
        stringBuilder.append(new Heading("Process Summary", 2)).append("\n");
        Table.Builder tableBuilder = new Table.Builder()
                .withRowLimit(7)
                .addRow("Category", "Values");

        for (Map.Entry<String, String> entry : markdownDoc.getSummary().entrySet()) {
            tableBuilder.addRow(entry.getKey(), entry.getValue());
        }
        stringBuilder.append(tableBuilder.build()).append("\n").append("\n");
        // Technical Documentation
        stringBuilder.append(new Heading("Technical Documentation", 2)).append("\n");
        /// Prerequisites
        stringBuilder.append(new Heading("Prerequisites", 3)).append("\n");
        //// Java Classes
        stringBuilder.append(new Heading("Java Classes", 4)).append("\n");
        //// Topics to Subscribe
        stringBuilder.append(new Heading("Topics to Subscribe", 4)).append("\n");
        //// Sub-Processes
        stringBuilder.append(new Heading("Sub-processes", 4)).append("\n");
        //// DMNs
        stringBuilder.append(new Heading("DMNs", 4)).append("\n");
        //// Forms
        stringBuilder.append(new Heading("Forms", 4)).append("\n");

        /// User Tasks
        stringBuilder.append(new Heading("User Tasks", 3)).append("\n");
        tableBuilder = new Table.Builder()
                .withRowLimit(7)
                .addRow("Key", "Assignee", "Candidate Users", "Candidate Groups", "Form Key");

        for (Task task : markdownDoc.getUserTasks()) {
            tableBuilder.addRow(task.getKey(), task.getAssignee(), task.getCadidateUsers(), task.getCadidateGroups(), task.getFormKey());
        }
        stringBuilder.append(tableBuilder.build()).append("\n").append("\n");

        /// Service Tasks
        stringBuilder.append(new Heading("Service Tasks", 3)).append("\n");
        /// Script Tasks
        stringBuilder.append(new Heading("Script Tasks", 3)).append("\n");
        /// Business Rule Tasks
        stringBuilder.append(new Heading("Business Rule Tasks", 3)).append("\n");

        // Element Documentation
        stringBuilder.append(new Heading("Element Documentation", 2)).append("\n");
//      Tasks
//        stringBuilder.append(new Heading("User Tasks ", 3)).append("\n")
//                .append(new HorizontalRule()).append("\n");
//        Table.Builder tableBuilder = new Table.Builder()
//                .withRowLimit(7)
//                .addRow("Key", "Assignee", "Candidate Users", "Candidate Groups");
//
//        for (Map.Entry<String, TaskDefinition> entry : processDefinition.getTaskDefinitions().entrySet()) {
//            TaskDefinition taskDefinition = entry.getValue();
//            tableBuilder.addRow(taskDefinition.getKey(), taskDefinition.getAssigneeExpression(), taskDefinition.getCandidateUserIdExpressions(), taskDefinition.getCandidateGroupIdExpressions());
//        }
//        stringBuilder.append(tableBuilder.build()).append("\n");

//        Activities
//        stringBuilder.append(new Heading("Activities ", 3)).append("\n")
//                .append(new HorizontalRule()).append("\n");
//        tableBuilder = new Table.Builder()
//                .withRowLimit(7)
//                .addRow("Name", "ID", "Behavior");
//
//        for (Element element : processElement.elements("serviceTask")) {
//                String taskType = element.attribute("http://camunda.org/schema/1.0/bpmn:delegateExpression");
//                if (taskType == null) {
//                    taskType = element.attribute("http://camunda.org/schema/1.0/bpmn:type"); // = external
//                }
//                element.attribute("name");
//                tableBuilder.addRow(element.attribute("name"), element.attribute("id"), taskType);
//        }
//        stringBuilder.append(tableBuilder.build());


        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.append(stringBuilder);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
