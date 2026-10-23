import {env} from 'cloudflare:workers';
import {Room,start,tick,publicRoom} from '../../../lib/game';
export async function POST(req:Request){
 try{
 const b=await req.json() as any;const db=env.DB!;
 if(!b.player||typeof b.player!=='string'||b.player.length>80)return Response.json({error:'Invalid player'},{status:400});
 b.player=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(b.player)))).map(v=>v.toString(16).padStart(2,'0')).join('');
 if(b.action==='create'){
 const id=crypto.randomUUID().slice(0,8).toUpperCase();const r:Room={id,host:b.player,players:[{id:b.player,name:String(b.name||'Player').slice(0,18),bot:false}],status:'waiting',round:0,matches:[],created:Date.now()};
 if(b.practice){['Pixel','Nova','Ghost','Echo','Blitz','Orbit','Flux'].forEach((name,i)=>r.players.push({id:'bot'+i,name,bot:true}));start(r)}
 await db.prepare('INSERT INTO rooms (id,state,version) VALUES (?,?,0)').bind(id,JSON.stringify(r)).run();return Response.json(publicRoom(r,b.player));}
 for(let attempt=0;attempt<8;attempt++){
 const row=await db.prepare('SELECT state,version FROM rooms WHERE id=?').bind(String(b.room||'').toUpperCase()).first<{state:string,version:number}>();if(!row)return Response.json({error:'Room not found. Check the code.'},{status:404});
 const r:Room=JSON.parse(row.state);tick(r);
 if(b.action==='join'&&!r.players.some(p=>p.id===b.player)){if(r.status!=='waiting'||r.players.length>=8)throw Error('This room is full or already playing.');r.players.push({id:b.player,name:String(b.name||'Player').slice(0,18),bot:false})}
 if(b.action==='start'){if(r.host!==b.player||r.status!=='waiting')throw Error('Only the host can start a waiting room.');if(b.fill){let i=0;while(r.players.length<8)r.players.push({id:'bot'+i,name:['Pixel','Nova','Ghost','Echo','Blitz','Orbit','Flux'][i++],bot:true})}if(r.players.length!==8)throw Error('Eight players are needed. Invite friends or add practice bots.');start(r)}
 if(b.action==='move'){
 const m=r.matches[r.round]?.find(m=>m.id===b.match);if(!m||m.winner||m.revealUntil||r.status!=='playing')throw Error('That throw has ended.');const i=m.a===b.player?0:m.b===b.player?1:-1;
 if(i<0||![0,1,2].includes(b.move)||m.moves[i]!==null)throw Error('Move already locked or invalid.');m.moves[i]=b.move;tick(r);
 }
 const updated=await db.prepare('UPDATE rooms SET state=?,version=version+1 WHERE id=? AND version=?').bind(JSON.stringify(r),r.id,row.version).run();if(updated.meta.changes)return Response.json(publicRoom(r,b.player));
 }
 return Response.json({error:'Room is busy. Please retry.'},{status:409});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Unable to connect'},{status:400})}
}
