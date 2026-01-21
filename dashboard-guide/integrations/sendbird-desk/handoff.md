# Handoff

When an AI agent hands off a conversation to a human agent in Desk, it passes customer-specific information called a context object. Desk uses this context object when creating or updating a ticket, automatically populating any ticket fields that match the fields in the context object.

AI agent can transfer the conversation to Desk human agent. It's called Handoff. When the handoff happens, it passes customer-specific information called a context object and ticket information to Desk.&#x20;

***

## What you can do

## Development vs Production environments

Triggering a handoff in Development or Staging do not impact the live Desk workspace.

* **Development** **or Staging**— you
* **Production** — the live version users interact with

***

## Handoff preview

Validate the entire process from Delight AI agent conversation to Desk handoff in a test environment without generating an actual Desk ticket.&#x20;

This preview helps you to evaluate ticket information that would be sent to Desk based on the assignment and priority rules you set, helping you verify the handoff flow, check assigned teams, and identify issues without affecting your live Desk workspace.

{% hint style="info" %}
If you want to turn off this feature so you can create an actual Desk ticket regardless of the environment, please contact us.
{% endhint %}

***

### Prerequisites

* Sendbird Desk integration is enabled.
* Desk assignment and priority rules are configured.

{% hint style="info" %}
If you don't have any assignment or priority rules configured in Desk, tickets will be assigned to the default team with medium priority.
{% endhint %}

***

### How to access

#### Step 1: Trigger a handoff

1. Start a conversation with your Delight AI agent in a Dev or Stage environment and trigger a handoff.
2. Go to **Evaluate > Reports > Conversations** on the Delight AI dashboard.
3. Click a conversation to see the conversation details.

<figure><img src="../../../.gitbook/assets/image (8).png" alt=""><figcaption></figcaption></figure>

#### Step 2: View the handoff preview

In the **Conversation Information** panel, you can find the **Handoff details** section. Click **View details for handoff preview** to open the preview modal.

<figure><img src="../../../.gitbook/assets/image (9).png" alt=""><figcaption></figcaption></figure>

The modal displays:

* **Ticket priority**: The ticket priority based on Desk's priority rules.
* **Assigned team**: The assigned team based on Desk's assignment rules.
* **Updated ticket fields**: Desk ticket field values populated from the context object. For more information, see the [**Desk > Handoff**](handoff.md) guide.
* **Context object**: Full context data passed during handoff.

***

## Context object

When a handoff happens in Production environment, it passes customer-specific information called a context object and ticket information to Desk.&#x20;

{% include "../../../.gitbook/includes/sample-integration-desk-handoff-1.md" %}

***

### Prerequisites

* Context object setup
  * Context object is a key–value store that sends customer-specific information to the AI agent so it can provide relevant answers. It can include business details such as order numbers, membership tiers, or any other data the agent should know.
  * If you haven’t set up a context object yet, refer to the following guides.
    * [DASHBOARD GUIDE > Users > Pass a context object to AI agents](../../users.md#pass-a-context-object-to-ai-agents)
    * [SDK DOCS > iOS > Context object](../../../sdk-docs/ios/context-object.md)
    * [SDK DOCS > Android > Context object](../../../sdk-docs/android/context-object.md)
    * [SDK DOCS > JavaScript (CDN) > Context object](../../../sdk-docs/javascript-cdn/context-object.md)
    * [SDK DOCS > React (npm) > Context object](../../../sdk-docs/react-npm/context-object.md)
    * [PLATFORM API > Context object for messenger channel](../../../platform-api/context-object-for-messenger-channel.md)

***

### How to enable

#### Check your custom ticket fields

1. Go to **Settings > Desk > Ticket fields**.
2. Verify the ticket field keys you want to populate. If you don’t have any fields, create them.
3. Only ticket fields whose keys **exactly match** the context object’s field keys will be populated.

{% hint style="info" %}
The context object’s field keys must follow the Desk field key convention, using only lowercase letters, numbers, and dashes for this to work.
{% endhint %}

{% include "../../../.gitbook/includes/sample-integration-desk-handoff-2.md" %}

***

## What's next

### Trigger a handoff from the AI agent to Desk

Any ticket fields that match the context object’s fields will appear in the ticket fields section of the ticket view, so you don’t need to update the values manually.
