# Messages

In Delight AI agent messenger, you can exchange text, images, files, and rich template-based messages. This allows you to build interactive conversations across many use cases.

This guide explains Types, Key features, and API references.

---

## Types

Delight AI agent messenger supports multiple message types. Each type maps to a content format and UI behavior.

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

Content: Plain text. You can also use Markdown for formatting.
Use case: Basic conversational interactions.
Support: Full text rendering with proper formatting.

### Image message

**Image message** lets you share images in a conversation.

Supported formats: `JPEG`, `PNG` only. You can send an image with text.
Use case: Sharing visual content.
Display: Optimized image rendering with proper scaling.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-image-message2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

> __Note__: Once a conversation is handed off to a human agent, users can send image files in any format.

### File message

**File message** lets you share files in a conversation.

Supported formats: `PDF` only. You can send a file with text.
Use case: Document sharing and file-based communication.
Display: File preview with download capabilities.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-file-message2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

### Rich message

**Rich message** uses predefined templates to create interactive message layouts. You configure these templates in the Delight AI dashboard.

#### Call to action (CTA) button

**CTA** messages include a button that opens an external URL in a web browser.

Components: A single button that links to an external webpage. Custom link formats are not supported.
Use case: Action-oriented user interactions.
Configuration: Available through dashboard template configuration.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-cta2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### Carousel

**Carousel** messages present multiple items that users can horizontally scroll.

Layout: Horizontal scrolling interface.
Content: Multiple items with individual interactions.
Use case: Product showcases, option selection, content browsing.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-carousel2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### Suggested replies

**Suggested replies** provide predefined quick responses for users.

Functionality: Quick response selection.
Use case: Streamlined user interactions and faster response times.
Display: Accessible quick reply buttons.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-suggested-replies2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### CSAT message

**CSAT message** collects customer satisfaction feedback within conversations.

Purpose: Customer satisfaction measurement.
Components: Rating systems and feedback collection.
Use case: Service quality assessment and user experience evaluation.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-csat2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

#### Product list

**Product list** messages display product information in a vertical scrolling format.

Layout: Vertical scrolling interface.
Content: Product information and details.
Use case: E-commerce integration, product showcases, inventory display.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/aa-sdk-mobile-message-product-list.png" alt="cascade" width="375">
  <figcaption></figcaption>
</figure>

#### Custom message template

**Custom message template** lets you render business-specific UI beyond pre-defined templates. The Delight AI agent server sends structured data, and you render it with your own UI components.

**Core features**

- **Data delivery**: Templates arrive as a `custom_message_templates` array in `extendedMessagePayload`. You parse the array and render the UI.
- **Multiple templates**: One message can include multiple templates, each representing a distinct UI element.
- **Backward compatibility**: Unknown template IDs should fall back to a safe UI to prevent application breakage.

**Data structure**

The `CustomMessageTemplateData` interface defines the payload.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
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
</div>

`id` indicates the template identifier configured in the dashboard. `response.status` specifies the HTTP status code from the agent server. `response.content` specifies the JSON payload you render. `error` indicates a server-side failure reason.

**Implementation steps**

**1. Understand the message layout**

Custom templates render in a dedicated slot within the message structure, below the standard message content.
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

You can access custom template data from the message.

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

**Unregistered templates**: Return fallback UI for unknown template IDs.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
when (templateData.id) {
    "known_template" -> createKnownTemplate(context, data)
    else -> createFallbackView(context)
}
```
</div>

**API failures**: Check response status and error field.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
if (data.error != null) return createErrorView(context, data.error)
if (data.response.status != 200) return createErrorView(context, "API error")
```
</div>

**Runtime errors**: Wrap handler logic in try-catch. The SDK also wraps calls to prevent crashes.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
try {
    callback.onViewReady(createView(context, data))
} catch (e: Exception) {
    callback.onViewReady(createFallbackView(context))
}
```
</div>

---

## Key features

The core features supported for messages in Delight AI agent include Read receipt, Citation, and Special notice.

### Read receipt

Read receipt indicates when a message is viewed. If you don't specify `enableMessageReceiptState`, the SDK does not show read status.

You can enable read receipt by passing `enableMessageReceiptState`.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
AIAgentMessenger.config.conversation.list.enableMessageReceiptState = true
```
</div>

### Citation

**Citation** displays source information for AI agent responses. This allows you to show the references used to generate each response.

Citation requires dashboard configuration to appear in the UI. If you don't specify the dashboard setting, the SDK hides the citation view.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-citation2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

### Special notice

**Special notice** displays important information before a conversation starts. You can also use this section to present guidelines or terms.

---

## API references

The following table provides API reference information for message-related functionality.

### ConversationConfig

The `ConversationConfig` class provides configuration options for the conversation screen. The configuration is split into `header` and `list`.

#### ConversationConfig.Header

`shouldShowProfile` indicates whether the profile is shown in the conversation header. If you don't specify `shouldShowProfile`, the SDK shows the profile.

<div component="AdvancedTable" type="3A">

| Property name | Description | Default value |
| --- | --- | --- |
| `shouldShowProfile` | Whether the profile is shown in the conversation header | `true` |

</div>

You can show or hide the profile by passing `shouldShowProfile`.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
// Hide profile in conversation header
AIAgentMessenger.config.conversation.header.shouldShowProfile = false

// Show profile in conversation header
AIAgentMessenger.config.conversation.header.shouldShowProfile = true
```
</div>

#### ConversationConfig.List

The following table lists the configuration options available in `AIAgentMessenger.config.conversation.list` besides read receipt.

`enableMessageReceiptState` determines whether the list shows read receipts. `shouldShowSenderProfile` indicates whether sender profile images appear. `scrollMode` specifies the scroll behavior. `shouldShowMessageFooterView` indicates whether the "Start new conversation" view is shown when a conversation ends. `enableNewMessageIndicator` specifies whether the new message indicator is enabled.

<div component="AdvancedTable" type="3A">

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `enableMessageReceiptState` | Boolean | `false` | Whether to display message receipt status |
| `shouldShowSenderProfile` | Boolean | `true` | Whether to show sender's profile information |
| `scrollMode` | ScrollMode | `ScrollMode.AUTO` | Scroll behavior of the message list. `AUTO` for normal scroll, `FIX` to keep user messages fixed at the top during bot responses |
| `shouldShowMessageFooterView` | Boolean | `true` | Whether the "Start new conversation" view is shown when a conversation ends |
| `enableNewMessageIndicator` | Boolean | `true` | Whether the new message indicator is enabled |

</div>

You can configure the conversation list by passing these properties on `AIAgentMessenger.config.conversation.list`.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
// Configure conversation list settings
AIAgentMessenger.config.conversation.list.enableMessageReceiptState = true
AIAgentMessenger.config.conversation.list.shouldShowSenderProfile = false
AIAgentMessenger.config.conversation.list.scrollMode = ScrollMode.FIX
AIAgentMessenger.config.conversation.list.shouldShowMessageFooterView = false
AIAgentMessenger.config.conversation.list.enableNewMessageIndicator = false
```
</div>

#### ConversationConfig.Input

The following table lists the configuration options available in `AIAgentMessenger.config.conversation.input`.

`camera.enablePhoto` determines whether photo capture from camera is enabled. `gallery.enablePhoto` indicates whether photo selection from gallery is enabled. `enableFile` specifies whether file attachment is enabled.

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
// Configure input settings
AIAgentMessenger.config.conversation.input.camera.enablePhoto = false
AIAgentMessenger.config.conversation.input.gallery.enablePhoto = false
AIAgentMessenger.config.conversation.input.enableFile = false
```
</div>
