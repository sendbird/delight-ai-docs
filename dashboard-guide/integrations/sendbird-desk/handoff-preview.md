# Handoff preview

Delight AI seamlessly integrates with Sendbird Desk for conversation handoffs. To help you verify this integration, triggering a handoff in a Development or Staging environment displays a preview instead of creating an actual Desk ticket. This preview shows ticket information that would be sent to Desk based on the Desk assignment and priority rules you set. This helps you verify the handoff flow, check assigned teams, and debug issues without affecting your live Desk workspace.

{% hint style="info" %}
To configure Desk assignment rules and ticket priority rules, go to [**Settings > Desk > Rules**](https://sendbird.com/docs/desk/guide/v1/rules/assignment-rules) on Sendbird Dashboard.
{% endhint %}

<figure><img src="../../../.gitbook/assets/image (5).png" alt="" width="563"><figcaption></figcaption></figure>

***

## Prerequisites

* Sendbird Desk integration.
* AI agent in a Development or Staging environment.
* (Optional) Desk assignment and priority rules are configured.

{% hint style="info" %}
If you don't have any assignment or priority rules configured in Desk, tickets will be assigned to the default team with medium priority.
{% endhint %}

***

## How to access

### Step 1: Trigger a handoff in a Development or Staging environment

Start a conversation with your AI agent and trigger a handoff to Desk.

### Step 2: Open the Handoff details

In the **Conversation Information** panel, find the **Handoff details** section. You can see a quick summary including:

* **Priority**: The ticket priority based on Desk's priority rules.
* **Assigned team**: The team that would receive the ticket.

### Step 3: View the full preview

Click **View details for handoff preview** to open the preview modal. The modal displays:

* **Ticket priority**
* **Assigned team**
* **Updated ticket fields**: Values populated from the context object.
* **Context object**: Full context data passed during handoff

***

## What's next

### Test end-to-end handoff flow without creating an actual Desk ticket

Verify the complete flow from AI agent conversation to Desk handoff in a non-production environment. Once confirmed, deploy the AI agent to Production safely.
