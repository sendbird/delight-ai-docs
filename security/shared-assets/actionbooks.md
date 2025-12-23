# Actionbooks

Actionbooks often power business-critical workflows triggered by customer requests. Because these workflows may involve sensitive operations, such as issuing monetary compensation, it is essential to control how decisions are executed.

Apply the following practices to ensure Actionbooks remain effective workflow enablers without becoming vectors for unauthorized actions or data leakage.

***

### Use Tools for critical business actions

Sensitive operations, such as issuing refunds or generating discount coupons, must not be implemented directly in Actionbook logic.&#x20;

Instead, they should be executed using external Tools, ensuring that only users validated by the server as authorized to perform the operation can access them. Actionbooks should orchestrate flows but delegate critical decisions to Tools.

***

### Disable unused Actionbooks

Disable any Actionbook that is no longer needed instead of modifying or leaving it active. This reduces the attack surface and prevents outdated or vulnerable workflows from being accidentally triggered.

***

### Audit and monitor Actionbooks regularly

Review Actionbook usages to ensure that workflows align with organizational policies and do not introduce unintended usages.

Regularly review Actionbook usage to:

* Verify workflows align with organizational policies
* Identify unintended behavior or misuse
* Ensure continued compliance with security requirements
