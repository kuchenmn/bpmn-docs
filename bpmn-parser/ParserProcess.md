# BPMN Parser Process - ParserProcess
This is the process that needs to be parsed for documentation purposes.
Process Summary
---------------
| Category       | Values                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------- |
| Participants   | Lanes: Lane 2,Lane 1 Candidate User(s): [admin, demo]  Assignee(s): Coolio Candidate Group(s): [banana, orange] |
| Start Event(s) | Start, Start Two                                                                                                |
| End Event(s)   | End                                                                                                             |
| Tasks          | 9                                                                                                               |

Technical Documentation
-----------------------
### Prerequisites
#### Topics to Subscribe
- serviceTask1Worker
#### Sub-processes
- Subprocess - null
- Call Activity - test
#### DMNs
- Business Rule Task - dmn_ref
- Second DMN - dmn_ref
#### Forms
- app:embedded:createTweet.html
### User Tasks
| Key                 | Assignee | Candidate Users | Candidate Groups | Form Key                      | Documentation                                             |
| ------------------- | -------- | --------------- | ---------------- | ----------------------------- | --------------------------------------------------------- |
| SayHelloToAdminTask | Coolio   | [admin, demo]   | [banana, orange] | app:embedded:createTweet.html | This is where the user needs to say "hello" to the admin. |

### Service Tasks
| Name            | ID                 | Behavior                                             | Documentation |
| --------------- | ------------------ | ---------------------------------------------------- | ------------- |
| External Task   | ExternalTaskTask   | External (topic ='serviceTask1Worker')               |               |
| Delegate Task   | DelegateTaskTask   | Delegate Expression: ${serviceTaskOneDelegate}       |               |
| Expression Task | ExpressionTaskTask | Expression: myExpression                             |               |
| Connector Task  | ConnectorTaskTask  | Connector: Consider Using a Different Implementation |               |

### Script Tasks
| Name        | ID              | Script Format | Script / Resource    | Documentation |
| ----------- | --------------- | ------------- | -------------------- | ------------- |
| Script Task | ScriptTaskTask  | JavaScript    | ```print("Hello")``` |               |
| Script Task | ScriptTaskTask1 | JavaScript    | test.js              |               |

### Business Rule Tasks
| Name               | ID                   | DecisionRef | Result Variable | MapDecisionResult | Documentation |
| ------------------ | -------------------- | ----------- | --------------- | ----------------- | ------------- |
| Business Rule Task | BusinessRuleTaskTask | dmn_ref     | decision        | singleResult      |               |
| Second DMN         | SecondDMNTask        | dmn_ref     | decision        | singleEntry       |               |

