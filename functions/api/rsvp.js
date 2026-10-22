
export async function onRequestPost({request,env}) {
 if(!env.DB)return Response.json({error:'回答の保存先が未設定です'},{status:503});
 let data;try{data=await request.json()}catch{return Response.json({error:'入力内容が不正です'},{status:400})}
 const fields=['guest','email','wedding','after','mayukoSeat','stay','checkin','people','roommate','children','childCount','allergy','note'];
 for(let i=1;i<=5;i++)fields.push('childName'+i,'childAge'+i,'childMeal'+i);
 const clean={};for(const k of fields)clean[k]=typeof data[k]==='string'?data[k].trim().slice(0,1200):'';
 if(!clean.guest||!/^\S+@\S+\.\S+$/.test(clean.email)||!['出席する','欠席する'].includes(clean.wedding)||!['参加する','参加しない','検討中'].includes(clean.after)||!['希望する','希望しない','検討中'].includes(clean.stay)||!['同伴する','同伴しない'].includes(clean.children))return Response.json({error:'必須項目を確認してください'},{status:400});
 if(clean.after==='参加する'&&!['OK','同じテーブルはOK','迷う','困る'].includes(clean.mayukoSeat))return Response.json({error:'まゆ子さんとの同席希望を選んでください'},{status:400});
 if(clean.after!=='参加する')clean.mayukoSeat='';
 if(clean.stay!=='希望する')for(const k of ['checkin','people','roommate'])clean[k]='';
 if(clean.stay==='希望する'&&(!clean.checkin||!clean.people))return Response.json({error:'宿泊情報を確認してください'},{status:400});
 if(clean.children==='同伴する'&&(!clean.childCount||!clean.childName1||!clean.childAge1))return Response.json({error:'お子様の情報を確認してください'},{status:400});
 const id=crypto.randomUUID();
 try{
  await env.DB.prepare('INSERT INTO wedding_rsvps (id,guest,email,wedding,after_party,mayuko_seat,stay,children,payload,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(id,clean.guest,clean.email,clean.wedding,clean.after,clean.mayukoSeat,clean.stay,clean.children,JSON.stringify(clean),new Date().toISOString()).run();
  return Response.json({ok:true,id:id.slice(0,8)});
 }catch{return Response.json({error:'保存に失敗しました'},{status:500})}
}
