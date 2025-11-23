# PWA & Interaction Verification

## 1. PWA Verification
- [ ] Check if `manifest.json` is loaded.
- [ ] Check if Service Worker is registered.
- [ ] Verify "Install App" prompt (if available).

## 2. Partner Connection Flow
- [ ] Open "Connect Partner" modal.
- [ ] Enter a dummy code (e.g., "123456").
- [ ] Verify that `localStorage` is updated with `us-time-partner-id`.

## 3. Pitch Activity Flow
- [ ] Open "Pitch Activity" modal.
- [ ] Click "Send".
- [ ] Verify that the pitch is sent via WebSocket (check console/network).
