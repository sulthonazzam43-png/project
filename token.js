// =============================================
// TOKEN DIAMBIL DARI ENVIRONMENT VERCEL
// =============================================
(function() {
    window.__getTokens = function() {
        // Token diambil dari environment variable Vercel
        // Cara set di Vercel: 
        // Settings → Environment Variables → Tambahin:
        // BOT_TOKEN, VERCEL_TOKEN, OWNER_ID, CHANNEL_USERNAME
        
        return {
            BOT_TOKEN: window.VERCEL_ENV?.BOT_TOKEN || "fallback_token_jangan_dipakai",
            VERCEL_TOKEN: window.VERCEL_ENV?.TOKEN_VERCEL || "fallback_vercel_token",
            OWNER_ID: parseInt(window.VERCEL_ENV?.OWNER_ID || "6336062767"),
            CHANNEL_USERNAME: window.VERCEL_ENV?.CHANNEL_USERNAME || "@zamshtml"
        };
    };
})();
