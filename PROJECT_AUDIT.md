# LovellyLilly AI — Full Project Audit
**Date:** April 7, 2026
**Stack:** React 19 + Vite · Node.js/Express 5 · MongoDB/GridFS · Socket.io · LangChain

---

## ✅ WORKING & FULLY IMPLEMENTED

### Backend — Rock Solid

| Area | Status | Notes |
|------|--------|-------|
| **Auth System** | ✅ Full | Register, Login, Logout, Verify Email, Forgot/Reset Password — all routes, controllers, validators, JWT cookie strategy |
| **Email Service** | ✅ Full | Nodemailer with branded HTML templates for verification + reset |
| **Admin Role Guard** | ✅ Full | `adminAuth.js` middleware checks `role === "admin"` properly |
| **Multi-AI Provider** | ✅ Full | Mistral, Gemini, OpenAI, Anthropic, MiniMax via LangChain — auto-fallback chain |
| **AI Streaming** | ✅ Full | Socket.io streaming with `stream_chunk` → `stream_done` events |
| **Mode Detection** | ✅ Full | 6 modes: search, think, create, generate-image, generate-video, build-website |
| **Web Search** | ✅ Full | Tavily API integration, returns title/url/snippet/favicon |
| **Auto-title generation** | ✅ Full | First-message → 4–6 word title via fast model |
| **Follow-up suggestions** | ✅ Full | 3 JSON suggestions generated post-response |
| **Chat CRUD** | ✅ Full | Create, list, delete, rename, save/bookmark |
| **Message storage** | ✅ Full | Full message history with sources, queryMode, responseTimeMs |
| **Skills system** | ✅ Full | 25+ skills in registry, slash-command detection + auto-detection, dynamic system prompt building |
| **Browser Agent** | ✅ Full* | PinchTab URL scraper — *requires PinchTab server running at localhost:9867* |
| **SEO Agent** | ✅ Full | Cheerio-based analysis, scores 7+ SEO factors, saves SeoReport to DB |
| **Code Runner Agent** | ✅ Full | `secure-exec` sandbox with fs/network/childProcess disabled |
| **Image Generation** | ✅ Full | Pollinations.ai (`flux` model), stores URL in DB |
| **Video Generation** | ✅ Full | Pollinations.ai (`wan` model), async poll for completion |
| **Website Builder** | ✅ Full | Gemini generates single-file HTML, stores in DB, preview served as HTML |
| **Document Upload** | ✅ Full | GridFS storage, parses PDF/DOCX/XLSX/TXT, async processing pipeline |
| **Document Q&A** | ✅ Full | Gemini RAG-style chat with per-doc history |
| **User Profile CRUD** | ✅ Full | Get, update, change password, delete account |
| **Admin Stats** | ✅ Full | Real counts: totalUsers, totalQueries, verifiedUsers, recentQueries |
| **Admin User List** | ✅ Full | Returns all users sorted by createdAt |
| **Query Logging** | ✅ Full | Async fire-and-forget query log with model, responseTimeMs, status |
| **Error handling** | ✅ Full | Global errorHandler, AppError utility, asyncHandler wrapper |
| **DB Models** | ✅ Full | User, Chat, Message, Document, GeneratedImage, GeneratedVideo, GeneratedWebsite, QueryLog, SeoReport, VerificationToken — all with proper indexes |

### Frontend — What Actually Works

