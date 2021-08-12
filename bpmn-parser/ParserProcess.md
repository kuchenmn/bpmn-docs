# BPMN Parser Process - ParserProcess
Process Summary
---------------
| Category       | Values                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Participants   | Lanes: Lane 2,Lane 1,Candidate User(s): [demo, admin] Assignee(s): Coolio Candidate Group(s): [orange, banana] |
| Start Event(s) | Start, Start Two                                                                                               |
| End Event(s)   | End                                                                                                            |
| Tasks          | 1                                                                                                              |

Technical Documentation
-----------------------
### Prerequisites
#### Java Classes
- com.my.service.Task
#### Topics to Subscribe
- serviceTask1Worker
- test
#### Sub-processes
- Subprocess
- Call Activity
#### DMNs
- Business Rule Task
- Second DMN
#### Forms
- app:embedded:createTweet.html
### User Tasks
| Key                 | Assignee | Candidate Users | Candidate Groups | Form Key                      |
| ------------------- | -------- | --------------- | ---------------- | ----------------------------- |
| SayHelloToAdminTask | Coolio   | [demo, admin]   | [orange, banana] | app:embedded:createTweet.html |

### Service Tasks
| Name            | ID               | Behavior                                       |
| --------------- | ---------------- | ---------------------------------------------- |
| External Task   | ServiceTask1Task | External (topic ='serviceTask1Worker')         |
| Delegate Task   | ServiceTask2Task | Delegate Expression: ${serviceTaskOneDelegate} |
| Java Task       | Activity_13omnql | JavaClass: com.my.service.Task                 |
| Expression Task | Activity_045kder | Expression: myExpression                       |
| Connector Task  | Activity_1uombid | External (topic ='test')                       |
### Script Tasks
| Name        | ID               | Script Format | Script / Resource    |
| ----------- | ---------------- | ------------- | -------------------- |
| Script Task | Activity_0hzjmu7 | JavaScript    | ```print("Hello")``` |
| Script Task | Activity_07t73x2 | JavaScript    | test.js              |
### Business Rule Tasks
| Name               | ID               | DecisionRef | Result Variable | MapDecisionResult |
| ------------------ | ---------------- | ----------- | --------------- | ----------------- |
| Business Rule Task | Activity_1pk6up7 | dmn_ref     | decision        | singleResult      |
| Second DMN         | Activity_02bfq06 | dmn_ref     | decision        | singleEntry       |
Element Documentation
---------------------
