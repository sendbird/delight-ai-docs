# Overview

This guide provides security considerations and best practices for Delight AI. Security is a shared responsibility between Delight AI and our customers. Delight AI delivers core security features and safeguards, while customers configure and operate them to meet their security, privacy, and compliance requirements.

<figure><img src="../.gitbook/assets/image (1) (1) (1).png" alt=""><figcaption></figcaption></figure>

Delight AI’s security model is built on layered scopes, from organization and account access controls to workspace and agent configurations, and finally to runtime safeguards that protect live conversations. This guide is organized into five sections, each corresponding to one of these layers.

***

### 1. Organization and Account

This section explains how to secure access to your Sendbird organization and user accounts. It covers authentication and access controls such as two-factor authentication (2FA), single sign-on (SSO), roles and permissions, and access control policies for both administrators and users.

* [Organization and Account](organization-and-account.md)

***

### 2. Environment separation

This section describes how Delight AI agent separates development and production environments to support secure testing and reliable deployment. Clear separation between test and live agents helps reduce the risk of unintended data exposure.

* [Environment separation](environment-separation.md)

***

### 3. AI agent instructions

This section explains how to configure and securely manage instructions that guide AI agent behavior. It covers both agent-level and workspace-level instructions, emphasizing best practices to avoid sharing sensitive information.

* [AI agent instructions](ai-agent-instructions.md)

***

### 4. Shared assets

This section covers assets that define what agents know and what they can do.

* [Knowledge](shared-assets/knowledge.md) explains how to securely manage an agent’s knowledge base, including data ingestion, sensitive content handling, and lifecycle controls.
* [Actionbooks](shared-assets/actionbooks.md) describes how to govern predefined behavior patterns and prevent unsafe or prohibited behaviors.
* [Tools](shared-assets/tools.md) focuses on securely integrating external APIs using strong authentication, fine-grained authorization, and least-privilege access.

***

### 5. Safeguards

This section covers safeguards applied during live conversations to help ensure safe and reliable AI behavior.

* [Safeguards](ai-agent-safeguards/ai-agent-safeguards.md) explains how to define restricted or unsafe content and how it is handled during conversations.
* [Personally Indentifiable Information](safeguards/personally-indentifiable-information.md) explains how user data is protected through PII masking, data minimization, and continuous monitoring to reduce privacy and compliance risks<br>
