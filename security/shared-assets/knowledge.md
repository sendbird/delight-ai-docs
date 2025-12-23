# Knowledge

Knowledge is the foundation of the AI agent's responses. Securing this critical asset requires careful attention to data ingestion, classification, and lifecycle management.

{image}

***

### Data ingestion

Delight AI allows you to ingest knowledge from a variety of content sources, including:

* Manually uploaded files
* Snippets
* Websites
* Integrations with third-party platforms such as Salesforce and Confluence

Integrations are particularly important because they enable AI agents to access existing company data, which may include highly sensitive information.

{% hint style="danger" %}
Note: All credentials and API keys used for integrations must be treated as sensitive assets and handled securely.
{% endhint %}

{% hint style="info" %}
For more information, refer to the [Integrations](../../dashboard-guide/integrations/) guide.
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

Once classified and integrated, knowledge is deployed for use by the AI agent. After deployment, continuous monitoring is essential to ensure data is used appropriately.<br>
