package com.bpmn.parser.domain;

import java.util.List;
import java.util.Map;

public class MarkdownDoc {
    private String processKey;
    private String processName;
    private String documentation;
    private Map<String, String> summary;
    private List<String> classes;
    private List<String> topics;
    private List<String> subProcesses;
    private List<String> dmns;
    private List<String> forms;
    private List<Task> userTasks;
    private List<Task> serviceTasks;
    private List<Task> scriptTasks;
    private List<Task> businessRuleTasks;

    public String getProcessKey() {
        return processKey;
    }

    public void setProcessKey(String processKey) {
        this.processKey = processKey;
    }

    public String getProcessName() {
        return processName;
    }

    public void setProcessName(String processName) {
        this.processName = processName;
    }

    public String getDocumentation() {
        return documentation;
    }

    public void setDocumentation(String documentation) {
        this.documentation = documentation;
    }

    public Map<String, String> getSummary() {
        return summary;
    }

    public void setSummary(Map<String, String> summary) {
        this.summary = summary;
    }

    public List<String> getClasses() {
        return classes;
    }

    public void setClasses(List<String> classes) {
        this.classes = classes;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public List<String> getSubProcesses() {
        return subProcesses;
    }

    public void setSubProcesses(List<String> subProcesses) {
        this.subProcesses = subProcesses;
    }

    public List<String> getDmns() {
        return dmns;
    }

    public void setDmns(List<String> dmns) {
        this.dmns = dmns;
    }

    public List<String> getForms() {
        return forms;
    }

    public void setForms(List<String> forms) {
        this.forms = forms;
    }

    public List<Task> getUserTasks() {
        return userTasks;
    }

    public void setUserTasks(List<Task> userTasks) {
        this.userTasks = userTasks;
    }

    public List<Task> getServiceTasks() {
        return serviceTasks;
    }

    public void setServiceTasks(List<Task> serviceTasks) {
        this.serviceTasks = serviceTasks;
    }

    public List<Task> getScriptTasks() {
        return scriptTasks;
    }

    public void setScriptTasks(List<Task> scriptTasks) {
        this.scriptTasks = scriptTasks;
    }

    public List<Task> getBusinessRuleTasks() {
        return businessRuleTasks;
    }

    public void setBusinessRuleTasks(List<Task> businessRuleTasks) {
        this.businessRuleTasks = businessRuleTasks;
    }
}
