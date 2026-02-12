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

---

# Phase 1: Before Convention (Legacy)

> The following section documents the original mapping before the naming convention was unified.
> File names differed between repos (e.g., `README.md` → `quickstart-guide-messenger.md`),
> and some private repos used flat directory structures without `features/` subdirectories.

## Common File Naming Rules (Legacy)

| Public repo | Docs repo |
|-------------|-----------|
| `README.md` | `quickstart-guide-messenger.md` |
| `MULTILANGUAGE.md` | `multi-language-support.md` |

---

## Android (Legacy)

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

## iOS (Legacy)

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

## JavaScript CDN (Legacy)

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-js (private) |
|---------------------------|----------------------------|----------------------|
| `js/cdn/docs/conversations.md` | `javascript-cdn/features/conversations.md` | `packages/cdn-loader/docs/conversations.md` |
| `js/cdn/docs/messages.md` | `javascript-cdn/features/messages.md` | `packages/cdn-loader/docs/messages.md` |
| `js/cdn/README.md` | `javascript-cdn/quickstart-guide-messenger.md` | ❌ N/A |
| `js/cdn/MULTILANGUAGE.md` | `javascript-cdn/multi-language-support.md` | ❌ N/A |

**Notes:**
- `quickstart`, `multi-language-support` don't exist in private repo → backward sync not available

---

## React NPM (Legacy)

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

## React Native (Legacy)

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-js (private) |
|---------------------------|----------------------------|----------------------|
| `js/react-native/docs/conversations.md` | `react-native/features/conversations.md` | `packages/messenger-react-native/docs/conversations.md` |
| `js/react-native/docs/messages.md` | `react-native/features/messages.md` | `packages/messenger-react-native/docs/messages.md` |
| `js/react-native/README.md` | `react-native/quickstart-guide-messenger.md` | ❌ N/A |
| `js/react-native/MULTILANGUAGE.md` | `react-native/multi-language-support.md` | ❌ N/A |

**Notes:**
- `quickstart`, `multi-language-support` don't exist in private repo → backward sync not available

---

## Legacy Summary: Sync Availability

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

# Phase 2: After Convention (Current)

> Convention unified: file names are now **the same across all repos** (no more renaming).
> All platforms use `docs/` and `docs/features/` directory structure consistently.
> Mapping is pattern-based via `mapping-table.json`.

## Convention Changes

1. **Same file names** — `README.md`, `MULTILANGUAGE.md` etc. are used as-is in all repos (no more `quickstart-guide-messenger.md`, `multi-language-support.md`)
2. **Consistent directory structure** — all repos use `docs/` root and `docs/features/` for feature docs
3. **Pattern-based mapping** — `mapping-table.json` uses prefix patterns instead of per-file entries

---

## Android

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-android (private) |
|---------------------------|----------------------------|----------------------------|
| `android/docs/features/conversations.md` | `android/features/conversations.md` | `docs/docs/features/conversations.md` |
| `android/docs/features/launcher.md` | `android/features/launcher.md` | `docs/docs/features/launcher.md` |
| `android/docs/features/messages.md` | `android/features/messages.md` | `docs/docs/features/messages.md` |
| `android/docs/features/readme.md` | `android/features/README.md` | `docs/docs/features/readme.md` |
| `android/docs/README.md` | `android/README.md` | `docs/docs/README.md` |
| `android/docs/MULTILANGUAGE.md` | `android/MULTILANGUAGE.md` | `docs/docs/MULTILANGUAGE.md` |
| `android/docs/context-object.md` | `android/context-object.md` | `docs/docs/context-object.md` |

**7 files** — all exist in all 3 repos → full bidirectional sync available

> `features/README.md`: renamed from `readme.md` → `README.md` in docs repo. public/private repos still have `readme.md` (will be updated via sync-back PR)

---

## iOS

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-ios (private) |
|---------------------------|----------------------------|------------------------|
| `ios/docs/features/conversations.md` | `ios/features/conversations.md` | `docs/features/conversations.md` |
| `ios/docs/features/launcher.md` | `ios/features/launcher.md` | `docs/features/launcher.md` |
| `ios/docs/features/messages.md` | `ios/features/messages.md` | `docs/features/messages.md` |
| `ios/docs/features/README.md` | `ios/features/README.md` | `docs/features/README.md` |
| `ios/docs/README.md` | `ios/README.md` | `docs/README.md` |
| `ios/docs/MULTILANGUAGE.md` | `ios/MULTILANGUAGE.md` | `docs/MULTILANGUAGE.md` |
| `ios/docs/context-object.md` | `ios/context-object.md` | `docs/context-object.md` |

**7 files** — all exist in all 3 repos → full bidirectional sync available

---

## JavaScript CDN

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-js (private) |
|---------------------------|----------------------------|----------------------|
| `js/cdn/docs/features/conversations.md` | `javascript-cdn/features/conversations.md` | `packages/cdn-loader/docs/features/conversations.md` |
| `js/cdn/docs/features/messages.md` | `javascript-cdn/features/messages.md` | `packages/cdn-loader/docs/features/messages.md` |
| ❌ N/A | `javascript-cdn/features/README.md` | `packages/cdn-loader/docs/features/README.md` |
| `js/cdn/docs/README.md` | `javascript-cdn/README.md` | `packages/cdn-loader/docs/README.md` |
| `js/cdn/docs/MULTILANGUAGE.md` | `javascript-cdn/MULTILANGUAGE.md` | `packages/cdn-loader/docs/MULTILANGUAGE.md` |
| ❌ N/A | `javascript-cdn/context-object.md` | `packages/cdn-loader/docs/context-object.md` |

