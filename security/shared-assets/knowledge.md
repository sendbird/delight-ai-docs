# Knowledge

Knowledge is the foundation of the AI agent's responses. Securing this critical asset requires careful attention to data ingestion, classification, and lifecycle management.

<figure><img src="../../.gitbook/assets/knowledge@3x (2).png" alt=""><figcaption></figcaption></figure>

***

### Data ingestion

Delight AI allows you to ingest knowledge from a variety of content sources, including:

* Manually uploaded files
* Snippets
* Websites
* Integrations with third-party platforms such as Salesforce and Confluence

Integrations are particularly important because they enable AI agents to access existing company data, which may include highly sensitive information.

{% hint style="danger" %}
**Note:** All credentials and API keys used for integrations must be treated as sensitive assets and handled securely.
{% endhint %}

{% hint style="info" %}
For more information, see: [Integrations](../../dashboard-guide/integrations/)
{% endhint %}

***

### Data classification and redaction

All ingested data should be analyzed and classified to determine whether it is appropriate for use in AI agent responses.

During this process:

* Identify sensitive, restricted, or confidential content
* Apply redaction or exclusion where necessary
* Ensure data aligns with organizational security and compliance requirements

Sensitive data redaction is a critical part of classification and should be applied before data is integrated into the AI agent’s knowledge base.

***

### Deployment and monitoring

Once classified and integrated, knowledge is deployed for use by the AI agent. After deployment, continuous monitoring is essential to ensure data is used appropriately.

***

### Data management lifecycle

Delight AI supports saving, syncing, deploying, and deleting knowledge items. Updates made in the Development environment do not automatically apply to Production and must be explicitly deployed.

To manage this securely:

* Restrict knowledge permissions using role-based access controls.
* Review and remove unused or outdated knowledge before deployment.
* Treat knowledge deployment like a software release, with controlled ownership and approval.

When integrations are enabled, data may be ingested automatically from connected platforms. Continuously monitor and reclassify incoming data to ensure only appropriate content is used in production.
