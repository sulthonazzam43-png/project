export default async function handler(req, res) {

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL = process.env.CHANNEL_USERNAME;

const id = req.query.id;

if(!id){
return res.json({ ok:false });
}

try{

const response = await fetch(
`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=@${CHANNEL}&user_id=${id}`
);

const data = await response.json();

if(
data.result &&
(data.result.status == "member" ||
data.result.status == "administrator" ||
data.result.status == "creator")
){
return res.json({ ok:true });
}

return res.json({ ok:false });

}catch(e){
return res.json({ ok:false });
}
}
