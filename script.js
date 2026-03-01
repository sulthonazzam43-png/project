// ==================== GLOBAL VARIABLES ====================
const tokens = window.__getTokens();
const BOT_TOKEN = tokens.BOT_TOKEN;
const VERCEL_TOKEN = tokens.VERCEL_TOKEN;
const OWNER_ID = tokens.OWNER_ID;
const CHANNEL_USERNAME = tokens.CHANNEL_USERNAME;

let currentUser = null;
let isAdmin = false;
let users = JSON.parse(localStorage.getItem('zams_users')) || [];
let deploys = JSON.parse(localStorage.getItem('zams_deploys')) || [];
let currentMode = null;
let currentFile = null;

// ==================== UTILITY FUNCTIONS ====================
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showStatus(msg, type) {
    const box = document.getElementById('statusBox');
    box.className = `status-box ${type}`;
    box.innerHTML = msg;
    setTimeout(() => {
        box.style.display = 'none';
    }, 5000);
}

function updateStats() {
    document.getElementById('totalUsers').innerText = users.length;
    document.getElementById('totalDeploys').innerText = deploys.length;
    if (deploys.length > 0) {
        const last = deploys[deploys.length - 1];
        document.getElementById('lastDeploy').innerText = last.time;
    }
}

// ==================== AUTH FUNCTIONS ====================
async function checkTelegramJoin(userId) {
    try {
        // Bersihin userId dari spasi
        userId = userId.trim();
        
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_USERNAME,
                user_id: parseInt(userId)
            })
        });
        
        const data = await response.json();
        console.log('Telegram API Response:', data); // Debug
        
        if (data.ok) {
            const status = data.result.status;
            return ['member', 'administrator', 'creator'].includes(status);
        } else {
            // Tampilkan error detail
            showStatus(`❌ API Error: ${data.description}`, 'error');
            return false;
        }
    } catch (e) {
        console.log('Fetch Error:', e);
        showStatus('❌ Gagal connect ke Telegram. Cek koneksi atau CORS.', 'error');
        return false;
    }
}
async function login() {
    const userId = document.getElementById('telegramId').value.trim();
    if (!userId) {
        showStatus('❌ Masukkan Telegram ID!', 'error');
        return;
    }

    showLoading();
    const joined = await checkTelegramJoin(userId);
    hideLoading();

    if (!joined) {
        showStatus('❌ Kamu belum join channel! Join dulu ya.', 'error');
        return;
    }

    currentUser = userId;
    isAdmin = (parseInt(userId) === OWNER_ID);
    
    if (!users.includes(userId)) {
        users.push(userId);
        localStorage.setItem('zams_users', JSON.stringify(users));
    }

    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('userName').innerHTML = `<i class="fas fa-user"></i> ID: ${userId}`;
    
    if (isAdmin) {
        document.getElementById('adminMenu').style.display = 'block';
    }

    updateStats();
}

function logout() {
    currentUser = null;
    isAdmin = false;
    currentMode = null;
    currentFile = null;
    
    document.getElementById('loginBox').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('telegramId').value = '';
    
    // Reset semua UI
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('domainInput').style.display = 'none';
    document.getElementById('encryptBtn').style.display = 'none';
    document.getElementById('decryptBtn').style.display = 'none';
    document.getElementById('usersList').style.display = 'none';
}

// ==================== MENU FUNCTIONS ====================
function showDeploy() {
    currentMode = 'deploy';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('domainInput').style.display = 'none';
    document.getElementById('encryptBtn').style.display = 'none';
    document.getElementById('decryptBtn').style.display = 'none';
    showStatus('📤 Upload file HTML yang mau di-deploy', 'info');
}

function showEncrypt() {
    currentMode = 'encrypt';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('domainInput').style.display = 'none';
    document.getElementById('encryptBtn').style.display = 'none';
    document.getElementById('decryptBtn').style.display = 'none';
    showStatus('🔒 Upload file HTML untuk dienkripsi', 'info');
}

function showDecrypt() {
    currentMode = 'decrypt';
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('domainInput').style.display = 'none';
    document.getElementById('encryptBtn').style.display = 'none';
    document.getElementById('decryptBtn').style.display = 'none';
    showStatus('🔓 Upload file HTML terenkripsi', 'info');
}

