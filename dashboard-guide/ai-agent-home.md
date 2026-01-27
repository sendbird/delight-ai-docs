# AI agent (home)

The **AI agent Home** and **Overview** give you a centralized view of all AI agents within your workspace.

\[image]

## Home

### What you can do

* View all AI agents in your [workspace](ai-agent-home.md#workspace-vs-ai-agent) at a glance
* [Check each agent’s environment status](ai-agent-home.md#development-vs-production-environments) (Development / Production)
* [View deployment history](ai-agent-home.md#viewing-deployment-history)
* [Create new AI agents](ai-agent-home.md#creating-a-new-ai-agent)

{% hint style="info" %}
The AI agent list view may vary based on your [role and permission](https://docs.delight.ai/roles-and-permissions) settings within the workspace.
{% endhint %}

### Core concepts

#### Workspace vs. AI agent

A **workspace** is the shared environment where your AI agents operate. A single workspace can contain multiple agents and shared assets, such as knowledge data.

<table><thead><tr><th width="192.26953125">Concept</th><th>Description</th></tr></thead><tbody><tr><td>Workspace</td><td>A region-based container. All agents in a workspace share instructional assets such as Knowledge, Actionbooks, Tools, and Message templates.</td></tr><tr><td>Agent</td><td>A uniquely configured entity with its own behavior, language, and use case.</td></tr></tbody></table>

If not sure where to start, use this rule of thumb:

* **Create a new workspace** if you need to serve users in a completely different region (e.g. US vs Korea).
* **Create a new agent** if you want to serve different audiences, policies, or languages within the same region.

{% hint style="info" %}
To create a new workspace, contact contact one of our Delight representative.
{% endhint %}

#### Development, Staging, and Production environments

Once you've created a workspace, you need to build a new AI agent. Delight AI agent automatically comes with three environments:

* **Development** — a sandbox for testing, editing, and validating your agent before going live.
* **Staging** - a pre-production environment for a final validation and quality assurance of changes from Development.&#x20;
* **Production** — the live version users interact with.

Modifications in Development and Staging do not impact the live agent until they are deployed to Production.

{% hint style="info" %}
You can edit agents only in **Development**. **Staging** and **Production** are read-only.
{% endhint %}

### Create more AI agents

Depending on your service environment, you might need more than one AI agents - one for Sales, one for Customer service, and one for Technical assistance. Click the **Add Agent➕** button below the list of agent cards to create a new agent. You'll be asked to:

* Name the agent (visible to users).

Each new agent will come with three environments: [Development, Staging, and Production](ai-agent-home.md#development-vs-production-environments).

{% hint style="info" %}
To delete an agent, contact one of our Delight representative.
{% endhint %}

***

## Overview&#x20;

### View and deploy changes

If there are updates in the **Development** environment that haven’t been deployed, a statement "**Available to deploy**" will appear on the agent card.

Click the agent card. You can find the **View changes to deploy** button at the top of left menu bar. Review the changes and choose to either deploy all or deploy selectively.

{% hint style="info" %}
To apply changes from **Development** on a production level, deploy changes to both **Staging** and then **Production**.&#x20;
{% endhint %}

**Selective deployment**

Selective deployment lets you control which AI agents receive workspace-level changes. For example, when you update a shared **Actionbook** or **Knowledge** item in **Development**, you can choose which agents receive the update in **Staging** and **Production**.

This allows you to:

* Gradually roll out updates to specific agents
* Run A/B tests across agents
* Prevent unintended changes to agents that share the same workspace assets

***

### View deployment history

Click **Deployment history** on any agent card to view past deployments.

Each record shows:

* The version number
* Who deployed it
* When it was deployed
* Details of the modified items
* Restore button\*

{% hint style="info" %}
Version information and history is available in **Staging** and **Production** only.
{% endhint %}

<details>

<summary>*How to revert deployment</summary>

After deployment, you can revert the change with a click. Each environment offers different ways to roll back your recent deployments.

**Development**

1. Click **Reset changes** in the Overview page. This synchronizes the Development environment back to the current Staging version.

**Staging and Production**

1. Click the **History** button in the Overview page to open the **Version history** modal.
2. Find an agent version to roll your **Staging** or **Production** back to.&#x20;
3. Click the **Restore** button in the far right column of the table.&#x20;
4. Select what changes to revert from the current settings.
5. Leave a note about why you are reverting the deployment and type in your organization name to proceed.

</details>

### Manage AI agent's operational state

You can activate or deactivate an agent in its Overview page. Click its **Active** status button and toggle the agent between **Active** and **Inactive**:

\[image]

* **Active**: The AI agent is up and running, and available to users.
* **Inactive**: The agent stops operating, and the specified fallback message will be sent as a response instead.

{% hint style="info" %}
Toggling the agent in one environment doesn’t affect the others.
{% endhint %}

***

## Workspace vs. AI agent

A **workspace** is the shared environment where your AI agents operate. A single workspace can contain multiple agents and shared assets, such as knowledge data.

<table><thead><tr><th width="192.26953125">Concept</th><th>Description</th></tr></thead><tbody><tr><td>Workspace</td><td>A region-based container. All agents in a workspace share instructional assets such as Knowledge, Actionbooks, Tools, and Message templates.</td></tr><tr><td>Agent</td><td>A uniquely configured entity with its own behavior, language, and use case.</td></tr></tbody></table>

If not sure where to start, use this rule of thumb:

* **Create a new workspace** if you need to serve users in a completely different region (e.g. US vs Korea).
* **Create a new agent** if you want to serve different audiences, policies, or languages within the same region.

{% hint style="info" %}
To create a new workspace, contact contact one of our Delight representative.
{% endhint %}
