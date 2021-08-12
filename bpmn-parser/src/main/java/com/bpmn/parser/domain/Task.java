package com.bpmn.parser.domain;

public class Task {
    private String name;
    private String key;
    private String documentation;
    private String assignee;
    private String cadidateUsers;
    private String cadidateGroups;
    private String formKey;
    private String behavior;
    private String scriptFormat;
    private String script;
    private String decisionRef;
    private String resultVariable;
    private String mapDecisionResult;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getDocumentation() {
        return documentation;
    }

    public void setDocumentation(String documentation) {
        this.documentation = documentation;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getCadidateUsers() {
        return cadidateUsers;
    }

    public void setCadidateUsers(String cadidateUsers) {
        this.cadidateUsers = cadidateUsers;
    }

    public String getCadidateGroups() {
        return cadidateGroups;
    }

    public void setCadidateGroups(String cadidateGroups) {
        this.cadidateGroups = cadidateGroups;
    }

    public String getFormKey() {
        return formKey;
    }

    public void setFormKey(String formKey) {
        this.formKey = formKey;
    }

    public String getBehavior() {
        return behavior;
    }

    public void setBehavior(String behavior) {
        this.behavior = behavior;
    }

    public String getScriptFormat() {
        return scriptFormat;
    }

    public void setScriptFormat(String scriptFormat) {
        this.scriptFormat = scriptFormat;
    }

    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
    }

    public String getDecisionRef() {
        return decisionRef;
    }

    public void setDecisionRef(String decisionRef) {
        this.decisionRef = decisionRef;
    }

    public String getResultVariable() {
        return resultVariable;
    }

    public void setResultVariable(String resultVariable) {
        this.resultVariable = resultVariable;
    }

    public String getMapDecisionResult() {
        return mapDecisionResult;
    }

    public void setMapDecisionResult(String mapDecisionResult) {
        this.mapDecisionResult = mapDecisionResult;
    }

}