function showUsers() {
    if (!isAdmin) return;
    
    currentMode = 'users';
    document.getElementById('uploadArea').style.display = 'none';
    document.getElementById('domainInput').style.display = 'none';
    document.getElementById('encryptBtn').style.display = 'none';
    document.getElementById('decryptBtn').style.display = 'none';
    
    let html = '<h3>📋 Registered Users</h3>';
    users.forEach(userId => {
        html += `
            <div class="user-item">
                <span class="user-id">${userId}</span>
                <div class="user-actions">
                    <button onclick="removeUser('${userId}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    
    document.getElementById('usersList').innerHTML = html;
    document.getElementById('usersList').style.display = 'block';
}

function removeUser(userId) {
    if (!isAdmin) return;
    users = users.filter(id => id !== userId);
    localStorage.setItem('zams_users', JSON.stringify(users));
    showUsers();
    updateStats();
}

// ==================== FILE HANDLING ====================
document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.html')) {
        showStatus('❌ File harus .html!', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
        currentFile = {
            name: file.name,
            content: event.target.result
        };
        
        if (currentMode === 'deploy') {
            document.getElementById('domainInput').style.display = 'block';
        } else if (currentMode === 'encrypt') {
            document.getElementById('encryptBtn').style.display = 'block';
        } else if (currentMode === 'decrypt') {
            document.getElementById('decryptBtn').style.display = 'block';
        }
    };
    reader.readAsText(file);
});

// ==================== DEPLOY FUNCTION ====================
async function deploy() {
    const domain = document.getElementById('domainName').value.trim().toLowerCase();
    if (!domain) {
        showStatus('❌ Masukkan domain!', 'error');
        return;
    }
    
    if (!/^[a-z0-9-]+$/.test(domain)) {
        showStatus('❌ Domain hanya boleh huruf, angka, dan -', 'error');
        return;
    }
    
    showLoading();
    
    try {
        const base64 = btoa(currentFile.content);
        
        const response = await fetch('https://api.vercel.com/v13/deployments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${VERCEL_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: domain,
                files: [
                    {
                        file: 'index.html',
                        data: base64,
                        encoding: 'base64'
                    }
                ],
                projectSettings: { framework: null },
                target: 'production'
            })
        });
        
        if (!response.ok) throw new Error('Deploy gagal');
        
        const result = await response.json();
        const link = `https://${domain}.vercel.app`;
        
        deploys.push({
            user: currentUser,
            domain: domain,
            link: link,
            time: new Date().toLocaleString()
        });
        localStorage.setItem('zams_deploys', JSON.stringify(deploys));
        
        showStatus(`✅ Deploy sukses! <a href="${link}" target="_blank">${link}</a>`, 'success');
        updateStats();
        
        // Reset UI
        document.getElementById('domainInput').style.display = 'none';
        document.getElementById('fileInput').value = '';
        currentFile = null;
        
    } catch (e) {
        showStatus(`❌ Error: ${e.message}`, 'error');
    }
    
    hideLoading();
}

// ==================== ENCRYPT FUNCTION ====================
function processEncrypt() {
    if (!currentFile) return;
    
    const base64Data = btoa(currentFile.content);
    const title = currentFile.name.replace('.html', '');
    
    const encrypted = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${title}</title></head>
<body>
<script>document.write(atob("${base64Data}"));</script>
</body>
</html>`;
    
    const blob = new Blob([encrypted], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encrypted_${Date.now()}.html`;
    a.click();
    
    showStatus('✅ Enkripsi berhasil! File didownload.', 'success');
    document.getElementById('fileInput').value = '';
    currentFile = null;
    document.getElementById('encryptBtn').style.display = 'none';
}

// ==================== DECRYPT FUNCTION ====================
function processDecrypt() {
    if (!currentFile) return;
    
    const match = currentFile.content.match(/atob\("(.+)"\)/);
    if (!match) {
        showStatus('❌ File tidak valid!', 'error');
        return;
    }
    
    const decoded = atob(match[1]);
    
    const blob = new Blob([decoded], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `decrypted_${Date.now()}.html`;
    a.click();
    
    showStatus('✅ Dekripsi berhasil! File didownload.', 'success');
    document.getElementById('fileInput').value = '';
    currentFile = null;
    document.getElementById('decryptBtn').style.display = 'none';
}

// ==================== INIT ====================
updateStats();
