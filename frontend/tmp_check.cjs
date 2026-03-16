const fs = require('fs');
const path = require('path');

const basePath = 'c:/Users/abhij/OneDrive/Desktop/hustlebuild/frontend/src';

const filesToCheck = [
  'components/layout/AppShell.jsx',
  'components/layout/Navbar.jsx',
  'components/layout/Sidebar.jsx',
  'components/layout/AuthLayout.jsx',
  'components/layout/StudioLayout.jsx',
  'components/ui/Button.jsx',
  'components/ui/Input.jsx',
  'components/ui/Card.jsx',
  'components/ui/Badge.jsx',
  'components/ui/Modal.jsx',
  'components/ui/Skeleton.jsx',
  'components/ui/Avatar.jsx',
  'components/ui/Logo.jsx',
  'components/ui/SegmentedControl.jsx',
  'components/ui/ProgressRing.jsx',
  'components/ui/PasswordStrengthMeter.jsx',
  'context/SocketContext.jsx',
  'context/AuthContext.jsx',
  'features/auth/pages/LoginPage.jsx',
  'features/auth/pages/SignupPage.jsx',
  'features/auth/pages/VerifyEmailPage.jsx',
  'features/auth/pages/ForgotPasswordPage.jsx',
  'features/auth/pages/ResetPasswordPage.jsx',
  'features/auth/hooks/useAuth.js',
  'features/auth/services/auth.api.js',
  'features/auth/auth.context.jsx',
  'features/chat/pages/DashboardPage.jsx',
  'features/chat/components/ChatInput.jsx',
  'features/chat/components/MessageBubble.jsx',
  'features/chat/components/ConversationSidebar.jsx',
  'features/chat/components/SourcesPanel.jsx',
  'features/chat/components/QueryModeBadge.jsx',
  'features/chat/components/FollowUpChips.jsx',
  'features/chat/hooks/useChat.js',
  'features/chat/hooks/useSocket.js',
  'features/chat/services/chat.api.js',
  'features/chat/chat.context.jsx',
  'features/studio/pages/ImageStudioPage.jsx',
  'features/studio/pages/VideoStudioPage.jsx',
  'features/studio/pages/WebsiteBuilderPage.jsx',
  'features/studio/services/studio.api.js',
  'features/documents/pages/DocumentVaultPage.jsx',
  'features/documents/services/documents.api.js',
  'features/user/pages/SettingsPage.jsx',
  'features/user/services/user.api.js',
  'features/admin/pages/AdminDashboard.jsx',
  'features/admin/services/admin.api.js',
  'features/voice/components/VoiceModal.jsx',
  'features/voice/hooks/useVoice.js'
];

const results = filesToCheck.map(file => {
  const fullPath = path.join(basePath, file);
  return { file, exists: fs.existsSync(fullPath) };
});

const missing = results.filter(r => !r.exists);
console.log('--- MISSING FILES ---');
missing.forEach(m => console.log(m.file));
console.log(`\nTotal checked: ${results.length}`);
console.log(`Missing: ${missing.length}`);
