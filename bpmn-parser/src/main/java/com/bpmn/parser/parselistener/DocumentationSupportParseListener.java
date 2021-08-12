package com.bpmn.parser.parselistener;

import com.bpmn.parser.domain.MarkdownDoc;
import com.bpmn.parser.domain.Task;
import net.steppschuh.markdowngenerator.list.UnorderedList;
import net.steppschuh.markdowngenerator.table.Table;
import net.steppschuh.markdowngenerator.text.heading.Heading;
import org.camunda.bpm.engine.impl.bpmn.parser.AbstractBpmnParseListener;
import org.camunda.bpm.engine.impl.persistence.entity.ProcessDefinitionEntity;
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
import java.util.*;

public class DocumentationSupportParseListener extends AbstractBpmnParseListener {
    private final Logger LOGGER = LoggerFactory.getLogger(DocumentationSupportParseListener.class.getName());
    private String filepath = "./";
    private MarkdownDoc markdownDoc;
    private Element processElement;
    private ProcessDefinitionEntity processDefinition;


    @Override
    public void parseProcess(Element processElement, ProcessDefinitionEntity processDefinition) {
        LOGGER.info("In DocumentationSupportListener...parsing Process");
        this.processElement = processElement;
        this.processDefinition = processDefinition;


        // Define md file
        String pathname = filepath + processDefinition.getKey() + ".md";
        File file = new File(pathname);

        // First - parse the processDefinition and build the Markdown object
        markdownDoc = new MarkdownDoc();
        markdownDoc.setProcessName(processDefinition.getName());
        markdownDoc.setProcessKey(processDefinition.getKey());
        markdownDoc.setDocumentation(processDefinition.getDescription());
        markdownDoc.setSubProcesses(getSubprocesses());
        markdownDoc.setScriptTasks(getScriptTasks());

        // Set ServiceTasks
        setServiceTasks();
        // Set UserTasks
        setUserTasksTyped();
        // Set BusinessRuleTask
        setBusinessRuleTasks();

        // Header {Process Name} - {Process Definition Key}
        StringBuilder stringBuilder = new StringBuilder()
                .append("# ").append(markdownDoc.getProcessName()).append(" - ").append(markdownDoc.getProcessKey()).append("\n");

        if(markdownDoc.getDocumentation() != null) {
            stringBuilder.append(markdownDoc.getDocumentation()).append("\n");
        }

        // Header Process Summary

        stringBuilder.append(new Heading("Process Summary", 2)).append("\n");
        Table.Builder tableBuilder = new Table.Builder()
                .withRowLimit(7)
                .addRow("Category", "Values");

        // Summary
        Map<String, String> summary = new LinkedHashMap<>();


        StringBuilder participants = new StringBuilder();

        // Add Participants based on Lanes
        participants.append(getParticipantsByLanes(processDefinition)).append(" ");
        participants.append(getAllCandidateUsers()).append(" ");
        participants.append(" ").append(getAllAssignees());
        participants.append(" ").append(getAllCandidateGroups());

        //Summary
        summary.put("Participants",participants.toString());
        summary.put("Start Event(s)",getStartEvents());
        summary.put("End Event(s)",getEndEvents());
        summary.put("Tasks", String.valueOf(getTaskCount()));
        markdownDoc.setSummary(summary);

        for (Map.Entry<String, String> entry : markdownDoc.getSummary().entrySet()) {
            tableBuilder.addRow(entry.getKey(), entry.getValue());
        }
        stringBuilder.append(tableBuilder.build()).append("\n").append("\n");
        // Technical Documentation
        stringBuilder.append(new Heading("Technical Documentation", 2)).append("\n");
        /// Prerequisites
        stringBuilder.append(new Heading("Prerequisites", 3)).append("\n");
        //// Java Classes
        if (markdownDoc.getClasses().size() > 0) {
            stringBuilder.append(new Heading("Java Classes", 4)).append("\n")
                    .append(new UnorderedList<>(markdownDoc.getClasses())).append("\n");
        }
        //// Topics to Subscribe
        if (markdownDoc.getTopics().size() > 0) {
            stringBuilder.append(new Heading("Topics to Subscribe", 4)).append("\n")
                    .append(new UnorderedList<>(markdownDoc.getTopics())).append("\n");
        }
        //// Sub-Processes
        if (markdownDoc.getSubProcesses().size() > 0) {
            stringBuilder.append(new Heading("Sub-processes", 4)).append("\n")
                    .append(new UnorderedList<>(markdownDoc.getSubProcesses())).append("\n");
        }
        //// DMNs
        if (markdownDoc.getDmns().size() > 0) {
            stringBuilder.append(new Heading("DMNs", 4)).append("\n")
                    .append(new UnorderedList<>(markdownDoc.getDmns())).append("\n");
        }
        //// Forms
        if (markdownDoc.getForms().size() > 0) {
            stringBuilder.append(new Heading("Forms", 4)).append("\n")
                    .append(new UnorderedList<>(markdownDoc.getForms())).append("\n");
        }

        /// User Tasks
        if (markdownDoc.getUserTasks().size() > 0) {
            stringBuilder.append(new Heading("User Tasks", 3)).append("\n");
            tableBuilder = new Table.Builder()
                    .addRow("Key", "Assignee", "Candidate Users", "Candidate Groups", "Form Key", "Documentation");

            for (Task task : markdownDoc.getUserTasks()) {
                tableBuilder.addRow(task.getKey(), task.getAssignee(), task.getCadidateUsers(), task.getCadidateGroups(), task.getFormKey(), task.getDocumentation());
            }
            stringBuilder.append(tableBuilder.build()).append("\n").append("\n");
        }

        /// Service Tasks
        if (markdownDoc.getServiceTasks().size() > 0) {
            stringBuilder.append(new Heading("Service Tasks", 3)).append("\n");
            stringBuilder.append(markdownDoc.getServiceTasksAsMdTable());
            stringBuilder.append("\n");
            stringBuilder.append("\n");
        }

        /// Script Tasks
        if (markdownDoc.getScriptTasks().size() > 0) {
            stringBuilder.append(new Heading("Script Tasks", 3)).append("\n");
            stringBuilder.append(markdownDoc.getScriptTasksAsMdTable());
            stringBuilder.append("\n");
            stringBuilder.append("\n");
        }

        /// Business Rule Tasks
        if (markdownDoc.getBusinessRuleTasks().size() > 0) {
            stringBuilder.append(new Heading("Business Rule Tasks", 3)).append("\n");
            stringBuilder.append(markdownDoc.getBusinessRuleTasksAsMdTable());
            stringBuilder.append("\n");
            stringBuilder.append("\n");
        }

        // TODO Element Documentation - Added to the columns - Implemented in User Tasks only
//        stringBuilder.append(new Heading("Element Documentation", 2)).append("\n");

        // Write File
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.append(stringBuilder);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String getFilepath() {
        return filepath;
    }

    public void setFilepath(String filepath) {
        this.filepath = filepath;
    }

    private String getParticipantsByLanes(ProcessDefinitionEntity processDefinition) {
        //get participants from lanes
        StringBuilder participants = new StringBuilder();
        List<LaneSet> laneSets = processDefinition.getLaneSets();
        Boolean firstEntry = true;
        for (LaneSet laneSet : laneSets) {
            List<Lane> lanes = laneSet.getLanes();
            for (Lane lane : lanes) {
                if(firstEntry) {
                    firstEntry = false;
                }
                else {
                    participants.append(",");
                }
                participants.append(lane.getName());
            }
        }

        return "Lanes: " + participants.toString();
    }

    private void setServiceTasks() {
        List<Task> serviceTasks = new ArrayList<>();
        List<String> javaClasses = new ArrayList<>();
        List<String> topics = new ArrayList<>();

        List<Element> serviceTaskElement = processElement.elements("serviceTask");
        for (Element element:serviceTaskElement) {
            Task task = new Task();
            // Set Name and ID
            task.setName(element.attribute("name"));
            task.setKey(element.attribute("id"));
            // Get type-specific attributes
            String delegateExpression = element.attribute("http://camunda.org/schema/1.0/bpmn:delegateExpression");
            String externalTopic = element.attribute("http://camunda.org/schema/1.0/bpmn:topic");
            String expression = element.attribute("http://camunda.org/schema/1.0/bpmn:expression");
            String javaClass = element.attribute("http://camunda.org/schema/1.0/bpmn:class");
            // Delegate
            if (delegateExpression != null) {
                task.setBehavior("Delegate Expression: " +delegateExpression);
            }
            // External
            else if(externalTopic != null) {
                task.setBehavior("External (topic ='" + externalTopic + "')");
                topics.add(externalTopic);
            }
            // Expression
            else if(expression!= null) {
                task.setBehavior("Expression: " + expression);
            }
            // JavaClass
            else if(javaClass!= null) {
                task.setBehavior("JavaClass: " + javaClass);
                javaClasses.add(javaClass);
            }
            //Connector
            else {
                try {
                    String connector = element.elements("extensionElements").get(0).elements("connector").get(0).elements().get(0).getText();
                    task.setBehavior("Connector: Consider Using a Different Implementation");
                }
                catch (Exception e) {
                    e.printStackTrace();
                }
            }
            serviceTasks.add(task);
        }
        markdownDoc.setServiceTasks(serviceTasks);
        markdownDoc.setTopics(topics);
        markdownDoc.setClasses(javaClasses);
        }

    private void setUserTasksTyped() {

        List<Task> tasks = new ArrayList<>();
        List<String> forms = new ArrayList<>();
        for (Map.Entry<String, TaskDefinition> entry : processDefinition.getTaskDefinitions().entrySet()) {
            Task task = new Task();
            TaskDefinition taskDefinition = entry.getValue();
            task.setKey(taskDefinition.getKey());
            if (taskDefinition.getAssigneeExpression() != null) {
                task.setAssignee(taskDefinition.getAssigneeExpression().getExpressionText());
            }
            if (taskDefinition.getCandidateGroupIdExpressions().size() > 0) {
                task.setCadidateGroups(taskDefinition.getCandidateGroupIdExpressions().toString());
            }
            if (taskDefinition.getCandidateUserIdExpressions().size() > 0) {
                task.setCadidateUsers(taskDefinition.getCandidateUserIdExpressions().toString());
            }
            if (taskDefinition.getFormKey() != null) {
                forms.add(taskDefinition.getFormKey().getExpressionText());
                task.setFormKey(taskDefinition.getFormKey().getExpressionText());
            }
            if (taskDefinition.getDescriptionExpression() != null) {
                task.setDocumentation(taskDefinition.getDescriptionExpression().getExpressionText());
            }
            tasks.add(task);
        }

        markdownDoc.setUserTasks(tasks);
        markdownDoc.setForms(forms);

    }

    private String getStartEvents() {
        List<Element> startEvents = processElement.elements("startEvent");
        String startEventsCSV = "";
        for (Element element: startEvents) {
            String name = element.attribute("name").replace("\n", "");
            if (startEventsCSV.equals("")) {
                startEventsCSV = name;
            }
            else {
                startEventsCSV = startEventsCSV + ", " + name;
            }
        }
        return startEventsCSV;
    }

    private String getEndEvents() {
        List<Element> endEvents = processElement.elements("endEvent");
        String endEventsCSV = "";
        for (Element element: endEvents) {
            String name = element.attribute("name").replace("\n", "");
            if (endEventsCSV .equals("")) {
                endEventsCSV  = name;
            }
            else {
                endEventsCSV  = endEventsCSV  + ", " + name;
            }
        }
        return endEventsCSV;
    }

    private List<String> getSubprocesses() {
        List<Element> subProcessesElements = processElement.elements("subProcess");
        subProcessesElements.addAll(processElement.elements("callActivity"));
        List<String> subProcesses = new ArrayList<>();

        for (Element element: subProcessesElements) {
            subProcesses.add(element.attribute("name"));
        }
        return subProcesses;
    }

    private void setBusinessRuleTasks() {
        List<Element> businessRuleElements = processElement.elements("businessRuleTask");
        List<String> businessRuleTaskNames = new ArrayList<>();
        List<Task> businessRuleTasks = new ArrayList<>();

        for (Element element: businessRuleElements) {
            Task task = new Task();
            task.setName(element.attribute("name"));
            task.setKey(element.attribute("id"));
            task.setDecisionRef(element.attribute("http://camunda.org/schema/1.0/bpmn:decisionRef"));
            task.setResultVariable(element.attribute("http://camunda.org/schema/1.0/bpmn:resultVariable"));
            String mapDecisionResult = element.attribute("http://camunda.org/schema/1.0/bpmn:mapDecisionResult");
            if(mapDecisionResult != null) {
                task.setMapDecisionResult(mapDecisionResult);
            }
            else{
                task.setMapDecisionResult("resultList");
            }
            businessRuleTaskNames.add(element.attribute("name") + " - " + element.attribute("http://camunda.org/schema/1.0/bpmn:decisionRef"));
            businessRuleTasks.add(task);
        }
        markdownDoc.setDmns(businessRuleTaskNames);
        markdownDoc.setBusinessRuleTasks(businessRuleTasks);
    }

    private List<Task> getScriptTasks() {
        List<Element> scriptTaskElements = processElement.elements("scriptTask");
        List<Task> scriptTasks = new ArrayList<>();

        for (Element element: scriptTaskElements) {
            Task task = new Task();
            String resource = element.attribute("http://camunda.org/schema/1.0/bpmn:resource");
            task.setName(element.attribute("name"));
            task.setKey(element.attribute("id"));
            task.setScriptFormat(element.attribute("scriptFormat"));
            if(resource != null) {
                task.setScript(resource);
            }
            else{
                task.setScript("```" + element.elements("script").get(0).getText() + "```");
            }
            scriptTasks.add(task);
        }
        return scriptTasks;

    }

    private String getAllCandidateUsers() {
        String candidateUsers = "Candidate User(s): ";
        List<Task> tasks = markdownDoc.getUserTasks();
        boolean firstEntry = true;
        for (Task task:tasks) {
            String candidateUser = task.getCadidateUsers();
            if(candidateUser != null) {
                if (firstEntry) {
                    candidateUsers = candidateUsers + candidateUser;
                    firstEntry = false;
                }
                else {
                    candidateUsers = candidateUsers + "," + candidateUser;
                }
            }
        }
        return candidateUsers;
    }

    private String getAllCandidateGroups() {
        String candidateGroups = "Candidate Group(s): ";
        List<Task> tasks = markdownDoc.getUserTasks();
        boolean firstEntry = true;
        for (Task task:tasks) {
            String candidateGroup = task.getCadidateGroups();
            if(candidateGroup != null) {
                if (firstEntry) {
                    candidateGroups = candidateGroups + candidateGroup;
                    firstEntry = false;
                }
                else {
                    candidateGroups = candidateGroups + "," + candidateGroup;
                }
            }
        }
        return candidateGroups;
    }

    private String getAllAssignees() {
        String assignees = "Assignee(s): ";
        List<Task> tasks = markdownDoc.getUserTasks();
        boolean firstEntry = true;
        for (Task task:tasks) {
            String assignee = task.getAssignee();
            if(assignee != null) {
                if (firstEntry) {
                    assignees = assignees + assignee;
                    firstEntry = false;
                }
                else {
                    assignees = assignees + "," + assignees;
                }
            }
        }
        return assignees;
    }

    private int getTaskCount() {
        int count = 0;
        List<Element> elements = processElement.elements();
        for (Element element:elements) {
            String tagName = element.getTagName();
            if (tagName.contains("Task")) {
                count++;
            }
        }
        return count;
    }

}
