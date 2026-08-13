import { useState } from 'react';
import Landing from './Landing';

type Option={id:string;icon:string;title:string;detail?:string};
const questions:[string,string,Option[]][]=[
 ['Como está a sua rotina hoje, de verdade?','Sem julgamento. Só seja real.',[
  {id:'chaos',icon:'🌪️',title:'Um caos total, faço tudo de última hora'},
  {id:'stop',icon:'😮‍💨',title:'Tento me organizar, mas largo em poucos dias'},
  {id:'scatter',icon:'📝',title:'Anoto em mil lugares e me perco'},
  {id:'steady',icon:'🌱',title:'Sou organizada, mas falta constância'},
  {id:'all',icon:'✦',title:'Um pouco de tudo isso'}]],
 ['O que mais te trava no dia a dia?','A resposta mostra por onde o apoio precisa começar.',[
  {id:'start',icon:'⌛',title:'Não sei por onde começar'},
  {id:'guilt',icon:'💔',title:'A culpa quando não cumpro o que planejei'},
  {id:'forget',icon:'🔔',title:'Esqueço das coisas importantes'},
  {id:'quit',icon:'🌤️',title:'Ninguém me cobra, aí eu desisto'},
  {id:'all',icon:'✦',title:'Todas as opções'}]],
 ['O que você mais quer organizar primeiro?','Você não precisa resolver tudo de uma vez.',[
  {id:'care',icon:'✨',title:'Meus hábitos e autocuidado'},
  {id:'wellbeing',icon:'🥗',title:'Alimentação, sono e treinos'},
  {id:'life',icon:'⌂',title:'Casa, contas e vida prática'},
  {id:'work',icon:'📚',title:'Estudos, trabalho e compromissos'},
  {id:'all',icon:'🌷',title:'Sinceramente? Tudo junto'}]],
 ['Quanto tempo por dia você tem para se organizar?','O seu plano precisa caber na vida que você tem.',[
  {id:'five',icon:'⚡',title:'Uns 5 minutinhos, no máximo'},
  {id:'fifteen',icon:'🕰️',title:'Uns 15 minutos'},
  {id:'thirty',icon:'☕',title:'Meia hora, se render'},
  {id:'none',icon:'🏃',title:'Zero. Minha rotina já é corrida demais'},
  {id:'all',icon:'✦',title:'Depende do dia'}]]
];
export default function DiscoveryQuiz(){const [step,setStep]=useState(0),[answers,setAnswers]=useState<string[]>([]),[phase,setPhase]=useState<'quiz'|'loading'|'result'|'offer'>('quiz');if(phase==='offer')return <Landing/>;const q=questions[step];const choose=(o:Option)=>{setAnswers(a=>[...a,o.id]);if(step===questions.length-1){setPhase('loading');window.setTimeout(()=>setPhase('result'),950)}else window.setTimeout(()=>setStep(n=>n+1),170)};const profile=answers[0]==='steady'?'Você já faz muita coisa — agora falta ter apoio para continuar.':answers[0]==='chaos'?'Você não é desorganizada. Você está tentando lembrar de tudo sozinha.':answers[0]==='scatter'?'Você não precisa de mais uma lista. Precisa de um lugar que reúna a sua vida.':'Você não precisa de uma rotina perfeita. Precisa de um ritmo possível.';return <main className="model-quiz reference-quiz"><div className="model-shell"><a className="model-brand" href="/"><img src="/essence-life-logo.png" alt=""/><span>Essence Life</span></a>{phase==='quiz'&&<><div className="model-status"><span>{Math.round((step+1)/questions.length*100)}%</span></div><div className="model-progress"><i style={{width:`${(step+1)/questions.length*100}%`}}/></div><div className="model-dots">{questions.map((_,i)=><i key={i} className={i<=step?'active':''}/>)}</div>{step===0&&<div className="model-intro"><span>SEU MAPA ESSENCE</span><h1>Descubra em menos de um minuto por onde sua rotina pode ficar mais leve.</h1><p>Quatro perguntas rápidas, feitas para a vida real.</p></div>}<section className="model-card" key={step}><span className="model-step">PASSO {step+1} DE {questions.length}</span><h2>{q[0]}</h2><p>{q[1]}</p><div className="model-options">{q[2].map(o=><button type="button" key={o.id} onClick={()=>choose(o)}><i>{o.icon}</i><span><b>{o.title}</b>{o.detail&&<small>{o.detail}</small>}</span><em>○</em></button>)}</div></section><small className="model-note">Leva menos de um minuto ✦</small></>}{phase==='loading'&&<section className="model-loading"><div className="model-loader">✦</div><h1>Organizando o seu perfil…</h1><p>Encontrando um jeito mais leve de começar.</p></section>}{phase==='result'&&<section className="model-card model-result profile-result"><span className="model-result-tag">✦ SEU PERFIL</span><h1>{profile}</h1><h2>O que falta não é força de vontade.</h2><p>É um lugar único para lembrar, planejar, cuidar de você e recomeçar sem culpa quando o dia sair do plano.</p><div className="model-result-list"><div><i>✓</i><span><b>Seu dia em um só lugar</b></span></div><div><i>🔔</i><span><b>Lembretes que aliviam a mente</b></span></div><div><i>✦</i><span><b>Uma base com IA quando precisar</b></span></div></div><button type="button" onClick={()=>{setPhase('offer');window.scrollTo(0,0)}}>VER MINHA EXPERIÊNCIA <span>→</span></button><small>Sem cadastro. Você conhece os recursos antes de escolher qualquer plano.</small></section>}</div></main>}