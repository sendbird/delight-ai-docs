# Messages

You can exchange text, images, files, and rich templates between the AI agent and users. This allows you to build interactive conversations across many use cases.

This guide covers:
- Types
- Key features
- API references

To learn more, see [API references](#api-references).

---

## Types

Delight AI agent messenger supports multiple message types. Each type maps to a distinct content format and UI behavior.

<div component="AdvancedTable" type="3A">

| Type | Description | Content format | Use cases |
| --- | --- | --- | --- |
| [Text message](messages.md#text-message) | Plain text communication | Plain text | Conversational interactions, Q&A, general dialogue |
| [Image message](messages.md#image-message) | Visual file sharing | Image files in `PNG` and `JPG` only | Visual communication, screenshots, diagrams |
| [File message](messages.md#file-message) | Document and file sharing | Various file formats | Document sharing, attachments, downloadable resources |
| [Rich message](messages.md#rich-message) | Template-based messages with interactive UI | Structured JSON templates | Product displays, carousels, CTAs, and more |

</div>

### Text message

**Text message** represents plain text communication between users and AI agents.

Text content supports Markdown. This allows you to format lists, links, and inline emphasis.

### Image message

**Image message** lets you share images in a conversation. Supported formats include `JPEG` and `PNG`.

You can send an image with optional text. On the other hand, once a conversation is handed off to a human agent, users can upload images in any format.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-image-message2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

> __Note__: The human-agent handoff allows any image format.

### File message

**File message** lets you share files in a conversation. Supported formats include `PDF`.

You can send a file with optional text. This allows you to attach documents and share resources.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-file-message2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

### Rich message

**Rich message** uses predefined templates to create interactive message layouts. You configure these templates in the Delight AI dashboard.

#### Call to action (CTA) button

**CTA** messages include a single button that opens an external URL.

You can configure the CTA through the dashboard. This allows you to drive users to external flows.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-cta2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### Carousel

**Carousel** messages display multiple items in a horizontal scroll view.

You can use a carousel for product showcases or content browsing. This allows you to present multiple options in a compact layout.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-carousel2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### Suggested replies

**Suggested replies** provide quick responses for the user.

You can use suggested replies to reduce typing. This allows you to speed up conversation flow.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-suggested-replies2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### CSAT message

**CSAT message** collects customer satisfaction feedback.

You can use CSAT messages to measure service quality. This allows you to track experience at the end of a flow.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-csat2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### Product list

**Product list** messages show items in a vertical list.

You can use a product list for browsing or inventory displays. This allows you to present richer item details than a carousel.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/aa-sdk-mobile-message-product-list.png" alt="cascade" width="375">
  <figcaption></figcaption>
</figure>

#### Custom message template

**Custom message template** lets you render business-specific UI beyond pre-defined templates. The Delight AI agent server sends structured data, and you render it with your own UI components. This allows you to ship domain-specific experiences without changing the message model.

**Core features**

- **Data delivery**: Templates arrive in the `custom_message_templates` array under `extendedMessagePayload`. You parse the array and render the UI.
- **Multiple templates**: One message can include multiple templates, each representing a distinct UI element. You can also map each template to a different view.
- **Backward compatibility**: Unknown template IDs should fall back to a safe UI to avoid crashes.

**Data structure**

The `CustomMessageTemplateData` interface defines the payload you receive.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
data class CustomMessageTemplateData(
    val id: String,              // Template identifier from the dashboard
    val response: Response,
    val error: String?           // Failure reason, if applicable
) {
    data class Response(
        val status: Int,         // HTTP request status code
        val content: String?     // Message content payload (JSON string)
    )
}
```
</div>

`id` specifies the template identifier configured in the dashboard. `response.status` indicates the HTTP status code from the agent server. `response.content` determines the JSON payload you render. `error` indicates a server-side failure reason.

**Implementation steps**

**1. Understand the message layout**

Custom templates render in a dedicated slot under the standard message content.
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

You can register a handler by passing `customMessageTemplateViewHandler` in `ConversationMessageListUIParams`.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
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
</div>

**3. Process template data**

You can access custom templates by reading `custom_message_templates` from `extendedMessagePayload`. If you don't specify `custom_message_templates`, the message renders without a custom template.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
val customTemplates = message.extendedMessagePayload["custom_message_templates"]
// SDK automatically parses this to List<CustomMessageTemplateData>
```
</div>

**4. Handle exceptions**

Wrap rendering logic and return a fallback view when errors occur. On the other hand, you should still return a view for recoverable errors so the message list remains stable.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
override fun onCreateCustomMessageTemplateView(
    context: Context,
    message: BaseMessage,
    data: List<CustomMessageTemplateData>,
    callback: CustomMessageTemplateViewCallback
) {
    try {
        val templateData = data.firstOrNull()
        if (templateData?.error != null) {
            callback.onViewReady(createErrorView(context, templateData.error))
            return
        }

        when (templateData?.response?.status) {
            200 -> callback.onViewReady(createTemplateView(context, templateData))
            else -> callback.onViewReady(createErrorView(context, "Failed to load template"))
        }
    } catch (e: Exception) {
        callback.onViewReady(createErrorView(context, "Template error"))
    }
}
```
</div>

**Error handling patterns**

**Unregistered templates**

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
when (templateData.id) {
    "known_template" -> createKnownTemplate(context, data)
    else -> createFallbackView(context)
}
```
</div>

**API failures**

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
if (data.error != null) return createErrorView(context, data.error)
if (data.response.status != 200) return createErrorView(context, "API error")
```
</div>

**Runtime errors**

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
try {
    callback.onViewReady(createView(context, data))
} catch (e: Exception) {
    callback.onViewReady(createFallbackView(context))
}
```
</div>

To learn more, see [Custom message template](#custom-message-template).

---

## Key features

The SDK supports these message features in Delight AI agent:

- Read receipt
- Citation
- Special notice

### Read receipt

Read receipt indicates when a message is viewed. If you don't specify the setting, the SDK does not show read status.

You can enable read receipt by passing `enableMessageReceiptState`.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
AIAgentMessenger.config.conversation.list.enableMessageReceiptState = true
```
</div>

### Citation

Citation shows source information for AI agent responses. This allows you to display the references used to generate an answer.

Citation requires dashboard configuration to appear in the UI. If you don't specify the dashboard setting, the SDK hides the citation view.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-citation2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

### Special notice

Special notice shows important information before a conversation starts. You can also use this section to present guidelines or terms.

To learn more, see [API references](#api-references).

## API references

This section provides message-related configuration references.

### ConversationConfig

`ConversationConfig` provides configuration options for the conversation screen. The configuration is split into `header` and `list`.

#### ConversationConfig.Header

`shouldShowProfile` determines whether the profile appears in the conversation header. If you don't specify `shouldShowProfile`, the SDK shows the profile.

<div component="AdvancedTable" type="3A">

| Property name | Description | Default value |
| --- | --- | --- |
| `shouldShowProfile` | Whether the profile is shown in the conversation header | `true` |

</div>

You can show or hide the profile by passing `shouldShowProfile`.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
AIAgentMessenger.config.conversation.header.shouldShowProfile = false
AIAgentMessenger.config.conversation.header.shouldShowProfile = true
```
</div>

#### ConversationConfig.List

These properties configure the conversation list UI.

`enableMessageReceiptState` determines whether the list shows read receipts. `shouldShowSenderProfile` indicates whether sender profile images appear. `scrollMode` specifies the scrolling behavior. `shouldShowMessageFooterView` indicates whether the end-of-conversation footer appears. `enableNewMessageIndicator` specifies whether the new message indicator appears.

<div component="AdvancedTable" type="3A">

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `enableMessageReceiptState` | Boolean | `false` | Whether to display message receipt status |
| `shouldShowSenderProfile` | Boolean | `true` | Whether to show sender profile information |
| `scrollMode` | ScrollMode | `ScrollMode.AUTO` | Scroll behavior of the message list. `AUTO` for normal scroll, `FIX` to keep user messages fixed at the top during bot responses |
| `shouldShowMessageFooterView` | Boolean | `true` | Whether the "Start new conversation" view is shown when a conversation ends |
| `enableNewMessageIndicator` | Boolean | `true` | Whether the new message indicator is enabled |

</div>

You can configure the conversation list by passing these properties on `AIAgentMessenger.config.conversation.list`.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
AIAgentMessenger.config.conversation.list.enableMessageReceiptState = true
AIAgentMessenger.config.conversation.list.shouldShowSenderProfile = false
AIAgentMessenger.config.conversation.list.scrollMode = ScrollMode.FIX
AIAgentMessenger.config.conversation.list.shouldShowMessageFooterView = false
AIAgentMessenger.config.conversation.list.enableNewMessageIndicator = false
```
</div>

#### ConversationConfig.Input

These properties configure the input component and attachment capabilities.

`camera.enablePhoto` determines whether photo capture is enabled. `gallery.enablePhoto` indicates whether photo selection from the gallery is enabled. `enableFile` specifies whether file attachments are enabled.

<div component="AdvancedTable" type="3A">

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `camera.enablePhoto` | Boolean | `true` | Whether photo capture from camera is enabled |
| `gallery.enablePhoto` | Boolean | `true` | Whether photo selection from gallery is enabled |
| `enableFile` | Boolean | `true` | Whether file attachment is enabled |

</div>

You can configure the input component by passing these properties on `AIAgentMessenger.config.conversation.input`.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
AIAgentMessenger.config.conversation.input.camera.enablePhoto = false
AIAgentMessenger.config.conversation.input.gallery.enablePhoto = false
AIAgentMessenger.config.conversation.input.enableFile = false
```
</div>