**6 files** — public repo missing 2 files (`features/README.md`, `context-object.md`)

---

## React (NPM)

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-js (private) |
|---------------------------|----------------------------|----------------------|
| `js/react/docs/features/conversations.md` | `react-npm/features/conversations.md` | `packages/messenger-react/docs/features/conversations.md` |
| `js/react/docs/features/messages.md` | `react-npm/features/messages.md` | `packages/messenger-react/docs/features/messages.md` |
| ❌ N/A | `react-npm/features/README.md` | `packages/messenger-react/docs/features/README.md` |
| `js/react/docs/README.md` | `react-npm/README.md` | `packages/messenger-react/docs/README.md` |
| `js/react/docs/MULTILANGUAGE.md` | `react-npm/MULTILANGUAGE.md` | `packages/messenger-react/docs/MULTILANGUAGE.md` |
| `js/react/docs/TEMPLATE-LAYOUT-CUSTOMIZATION-GUIDE.md` | `react-npm/TEMPLATE-LAYOUT-CUSTOMIZATION-GUIDE.md` | `packages/messenger-react/docs/TEMPLATE-LAYOUT-CUSTOMIZATION-GUIDE.md` |
| ❌ N/A | `react-npm/context-object.md` | `packages/messenger-react/docs/context-object.md` |

**7 files** — public repo missing 2 files (`features/README.md`, `context-object.md`)

---

## React Native

| delight-ai-agent (public) | delight-ai-docs (sdk-docs) | ai-agent-js (private) |
|---------------------------|----------------------------|----------------------|
| `js/react-native/docs/features/conversations.md` | `react-native/features/conversations.md` | `packages/messenger-react-native/docs/features/conversations.md` |
| `js/react-native/docs/features/messages.md` | `react-native/features/messages.md` | `packages/messenger-react-native/docs/features/messages.md` |
| ❌ N/A | `react-native/features/README.md` | `packages/messenger-react-native/docs/features/README.md` |
| `js/react-native/docs/README.md` | `react-native/README.md` | `packages/messenger-react-native/docs/README.md` |
| `js/react-native/docs/MULTILANGUAGE.md` | `react-native/MULTILANGUAGE.md` | `packages/messenger-react-native/docs/MULTILANGUAGE.md` |

**5 files** — public repo missing 1 file (`features/README.md`)

---

## Summary: Sync Availability

### Forward Sync Available (public → docs): 27 files

| Platform | Files in public repo |
|----------|---------------------|
| Android | 7 |
| iOS | 7 |
| JS CDN | 4 |
| React NPM | 5 |
| React Native | 4 |

### Backward Sync Available (docs → private): 32 files

All docs repo files have corresponding private repo files → backward sync available for all.

| Platform | Files in docs repo | Files in private repo | Backward sync |
|----------|-------------------|----------------------|---------------|
| Android | 7 | 7 | ✅ All |
| iOS | 7 | 7 | ✅ All |
| JS CDN | 6 | 6 | ✅ All |
| React NPM | 7 | 7 | ✅ All |
| React Native | 5 | 5 | ✅ All |

### Files missing in public repo (no forward sync)

| Platform | Missing file | Exists in docs | Exists in private |
|----------|-------------|---------------|-------------------|
| JS CDN | `features/README.md` | ✅ | ✅ |
| JS CDN | `context-object.md` | ✅ | ✅ |
| React NPM | `features/README.md` | ✅ | ✅ |
| React NPM | `context-object.md` | ✅ | ✅ |
| React Native | `features/README.md` | ✅ | ✅ |

### Case mismatch (pending rename)

| Platform | File | docs repo | public repo | private repo |
|----------|------|-----------|-------------|--------------|
| Android | `features/README.md` | `README.md` | `readme.md` | `readme.md` |

---

## mapping-table.json Field Description

The mapping table uses a **pattern-based** approach. Files are auto-mapped by matching their docs path prefix.

```json
{
  "patterns": [
    {
      "docsPrefix": "sdk-docs/android/features/",
      "repo": "android",
      "privateBase": "docs/docs/features/",
      "publicBase": "android/docs/features/"
    }
  ]
}
```

- `docsPrefix` — prefix to match against docs repo file paths
- `repo` — which repository entry to use (from `repositories`)
- `privateBase` — the corresponding directory in the private repo
- `publicBase` — the corresponding directory in the public repo

**Mapping logic:** strip `docsPrefix` from the docs path, append the remainder to `privateBase` or `publicBase`.

Example: `sdk-docs/android/features/conversations.md` → strip `sdk-docs/android/features/` → `conversations.md` → private: `docs/docs/features/conversations.md`, public: `android/docs/features/conversations.md`

For files that don't follow patterns (different names or special paths), use `overrides`:

```json
{
  "overrides": {
    "sdk-docs/android/special-file.md": {
      "repo": "android",
      "privatePath": "docs/docs/special-file.md",
      "publicAgentPath": "android/docs/special-file.md"
    }
  }
}
```
