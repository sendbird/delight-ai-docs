# Messages

In Delight AI agent, users can exchange text, image, file, and rich template messages in the messenger. This allows you to build conversations that combine plain text with visual and interactive content across many use cases.

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

Delight AI agent messenger supports multiple message types for communication between users and AI agents. You can choose a message type based on content format and user intent.

| Type                                       | Description                                 | Content format                      | Use cases                                                                  |
| ------------------------------------------ | ------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------- |
| [Text message](messages.md#text-message)   | Regular text-based communication            | Plain text                          | Basic conversational interactions, Q&A, general dialogue                   |
| [Image message](messages.md#image-message) | Visual file sharing                         | Image files in `PNG` and `JPG` only | Visual communication, screenshots, diagrams                                |
| [File message](messages.md#file-message)   | Document and file sharing                   | Various file formats                | Document sharing, attachments, downloadable resources                      |
| [Rich message](messages.md#rich-message)   | Template-based messages with interactive UI | Structured JSON templates           | Product displays, carousels, CTAs, and more                                |

### Text Message

Text messages provide regular text-based communication between users and AI agents.

- Content: Plain text. Markdown supported.
- Use case: Basic conversational interactions.
- Rendering: Full text rendering with proper formatting.

### Image Message

Image messages enable sharing of image files within conversations.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-image-message2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

- Supported formats: `JPEG`, `PNG` only. Images can include accompanying text.
- Use case: Sharing visual content.
- Display: Optimized image rendering with proper scaling.

> __Note__: Once handed off to a human agent, users can send image files in any format.

### File Message

File messages allow sharing of files within conversations.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-file-message2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

- Supported formats: `PDF` only. Files can include accompanying text.
- Use case: Document sharing and file-based communication.
- Display: File preview with download capabilities.

### Rich Message

Rich messages use predefined templates to create interactive message experiences. You can configure these templates in the **Delight AI dashboard**.

| Type | Description | Example use case |
| ---- | ----------- | ---------------- |
| Call to action | Button-driven interactions | Open a URL to complete a task |
| Carousel | Horizontally scrollable items | Browse multiple products |
| Suggested replies | Quick response buttons | Speed up common replies |
| CSAT | Satisfaction survey UI | Collect feedback |
| Product list | Vertically scrollable items | Browse a catalog |
| Custom message template | Custom UI with structured data | Render proprietary layouts |

#### Call to Action (CTA) button

CTA messages contain a button that allows users to take actions directly from the conversation interface. In Delight AI agent messenger, the button opens the specified external URL in a web browser.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-cta2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

- Components: A single button that links to an external webpage. Custom link formats are not supported.
- Use case: Action-oriented user interactions.
- Configuration: Available through **Delight AI dashboard** template settings.

#### Carousel

Carousel messages present multiple items that users can scroll horizontally.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-carousel2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

- Layout: Horizontal scrolling interface.
- Content: Multiple items with individual interactions.
- Use case: Product showcases, option selection, content browsing.

#### Suggested replies

Suggested replies provide predefined quick responses for users.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-suggested-replies2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

- Functionality: Quick response selection.
- Use case: Streamlined user interactions and faster response times.
- Display: Accessible quick reply buttons.

#### CSAT Message

CSAT messages collect user feedback for customer satisfaction surveys within conversations.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-csat2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

- Purpose: Customer satisfaction measurement.
- Components: Rating systems and feedback collection.
- Use case: Service quality assessment and user experience evaluation.

#### Product List

Product list messages display product information in a vertical scrolling format.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/aa-sdk-mobile-message-product-list.png" alt="cascade" width="375">
  <figcaption></figcaption>
</figure>

- Layout: Vertical scrolling interface.
- Content: Product information and details.
- Use case: E-commerce integration, product showcases, inventory display.

| Item | Layout | Scroll direction | Typical use |
| ---- | ------ | ---------------- | ----------- |
| Carousel | Horizontal cards | Horizontal | Product showcases and option selection |
| Product list | Vertical list | Vertical | Catalog browsing and inventory display |

#### Custom message template

Custom message templates enable business-specific UI components beyond predefined templates. The Delight AI agent server sends structured data that clients render with custom UI components.

**Core features**

- **Data delivery**: Templates arrive as a `custom_message_templates` array in the message's `extendedMessagePayload`. Clients handle UI rendering.
- **Multiple templates**: A single message can include multiple templates, each representing different UI elements.
- **Backward compatibility**: Unregistered template IDs trigger fallback UI to prevent application breakage.

**Data structure**

The `CustomMessageTemplateData` interface:

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

Sample payload in `extendedMessagePayload`:

<div component="AdvancedCode" languages="json#JSON">
```json
{
  "custom_message_templates": [
    {
      "id": "product_card",
      "response": {
        "status": 200,
        "content": "{\"title\":\"Wireless Charger\",\"price\":\"$29\"}"
      },
      "error": null
    }
  ]
}
```
</div>

**Implementation steps**

1. Understand the message layout.
Custom templates render in a dedicated slot within the message structure, appearing below the standard message content.
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

2. Register a custom handler.
Implement `CustomMessageTemplateViewHandler` and set it in `ConversationMessageListUIParams`.

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
</div>

3. Process template data.
Access custom template data from the message.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
val customTemplates = message.extendedMessagePayload["custom_message_templates"]
// SDK automatically parses this to List<CustomMessageTemplateData>
```
</div>

4. Handle exceptions.
Implement error handling for failure scenarios.

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

{% tabs %}
{% tab title="Fallback UI" %}
Use fallback UI for unknown template IDs.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
when (templateData.id) {
    "known_template" -> createKnownTemplate(context, data)
    else -> createFallbackView(context)
}
```
</div>
{% endtab %}

{% tab title="API failures" %}
Check response status and error fields.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
if (data.error != null) return createErrorView(context, data.error)
if (data.response.status != 200) return createErrorView(context, "API error")
```
</div>
{% endtab %}

{% tab title="Runtime errors" %}
Wrap handler logic in try-catch. The SDK also wraps calls to prevent crashes.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
try {
    callback.onViewReady(createView(context, data))
} catch (e: Exception) {
    callback.onViewReady(createFallbackView(context))
}
```
</div>
{% endtab %}
{% endtabs %}

---

## Key features

Messages support features that enhance transparency and conversation flow.

- [Read receipt](messages.md#read-receipt)
- [Citation](messages.md#citation)
- [Special notice](messages.md#special-notice)

### Read receipt

Read receipts show when a message has been viewed. If you don't specify `enableMessageReceiptState`, read receipts are hidden.

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
// Enable message receipt state
AIAgentMessenger.config.conversation.list.enableMessageReceiptState = true
```
</div>

### Citation

Citation displays source information for AI agent responses. This allows users to review references used to generate responses.

- Default: Disabled.
- Configuration: Enable in **Delight AI dashboard**.
- Activation settings: Adjustable through dashboard configuration values.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-citation2.png" alt="" width="375">
  <figcaption></figcaption>
</figure>

### Special notice

Special notice displays important information to users before conversation starts.

- Display location: Bottom of the screen.
- Behavior: Automatically disappears when a conversation starts.
- Configuration: Available through **Delight AI dashboard** configuration.

<figure>
  <img src="https://sendbird-files.s3.ap-northeast-1.amazonaws.com/docs/da-mobile-special-notice2.png" alt="special_notice" width="375">
  <figcaption></figcaption>
</figure>

---

## API references

The following tables list message-related configuration options for the Android SDK.

### ConversationConfig

The `ConversationConfig` class provides configuration options for the conversation screen, organized into `header`, `list`, and `input`.

#### ConversationConfig.Header

| Property | Type | Description |
| -------- | ---- | ----------- |
| `shouldShowProfile` | `Boolean` | Determines whether the profile appears in the conversation header. (Default: `true`) |

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
// Hide profile in conversation header
AIAgentMessenger.config.conversation.header.shouldShowProfile = false

// Show profile in conversation header
AIAgentMessenger.config.conversation.header.shouldShowProfile = true
```
</div>

#### ConversationConfig.List

| Property | Type | Description |
| -------- | ---- | ----------- |
| `enableMessageReceiptState` | `Boolean` | Determines whether message receipt status is shown. (Default: `false`) |
| `shouldShowSenderProfile` | `Boolean` | Determines whether sender profile information is shown. (Default: `true`) |
| `scrollMode` | `ScrollMode` | Specifies scroll behavior for the message list. (Default: `ScrollMode.AUTO`) `ScrollMode.AUTO` uses normal scrolling. `ScrollMode.FIX` keeps the user message fixed at the top during bot responses. |
| `shouldShowMessageFooterView` | `Boolean` | Determines whether the **Start new conversation** view is shown when a conversation has ended. (Default: `true`) |
| `enableNewMessageIndicator` | `Boolean` | Determines whether the new message indicator is shown. (Default: `true`) |

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

| Property | Type | Description |
| -------- | ---- | ----------- |
| `camera.enablePhoto` | `Boolean` | Determines whether photo capture from camera is enabled. (Default: `true`) |
| `gallery.enablePhoto` | `Boolean` | Determines whether photo selection from gallery is enabled. (Default: `true`) |
| `enableFile` | `Boolean` | Determines whether file attachments are enabled. (Default: `true`) |

<div component="AdvancedCode" languages="kotlin#Kotlin,kotlin#KTX">
```kotlin
// Configure input settings
AIAgentMessenger.config.conversation.input.camera.enablePhoto = false
AIAgentMessenger.config.conversation.input.gallery.enablePhoto = false
AIAgentMessenger.config.conversation.input.enableFile = false
```
</div>
