---
name: Pull Request
about: Create a pull request to help improve the extension
title: 'fix: prevent double-sending rolls to Roll20 when no campaign limit is set'
labels: pr
assignees: ''
---

## Summary
Fixes a double-roll bug where Roll20 tabs received each roll message twice when no specific VTT campaign limit was configured.

## Type of change
- [x] 🐛 Bug fix (non-breaking change that fixes an issue)

## ⚠️ AI usage disclosure (required)
- [x] I **did** use AI for this PR (describe below).

AI-assisted in identifying the root cause by comparing old and new versions of background.js.

## Motivation & context
When `settings["vtt-tab"]` is null (no specific campaign configured), `sendMessageToRoll20` entered the `else` branch which sent the roll message via `sendMessageTo(ROLL20_URL, ...)` and then looped through all tracked `roll20_tabs` separately. Any Roll20 tab that matched the URL query AND was tracked in `roll20_tabs` received the message twice, causing double roll output in Roll20.

## What changed?
- `src/extension/background.js`: In the `else` branch of `sendMessageToRoll20`, replaced the separate URL query send + tracked tabs loop with a single query that merges `roll20_tabs` into the URL-matched results (deduplicating by tab id) before sending, matching the pattern used in the `if (limit)` branch.

## How to test
1. Configure Beyond20 with no specific VTT campaign limit (vtt-tab is null)
2. Open a Roll20 game
3. Make a roll from D&D Beyond
4. Observe that only one chat message appears in Roll20 (previously two appeared)

## Reviewer notes
The `roll20_tabs` tracking was added to support the no-trailing-slash Roll20 URL variant, but the `else` branch didn't account for overlap between URL query results and tracked tabs. The fix uses the same merge-before-send pattern already used in the `if (limit)` branch above.
