// =============================================
// TOKEN SUPER ENCRYPTED - JANGAN COBA DIEDIT!
// =============================================
(function() {
    // ==================== LAYER 1: CAESAR CIPHER ====================
    const caesarDecode = (str, shift) => {
        return str.split('').map(char => {
            if (char.match(/[a-zA-Z0-9=+/]/)) {
                // Geser karakter
                let code = char.charCodeAt(0);
                if (code >= 65 && code <= 90) { // A-Z
                    code = ((code - 65 - shift + 26) % 26) + 65;
                } else if (code >= 97 && code <= 122) { // a-z
                    code = ((code - 97 - shift + 26) % 26) + 97;
                } else if (code >= 48 && code <= 57) { // 0-9
                    code = ((code - 48 - shift + 10) % 10) + 48;
                }
                return String.fromCharCode(code);
            }
            return char;
        }).join('');
    };

    // ==================== LAYER 2: REVERSE STRING ====================
    const reverseStr = (str) => str.split('').reverse().join('');

    // ==================== LAYER 3: BASE64 ====================
    // Token dalam bentuk super encrypted (gak keliatan wujud aslinya)
    const superEncrypted = {
        // BOT_TOKEN: hasil dari encode3Layer("7689769594:AAHf2Cgf3m_7GJthEl3oBp-Ez2Jqa6EfiEM")
        bot1: "9N25McjMZmxNUUl2YkJ1dWtNMnJ5QVJpcDdGMWpmQzdBaG5mbnI0YWV4c1l3Rko=",
        bot2: "VnpjeE5XaFlSRWRnVmpCVVlWbGpRVzloU1Zac1lWUnNkbUZIVm5Wa1IxWjNZMjFHYzJSSGVEQlVWbFUwV2xNMWVGcFhTbk5YVjFwWVlWY3hkVlJYU1hOSlIxWnNaRWQ0Y0Zac2JEWEo=",
        
        // VERCEL_TOKEN: hasil dari encode3Layer("")
        vercel1: "Wm5waFJuaG9UVzFIVHpOb1IzQmFaa2R2WTI1cmRtRldaV3h2VkZab1dsWlNlVzFzV2xkNGJsWlhRVFZTVlZwRVpFZEdiMDFXYkVWVA==",
        vercel2: "R0ZoVlJrTlZWakF3VmpGS01HRlhWWFpOYWxKRFpXdFdkVmt5ZDNsUVJrcElaRWM1YzJKWVZqQlNiVlpJVkZSTmVFMUhSWHBOYlVwRFpFZFZkMDFVU2xaUFZrcEdUMVJyUFE9PQ==",
        
        // OWNER_ID: hasil dari encode3Layer("6336062767")
        owner: "VnpjeE5XaFlSRWRnVmpCVVlWbGpRVzloU1Zac1lWUnNkbUZIVm5WSlZqQk9lVlV5UlhsTlZscFhZMFpPZGxsVVFuZFVNRlpXVUcxS2RGWlhNVFJVUmxabFdXcE9RVlZ0TVhwaFYwWm9Zek5rYUdSSE1EUlViVXB5V2xNMWVGVlVSbGRhUjFadVl6TlNlbVZYU2xoTlZrWnFaREpPYzJSSE1ucGpiVVp2WkVoQ2NGVnFRbTlWTURWSFZXcEdZV0pWUlRsYVJFRjBURlJDTjFwWE1UUlpWRVpQVFVSV2RGVlhlR3RqYlRGblNXcEdZV1ZWT1hWYU1VcDJURU5vYzJSSGVEVlJSMVowWkROb2FGUnJiRFJPVkVaelNVaEthV0pIY0RCYVJUVkVaRzV3UT09"
    };

    // ==================== FUNGSI DECODE SUPER ====================
    window.__getTokens = function() {
        // Langkah 1: Base64 decode
        const step1_bot1 = atob(superEncrypted.bot1);
        const step1_bot2 = atob(superEncrypted.bot2);
        const step1_vercel1 = atob(superEncrypted.vercel1);
        const step1_vercel2 = atob(superEncrypted.vercel2);
        const step1_owner = atob(superEncrypted.owner);
        
        // Langkah 2: Reverse string
        const step2_bot1 = reverseStr(step1_bot1);
        const step2_bot2 = reverseStr(step1_bot2);
        const step2_vercel1 = reverseStr(step1_vercel1);
        const step2_vercel2 = reverseStr(step1_vercel2);
        const step2_owner = reverseStr(step1_owner);
        
        // Langkah 3: Caesar cipher (shift 5)
        const step3_bot1 = caesarDecode(step2_bot1, 5);
        const step3_bot2 = caesarDecode(step2_bot2, 5);
        const step3_vercel1 = caesarDecode(step2_vercel1, 5);
        const step3_vercel2 = caesarDecode(step2_vercel2, 5);
        const step3_owner = caesarDecode(step2_owner, 5);
        
        // Langkah 4: Gabungkan token yang terpisah
        const BOT_TOKEN = step3_bot1 + step3_bot2;
        const VERCEL_TOKEN = step3_vercel1 + step3_vercel2;
        const OWNER_ID = parseInt(step3_owner);
        const CHANNEL_USERNAME = "@zamshtml";
        
        return {
            BOT_TOKEN: BOT_TOKEN,
            VERCEL_TOKEN: VERCEL_TOKEN,
            OWNER_ID: OWNER_ID,
            CHANNEL_USERNAME: CHANNEL_USERNAME
        };
    };
})();
