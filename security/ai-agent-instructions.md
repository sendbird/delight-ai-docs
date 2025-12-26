# AI agent instructions

The Delight AI agent allows you to configure instructions that guide agent behavior. Instructions can be defined at two levels:

* **Workspace:** Shared goals and communication styles applied across multiple agents.
* **Agent:** Goals and guidelines specific to an individual agent.

<figure><img src="../.gitbook/assets/CleanShot 2025-05-17 at 13.25.41@2x.png" alt=""><figcaption></figcaption></figure>

***

### Instruction security best practices

Instructions can be configured on the Build page for an AI agent and in the Workspace settings section of the dashboard. While instructions play a critical role in shaping agent responses, it is essential to understand their security limitations.

#### 1. Do not treat instructions as confidential

Instructions are processed by the underlying LLM and may be partially reflected in generated responses.

#### 2. Never include sensitive information

Do not include sensitive information in agent goals, guidelines, or any workspace-level instructions.

{% hint style="danger" %}
**Avoid**

* Credentials, API keys, or passwords
* Details of internal systems or infrastructure
{% endhint %}

Instructions should not be relied upon as a security mechanism. To protect your organization, always keep sensitive data out of all instruction fields and manage secrets using secure, dedicated systems.
