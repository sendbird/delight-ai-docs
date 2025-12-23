# AI agent instructions

Delight AI agent allows you to configure instructions that guide agent behavior. Instructions can be defined at two levels:

* **Workspace:** Shared goals and communication styles applied across multiple agents.
* **Agent:** Goals and guidelines specific to an individual agent.

<figure><img src="../.gitbook/assets/CleanShot 2025-05-17 at 13.25.41@2x.png" alt=""><figcaption></figcaption></figure>

***

### Instructions security best practice

Instructions can be configured on the Build page for a AI agent and in the Workspace settings section of the dashboard. While instructions play a critical role in shaping agent responses, it is important to understand their security limitations.

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

***

### Safeguards

Delight AI agent provides multiple safeguard layers designed to secure instructions and prevent misuse of the AI Agent.

* **Guardrails:** Built-in controls that automatically detect and flag inappropriate content before it reaches the AI agent, while also validating outputs before sending to end-users.
* **Adversarial Defense:** Security features that strive to protect against malicious attempts like prompt injection and jailbreaking designed to manipulate the AI agent’s behavior and breach its security.
* **Banned Words and Phrases:** Allows organizations to restrict explicit terms, sensitive topics, or competitor mentions.
* **PII:** When turned on, mask personally identifiable information (PII) such as phone numbers, emails, and other sensitive data from appearing in dashboard conversation history.
* **Low-confidence protection:** Delight AI agent validate content that is determined to be low-confidence. If the agent’s answer is inconsistent with the provided material and is judged to be low-confidence, it is categorized separately.

For more information, refer to [Safeguards guide](../dashboard-guide/build/safeguards.md) or [Safeguards security guide](safeguards/)
