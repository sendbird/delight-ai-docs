# Messages

In Delight AI agent, users can exchange text, image, and file messages with AI agents. AI agents can also send rich template-based messages to provide interactive experiences. This enables comprehensive and engaging conversations across different use cases.

This guide covers:
- [Types](#types)
    - [Text Message](#text-message)
    - [Image Message](#image-message)
    - [File Message](#file-message)
    - [Rich Message](#rich-message)
- [Key features](#key-features)
    - [Read receipt](#read-receipt)
    - [Citation](#citation)
    - [Special notice](#special-notice)
- [API references](#api-references)

---

## Types

Delight AI agent supports the following message types for communication between users and AI agents.

| Type                                       | Description                                 | Content format                      | Use cases                                                                  |
| ------------------------------------------ | ------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| [Text message](messages.md#text-message)   | Regular text-based communication            | Plain text                          | Basic conversational interactions, Q\&A, general dialogue                  |
| [Image message](messages.md#image-message) | Visual file sharing                         | Image files in `PNG` and `JPG` only | Visual communication, screenshots, diagrams                                |
| [File message](messages.md#file-message)   | Document and file sharing                   | Various file formats                | Document sharing, attachments, downloadable resources                      |
| [Rich message](messages.md#rich-message)   | Template-based messages with interactive UI | Structured JSON templates           | Product displays, carousels, CTAs and more. See below section for details. |

### Text message

Text messages are the foundation of conversational interactions between users and AI agents.

* Content: Plain text with Markdown support.
* Use case: Basic conversational interactions.

### Image message

Image messages allow users to share visual content within conversations.

* Supported formats: `JPEG` and `PNG` only. Can be sent with text.
* Use case: Sharing screenshots, diagrams, and visual content.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-image-message2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

> __Note__: Once handed off to a human agent, users can send image files in any format.

### File message

File messages allow users to share documents within conversations.

* Supported formats: `PDF` only. Can be sent with text.
* Use case: Document sharing and file attachments.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-file-message2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

### Rich message

Rich messages use predefined templates to create interactive message experiences. You can configure these templates through the **Delight AI dashboard**.

#### Call to Action (CTA) button

CTA messages contain a button that allows users to take specific actions directly from the conversation. The button opens an external URL in a web browser.

* Components: A single button linking to an external webpage. Custom link formats are not supported.
* Use case: Action-oriented user interactions.
* Configuration: Configure through **Workspace settings > Shared assets > Message templates** in **Delight AI dashboard**.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-cta2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### Carousel

Carousel messages present multiple items in a horizontally scrollable format. Users can browse through various options or content pieces.

* Layout: Horizontal scrolling interface.
* Content: Multiple items with individual interactions.
* Use case: Product showcases, option selection, content browsing.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-carousel2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### Suggested replies

Suggested replies provide predefined quick response options for users. This enables faster conversation flow by offering common responses.

* Functionality: Quick response selection.
* Use case: Streamlined user interactions and faster response times.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-suggested-replies2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### CSAT message

CSAT messages collect user feedback for customer satisfaction surveys within conversations.

* Purpose: Customer satisfaction measurement.
* Components: Rating system and feedback collection.
* Use case: Service quality assessment and user experience evaluation.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-csat2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### Product list

Product list messages display product information in a vertical scrolling format. Unlike Carousel, the vertical layout is optimized for product browsing and selection.

* Layout: Vertical scrolling interface.
* Content: Product information and details.
* Use case: E-commerce integration, product showcases, inventory display.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/aa-sdk-mobile-message-product-list.png" alt="cascade" width="375">
  <figcaption></figcaption>
</figure>

#### Custom message template

Custom message templates allow you to implement business-specific UI components beyond predefined templates. The Delight AI agent server sends structured data that you render with your own custom UI components.

**Core features**

- **Data delivery**: You receive templates in the `custom_message_templates` array within the message's `extendedMessagePayload`. You handle UI rendering.
- **Multiple templates**: A single message can include multiple templates, each representing different UI elements.
- **Backward compatibility**: Unregistered template IDs trigger fallback UI, preventing application breakage.

**Data structure**

The `CustomMessageTemplateData` interface has the following structure:

```kotlin
data class CustomMessageTemplateData(
    val id: String,              // Unique template identifier matching dashboard configuration
    val response: Response,
    val error: String?           // Failure reason, if applicable
) {
    data class Response(
        val status: Int,         // HTTP request status code
        val content: String?     // Message content payload (JSON string)
    )
}
```

**Implementation steps**

**1. Understand the message layout**

Custom templates render in a dedicated slot within the message structure. They appear below the standard message content.
```
┌──────────────────────────────────────────────────────────┐
│                      <MessageBubble>                     │
│   ┌──────────────────────────────────────────────────┐   │
│   │                    <Message>                     │   │
│   └──────────────────────────────────────────────────┘   │
│   ┌──────────────────────────────────────────────────┐   │
│   │                  <CTAButton>                     │   │
│   └──────────────────────────────────────────────────┘   │
│   ┌──────────────────────────────────────────────────┐   │
│   │                  <Citation>                      │   │
│   └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│                   <MessageTemplate>                      │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│            <CustomMessageTemplateSlot>                   │
│        (Place CustomMessageTemplate here)                │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│                      <Feedback>                          │
└──────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────┐
│                 <SuggestedReplies>                       │
└──────────────────────────────────────────────────────────┘
```

**2. Register a custom handler**

Implement `CustomMessageTemplateViewHandler` and set it in `ConversationMessageListUIParams`.

```kotlin
class MyCustomTemplateHandler : CustomMessageTemplateViewHandler {
    override fun onCreateCustomMessageTemplateView(
        context: Context,
        message: BaseMessage,
        data: List<CustomMessageTemplateData>,
        callback: CustomMessageTemplateViewCallback
    ) {
        val view = when (data.firstOrNull()?.id) {
            "product_card" -> createProductCard(context, data.first())
            else -> createFallbackView(context)
        }
        callback.onViewReady(view)
    }

    private fun createProductCard(context: Context, data: CustomMessageTemplateData): View {
        val content = data.response.content ?: return createFallbackView(context)
        return LayoutInflater.from(context).inflate(R.layout.custom_product_card, null).apply {
            // Populate view with data from JSON content
        }
    }

    private fun createFallbackView(context: Context): View {
        return TextView(context).apply {
            text = "Template not available"
            setPadding(16, 16, 16, 16)
        }
    }
}

// Register handler
AIAgentAdapterProviders.conversation =
    ConversationAdapterProvider { channel, uiParams, containerGenerator ->
        uiParams.customMessageTemplateViewHandler = MyCustomTemplateHandler()
        ConversationMessageListAdapter(
            channel,
            uiParams,
            containerGenerator
        )
    }
```

**3. Process template data**

You can access custom template data from the message.

```kotlin
val customTemplates = message.extendedMessagePayload["custom_message_templates"]
// SDK automatically parses this to List<CustomMessageTemplateData>
```

**4. Handle exceptions**

Implement error handling for various failure scenarios.

```kotlin
override fun onCreateCustomMessageTemplateView(
    context: Context,
    message: BaseMessage,
    data: List<CustomMessageTemplateData>,
    callback: CustomMessageTemplateViewCallback
) {
    try {
        // Check for errors in data
        val templateData = data.firstOrNull()
        if (templateData?.error != null) {
            callback.onViewReady(createErrorView(context, templateData.error))
            return
        }

        // Validate response status
        when (templateData?.response?.status) {
            200 -> callback.onViewReady(createTemplateView(context, templateData))
            else -> callback.onViewReady(createErrorView(context, "Failed to load template"))
        }
    } catch (e: Exception) {
        callback.onViewReady(createErrorView(context, "Template error"))
    }
}
```

**Error handling patterns**

**Unregistered templates**: Return fallback UI for unknown template IDs.
```kotlin
when (templateData.id) {
    "known_template" -> createKnownTemplate(context, data)
    else -> createFallbackView(context)
}
```

**API failures**: Check response status and error field.
```kotlin
if (data.error != null) return createErrorView(context, data.error)
if (data.response.status != 200) return createErrorView(context, "API error")
```

**Runtime errors**: Wrap handler logic in try-catch. The SDK also wraps calls to prevent crashes.
```kotlin
try {
    callback.onViewReady(createView(context, data))
} catch (e: Exception) {
    callback.onViewReady(createFallbackView(context))
}
```

---

## Key features

Delight AI agent supports the following message features:

* [Read receipt](messages.md#read-receipt)
* [Citation](messages.md#citation)
* [Special notice](messages.md#special-notice)

### Read receipt

You can display read status on messages to indicate when they have been viewed. By default, read status is not displayed. You can enable it through `AIAgentMessenger.config`.

```kotlin
// Enable message receipt state
AIAgentMessenger.config.conversation.list.enableMessageReceiptState = true
```

### Citation

Citation displays source information for AI agent responses. Users can see the references that the AI agent used to generate its responses. This provides transparency and credibility to the AI agent's answers.

* Default: Disabled.
* Configuration: Configure through **Delight AI dashboard** to display citations.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-citation2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

### Special notice

Special notice displays important information to users before a conversation starts. You can use this to communicate guidelines, terms, or instructions at the beginning of user interactions.

* Display location: Bottom of the screen.
* Behavior: Automatically disappears when a conversation starts.
* Configuration: Configure through **Delight AI dashboard**.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-special-notice2.png" alt="special_notice" width="375">
  <figcaption></figcaption>
</figure>

---

## API references

### ConversationConfig

`ConversationConfig` provides configuration options for the conversation screen. It contains the following sub-configurations: `header`, `list`, and `input`.

#### ConversationConfig.Header

The following table lists the configuration options for the conversation header.

| Property | Type | Description |
| -------- | ---- | ----------- |
| `shouldShowProfile` | Boolean | Determines whether to show the profile in the conversation header. (Default: `true`) |

```kotlin
// Hide profile in conversation header
AIAgentMessenger.config.conversation.header.shouldShowProfile = false

// Show profile in conversation header
AIAgentMessenger.config.conversation.header.shouldShowProfile = true
```

#### ConversationConfig.List

The following table lists the configuration options available in `AIAgentMessenger.config.conversation.list`. These options control how the conversation list and messages are displayed.

| Property | Type | Description |
| -------- | ---- | ----------- |
| `enableMessageReceiptState` | Boolean | Determines whether to display message receipt status. (Default: `false`) |
| `shouldShowSenderProfile` | Boolean | Determines whether to show sender's profile information. (Default: `true`) |
| `scrollMode` | ScrollMode | Determines scroll behavior of the message list. `AUTO` for normal scroll, `FIX` to keep user message fixed at the top during bot responses. (Default: `ScrollMode.AUTO`) |
| `shouldShowMessageFooterView` | Boolean | Determines whether the **Start new conversation** view is shown when the conversation has ended. (Default: `true`) |
| `enableNewMessageIndicator` | Boolean | Determines whether the new message indicator is enabled. (Default: `true`) |

```kotlin
// Configure conversation list settings
AIAgentMessenger.config.conversation.list.enableMessageReceiptState = true
AIAgentMessenger.config.conversation.list.shouldShowSenderProfile = false
AIAgentMessenger.config.conversation.list.scrollMode = ScrollMode.FIX
AIAgentMessenger.config.conversation.list.shouldShowMessageFooterView = false
AIAgentMessenger.config.conversation.list.enableNewMessageIndicator = false
```

#### ConversationConfig.Input

The following table lists the configuration options available in `AIAgentMessenger.config.conversation.input`. These options control the message input component and attachment capabilities.

| Property | Type | Description |
| -------- | ---- | ----------- |
| `camera.enablePhoto` | Boolean | Determines whether photo capture from camera is enabled. (Default: `true`) |
| `gallery.enablePhoto` | Boolean | Determines whether photo selection from gallery is enabled. (Default: `true`) |
| `enableFile` | Boolean | Determines whether file attachment is enabled. (Default: `true`) |

```kotlin
// Configure input settings
AIAgentMessenger.config.conversation.input.camera.enablePhoto = false
AIAgentMessenger.config.conversation.input.gallery.enablePhoto = false
AIAgentMessenger.config.conversation.input.enableFile = false
```
