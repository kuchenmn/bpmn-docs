# Customer Onboarding - customer_onboarding_en
Process Summary
---------------
| Category       | Values                                                                            |
| -------------- | --------------------------------------------------------------------------------- |
| Participants   | Lanes:  Candidate User(s):   Assignee(s):  Candidate Group(s): [clerk],[teamlead] |
| Start Event(s) | Application received                                                              |
| End Event(s)   | Application issued, Decision accelerated, Application rejected                    |
| Tasks          | 8                                                                                 |

Technical Documentation
-----------------------
### Prerequisites
#### Sub-processes
- Request document
#### DMNs
- Check application automatically - checkRisk_en
#### Forms
- embedded:app:forms/decide_en.html
### User Tasks
| Key                          | Assignee | Candidate Users | Candidate Groups | Form Key                          | Documentation                                                       |
| ---------------------------- | -------- | --------------- | ---------------- | --------------------------------- | ------------------------------------------------------------------- |
| UserTask_DecideOnApplication |          |                 | [clerk]          | embedded:app:forms/decide_en.html | User task required to decide on a yellow (moderate) risk applicant. |
| UserTask_AccelerateDecision  |          |                 | [teamlead]       |                                   |                                                                     |

### Service Tasks
| Name                 | ID                        | Behavior                                   | Documentation |
| -------------------- | ------------------------- | ------------------------------------------ | ------------- |
| Deliver confirmation | ServiceTask_DeliverPolicy | Delegate Expression: ${issuePolicyAdapter} |               |
| Reject application   | ServiceTask_RejectPolicy  | Delegate Expression: ${loggerDelegate}     |               |
| Get credit score     | ServiceTask_0tixwo5       | Delegate Expression: ${calculateScore}     |               |

### Business Rule Tasks
| Name                            | ID                                             | DecisionRef  | Result Variable | MapDecisionResult | Documentation |
| ------------------------------- | ---------------------------------------------- | ------------ | --------------- | ----------------- | ------------- |
| Check application automatically | BusinessRuleTask_CheckApplicationAutomatically | checkRisk_en | riskDMNresult   | resultList        |               |

Element Documentation
---------------------
