# bpmn-docs
Summer Hackdays 2021 project to generate documentation from a BPMN model automatically

## Goals
- A java? application to input a .bpmn model and generate a .md? documentation of the model
- **Stretch 1 - Same thing for a .dmn model**


## Plan
Come up with a better name for the project.  :)

https://github.com/camunda/camunda-bpm-platform/blob/master/engine/src/main/java/org/camunda/bpm/engine/impl/bpmn/parser/BpmnParser.java

#### Option 1 - Engine Plugin
**Pros**
- Utilize the same libraries used by the engine
- Should come together fairly quickly
- https://github.com/camunda/camunda-bpm-examples/tree/master/process-engine-plugin/bpmn-parse-listener

**Cons**
- Engine infrastructure needed.
- Model needs to be deployable?

#### Option 2 - Modeler Plugin
**Pros**
- Built in parsing functions
- Could come together quickly (front end developer)

**Cons**
- I have very little js talent

#### Option 3 - BYO Solution
**Pros**
- Most customizable
- Not tied to existing tooling

**Cons**
- Most work for parsing