| Area | Status | Notes |
|------|--------|-------|
| **Auth Pages** | ✅ Full | Login, Signup, ForgotPassword, ResetPassword, VerifyEmail — all call real APIs |
| **AuthContext** | ✅ Full | Persistent session via `getMe` on mount, shared across app |
| **SocketContext** | ✅ Full | Auth-gated WebSocket, reconnects on auth state change |
| **Dashboard Chat** | ✅ Full | Real socket streaming, typing indicator, conversation list, load/delete chats, new chat |
| **MessageBubble** | ✅ Full | Markdown + GFM, code highlighting (github-dark), copy button |
| **ChatInput** | ✅ Full | Auto-resize textarea, web-search toggle, keyboard submit |
| **VoiceControl** | ✅ Full | Push-to-hold STT (Web Speech API) + TTS auto-speak mode |
| **Skill badges in chat** | ✅ Full | Active skills shown as badges during generation |
| **Agent status in chat** | ✅ Full | Spinning indicator with message (browsing, SEO, code running) |
| **Settings → Profile** | ✅ Full | Name update calls real API, logout works |
| **Custom Cursor** | ✅ Full | Registered in App.jsx |
| **Lenis scroll** | ✅ Full | Paused on Dashboard (important — prevents scroll conflicts) |
| **Toast notifications** | ✅ Full | react-hot-toast with branded dark styling |
| **Landing Page** | ✅ Full | GSAP + Lenis animations, loads correctly |
| **Route protection** | ✅ Full | ProtectedRoute wrapper, redirects to /login |
| **App routing** | ✅ Full | All 13 routes defined and wired |
| **Vite proxy** | ✅ Full | /api → port 5000, /socket.io → port 5000 (WebSocket) |

---

## ❌ NOT WORKING / BROKEN / FAKE

### Critical — Pages with Fake/Mock Data (No Real API Calls)

**1. Image Studio Page (`/studio/image`)**
- `handleGenerate()` uses `setTimeout` + hardcoded Unsplash URL
- The real backend `/api/images/generate` is NEVER called
- `studio.api.js` has `generateImage()` but it's not imported anywhere in the page
- Download/Share buttons have no `onClick` handlers — they are dead
- The entire gallery is local React state, not persisted

**2. Video Studio Page (`/studio/video`)**
- `handleGenerate()` uses `setTimeout` + hardcoded thumbnail URL
- The real backend `/api/videos/generate` is NEVER called
- "45/100 credits" bar is hardcoded — no real credit system
- No actual video player — only a thumbnail placeholder
- No polling for video completion status

**3. Website Builder Page (`/studio/website`)**
- `handleCreate()` uses `setTimeout` + sets `websiteHash = 'demo-site-123'`
- The real backend `/api/websites/generate` is NEVER called
- Preview iframe shows nothing (just a placeholder)
- Code View tab has no real HTML to show
- "Add pricing table", "Change header to sticky" suggestion buttons do nothing

**4. Document Vault Page (`/documents`)**
- Hardcoded mock documents array (2024 Market Research.pdf, Quarterly Report.docx, etc.)
- Upload button uses `setTimeout` to fake-add a "New Document.pdf"
- The real backend `/api/documents` (GET list) is NEVER called
- The real `/api/documents/upload` is NEVER called
- All action buttons (Chat, View, Download, Delete) have no handlers

**5. Admin Dashboard (`/admin`)**
- Stats cards (12,482 users, 1.2M API requests, 14% DB load, 32% CPU) are all hardcoded
- Chart data (Jan–Jun growth) is hardcoded
- Alerts panel is hardcoded
- Users table is hardcoded
- Real `/api/admin/stats`, `/api/admin/users`, `/api/admin/logs` are NEVER called
- "System Status" button does nothing
- "Export CSV" button does nothing

### Settings Page — Partial Implementation

**6. Settings → Security tab**
- Password "Change" button has no `onClick` — it's just a `<div>` list item
- 2FA "Enable" button has no `onClick` — not connected to anything
- `changePassword` from `user.api.js` exists but is never called anywhere in the page

**7. Settings → Billing tab**
- Pure placeholder: hardcoded "Professional Plan", "April 15, 2024"
- "Upgrade to Pro" button has no handler

**8. Settings → API Keys tab**
- Pure placeholder (not even rendered — tab exists in nav but content likely empty)

**9. Settings → Notifications tab**
- Pure placeholder

### Components Built But Never Used

