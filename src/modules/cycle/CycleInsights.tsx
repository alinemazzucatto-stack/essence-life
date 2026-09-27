import './CycleInsights.css';
import cycleHistoryFlowers from '../../assets/cycle-history-flowers-v2.png';

type Entry={id:string;date:string;flow:string;symptoms:string[];moods?:string[];mood?:string};
type Symptom={name:string;count:number};
type Props={entries:Entry[];cycleLength:number;cycleDay:number;phase:string;hasReference:boolean;symptoms:Symptom[];suggestions:string[]};

const symptomIcons:Record<string,string>={'Cólicas':'ϟ','Inchaço':'●','Dor de cabeça':'◌','Sensibilidade':'♡'};

function InsightGlyph({type}:{type:'calendar'|'flow'|'ovulation'|'next'}){
  if(type==='calendar')return <svg viewBox="0 0 24 24" fill="none"><rect x="4" y="5.5" width="16" height="14" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M8 3.5v4M16 3.5v4M4 10h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  if(type==='flow')return <svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5C9 7.2 6.5 10 6.5 13.4a5.5 5.5 0 1 0 11 0C17.5 10 15 7.2 12 3.5Z" fill="currentColor"/></svg>;
  if(type==='ovulation')return <svg viewBox="0 0 24 24"><g fill="currentColor"><circle cx="12" cy="5.5" r="3.3"/><circle cx="18" cy="9" r="3.3"/><circle cx="18" cy="15" r="3.3"/><circle cx="12" cy="18.5" r="3.3"/><circle cx="6" cy="15" r="3.3"/><circle cx="6" cy="9" r="3.3"/></g><circle cx="12" cy="12" r="2.2" fill="#fff8f8"/></svg>;
  return <svg viewBox="0 0 24 24"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" fill="currentColor"/></svg>;
}

function CareGlyph({type}:{type:string}){
  if(type==='Chá de conforto')return <svg viewBox="0 0 24 24" fill="none"><path d="M5 10h11v5.2a4.2 4.2 0 0 1-8.4 0V10Z" fill="currentColor"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M4 20h14M9 7c-1-1.2.5-2.4.2-3.8M13 7c-1-1.2.5-2.4.2-3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  if(type==='Respiração de 5 min')return <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8.5v3.8l2.4 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  if(type==='Compressa morna')return <svg viewBox="0 0 24 24" fill="none"><path d="M5 9h14v8H5z" fill="currentColor"/><path d="M8 6c-1-1.2.4-2.2.2-3.5M12 6c-1-1.2.4-2.2.2-3.5M16 6c-1-1.2.4-2.2.2-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  return <InsightGlyph type="next"/>;
}

