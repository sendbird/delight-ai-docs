---
hidden: true
---

# Personalize with AI

**Personalize with AI** lets your AI agent dynamically generate a welcome message and suggested replies tailored to each user. Instead of showing a fixed message, the AI agent references the user's past conversations, external data from API tool calls, and conversation-specific context to compose a relevant first message.

## How it works

To personalize messages, the AI agent can use the following sources:

* **User memory**: AI agent can sift through recent conversations — and all of their messages — and reference them to create more user-specific messages.&#x20;
* [**API data**](../../../../shared-assets/tools.md): Using Tools you've preset, AI agent can pull user-related data from your server and customize the welcome message or suggested replies to enhance communication efficiency.
* [**Context object**](../../../../../platform-api/context-object-for-messenger-channel.md): you can store an additional set of user-related data in a `context` object of each conversation. AI agent would also refer to the information in the object when generating a FYC message.

<figure><img src="../../../../../.gitbook/assets/Group 1000005079.png" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
This feature also requires deployment for live action. Make sure deploy the change up to **Production**.
{% endhint %}

## How to use

1. Navigate to **Build > Channels > Messenger** in the left menu bar of Delight AI agent dashboard.
2. In the **Conversation settings** tab, toggle on **Welcome message & suggested replies** under **Start a conversation**.
3. Toggle on **Personalize with AI** to let AI agent dynamically generate the welcome message and suggested replies when a conversation opens.
4. Select whether AI agent can access **User memory** and **API data**. For more personalized assistance, we recommend you enable both.
5. Provide **Instructions for AI**, **Welcome message example**, and **Suggested reply example**. AI agent will refer to the instructions and examples when generating messages.
6. As a fallback, add a default welcome message under **Language** that can be used when the AI agent can't generate a personalized message.

{% hint style="warning" %}
#### Message behavior - When **Personalize with AI** is enabled

• Language-specific welcome messages are ignored. \
• The default welcome message is used if the AI agent fails to generate a personalized message within five seconds.
{% endhint %}

<figure><img src="../../../../../.gitbook/assets/image.png" alt=""><figcaption></figcaption></figure>
