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

Delight AI Agent provides multiple layers of safeguards designed to secure instructions and prevent misuse.

* **Guardrails:** Built-in controls that automatically detect and flag inappropriate content before it reaches the AI agent, and validate outputs before they are sent to end users.
* **Adversarial defense:** Security features that protect against malicious techniques such as prompt injection and jailbreaking attempts intended to manipulate agent behavior.
* **Banned words and phrases:** Allows organizations to block explicit terms, sensitive topics, or competitor mentions.
* **PII:** Prevents personally identifiable information (PII), such as phone numbers and email addresses, from appearing in conversations.
* **Low-confidence protection:** Identifies and validates responses with low confidence. If an AI agent generates responses that are not grounded in the provided knowledge sources, they are categorized as low-confidence messages. You can monitor these messages in [Evaluate > Flagged messages](../dashboard-guide/evaluate/flagged-messages.md).

{% hint style="info" %}
For more information, refer to [Safeguards guide](../dashboard-guide/build/safeguards.md) or [Safeguards security guide](safeguards/)
{% endhint %}