export default function CycleInsights({entries,cycleLength,cycleDay,phase,hasReference,symptoms,suggestions}:Props){
  const total=Math.max(entries.length,1);
  const frequent=symptoms.filter(item=>item.count>0).slice(0,4);
  const flowDays=entries.filter(entry=>entry.flow!=='Sem fluxo').length;
  const regularity=hasReference?'Regular':'Em acompanhamento';
  const recommendations=(suggestions.length?suggestions:['Registrar seu dia','Autocuidado','Respiração de 5 min']).slice(0,3);

  return <section className="cycle-insights-view">
    <header className="cycle-insights-intro">
      <div><h2>Seus insights do ciclo</h2><p>Entenda seus padrões e receba recomendações personalizadas.</p></div>
      <img src={cycleHistoryFlowers} alt="" aria-hidden="true"/>
    </header>

    <section className="cycle-insights-hero">
      <article className="cycle-insights-regularity">
        <span className="cycle-insights-icon calendar"><InsightGlyph type="calendar"/></span>
        <div><small>SEU CICLO É</small><h3>{regularity}</h3><p>{hasReference?'Sua estimativa está organizada para acompanhar os próximos ciclos.':'Registre sua referência para receber estimativas mais completas.'}</p></div>
        <i aria-hidden="true">❋</i>
      </article>
      <article className="cycle-insights-duration">
        <div className="cycle-insights-ring"><b>{cycleLength}</b><span>dias</span></div>
        <div><b>Duração média<br/>do ciclo</b><p>{hasReference?'Estimativa atual do seu ciclo.':'Defina uma referência para personalizar.'}</p></div>
      </article>
    </section>

    <section className="cycle-insights-metrics">
      <article><span className="cycle-insights-icon flow"><InsightGlyph type="flow"/></span><div><small>FLUXO REGISTRADO</small><strong>{flowDays?flowDays+' dia'+(flowDays===1?'':'s'):'—'}</strong><p>{flowDays?'Nos seus registros atuais.':'Ainda sem registros de fluxo.'}</p></div></article>
      <article><span className="cycle-insights-icon ovulation"><InsightGlyph type="ovulation"/></span><div><small>FASE ATUAL</small><strong>{phase}</strong><p>{cycleDay?'Dia '+cycleDay+' do ciclo.':'Defina uma data de referência.'}</p></div></article>
      <article><span className="cycle-insights-icon rest"><InsightGlyph type="next"/></span><div><small>PRÓXIMO PASSO</small><strong>{suggestions[0]||'Registrar seu dia'}</strong><p>Uma sugestão opcional para você.</p></div></article>
    </section>

    <article className="cycle-insights-pattern">
      <div className="cycle-section-title"><div><h3>Como você se sente ao longo do ciclo</h3><p>Com base nos seus registros mais recentes.</p></div></div>
      <div className="cycle-pattern-plot" aria-label="Resumo visual dos padrões registrados">
        <div className="cycle-pattern-scale"><span>Alta</span><span>Média</span><span>Baixa</span></div>
        <div className="cycle-pattern-lines">
          <div className="cycle-phase-band menstrual">Menstruação</div><div className="cycle-phase-band follicular">Fase folicular</div><div className="cycle-phase-band ovulation">Ovulação</div><div className="cycle-phase-band luteal">Fase lútea</div>
          <svg viewBox="0 0 600 130" preserveAspectRatio="none" aria-hidden="true"><path className="energy" d="M0 78 C45 65 72 92 112 70 S178 56 220 76 S280 62 320 73 S382 96 424 54 S490 35 530 61 S575 70 600 56"/><path className="mood" d="M0 96 C45 70 76 102 112 91 S180 87 220 95 S278 60 320 86 S384 68 424 81 S490 97 530 90 S575 62 600 75"/><path className="sensitivity" d="M0 100 C48 105 76 84 112 95 S180 100 220 82 S275 84 320 69 S380 44 424 70 S488 72 530 84 S574 58 600 72"/><path className="rest" d="M0 83 C45 82 76 61 112 78 S180 96 220 90 S278 80 320 92 S382 105 424 90 S490 72 530 98 S575 80 600 88"/></svg>
        </div>
      </div>
      <div className="cycle-pattern-key"><span className="energy">Energia</span><span className="mood">Humor</span><span className="sensitivity">Sensibilidade</span><span className="rest">Descanso</span></div>
    </article>

    <article className="cycle-insights-symptoms">
      <div className="cycle-section-title"><div><h3>Sintomas mais recorrentes</h3><p>Com base nos seus últimos registros.</p></div><button type="button">Ver todos ›</button></div>
      {frequent.length?<div className="cycle-symptom-cards">{frequent.map(item=>{const percent=Math.round(item.count/total*100);return <article key={item.name}><span>{symptomIcons[item.name]||'✦'}</span><div><b>{item.name}</b><strong>{percent}%</strong><small>dos registros</small></div><i><em style={{width:percent+'%'}}/></i></article>})}</div>:<div className="cycle-insights-empty"><span>✦</span><div><b>Seus padrões vão aparecer aqui</b><p>Registre como se sente em alguns dias para tornar seus insights mais pessoais.</p></div></div>}
    </article>

    <article className="cycle-insights-recommendations">
      <div className="cycle-section-title"><div><h3>Recomendações para você</h3><p>Pequenos cuidados que combinam com o seu momento.</p></div></div>
      <div>{recommendations.map((item,index)=><button type="button" key={item}><span><CareGlyph type={item}/></span><b>{item}</b><small>{index===0?'Uma sugestão gentil para agora.':'Escolha se fizer sentido para você.'}</small><i>›</i></button>)}</div>
    </article>
  </section>;
}
