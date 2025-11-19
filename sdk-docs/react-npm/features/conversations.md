# Conversations

In Delight AI agent, a conversation refers to a channel where an AI Agent communicates with a user. Depending on your service requirements, you can allow users to maintain a single active conversation or multiple. Delight AI agent supports two different conversation modes: Single active conversation and Multiple active conversation mode, which is the default.

When the launcher is clicked, a user can be led to either their conversation list or a conversation depending on your choice of the conversation mode.

| Feature                       | Single active conversation                                                                                                      | Multiple active conversations (Default)                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Number of active conversation | A user can have only one active conversation with your AI agent at a time.                                                      | A user can have multiple active conversations with your AI agent at the same time.                                      |
| Starting a new conversation   | A new conversation can't be created if there is an active conversation at the moment. The existing conversation must end first. | New conversations can be created anytime using the `createConversation()` function from `useMessengerSessionContext()`. |

> **Note**: Whichever conversation mode you choose, if there is no active conversation, a new conversation is automatically created and the user can start a dialogue with your AI agent. This provides seamless user experience without requiring manual conversation setup.

This guide explains:

* [Conversations](conversations.md#conversations)
  * [Start a conversation](conversations.md#start-a-conversation)
    * [With `FixedMessenger`](conversations.md#with-fixedmessenger)
      * [Launch a conversation](conversations.md#launch-a-conversation)
      * [Launch a conversation list](conversations.md#launch-a-conversation-list)
      * [Set the launcher layout (position, margin, size)](conversations.md#set-the-launcher-layout)
      * [Customize the launcher appearance](conversations.md#customize-the-launcher-appearance)
    * [With direct presentation](conversations.md#with-direct-presentation)
  * [Advanced configuration](conversations.md#advanced-configuration)
    * [Context object for personalized conversation](conversations.md#context-object-for-personalized-conversation)
    * [Opening a specific conversation with channel URL](conversations.md#opening-a-specific-conversation-with-channel-url)
    * [Start a conversation in multiple conversation mode](conversations.md#start-a-conversation-in-multiple-conversation-mode)
  * [API Reference](conversations.md#api-reference)

***

## Start a conversation

Once you have determined which conversation mode to apply, you should also consider how the messenger will be launched. Delight AI agent SDK for React provides two launch methods: `FixedMessenger` and directly using the `Conversation` component. The following table describes the characteristics of each approach.

| Launch method             | Description                                                                                                            | Recommended use case                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| FixedMessenger            | Provides a floating launcher button that automatically manages conversation creation and navigation.                   | Ideal when you want a persistent, always-accessible AI agent across your application.                              |
| Direct Conversation Usage | Programmatically render the Conversation component directly, offering fine-grained control over layout and navigation. | Best for custom UI layouts, embedded conversations, or when you need full control over the conversation interface. |

### With `FixedMessenger`

`FixedMessenger` provides a floating UI approach for launching the messenger and starting a conversation.

#### Launch a conversation

The `entryPoint` prop allows you to lead the user to either a conversation view or a conversation list view. By default, the messenger launches a conversation view when the launcher is clicked. However, if there is no ongoing conversation for the user, mounting the `<FixedMessenger />` component automatically creates a conversation on click. If you wish to show a conversation list first, simply set `entryPoint` to `ConversationList`.

The launcher's appearance can be customized via the dashboard. For positioning and sizing customization, see [Launcher customization](conversations.md#launcher-customization).

```tsx
import { FixedMessenger } from '@sendbird/ai-agent-messenger-react';

// Basic launcher setup - automatically starts conversation when clicked.
// Configure messenger to open conversation directly (default behavior)
<FixedMessenger
  appId={'YOUR_APP_ID'}
  aiAgentId={'YOUR_AI_AGENT_ID'}
  entryPoint={'Conversation'}
/>
```

#### Launch a conversation list

You can configure the messenger to show the conversation list first:

```tsx
// Configure messenger to open conversation list
<FixedMessenger
  appId={'YOUR_APP_ID'}
  aiAgentId={'YOUR_AI_AGENT_ID'}
  entryPoint={'ConversationList'}
/>
```

#### Set the launcher layout

You can customize the launcher's position, margin, and size using the `FixedMessenger.Style` component.

![](https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-web-launcher.png)

> **Note**: On mobile devices, the messenger automatically opens in full-screen mode. On desktop, it displays as a floating mini-window anchored near the launcher.

The following example demonstrates all customization options together:

```tsx
import { FixedMessenger } from '@sendbird/ai-agent-messenger-react';

<FixedMessenger
  appId={'YOUR_APP_ID'}
  aiAgentId={'YOUR_AI_AGENT_ID'}
  entryPoint={'Conversation'}
  language={'en-US'}
  context={{ user_type: 'premium' }}
>
  <FixedMessenger.Style
    position={'start-bottom'}
    margin={{
      start: 20,
      bottom: 20
    }}
    launcherSize={48}
  />
</FixedMessenger>
```

* Position

Set the launcher position on the screen using the `position` prop. Available positions are: `start-top`, `start-bottom`, `end-top`, and `end-bottom`. The following table lists available position values:

| Position         | Description                                  |
| ---------------- | -------------------------------------------- |
| `'start-top'`    | Top-left corner of the screen.               |
| `'start-bottom'` | Bottom-left corner of the screen.            |
| `'end-top'`      | Top-right corner of the screen.              |
| `'end-bottom'`   | Bottom-right corner of the screen (default). |

* Margin

Adjust the spacing around the launcher using the `margin` prop. You can set margins for each side individually. The `margin` prop accepts an object with the following optional properties.

<table><thead><tr><th width="112.4375">Property</th><th width="110.078125">Type</th><th width="96.984375">Default</th><th>Description</th></tr></thead><tbody><tr><td><code>top</code></td><td>number</td><td>24</td><td>Top margin in pixels</td></tr><tr><td><code>bottom</code></td><td>number</td><td>24</td><td>Bottom margin in pixels</td></tr><tr><td><code>start</code></td><td>number</td><td>24</td><td>Start margin in pixels (left in LTR, right in RTL)</td></tr><tr><td><code>end</code></td><td>number</td><td>24</td><td>End margin in pixels (right in LTR, left in RTL)</td></tr></tbody></table>

* Size

Customize the launcher button size in pixels using the `launcherSize` prop. The default size is `48` pixels.

#### Customize the launcher appearance

The launcher's icon and color can be configured through the [Delight AI dashboard](https://dashboard.delight.ai) - no code changes required. Simply go to [**Build > Channels > Messenger**](https://dashboard.delight.ai/ai-agent/%7Bapplication-id%7D/channels/messenger/?active_tab=Appearance) in the dashboard and click on the **Appearance** tab to customize your launcher.

<figure><img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-messenger-appearance.png" alt=""><figcaption></figcaption></figure>

### With direct presentation

For advanced use cases where you need direct control over the conversation view without the floating launcher, you can use the `Conversation` component directly. This provides a full-screen or custom-sized conversation interface.

This approach is recommended when:

* You want to embed the conversation in a specific part of your UI.
* You need custom navigation or layout control.
* You want to build a full-page conversation experience.
* You need to open a specific conversation programmatically with its `channelUrl`.

The following snippet demonstrates how to render a conversation directly by wrapping the `Conversation` component with `AgentProviderContainer`.

```tsx
import { AgentProviderContainer, Conversation } from '@sendbird/ai-agent-messenger-react';

function DirectConversationView() {
  const [channelUrl, setChannelUrl] = useState<string | undefined>();

  return (
    <AgentProviderContainer
      appId={'YOUR_APP_ID'}
      aiAgentId={'YOUR_AI_AGENT_ID'}
      language={'en-US'}
      context={{ launch_source: 'direct_view' }}
    >
      <Conversation
        channelUrl={channelUrl}
        onClearChannelUrl={() => setChannelUrl(undefined)}
      />
    </AgentProviderContainer>
  );
}
```

***

## Advanced configuration

Beside the conversation mode, you can further configure how the conversation channels are created and built.

When a new conversation begins, you can pass over user information to the channel so that AI agent can provide more personalized assistance to the user. This information is contained in a `context` object, which can be set at the creation of the conversation.

Also, you can open a specific conversation channel by passing its URL, or manually create a new one while in multiple conversation mode.

#### Context object for personalized conversation

The `context` object allows you to provide user's information to AI agents for more personalized service, such as their country code and language preference. This context can be set when creating conversations to enhance the user experience. Use the `FixedMessenger` component props to configure these settings at the provider level.

```tsx
// Setting context through FixedMessenger props
<FixedMessenger
  appId={'YOUR_APP_ID'}
  aiAgentId={'YOUR_AI_AGENT_ID'}
  language={'en-US'}  // IETF BCP 47 format
  countryCode={'US'}  // ISO 3166 format
  context={{
    customer_tier: 'premium',
    previous_interaction: 'support_ticket_123',
    user_preferences: 'technical_support'
  }}
/>
```

### Opening a specific conversation with channel URL

You can open a specific conversation by passing its channel URL to the `Conversation` component. This is useful when you want to display a specific conversation directly without using the launcher.

```tsx
import { useState } from 'react';
import { FixedMessenger, Conversation, AgentProviderContainer } from '@sendbird/ai-agent-messenger-react';

// Using Conversation component directly to open specific conversation
function CustomMessengerView() {
  const [channelUrl] = useState('sendbird_group_channel_12345');

  return (
    <AgentProviderContainer
      appId={'YOUR_APP_ID'}
      aiAgentId={'YOUR_AI_AGENT_ID'}
    >
      <Conversation
        channelUrl={channelUrl}
        onClearChannelUrl={() => {/* Handle clear */}}
      />
    </AgentProviderContainer>
  );
}
```

### Start a conversation in multiple conversation mode

Multiple active conversation mode allows users to simultaneously communicate with your AI agent in different channels. In this case, use the `createConversation()` function from `useMessengerSessionContext()` to create a new conversation whenever needed.

> **Note**: In single conversation mode, a new conversation can't be created if there is an active conversation.

```tsx
import { useMessengerSessionContext } from '@sendbird/ai-agent-messenger-react';

function CreateConversationButton() {
  const { createConversation } = useMessengerSessionContext();

  const handleCreateConversation = async () => {
    try {
      const channelUrl = await createConversation({
        aiAgentId: 'YOUR_AI_AGENT_ID',
        language: 'en-US',
        country: 'US',
        context: {
          user_type: 'premium',
          session_id: 'session_123'
        }
      });

      console.log('Successfully created conversation:', channelUrl);

      // You can now use this channelUrl to open the specific conversation
      // See "With direct presentation" section for details

    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
  };

  return (
    <button onClick={handleCreateConversation}>
      Create New Conversation
    </button>
  );
}

// Usage within FixedMessenger context
<FixedMessenger
  appId={'YOUR_APP_ID'}
  aiAgentId={'YOUR_AI_AGENT_ID'}
>
  <CreateConversationButton />
</FixedMessenger>
```

***

## API Reference

### FixedMessenger Props

Configuration options for the `FixedMessenger` component.

<table><thead><tr><th width="155.2421875">Property</th><th width="202.49609375">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>appId</code></td><td>string</td><td>Your application ID. This is required.</td></tr><tr><td><code>aiAgentId</code></td><td>string</td><td>AI agent identifier for conversation target. This is required.</td></tr><tr><td><code>entryPoint</code></td><td>'Conversation' | 'ConversationList'</td><td>Which screen to show when the messenger is first loaded. (Default: <code>'Conversation'</code>)      </td></tr><tr><td><code>userSessionInfo</code></td><td>ManualSessionInfo | AnonymousSessionInfo</td><td>User session information for authentication.</td></tr><tr><td><code>language</code></td><td>string</td><td>Language setting following IETF BCP 47 format (e.g., "en-US", "ko-KR"). (Default: <code>navigator.language</code>)</td></tr><tr><td><code>countryCode</code></td><td>string</td><td>Country code following ISO 3166 format (e.g., "US", "KR").</td></tr><tr><td><code>context</code></td><td>Record&#x3C;string, string></td><td>Context object for personalized AI agent responses.</td></tr><tr><td><code>queryParams</code></td><td>AIAgentQueryParams</td><td>Global default query parameters for AI agent.</td></tr><tr><td><code>config</code></td><td>AIAgentConfig</td><td>Global default configuration for AI agent.</td></tr><tr><td><code>theme</code></td><td>object</td><td>Theme customization for palette and typography.</td></tr><tr><td><code>stringSet</code></td><td>Partial</td><td>Localization string set for the messenger.</td></tr><tr><td><code>logLevel</code></td><td>LogLevel</td><td>Log level for the AI agent client. (Default: <code>LogLevel.WARN</code>)</td></tr><tr><td><code>dir</code></td><td>'ltr' | 'rtl'</td><td>Text direction for the widget.</td></tr><tr><td><code>entryStyle</code></td><td>CSSProperties</td><td>Custom CSS styles for the entry container element.</td></tr><tr><td><code>rootElement</code></td><td>HTMLElement</td><td>Root HTML element to which the messenger will be appended. (Default: <code>LogLevel.WARN</code>)</td></tr><tr><td><code>state</code></td><td>object</td><td>Custom state management for opened/expanded states.</td></tr></tbody></table>

### FixedMessenger.Style Props

Configuration options for customizing the launcher appearance.

<table><thead><tr><th width="132.12109375">Property</th><th width="312.890625">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>position</code></td><td>'start-top' | 'start-bottom' | 'end-top' | 'end-bottom'</td><td>Position of the launcher button. (Default: <code>'end-bottom'</code>)</td></tr><tr><td><code>margin</code></td><td>Partial&#x3C;{ top: number; bottom: number; start: number; end: number }></td><td>Margin around the launcher. (Default: 24 for all dicrections)</td></tr><tr><td><code>launcherSize</code></td><td>number</td><td>Size of the launcher button in pixels. (Default: 48)</td></tr></tbody></table>

### Conversation Props

Configuration options for the `Conversation` component.

<table><thead><tr><th width="261.9765625">Property</th><th width="102.59765625">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>channelUrl</code></td><td>string</td><td>Channel URL to open. If not provided, uses active channel from context.</td></tr><tr><td><code>onClearChannelUrl</code></td><td>() => void</td><td>Callback when channel URL should be cleared.</td></tr><tr><td><code>onNavigateToConversationList</code></td><td>() => void</td><td>Callback to navigate to conversation list.</td></tr><tr><td><code>shouldMarkAsRead</code></td><td>boolean</td><td>Whether to mark messages as read when viewed. (Default: <code>false</code>)</td></tr></tbody></table>

### useMessengerSessionContext Hook

Access to messenger session context and conversation management functions.

* Key Properties

<table><thead><tr><th width="151.0625">Property</th><th width="150.890625">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>sdkUser</code></td><td>User | null</td><td>Sendbird Chat SDK user object.</td></tr></tbody></table>

* Methods

| Method                 | Parameters                       | Return Type | Description                                             |
| ---------------------- | -------------------------------- | ----------- | ------------------------------------------------------- |
| `createConversation`   | params: ConversationCreateParams | Promise     | Creates a new conversation and returns the channel URL. |
| `refreshActiveChannel` | -                                | Promise     | Refreshes the active channel and returns URL.           |
| `authenticate`         | -                                | Promise     | Authenticates the user session.                         |
| `deauthenticate`       | -                                | Promise     | Deauthenticates the user session.                       |

### ConversationCreateParams

Parameters for creating new conversations.

<table><thead><tr><th width="172.9765625">Property</th><th width="187.9453125">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>aiAgentId</code></td><td>string</td><td>AI agent identifier. This is required.</td></tr><tr><td><code>language</code></td><td>string</td><td>Language code (IETF BCP 47).</td></tr><tr><td><code>country</code></td><td>string</td><td>Country code (ISO 3166).</td></tr><tr><td><code>context</code></td><td>Record&#x3C;string, string></td><td>Additional metadata for AI agent.</td></tr></tbody></table>
