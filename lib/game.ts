export type Player={id:string,name:string,bot:boolean};
export type Match={id:string,a:string,b:string,score:number[],moves:(number|null)[],miss:number[],deadline:number,revealUntil:number,last:(number|null)[]|null,winner:string|null,history:string[]};
export type Room={id:string,host:string,players:Player[],status:string,round:number,matches:Match[][],created:number};
const rand=()=>crypto.getRandomValues(new Uint32Array(1))[0]/4294967296;
export function match(a:string,b:string):Match{return {id:crypto.randomUUID(),a,b,score:[0,0],moves:[null,null],miss:[0,0],deadline:Date.now()+7000,revealUntil:0,last:null,winner:null,history:[]}}
export function start(r:Room){let ids=r.players.map(p=>p.id);for(let i=ids.length-1;i>0;i--){let j=Math.floor(rand()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]]}r.status='playing';r.round=0;r.matches=[[]];for(let i=0;i<8;i+=2)r.matches[0].push(match(ids[i],ids[i+1]));}
export function tick(r:Room,now=Date.now()){
 if(r.status!=='playing')return;
 for(const m of r.matches[r.round]){
 if(m.winner)continue;
 if(m.revealUntil){if(now<m.revealUntil)continue;m.revealUntil=0;m.last=null;m.moves=[null,null];m.deadline=now+7000;}
 [m.a,m.b].forEach((id,i)=>{if(r.players.find(p=>p.id===id)?.bot&&m.moves[i]===null)m.moves[i]=Math.floor(rand()*3)});
 if(m.moves.some(x=>x===null)&&now<m.deadline)continue;
 const [a,b]=m.moves;m.last=[a,b];m.revealUntil=now+3200;
 let winner=-1;
 if(a===null||b===null){[a,b].forEach((v,i)=>{m.miss[i]=v===null?m.miss[i]+1:0});winner=a===null&&b!==null?1:b===null&&a!==null?0:-1;m.history.push('Timeout');}
 else {m.miss=[0,0];winner=a===b?-1:(a-b+3)%3===1?0:1;m.history.push(winner<0?'Tie':`${winner===0?'A':'B'} wins`)}
 if(winner>=0)m.score[winner]++;
 if(m.miss[0]>=2&&m.miss[1]>=2){r.status='cancelled';return;}
 if(m.score[0]>=3||m.miss[1]>=2)m.winner=m.a;
 if(m.score[1]>=3||m.miss[0]>=2)m.winner=m.b;
 }
 const current=r.matches[r.round];
 if(current.every(m=>m.winner&&now>=m.revealUntil)){
 if(r.round===2){r.status='finished';return;}
 const winners=current.map(m=>m.winner!);r.round++;r.matches.push([]);for(let i=0;i<winners.length;i+=2)r.matches[r.round].push(match(winners[i],winners[i+1]));
 }
}
export function publicRoom(r:Room,viewer:string){return {...r,myId:viewer,host:undefined,isHost:r.host===viewer,matches:r.matches.map(ms=>ms.map(m=>({...m,moves:undefined,locked:m.moves.map(x=>x!==null),myMove:m.a===viewer?m.moves[0]:m.b===viewer?m.moves[1]:null})))}}
