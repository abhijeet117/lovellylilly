import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import '../components/ui/Button.css';
import '../components/ui/Card.css';
import './ApiDocsPage.css';

/* ── Data ──────────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: 'intro', label: 'Introduction' },
  { id: 'auth', label: 'Authentication' },
  { id: 'chat', label: 'Chat' },
  { id: 'messages', label: 'Messages' },
  { id: 'documents', label: 'Documents' },
  { id: 'images', label: 'Images' },
  { id: 'websites', label: 'Websites' },
  { id: 'seo', label: 'SEO' },
  { id: 'user', label: 'User' },
  { id: 'errors', label: 'Errors' },
];

const BASE_URL = 'https://api.lovelylilly.ai';

const ENDPOINTS = {
  auth: [
    {
      method: 'POST', path: '/api/auth/register', title: 'Register',
      desc: 'Create a new user account. A verification email is sent automatically.',
      body: `{
  "name": "Your Name",
  "email": "you@example.com",
  "password": "SecureP@ss1"
}`,
      response: `{
  "status": "success",
  "message": "Verification email sent. Please verify your email."
}`,
    },
    {
      method: 'POST', path: '/api/auth/login', title: 'Login',
      desc: 'Authenticate with email and password. Returns a session cookie.',
      body: `{
  "email": "you@example.com",
  "password": "SecureP@ss1"
}`,
      response: `{
  "status": "success",
  "user": {
    "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Your Name",
    "email": "you@example.com",
    "role": "user",
    "isEmailVerified": true
  }
}`,
    },
    {
      method: 'POST', path: '/api/auth/logout', title: 'Logout',
      desc: 'Clears the authentication cookie and ends the session.',
      body: null,
      response: `{ "status": "success", "message": "Logged out." }`,
    },
    {
      method: 'GET', path: '/api/auth/me', title: 'Get Current User',
      desc: 'Returns the currently authenticated user. Requires valid session cookie.',
      body: null,
      response: `{
  "status": "success",
  "user": { "_id": "...", "name": "...", "email": "...", "role": "user" }
}`,
    },
    {
      method: 'POST', path: '/api/auth/firebase', title: 'Firebase OAuth',
      desc: 'Exchange a Firebase ID token (from Google/GitHub popup) for a session cookie.',
      body: `{ "idToken": "firebase-id-token-from-popup" }`,
      response: `{ "status": "success", "user": { ... } }`,
    },
  ],
  chat: [
    {
      method: 'GET', path: '/api/chats', title: 'List Conversations',
      desc: 'Returns all conversations for the authenticated user, newest first.',
      body: null,
      response: `{
  "status": "success",
  "chats": [
    { "_id": "...", "title": "My First Chat", "model": "gemini-pro", "createdAt": "..." }
  ]
}`,
    },
    {
      method: 'POST', path: '/api/chats', title: 'Create Conversation',
      desc: 'Creates a new conversation thread. Model defaults to gemini-pro.',
      body: `{ "title": "Research Session", "model": "gemini-pro" }`,
      response: `{ "status": "success", "chat": { "_id": "...", "title": "Research Session" } }`,
    },
    {
      method: 'DELETE', path: '/api/chats/:id', title: 'Delete Conversation',
      desc: 'Permanently deletes a conversation and all its messages.',
      body: null,
      response: `{ "status": "success", "message": "Chat deleted." }`,
    },
  ],
  messages: [
    {
      method: 'GET', path: '/api/messages/:chatId', title: 'Get Messages',
      desc: 'Returns all messages in a conversation, chronologically ordered.',
      body: null,
      response: `{
  "status": "success",
  "messages": [
    { "_id": "...", "role": "user", "content": "Hello!", "createdAt": "..." },
    { "_id": "...", "role": "assistant", "content": "Hello! How can I help?", "createdAt": "..." }
  ]
}`,
    },
    {
      method: 'POST', path: '/api/messages', title: 'Send Message',
      desc: 'Send a message and receive an AI response. Supports streaming via Socket.io.',
      body: `{
  "chatId": "65f1a2b3c4d5e6f7a8b9c0d1",
  "content": "Explain quantum entanglement simply.",
  "model": "gemini-pro"
}`,
      response: `{
  "status": "success",
  "userMessage": { "_id": "...", "role": "user", "content": "..." },
  "aiMessage": { "_id": "...", "role": "assistant", "content": "..." }
}`,
    },
  ],
  documents: [
    {
      method: 'POST', path: '/api/documents/upload', title: 'Upload Document',
      desc: 'Upload a PDF, DOCX, or TXT file. Max 10MB. Returns a document ID for querying.',
      body: `FormData: { file: <binary>, chatId: "optional-chat-id" }`,
      response: `{
  "status": "success",
  "document": { "_id": "...", "filename": "report.pdf", "status": "processing" }
}`,
    },
    {
      method: 'POST', path: '/api/documents/:id/chat', title: 'Chat with Document',
      desc: 'Ask a question about an uploaded document using the RAG pipeline.',
      body: `{ "message": "What are the key findings in section 3?" }`,
      response: `{ "status": "success", "answer": "The key findings are..." }`,
    },
    {
      method: 'GET', path: '/api/documents', title: 'List Documents',
      desc: 'Returns all documents uploaded by the authenticated user.',
      body: null,
      response: `{ "status": "success", "documents": [ { "_id": "...", "filename": "...", "status": "ready" } ] }`,
    },
  ],
  images: [
    {
      method: 'POST', path: '/api/images/generate', title: 'Generate Image',
      desc: 'Generate an image from a text prompt using Cloudflare AI or Pollinations.',
      body: `{
  "prompt": "A serene mountain lake at golden hour, photorealistic",
  "width": 1024,
  "height": 1024
}`,
      response: `{ "status": "success", "url": "https://...", "prompt": "..." }`,
    },
  ],
  websites: [
    {
      method: 'POST', path: '/api/websites/generate', title: 'Generate Website',
      desc: 'Generate a complete HTML/CSS/JS website from a natural language description.',
      body: `{ "prompt": "A minimalist portfolio website for a photographer" }`,
      response: `{ "status": "success", "html": "<!DOCTYPE html>..." }`,
    },
  ],
  seo: [
    {
      method: 'POST', path: '/api/seo/analyse', title: 'Analyse URL',
      desc: 'Perform a full SEO audit on a URL. Returns meta, keywords, readability, and structured data.',
      body: `{ "url": "https://your-site.com" }`,
      response: `{
  "status": "success",
  "result": {
    "title": "Your Page Title",
    "description": "...",
    "score": 82,
    "keywords": [...],
    "issues": [...]
  }
}`,
    },
  ],
  user: [
    {
      method: 'GET', path: '/api/user/profile', title: 'Get Profile',
      desc: 'Returns the full user profile for the authenticated user.',
      body: null,
      response: `{ "status": "success", "user": { "name": "...", "bio": "...", "avatar": "..." } }`,
    },
    {
      method: 'PATCH', path: '/api/user/profile', title: 'Update Profile',
      desc: 'Update name, bio, avatar, and preferences. Role and security fields are blocked.',
      body: `{
  "name": "New Name",
  "bio": "About me",
  "preferences": { "theme": "dark", "model": "gemini-pro" }
}`,
      response: `{ "status": "success", "user": { ... } }`,
    },
    {
      method: 'POST', path: '/api/user/api-keys', title: 'Create API Key',
      desc: 'Generate a new API key. The key is only shown once — store it securely.',
      body: `{ "name": "My Integration" }`,
      response: `{ "status": "success", "key": "ll_live_...", "name": "My Integration" }`,
    },
  ],
};

const METHOD_COLORS = {
  GET: 'get', POST: 'post', PUT: 'put', PATCH: 'patch', DELETE: 'delete',
};

/* ── Component ─────────────────────────────────────────────────────────── */
export default function ApiDocsPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState('intro');
  const [copied, setCopied] = useState(null);

  const copy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  const endpoints = ENDPOINTS[active] || [];

  return (
    <div className="api-docs-page">
      <Navbar />

      <div className="api-layout">
        {/* Sidebar */}
        <aside className="api-sidebar">
          <div className="api-sidebar-inner">
            <div className="api-sidebar-head">
              <span className="vis-lbl">API Reference</span>
              <div className="api-version">v1 · REST</div>
            </div>
            <nav className="api-nav">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  className={`api-nav-item ${active === s.id ? 'active' : ''}`}
                  onClick={() => setActive(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </nav>
            <div className="api-sidebar-footer">
              <button className="btn-solid-sm w-full" onClick={() => navigate('/signup')}>
                Get API Key
              </button>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="api-content">
          {active === 'intro' && <IntroSection copy={copy} copied={copied} navigate={navigate} />}
          {active === 'errors' && <ErrorsSection />}
          {endpoints.length > 0 && (
            <div className="api-endpoints">
              <div className="api-section-head">
                <span className="vis-lbl">{SECTIONS.find((s) => s.id === active)?.label}</span>
                <h2 className="api-h2">{SECTIONS.find((s) => s.id === active)?.label} API</h2>
              </div>
              {endpoints.map((ep, i) => (
                <EndpointBlock key={i} ep={ep} copy={copy} copied={copied} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function IntroSection({ copy, copied, navigate }) {
  return (
    <div className="api-endpoints">
      <div className="api-section-head">
        <span className="vis-lbl">API Reference</span>
        <h2 className="api-h2">Introduction</h2>
      </div>

      <div className="api-prose">
        <p>The LovellyLilly REST API lets you build integrations and custom clients on top of the full platform. Every feature available in the web app is accessible programmatically.</p>

        <h3>Base URL</h3>
        <div className="api-code-block">
          <code>{BASE_URL}</code>
          <button className="api-copy-btn" onClick={() => copy(BASE_URL, 'base')}>
            {copied === 'base' ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        <h3>Authentication</h3>
        <p>The API uses two authentication methods:</p>
        <ul>
          <li><strong>Session Cookie</strong> — Returned on login. Automatically included in browser requests. Recommended for web clients.</li>
          <li><strong>API Key</strong> — Pass as a header: <code>Authorization: Bearer ll_live_...</code>. Recommended for server-to-server integrations.</li>
        </ul>

        <h3>Request Format</h3>
        <p>All request bodies must be JSON with <code>Content-Type: application/json</code>. File uploads use <code>multipart/form-data</code>.</p>

        <h3>Response Format</h3>
        <div className="api-code-block">
          <pre><code>{`{
  "status": "success" | "error",
  "message": "Human-readable description",
  "data": { ... }  // varies by endpoint
}`}</code></pre>
        </div>

        <h3>Rate Limits</h3>
        <table className="api-table">
          <thead>
            <tr><th>Endpoint Group</th><th>Limit</th><th>Window</th></tr>
          </thead>
          <tbody>
            <tr><td>Auth (login, register)</td><td>15 requests</td><td>15 minutes</td></tr>
            <tr><td>AI Generation (images, video, websites)</td><td>30 requests</td><td>60 minutes</td></tr>
            <tr><td>Documents</td><td>50 requests</td><td>60 minutes</td></tr>
            <tr><td>General API</td><td>300 requests</td><td>60 minutes</td></tr>
          </tbody>
        </table>

        <div className="api-callout">
          <strong>Pro Tip:</strong> Rate limits are per-user when authenticated, per-IP when anonymous. API key requests always count as authenticated.
        </div>
      </div>
    </div>
  );
}

function ErrorsSection() {
  const ERRORS = [
    { code: 400, name: 'Bad Request', desc: 'The request body failed validation. Check the message field for details.' },
    { code: 401, name: 'Unauthorized', desc: 'Missing or invalid authentication. Login or provide a valid API key.' },
    { code: 403, name: 'Forbidden', desc: 'Authenticated but not permitted to access this resource.' },
    { code: 404, name: 'Not Found', desc: 'The requested resource does not exist.' },
    { code: 409, name: 'Conflict', desc: 'The request conflicts with existing data (e.g. email already registered).' },
    { code: 429, name: 'Too Many Requests', desc: 'Rate limit exceeded. Check the Retry-After header.' },
    { code: 500, name: 'Internal Server Error', desc: 'Something went wrong on our end. Try again or contact support.' },
  ];
  return (
    <div className="api-endpoints">
      <div className="api-section-head">
        <span className="vis-lbl">Reference</span>
        <h2 className="api-h2">Error Codes</h2>
      </div>
      <div className="api-prose">
        <p>All errors return a consistent JSON body:</p>
        <div className="api-code-block">
          <pre><code>{`{ "status": "error", "message": "Descriptive error message" }`}</code></pre>
        </div>
        <table className="api-table">
          <thead>
            <tr><th>Code</th><th>Name</th><th>Description</th></tr>
          </thead>
          <tbody>
            {ERRORS.map((e) => (
              <tr key={e.code}>
                <td><span className={`api-status-code api-code-${e.code < 500 ? '4xx' : '5xx'}`}>{e.code}</span></td>
                <td><strong>{e.name}</strong></td>
                <td>{e.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EndpointBlock({ ep, copy, copied }) {
  const id = `${ep.method}-${ep.path}`;
  return (
    <div className="api-endpoint-block">
      <div className="api-ep-header">
        <span className={`api-method api-method-${METHOD_COLORS[ep.method]}`}>{ep.method}</span>
        <code className="api-path">{ep.path}</code>
        <span className="api-ep-title">{ep.title}</span>
      </div>
      <p className="api-ep-desc">{ep.desc}</p>

      {ep.body && (
        <div className="api-ep-section">
          <div className="api-ep-label">Request Body</div>
          <div className="api-code-block">
            <pre><code>{ep.body}</code></pre>
            <button className="api-copy-btn" onClick={() => copy(ep.body, `${id}-body`)}>
              {copied === `${id}-body` ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      <div className="api-ep-section">
        <div className="api-ep-label">Response</div>
        <div className="api-code-block">
          <pre><code>{ep.response}</code></pre>
          <button className="api-copy-btn" onClick={() => copy(ep.response, `${id}-res`)}>
            {copied === `${id}-res` ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
