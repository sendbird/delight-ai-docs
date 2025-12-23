# Overview

{image}

This guide provides security considerations and best practices for the Delight AI agent. Security is a shared responsibility between Delight AI agent and our customers. Delight AI agent delivers the core security features, controls, and safeguards that underpin the platform, while customers are responsible for configuring and operating those controls to meet their own security, privacy, and compliance requirements.

There are five sections to this guide.

### 1. Organization & Account

[Organization & Account](organization-and-account.md)

* This section provides guidance on securing your Sendbird organization and user accounts. It covers critical measures such as enabling Two-Factor Authentication (2FA), implementing Role-Based Access Control (RBAC) aligned with the Principle of Least Privilege, enforcing Single Sign-On (SSO), and applying strong access control policies to safeguard both administrative and user access.

***

### 2. AI agent environments

[Development vs Production environments](environments/development-vs-production-environments.md)

* Delight AI agent separates Development and Production environments, ensuring secure testing and reliable agent deployment. This distinction helps prevent unnecessary data exposure by clearly identifying test/development and live agents.

***

### 3. AI agent instructions

[AI agent instructions](ai-agent-instructions.md)

* Instructions define how agents behave and inherit shared context. This section explains how to configure and manage these instructions securely.

***

### 4. Shared assets

[Knowledge](shared-assets/knowledge.md)

* Securing an AI agent's knowledge base is essential. This section explains best practices, including secure data ingestion, classifying sensitive content, managing with sensitivity awareness, and implementing lifecycle controls for knowledge assets.

[Actionbooks](shared-assets/actionbooks.md)

* Actionbooks define behavior patterns for AI agents. This section explains governance practices for Actionbooks and outlines unsafe or prohibited content and behaviors that should not be included.

[Tools](shared-assets/tools.md)

* When integrating AI agents with external APIs, prioritize security by implementing strong authentication, detailed authorization, and adhering to the Principle of Least Privilege. Strengthen your defenses against common web threats to ensure data protection.

***

### 5. AI agent Safeguards

[Delight AI agent safeguards](safeguards/delight-ai-agent-safeguards.md)

* To ensure a high-quality and worry-free AI customer experience, Delight AI agent offers features to detect low-confidence messages and filter sensitive content throughout all conversations. This section introduces safeguard measures designed to prevent misuse and ensure AI responses remain safe and reliable.

[Personally Indentifiable Information](safeguards/personally-indentifiable-information.md)

* Protect Personally Identifiable Information (PII) by using Delight AI agent's PII masking features, implementing data minimization strategies, and ensuring continuous monitoring to minimize compliance and privacy risks.



<br>
