const admin = require("firebase-admin");

let initialized = false;

/**
 * Lazily initialises Firebase Admin SDK using service-account env vars.
 * Skips init if the required vars are absent (feature disabled gracefully).
 */
function getAdmin() {
    if (initialized) return admin;

    const {
        FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY,
    } = process.env;

    if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
        return null; // Firebase not configured — callers must handle null
    }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId:   FIREBASE_PROJECT_ID,
            clientEmail: FIREBASE_CLIENT_EMAIL,
            // Private key is stored with literal \n in env — replace with real newlines
            privateKey:  FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
    });

    initialized = true;
    return admin;
}

/**
 * Verifies a Firebase ID token and returns the decoded payload.
 * Throws an error if the token is invalid or Firebase is not configured.
 */
exports.verifyIdToken = async (idToken) => {
    const firebaseAdmin = getAdmin();
    if (!firebaseAdmin) {
        const err = new Error("Firebase authentication is not configured on this server.");
        err.statusCode = 503;
        throw err;
    }
    const decoded = await firebaseAdmin.auth().verifyIdToken(idToken);
    return decoded; // { uid, email, name, picture, email_verified, ... }
};
