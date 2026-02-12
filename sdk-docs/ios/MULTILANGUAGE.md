# Multi-language support

This guide explains how to localize the user-facing UI strings in the **Delight AI agent SDK for iOS**, enabling support for multiple languages in your application.

This guide covers:
- [Overview](#overview)
- [Supported languages](#supported-languages)
- [1. Add a `Localizable.strings` file](#1-add-a-localizablestrings-file)
- [2. Enable localization](#2-enable-localization)
- [3. Add translations](#3-add-translations)
- [Tips](#tips)

---

## Overview

The Delight AI agent SDK includes a predefined set of UI string resources — including button labels, error messages, input hints, and system messages.

To support multiple languages, you can localize these strings using iOS's `Localizable.strings` file.

---

## Supported languages

The SDK includes built-in localization support for the following languages:

- English (`en`)
- German (`de`)
- Spanish (`es`)
- French (`fr`)
- Hindi (`hi`)
- Italian (`it`)
- Japanese (`ja`)
- Korean (`ko`)
- Portuguese (`pt`)
- Turkish (`tr`)

If your target language is not listed above, you can add translations or override default strings.

---

## 1. Add a `Localizable.strings` file

If your project does not already have a `Localizable.strings` file, follow these steps to create one.

1. In the **Project Navigator**, right-click on your target group or folder.
2. Select **New File from Template…**
3. Choose **Strings File (Legacy)** under the **Resource** section.
4. Name the file exactly: `Localizable.strings`.
5. Click **Create**.

---

## 2. Enable localization

1. In the **Project Navigator**, click on your project (blue icon) to open the project editor.
2. Select the **Project** (not the target) in the left sidebar of the project editor.
3. Open the **Info** tab at the top.
4. Scroll down to the **Localizations** section.
5. Click the **+** button to add a new language (e.g., **Korean**).
6. A dialog will appear asking which files to localize — make sure to select `Localizable.strings`.
7. Xcode will generate a separate `Localizable.strings` file for the newly added language.

This configures your app to support multiple languages and allows Xcode to manage localized resources.

---

## 3. Add translations

Edit the `Localizable.strings` files per language:

### `Localizable.strings` (English)

```text
"SBA_Common_cancel" = "Cancel";
"SBA_Common_retry" = "Retry";
...
```

To see the full list of string keys, refer to the [English-based `Localizable.strings` file](https://github.com/sendbird/delight-ai-agent/blob/main/ios/en.lproj/Localizable.strings).

When you define key-value pairs in `Localizable.strings` for a specific language, the SDK uses your custom values instead of its defaults. For any keys you don't translate, the SDK displays the English default.

---

## Tips

### Test different languages in simulator

1. Run your app in the **iOS Simulator**.
2. Open **Settings > General > Language & Region**.
3. Change the language to your desired option (e.g., Bangla).
4. Relaunch your app — localized strings should appear accordingly.