**10. `FollowUpChips` component**
- Fully built, accepts `suggestions` and `onSelect`
- Backend generates 3 follow-up suggestions and sends them in `stream_done`
- **Never imported or rendered anywhere** — `DashboardPage` receives the suggestions but doesn't display them

**11. `SourcesPanel` component**
- Fully built with clickable source links
- Backend sends sources via socket
- **Never imported or rendered anywhere** — sources are passed to `MessageBubble` but never shown in a panel

**12. `QueryModeBadge` component**
- Fully built with mode icons
- **Never imported or rendered anywhere**

**13. `VoiceModeOverlay` component**
- Beautiful full-screen voice overlay with waveform animation
- **Never imported or triggered anywhere in the app**

**14. `ConversationSidebar` component** (`features/chat/components/ConversationSidebar.jsx`)
- Built as a standalone component
- **Never used** — Dashboard has its own inline sidebar instead

### Chat — Generation Mode Responses Not Handled

**15. In-chat image/video/website responses**
The socket `stream_done` handler in `DashboardPage` ONLY handles text responses. When the AI detects `generate-image`, `generate-video`, or `build-website` mode, the backend emits a `stream_done` with `{ mode: "image", imageUrl: "..." }` — but the frontend `handleDone` function only reads `sources` and `followUpSuggestions`. The image URL, video operationId, and website HTML are **silently ignored and lost**.

### Backend Issues

**16. Chat model `queryMode` enum mismatch**
`Chat.model.js` only allows `"search" | "think" | "create"` in the enum, but `socket.service.js` sets `chat.queryMode = mode` where `mode` can be `"generate-image"`, `"generate-video"`, or `"build-website"` — this causes a **Mongoose validation error** on save for those modes.

**17. Admin ban/unban/deleteUser — routes don't exist on backend**
`admin.api.js` exports `banUser`, `unbanUser`, `deleteUser` which call POST `/admin/users/:id/ban`, POST `/admin/users/:id/unban`, DELETE `/admin/users/:id` — but none of these routes exist in `admin.routes.js`. They will **404**.

**18. PinchTab dependency — single point of failure**
All URL browsing (auto-browse any URL in chat, `/browse` slash command, `/seo` command) depends on a **PinchTab server running at localhost:9867**. If it's not running, all these features fail silently (try/catch swallows the error). There's no fallback to a simpler scraper.

**19. Rate limiter disabled**
The rate limiter in `app.js` is commented out. Running in production without it is a security risk.

---

## 🚫 MISSING ENTIRELY (Not Implemented Anywhere)

| Feature | Priority | Notes |
|---------|----------|-------|
| **Subscription/Credits system** | High | Video Studio shows fake credits; no real credit tracking in DB or logic |
| **Image download** | High | Button in Image Studio exists but no handler; needs `fetch(imageUrl)` → blob → save |
| **Image sharing** | Medium | Share button is dead |
| **Chat — file attachment flow** | High | Paperclip shows "Attachments coming soon"; the document upload system exists on backend but is not wired to the chat input |
| **In-chat generation display** | High | When chat mode is generate-image/video/website, results need to render in the message feed (image preview, video player, website iframe) |
| **SEO reports history page** | Medium | `SeoReport` model and `/api/seo` routes exist, but there's no frontend page to view past reports |
| **Chat rename UI** | Medium | `renameConversation()` API exists, but no rename input/button in the conversation list |
| **Chat save/bookmark UI** | Low | `toggleSaveConversation()` API exists, but no star/bookmark button in the conversation list |
| **Avatar upload** | Low | `User.avatar` field exists, no upload endpoint or UI |
| **Cloudinary integration** | Medium | Listed in `.env.example` but never referenced in any code file — images/files go to Pollinations URLs or GridFS only |
| **2FA** | Low | Shown in Settings Security but no backend implementation |
| **Real Admin user management** | High | No backend endpoints for ban/suspend/delete user |
| **Real Admin query logs display** | Medium | Backend `/api/admin/logs` works, but Admin Dashboard doesn't call it |
| **Admin Export CSV** | Low | Button exists, no functionality |
| **Real Admin user table** | High | Backend `/api/admin/users` works, Dashboard doesn't call it |
| **MiniMax API endpoint** | Medium | `ai.service.js` uses `https://minimax-m2.com/api/v1` — verify this is the correct MiniMax endpoint |
| **Follow-up chips in chat UI** | Medium | Data flows correctly from backend, but `FollowUpChips` component is never rendered |
| **Sources panel in chat UI** | Medium | Data flows correctly, `SourcesPanel` never rendered |
| **Query mode badge in chat UI** | Low | Component built, never rendered |
| **Full-screen voice overlay** | Low | `VoiceModeOverlay` built, never triggered |
| **Video polling in Video Studio** | High | After generating a video, no polling to check when it's ready |
| **Website preview in Website Builder** | High | No iframe loading from the backend preview endpoint |
| **Website code view** | Low | Code tab has no content |
| **Document search/filter** | Low | Filter button in Document Vault does nothing |
| **Real-time admin metrics** | Low | CPU, DB load stats require server-side monitoring (not implemented) |

