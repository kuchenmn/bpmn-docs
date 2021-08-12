# BPMN Parser Process - ParserProcess
This is the process that needs to be parsed for documentation purposes.
Process Summary
---------------
| Category       | Values                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| Participants   | Lanes: Lane 2,Lane 1 Candidate User(s): [admin, demo]  Assignee(s): Coolio Candidate Group(s): [orange, banana] |
| Start Event(s) | Start, Start Two                                                                                                |
| End Event(s)   | End                                                                                                             |
| Tasks          | 9                                                                                                               |

Technical Documentation
-----------------------
### Prerequisites
#### Topics to Subscribe
- serviceTask1Worker
#### Sub-processes
- Call Activity
- Subprocess
#### DMNs
- Business Rule Task
- Second DMN
#### Forms
- app:embedded:createTweet.html
### User Tasks
| Key                 | Assignee | Candidate Users | Candidate Groups | Form Key                      |
| ------------------- | -------- | --------------- | ---------------- | ----------------------------- |
| SayHelloToAdminTask | Coolio   | [admin, demo]   | [orange, banana] | app:embedded:createTweet.html |

### Service Tasks
| Name            | ID                 | Behavior                                       |
| --------------- | ------------------ | ---------------------------------------------- |
| External Task   | ExternalTaskTask   | External (topic ='serviceTask1Worker')         |
| Delegate Task   | DelegateTaskTask   | Delegate Expression: ${serviceTaskOneDelegate} |
| Expression Task | ExpressionTaskTask | Expression: myExpression                       |
| Connector Task  | ConnectorTaskTask  | Connector: soap-http-connector                 |

### Script Tasks
| Name        | ID              | Script Format | Script / Resource    |
| ----------- | --------------- | ------------- | -------------------- |
| Script Task | ScriptTaskTask  | JavaScript    | ```print("Hello")``` |
| Script Task | ScriptTaskTask1 | JavaScript    | test.js              |

### Business Rule Tasks
| Name               | ID                   | DecisionRef | Result Variable | MapDecisionResult |
| ------------------ | -------------------- | ----------- | --------------- | ----------------- |
| Business Rule Task | BusinessRuleTaskTask | dmn_ref     | decision        | singleResult      |
| Second DMN         | SecondDMNTask        | dmn_ref     | decision        | singleEntry       |

Element Documentation
---------------------
