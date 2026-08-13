import { useState } from 'react';
import Landing from './Landing';

type Option={id:string;icon:string;title:string;detail:string};
const questions:[string,string,Option[]][]=[
  ['O que mais costuma escapar na correria?','Escolha o que mais acontece com você hoje.',[
    {id:'water',icon:'💧',title:'Beber água e me cuidar',detail:'O dia anda e eu percebo tarde demais que não fiz pausas.'},
    {id:'meds',icon:'💊',title:'Remédios e compromissos',detail:'Tenho medo de esquecer horários, consultas ou coisas importantes.'},
    {id:'tasks',icon:'✓',title:'Tarefas e lembretes',detail:'Guardo tudo na cabeça e sempre sobra alguma coisa.'},
    {id:'self',icon:'♡',title:'Tempo para mim',detail:'Minha rotina fica cheia e o meu cuidado vai ficando por último.'},
    {id:'all',icon:'✦',title:'Todas as opções',detail:'Quando tudo pede atenção ao mesmo tempo.'}
  ]],
  ['O que você gostaria de cuidar com mais constância?','O Essence pode acompanhar uma área ou ajudar você a reunir tudo.',[
    {id:'food',icon:'🥗',title:'Alimentação e hidratação',detail:'Lembrar refeições, água e escolhas possíveis no dia.'},
    {id:'sleep',icon:'🌙',title:'Sono e descanso',detail:'Criar uma rotina noturna e olhar para o seu ritmo.'},
    {id:'movement',icon:'🏃',title:'Treinos e movimento',detail:'Ter espaço para se movimentar sem transformar isso em pressão.'},
    {id:'care',icon:'☼',title:'Autocuidado',detail:'Incluir pausas, cuidados e bem-estar na rotina.'},
    {id:'all',icon:'✦',title:'Todas as opções',detail:'Quero cuidar da vida por inteiro, no meu ritmo.'}
  ]],
  ['Que tipo de apoio faria diferença no seu dia?','Não é sobre fazer mais. É sobre ter menos coisas para lembrar sozinha.',[
    {id:'notify',icon:'🔔',title:'Lembretes no horário certo',detail:'Um aviso gentil para o que não pode passar.'},
    {id:'visual',icon:'◌',title:'Ver meu dia com clareza',detail:'Saber o que importa sem abrir várias listas.'},
    {id:'smart',icon:'✦',title:'Uma ajuda para começar',detail:'Sugestões inteligentes quando eu não souber por onde ir.'},
    {id:'balance',icon:'☼',title:'Cuidar da vida por inteiro',detail:'Rotina, saúde, casa e bem-estar no mesmo lugar.'},
    {id:'all',icon:'✦',title:'Todas as opções',detail:'Quero apoio completo, com liberdade para usar o que precisar.'}
  ]]
];

export default function DiscoveryQuiz(){
  const [step,setStep]=useState(0),[answers,setAnswers]=useState<string[]>([]),[phase,setPhase]=useState<'quiz'|'loading'|'result'|'offer'>('quiz');
  if(phase==='offer')return <Landing/>;
  const question=questions[step];
  const select=(option:Option)=>{const next=[...answers,option.id];setAnswers(next);if(step===questions.length-1){setPhase('loading');window.setTimeout(()=>setPhase('result'),1100)}else window.setTimeout(()=>setStep(value=>value+1),180)};
  const first=answers[0];
  const focus=first==='all'?'apoio para organizar tudo com mais leveza':first==='water'?'cuidado que cabe na vida real':first==='meds'?'segurança para não depender da memória':first==='tasks'?'clareza para o que importa':'espaço para você voltar a se priorizar';
  return <main className="model-quiz care-quiz"><span className="model-deco model-deco-a">✦</span><span className="model-deco model-deco-b">🔔</span><span className="model-deco model-deco-c">💧</span><div className="model-shell"><a className="model-brand" href="/"><img src="/essence-life-logo.png" alt=""/><span>Essence Life</span></a>
    {phase==='quiz'&&<><div className="model-status"><span>{Math.round((step+1)/questions.length*100)}%</span></div><div className="model-progress"><i style={{width:`${(step+1)/questions.length*100}%`}}/></div><div className="model-dots">{questions.map((_,index)=><i key={index} className={index<=step?'active':''}/>)}</div>{step===0&&<div className="model-intro"><span>SEU MAPA DA ROTINA</span><h1>Sua cabeça já cuida de coisa demais.</h1><p>Em 3 escolhas, encontre um jeito mais leve de lembrar, organizar e se cuidar.</p></div>}<section className="model-card" key={step}><span className="model-step">ETAPA {step+1} DE {questions.length}</span><h2>{question[0]}</h2><p>{question[1]}</p><div className="model-options">{question[2].map(option=><button type="button" key={option.id} onClick={()=>select(option)}><i>{option.icon}</i><span><b>{option.title}</b><small>{option.detail}</small></span><em>○</em></button>)}</div></section><small className="model-note">Você pode escolher “Todas as opções” se mais de uma área estiver pesando agora.</small></>}
    {phase==='loading'&&<section className="model-loading"><div className="model-loader">✦</div><h1>Preparando seu ponto de partida…</h1><div><p>✓ Entendendo sua rotina</p><p>✓ Encontrando o apoio que faz sentido</p><p>• Organizando uma experiência mais leve</p></div></section>}
    {phase==='result'&&<section className="model-card model-result care-result"><span className="model-result-tag">✦ SEU MAPA ESSENCE</span><h1>Seu próximo passo pede mais {focus}.</h1><p>O Essence Life não tenta controlar a sua vida. Ele ajuda a tirar da cabeça o que precisa ser lembrado — para você viver o dia com mais presença.</p><div className="model-result-list"><div><i>🔔</i><span><b>Lembretes gentis</b><small>Crie avisos para água, remédios, consultas, hábitos e prioridades.</small></span></div><div><i>✦</i><span><b>Apoio inteligente</b><small>Use IA para ter uma base de rotina, treino, cardápio ou autocuidado e adapte ao seu jeito.</small></span></div><div><i>☼</i><span><b>Uma visão do seu dia</b><small>Agenda, alimentação, sono, treinos e vida prática no mesmo espaço.</small></span></div></div><button type="button" onClick={()=>{setPhase('offer');window.scrollTo(0,0)}}>VER TODOS OS RECURSOS <span>→</span></button><small>Você vai conhecer a experiência completa e comparar os planos com calma — sem escolher nada agora.</small></section>}
  </div></main>;
}