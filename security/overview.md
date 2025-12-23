# Overview

{image}

This guide provides security considerations and best practices for the Delight AI agent platform. Security is a shared responsibility between Delight and our customers. Delight delivers the core security features, controls, and safeguards that underpin the platform, while customers are responsible for configuring and operating those controls to meet their own security, privacy, and compliance requirements.

There are four main parts to this guide. Please find the table of contents for each section below

### 1. Organization & Account

[Organization & Account](organization-and-account.md)

* This section provides guidance on securing your Sendbird organization and user accounts. It covers critical measures such as enabling Two-Factor Authentication (2FA), implementing Role-Based Access Control (RBAC) aligned with the Principle of Least Privilege, enforcing Single Sign-On (SSO), and applying strong access control policies to safeguard administrative and user access.

***

### 2. Environments

[Workspace & Agent levels](environments/workspace-vs-agent-levels.md)

* Delight AI agent allows configuration of instructions that guide AI Agent behavior. These instructions can be set at two levels - workspace level for all agents and agent level. This section provides&#x20;

[Development vs Production environments](environments/development-vs-production-environments.md)

* Delight AI agent provides a clear separation between Development and Production environments to ensure safe testing and reliable deployment of agents. This feature allows you to differentiate between test/development agents and live agents, preventing unnecessary data exposure.

***

### 3. Shared assets

[Knowledge](shared-assets/knowledge.md)

* Provides guidance on securing an AI agent’s knowledge base through secure data ingestion, classification of sensitive content, sensitivity-aware management, and lifecycle controls for knowledge assets.

[Actionbooks](shared-assets/actionbooks.md)

* Actionbooks define behavior patterns for AI agents. This section explains governance practices for Actionbooks and outlines unsafe or prohibited content and behaviors that should not be included.

[Tools](shared-assets/tools.md)

* External APIs pose one of the highest security risks, this section focuses on securely integrating tools with strong authentication, fine-grained authorization, and adherence to the Principle of Least Privilege. It also emphasizes the need for basic web security defenses to protect against common attack vectors.

***

### 4. Safeguards

[Delight AI agent safeguards](safeguards/delight-ai-agent-safeguards.md)

* For high-quality, worry-free AI customer experience, Delight AI agent provides a feature that can detect low-confidence messages and filter sensitive messages in all conversations. Such messages are flagged to notify you of a potential issue, allowing you to swiftly address and mitigate any risks to maintain a secure and safe communication environment

[Personally Indentifiable Information](safeguards/personally-indentifiable-information.md)

* Focuses on protecting Personally Identifiable Information (PII) by utilizing Sendbird’s PII masking capabilities, applying data minimization principles, and implementing continuous monitoring to reduce compliance and privacy risks.



<br>
