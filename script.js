const CHANNEL = "zamshtml";

/* LOGIN TELEGRAM */
async function login(){

let id = document.getElementById("telegramId").value;
let status = document.getElementById("loginStatus");

if(!id) return status.innerHTML = "Masukkan ID";

status.innerHTML = "Checking...";

/*
NOTE:
Ini dummy verification.
Untuk production gunakan API:
https://api.telegram.org/botTOKEN/getChatMember
*/

try{

let res = await fetch("/api/verify?id="+id);
let data = await res.json();

if(!data.ok){

status.className="error";
status.innerHTML = `
Anda belum join channel <br>
<a href="https://t.me/${CHANNEL}" target="_blank">Join Channel</a>
`;
return;
}

document.getElementById("loginCard").classList.add("hidden");
document.getElementById("dashboard").classList.remove("hidden");

}catch(e){
status.innerHTML="Server error";
}

}


/* TAB SWITCH */
function showTab(tab){

document.querySelectorAll(".tab").forEach(t=>{
t.classList.add("hidden");
});

document.getElementById(tab).classList.remove("hidden");
}


/* DEPLOY */
async function deploy(){

let file = document.getElementById("deployFile").files[0];
let domain = document.getElementById("domain").value;
let status = document.getElementById("deployStatus");

if(!file) return status.innerHTML="Upload file dulu";

let text = await file.text();

status.innerHTML="Deploying...";

try{

let res = await fetch("/api/deploy",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
html:text,
name:domain
})
});

let data = await res.json();

status.className="success";
status.innerHTML=`Deploy sukses:<br>${data.url}`;

}catch(e){
status.className="error";
status.innerHTML="Deploy gagal";
}

}


/* ENCRYPT */
async function encryptFile(){

let file = document.getElementById("encryptFile").files[0];
if(!file) return alert("Upload file");

let text = await file.text();

let base64 = btoa(text);

let output = `
<script>
document.write(atob("${base64}"))
</script>
`;

let blob = new Blob([output], {type:"text/html"});
let url = URL.createObjectURL(blob);

let link = document.getElementById("downloadEncrypt");
link.href = url;
link.download = "encrypted.html";
link.classList.remove("hidden");
link.innerText="Download File";
}


/* DECRYPT */
async function decryptFile(){

let file = document.getElementById("decryptFile").files[0];
if(!file) return alert("Upload file");

let text = await file.text();

let base64 = text.match(/atob\\("(.*?)"\\)/);

if(!base64) return alert("Format salah");

let decoded = atob(base64[1]);

let blob = new Blob([decoded], {type:"text/html"});
let url = URL.createObjectURL(blob);

let link = document.getElementById("downloadDecrypt");
link.href = url;
link.download = "decrypted.html";
link.classList.remove("hidden");
link.innerText="Download File";
}
