# Mapping Reference

File mapping reference document between repositories.

## Repository Structure

| Role | Repository | Description |
|------|-----------|-------------|
| Public | `delight-ai-agent` | External public documentation (GitHub public) |
| Docs | `delight-ai-docs` | GitBook-connected documentation repo |
| Private | `ai-agent-android` | Android SDK internal repo |
| Private | `ai-agent-ios` | iOS SDK internal repo |
| Private | `ai-agent-js` | JavaScript SDK internal repo |

## Sync Direction

```
Forward Sync:  delight-ai-agent (public) → delight-ai-docs
Backward Sync: delight-ai-docs → ai-agent-{platform} (private)
```

## Common File Naming Rules

| Public repo | Docs repo |
|-------------|-----------|
| `README.md` | `quickstart-guide-messenger.md` |
| `MULTILANGUAGE.md` | `multi-language-support.md` |

---

## Android

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-android (private) |
|---------------------------|----------------------------|----------------------------|
| `android/docs/conversations.md` | `android/features/conversations.md` | `docs/conversations.md` |
| `android/docs/launcher.md` | `android/features/launcher.md` | `docs/launcher.md` |
| `android/docs/messages.md` | `android/features/messages.md` | `docs/messages.md` |
| `android/README.md` | `android/quickstart-guide-messenger.md` | `README.md` |
| `android/MULTILANGUAGE.md` | `android/multi-language-support.md` | ❌ N/A |

**Notes:**
- `multi-language-support.md` doesn't exist in private repo → backward sync not available

---

## iOS

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-ios (private) |
|---------------------------|----------------------------|------------------------|
| `ios/docs/conversations.md` | `ios/features/conversations.md` | `docs/features/conversations.md` |
| `ios/docs/launcher.md` | `ios/features/launcher.md` | `docs/features/launcher.md` |
| `ios/docs/messages.md` | `ios/features/messages.md` | `docs/features/messages.md` |
| `ios/features/README.md` | `ios/features/README.md` | `docs/features/README.md` |
| `ios/README.md` | `ios/quickstart-guide-messenger.md` | `docs/README.md` |
| `ios/MULTILANGUAGE.md` | `ios/multi-language-support.md` | `docs/multi-language-support.md` |
| `ios/context-object.md` | `ios/context-object.md` | `docs/context-object.md` |

**Notes:**
- All iOS files exist in private repo → bidirectional sync available

---

## JavaScript CDN

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-js (private) |
|---------------------------|----------------------------|----------------------|
| `js/cdn/docs/conversations.md` | `javascript-cdn/features/conversations.md` | `packages/cdn-loader/docs/conversations.md` |
| `js/cdn/docs/messages.md` | `javascript-cdn/features/messages.md` | `packages/cdn-loader/docs/messages.md` |
| `js/cdn/README.md` | `javascript-cdn/quickstart-guide-messenger.md` | ❌ N/A |
| `js/cdn/MULTILANGUAGE.md` | `javascript-cdn/multi-language-support.md` | ❌ N/A |

**Notes:**
- `quickstart`, `multi-language-support` don't exist in private repo → backward sync not available

---

## React (NPM)

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-js (private) |
|---------------------------|----------------------------|----------------------|
| `js/react/docs/conversations.md` | `react-npm/features/conversations.md` | `packages/messenger-react/docs/conversations.md` |
| `js/react/docs/messages.md` | `react-npm/features/messages.md` | `packages/messenger-react/docs/messages.md` |
| `js/react/README.md` | `react-npm/quickstart-guide-messenger.md` | ❌ N/A |
| `js/react/MULTILANGUAGE.md` | `react-npm/multi-language-support.md` | ❌ N/A |
| `js/react/TEMPLATE-LAYOUT-CUSTOMIZATION-GUIDE.md` | `react-npm/template-based-layout-component-customization-guide.md` | ❌ N/A |

**Notes:**
- `quickstart`, `multi-language-support`, `template-guide` don't exist in private repo → backward sync not available

---

## React Native

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-js (private) |
|---------------------------|----------------------------|----------------------|
| `js/react-native/docs/conversations.md` | `react-native/features/conversations.md` | `packages/messenger-react-native/docs/conversations.md` |
| `js/react-native/docs/messages.md` | `react-native/features/messages.md` | `packages/messenger-react-native/docs/messages.md` |
| `js/react-native/README.md` | `react-native/quickstart-guide-messenger.md` | ❌ N/A |
| `js/react-native/MULTILANGUAGE.md` | `react-native/multi-language-support.md` | ❌ N/A |

**Notes:**
- `quickstart`, `multi-language-support` don't exist in private repo → backward sync not available

---

## Summary: Sync Availability

### Forward Sync Available (public → docs): 23 files
All public repo files can be synced to docs repo

### Backward Sync Available (docs → private): 14 files

| Platform | Files | Available |
|----------|-------|-----------|
| Android | conversations, launcher, messages | ✅ |
| Android | quickstart | ✅ |
| Android | multi-language-support | ❌ |
| iOS | conversations, launcher, messages | ✅ |
| iOS | features/README | ✅ |
| iOS | quickstart, multi-language, context-object | ✅ |
| JS CDN | conversations, messages | ✅ |
| JS CDN | quickstart, multi-language | ❌ |
| React NPM | conversations, messages | ✅ |
| React NPM | quickstart, multi-language, template-guide | ❌ |
| React Native | conversations, messages | ✅ |
| React Native | quickstart, multi-language | ❌ |

---

## mapping-table.json Field Description

```json
{
  "docsPath": {
    "repo": "android|ios|js",
    "privatePath": "path in private repo (null if not available)",
    "publicAgentPath": "path in public repo (null if not available)"
  }
}
```

- `privatePath: null` → backward sync not available (docs → private)
- `publicAgentPath: null` → forward sync not available (public → docs)
