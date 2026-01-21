# Handoff preview

When you trigger a handoff in a Development or Staging environment, Delight AI displays a preview instead of creating an actual Desk ticket. This preview shows ticket information that would be sent to Desk based on the assignment and priority rules you set, helping you verify the handoff flow, check assigned teams, and identify issues without affecting your live Desk workspace.

{% hint style="info" %}
To configure Desk assignment rules and ticket priority rules, go to [**Settings > Desk > Rules**](https://sendbird.com/docs/desk/guide/v1/rules/assignment-rules) on the Sendbird dashboard.
{% endhint %}

<figure><img src="../../../.gitbook/assets/image (5).png" alt="" width="563"><figcaption></figcaption></figure>

***

## Prerequisites

* Sendbird Desk integration is enabled.
* Desk assignment and priority rules are configured.

{% hint style="info" %}
If you don't have any assignment or priority rules configured in Desk, tickets will be assigned to the default team with medium priority.
{% endhint %}

***

## How to access

### Step 1: Trigger a handoff

1. Start a conversation with your Delight AI agent in a Dev or Stage environment and trigger a handoff.
2. Go to **Evaluate > Reports > Conversations** on the Delight AI dashboard.
3. Click a conversation to see the conversation details.

<figure><img src="../../../.gitbook/assets/image (8).png" alt=""><figcaption></figcaption></figure>

### Step 2: View the handoff preview

In the **Conversation Information** panel, you can find the **Handoff details** section. Click **View details for handoff preview** to open the preview modal.

<figure><img src="../../../.gitbook/assets/image (9).png" alt=""><figcaption></figcaption></figure>

The modal displays:

* **Ticket priority**: The ticket priority based on Desk's priority rules.
* **Assigned team**: The team that would receive the ticket based on Desk's assignment rules.
* **Updated ticket fields**: Desk ticket field values populated from the context object. For more information, see the [**Desk > Handoff**](handoff.md) guide.
* **Context object**: Full context data passed during handoff.

***

## What's next

### Evaluate the entire process without creating a Desk ticket

Validate the entire process from Delight AI agent conversation to Desk handoff in a test environment without generating an actual Desk ticket. Once verified, proceed to deploy the Delight AI agent to the production environment.

{% hint style="info" %}
If you want to turn off this feature so you can create an actual Desk ticket regardless of the environment, please contact us.
{% endhint %}
