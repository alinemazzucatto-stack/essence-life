import { useState } from 'react';
import Landing from './Landing';

type Option={id:string;icon:string;title:string;detail?:string};
const questions:[string,string,Option[]][]=[
 ['Em que momento o seu dia costuma sair das suas mãos?','Escolha a situação que mais se parece com a sua realidade.',[
  {id:'chaos',icon:'🌪️',title:'Eu vou apagando incêndios até o fim do dia'},
  {id:'stop',icon:'😮‍💨',title:'Eu começo animada, mas não consigo manter'},
  {id:'scatter',icon:'📝',title:'Eu até anoto, mas depois não encontro nada'},
  {id:'steady',icon:'🌱',title:'Eu sei o que fazer, mas perco o ritmo'},
  {id:'all',icon:'✦',title:'Meu dia muda muito e tudo se mistura'}]],
 ['O que mais pesa na sua mente hoje?','Queremos entender o tipo de ajuda que faria diferença.',[
  {id:'start',icon:'⌛',title:'Decidir o que vem primeiro'},
  {id:'guilt',icon:'💔',title:'Sentir que nunca fiz o suficiente'},
  {id:'forget',icon:'🔔',title:'Guardar tantos lembretes na memória'},
  {id:'quit',icon:'🌤️',title:'Perder o foco quando a semana aperta'},
  {id:'all',icon:'✦',title:'Todas as opções'}]],
 ['Qual parte da sua vida você quer simplificar agora?','Começar por uma área pequena já muda bastante coisa.',[
  {id:'care',icon:'✨',title:'Hábitos que fazem bem para mim'},
  {id:'wellbeing',icon:'🥗',title:'Meu corpo: comida, descanso e movimento'},
  {id:'life',icon:'⌂',title:'A vida prática: casa, compras e dinheiro'},
  {id:'work',icon:'📚',title:'Meus compromissos e responsabilidades'},
  {id:'all',icon:'🌷',title:'Quero um pouco de apoio em tudo'}]],
 ['Como você gostaria que o Essence aparecesse no seu dia?','Escolha o tipo de apoio que combina com o seu momento.',[
  {id:'five',icon:'⚡',title:'Com lembretes rápidos na hora certa'},
  {id:'fifteen',icon:'🕰️',title:'Com uma visão simples das minhas prioridades'},
  {id:'thirty',icon:'☕',title:'Com um momento reservado para planejar'},
  {id:'none',icon:'🏃',title:'Com sugestões quando eu não souber como começar'},
  {id:'all',icon:'✦',title:'Com todas essas possibilidades, sem rigidez'}]]
];
export default function DiscoveryQuiz(){const [step,setStep]=useState(0),[answers,setAnswers]=useState<string[]>([]),[phase,setPhase]=useState<'quiz'|'loading'|'result'|'offer'>('quiz');if(phase==='offer')return <Landing/>;const q=questions[step];const choose=(o:Option)=>{setAnswers(a=>[...a,o.id]);if(step===questions.length-1){setPhase('loading');window.setTimeout(()=>setPhase('result'),950)}else window.setTimeout(()=>setStep(n=>n+1),170)};const profile=answers[0]==='steady'?'Você já faz muita coisa — agora falta ter apoio para continuar.':answers[0]==='chaos'?'Você vem fazendo o melhor que consegue com muita coisa acontecendo ao mesmo tempo.':answers[0]==='scatter'?'Quando tudo fica espalhado, encontrar clareza vira um esforço diário.':'Sua rotina pode ser flexível e ainda assim ajudar você a avançar.';return <main className="model-quiz reference-quiz"><div className="model-shell"><a className="model-brand" href="/"><img src="/essence-life-logo.png" alt=""/><span>Essence Life</span></a>{phase==='quiz'&&<><div className="model-status"><span>{Math.round((step+1)/questions.length*100)}%</span></div><div className="model-progress"><i style={{width:`${(step+1)/questions.length*100}%`}}/></div><div className="model-dots">{questions.map((_,i)=><i key={i} className={i<=step?'active':''}/>)}</div>{step===0&&<div className="model-intro"><span>SEU MAPA ESSENCE</span><h1>Descubra em menos de um minuto por onde sua rotina pode ficar mais leve.</h1><p>Quatro perguntas rápidas, feitas para a vida real.</p></div>}<section className="model-card" key={step}><span className="model-step">PASSO {step+1} DE {questions.length}</span><h2>{q[0]}</h2><p>{q[1]}</p><div className="model-options">{q[2].map(o=><button type="button" key={o.id} onClick={()=>choose(o)}><i>{o.icon}</i><span><b>{o.title}</b>{o.detail&&<small>{o.detail}</small>}</span><em>○</em></button>)}</div></section><small className="model-note">Leva menos de um minuto ✦</small></>}{phase==='loading'&&<section className="model-loading"><div className="model-loader">✦</div><h1>Organizando o seu perfil…</h1><p>Encontrando um jeito mais leve de começar.</p></section>}{phase==='result'&&<section className="model-card model-result profile-result"><span className="model-result-tag">✦ SEU PERFIL</span><h1>{profile}</h1><h2>O que falta não é força de vontade.</h2><p>É um lugar único para lembrar, planejar, cuidar de você e recomeçar sem culpa quando o dia sair do plano.</p><div className="model-result-list"><div><i>✓</i><span><b>Seu dia em um só lugar</b></span></div><div><i>🔔</i><span><b>Lembretes que aliviam a mente</b></span></div><div><i>✦</i><span><b>Uma base com IA quando precisar</b></span></div></div><button type="button" onClick={()=>{setPhase('offer');window.scrollTo(0,0)}}>VER MINHA EXPERIÊNCIA <span>→</span></button><small>Sem cadastro. Você conhece os recursos antes de escolher qualquer plano.</small></section>}</div></main>}