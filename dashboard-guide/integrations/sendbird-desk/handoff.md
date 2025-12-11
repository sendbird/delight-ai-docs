# Handoff

When an AI agent hands off a conversation to a human agent in Desk, it passes customer-specific information called a context object. Desk uses this context object when creating or updating a ticket, automatically populating any ticket fields that match the fields in the context object.

{% include "../../../.gitbook/includes/sample-integration-desk-handoff-1.md" %}

***

## Prerequisites

* Context object setup
  * Context object is a key–value store that sends customer-specific information to the AI agent so it can provide relevant answers. It can include business details such as order numbers, membership tiers, or any other data the agent should know.
  * If you haven’t set up a context object yet, refer to the following guides.
    * [DASHBOARD GUIDE > Users > Pass a context object to AI agents](../../users.md#pass-a-context-object-to-ai-agents)&#x20;
    * [SDK DOCS > iOS > Context object](../../../sdk-docs/ios/context-object.md)
    * [SDK DOCS > Android > Context object](../../../sdk-docs/android/context-object.md)
    * [SDK DOCS > JavaScript (CDN) > Context object](../../../sdk-docs/javascript-cdn/context-object.md)
    * [SDK DOCS > React (npm) > Context object](../../../sdk-docs/react-npm/context-object.md)
    * [PLATFORM API > Context object for messenger channel](../../../platform-api/context-object-for-messenger-channel.md)

***

## How to enable

### Check your custom ticket fields

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