---

## 🔗 API Mismatch Summary

| Frontend API call | Backend route | Status |
|---|---|---|
| `POST /admin/users/:id/ban` | ❌ Does not exist | Will 404 |
| `POST /admin/users/:id/unban` | ❌ Does not exist | Will 404 |
| `DELETE /admin/users/:id` | ❌ Does not exist | Will 404 |
| `GET /api/images` | ✅ Exists | Never called from Image Studio |
| `POST /api/images/generate` | ✅ Exists | Never called from Image Studio |
| `POST /api/videos/generate` | ✅ Exists | Never called from Video Studio |
| `POST /api/websites/generate` | ✅ Exists | Never called from Website Builder |
| `GET /api/documents` | ✅ Exists | Never called from Document Vault |
| `POST /api/documents/upload` | ✅ Exists | Never called from Document Vault |
| `GET /api/admin/stats` | ✅ Exists | Never called from Admin Dashboard |
| `GET /api/admin/users` | ✅ Exists | Never called from Admin Dashboard |
| `GET /api/admin/logs` | ✅ Exists | Never called from Admin Dashboard |
| `PATCH /user/password` | ✅ Exists | Never called from Settings Security |

---

## ⚡ Quick Fix Priority List

### Fix in 1–2 hours each (just wire existing API to existing UI):
1. Connect Image Studio → `/api/images/generate` (remove setTimeout, call `generateImage()` from studio.api.js)
2. Connect Video Studio → `/api/videos/generate` + add polling
3. Connect Website Builder → `/api/websites/generate` + load preview via iframe
4. Connect Document Vault → `/api/documents` (list) + real upload with FormData
5. Connect Admin Dashboard → `/api/admin/stats`, `/api/admin/users`, `/api/admin/logs`
6. Render `FollowUpChips` in `MessageBubble` (data already arrives from backend)
7. Render `SourcesPanel` in `DashboardPage` (data already arrives from backend)
8. Fix Chat model `queryMode` enum to include "generate-image", "generate-video", "build-website"

### Fix in 2–4 hours each (requires new logic):
9. Handle generation mode responses in DashboardPage `handleDone` (show image/video/website inline)
10. Wire Settings Security tab → `changePassword` API
11. Add backend routes for admin user management (ban/delete)
12. Add rename/bookmark buttons to conversation list

### Requires significant work (new features):
13. Real credit/subscription system
14. File attachment in chat input (drag-drop document → auto-upload → chat context)
15. SEO reports history page
16. Cloudinary integration for cloud-stored images
17. PinchTab fallback scraper (use cheerio/axios directly if PinchTab unavailable)
18. Real admin metrics (needs server monitoring library like `os` module stats)
