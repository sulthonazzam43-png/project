// =============================================
// TOKEN TERSEMBUNYI - JANGAN DIEDIT LANGSUNG!
// =============================================
(function() {
    // Token dalam bentuk encoded (biar gak keliatan)
    const encodedToken = "NzY4OTc2OTU5NDpBQUhmMkNnZjNtXzdHSnRoRWwzb0JwLUV6MkpxYTZFaWZFTQ==";
    const encodedVercel = "dmNwXzhrUnQ3RUpub3pqSDdkb2p4WFc5RjI2TEFyQlVMRGxpcXNKeDhveFRSWGFXUk00MG4xSmZjeUk=";
    const encodedOwner = "NjMzNjA2Mjc2Nw==";
    const encodedChannel = "QHphbXNodG1s";
    
    // Fungsi decode (base64)
    window.__getTokens = function() {
        return {
            BOT_TOKEN: atob(encodedToken),
            VERCEL_TOKEN: atob(encodedVercel),
            OWNER_ID: parseInt(atob(encodedOwner)),
            CHANNEL_USERNAME: atob(encodedChannel)
        };
    };
})();
