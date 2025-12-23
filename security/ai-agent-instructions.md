# AI agent instructions

Delight AI agent allows configuration of instructions that guide AI Agent behavior. These instructions can be set at two levels:

* **Workspace:** Common goals and communication styles shared across multiple agents.
* **Agent:** Goal and guidelines specific to a agent.

<figure><img src="../.gitbook/assets/CleanShot 2025-05-17 at 13.25.41@2x.png" alt=""><figcaption></figcaption></figure>

***

### Instructions security best practice

Instructions can be configured on the Build page for a AI agent and in the Workspace Settings section of the dashboard. Instructions play a critical role in shaping the responses of your AI agent, but it is essential to understand their security limitations.

#### 1. Do not treat instructions as confidential

Instructions are processed by the LLM and may be partially surfaced in responses.

#### 2. Never include sensitive information

Sensitive information must not be entered into the Goal, Guidelines, or any workspace-level settings.

{% hint style="danger" %}
**Avoid**

Credentials, API keys, passwords, or details of internal systems
{% endhint %}



It is crucial to recognize that instructions should not be treated as confidential or relied upon for security. Consequently, sensitive information like credentials or internal system details must not be included in these instructions.

<br>
