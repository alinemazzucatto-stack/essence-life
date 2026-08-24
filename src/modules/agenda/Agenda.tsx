import { useEffect, useMemo, useRef, useState } from 'react';
import { createId as id, today } from '../../shared/app-utils';
import { removeAppReminder, requestReminderPermission, syncDatedReminder } from '../../shared/reminders';
import { readStoredArray } from '../../shared/storage';

type AgendaKind = 'task' | 'habit' | 'event';
type Task = { id:string; title:string; date:string; time?:string; category?:string; priority:string; notes?:string; reminder?:string; recurrence?:string; recurrenceEnd?:string; seriesId?:string; kind?:AgendaKind; done:boolean };
const cats = ['Pessoal','Trabalho','Casa','Saúde','Estudos','Outro'];
const kinds: Record<AgendaKind, {label:string; icon:string}> = { task:{label:'Tarefa',icon:'✓'}, habit:{label:'Hábito',icon:'↻'}, event:{label:'Compromisso',icon:'◷'} };
const isoDate = (value:Date) => [value.getFullYear(),String(value.getMonth()+1).padStart(2,'0'),String(value.getDate()).padStart(2,'0')].join('-');
const dateLabel = (value:string) => new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long'}).format(new Date(value+'T12:00:00'));
const shortLabel = (value:string) => new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short'}).format(new Date(value+'T12:00:00'));
const monthDays = (value:string) => { const base = new Date(value+'T12:00:00'); return Array.from({length:new Date(base.getFullYear(),base.getMonth()+1,0).getDate()},(_,index)=>isoDate(new Date(base.getFullYear(),base.getMonth(),index+1,12))); };
const weekFor = (value:string) => { const base = new Date(value+'T12:00:00'); base.setDate(base.getDate()-((base.getDay()+6)%7)); return Array.from({length:7},(_,index)=>{ const current = new Date(base); current.setDate(base.getDate()+index); return isoDate(current); }); };
const recurringDates = (start:string, repeat:string, end:string) => { if(!repeat) return [start]; const base = new Date(start+'T12:00:00'), limit=end?new Date(end+'T12:00:00'):null, max=repeat==='daily'?90:repeat==='weekly'?52:12; const dates=[start]; for(let index=1; index<=max; index++){ const next=new Date(base); if(repeat==='monthly') next.setMonth(base.getMonth()+index); else next.setDate(base.getDate()+index*(repeat==='weekly'?7:1)); if(limit && next>limit) break; dates.push(isoDate(next)); } return dates; };

export default function Agenda(){
  const [tasks,setTasks] = useState<Task[]>(()=>readStoredArray<Task>('essence:tasks'));
  const [selectedDate,setSelectedDate] = useState(today());
  const [view,setView] = useState<'day'|'week'|'month'>('day');
  const [kindFilter,setKindFilter] = useState<'all'|AgendaKind>('all');
  const [formOpen,setFormOpen] = useState(false);
  const [editing,setEditing] = useState<Task|null>(null);
  const [message,setMessage] = useState('');
  const [formError,setFormError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(()=>localStorage.setItem('essence:tasks',JSON.stringify(tasks)),[tasks]);
  const ordered = useMemo(()=>[...tasks].sort((a,b)=>(a.date+(a.time||'23:59')).localeCompare(b.date+(b.time||'23:59'))),[tasks]);
  const selectedWeek = weekFor(selectedDate);
  const selectedMonth = monthDays(selectedDate);
  const sameKind = (task:Task) => kindFilter==='all' || (task.kind||'event')===kindFilter;
  const selectedTasks = ordered.filter(task=>task.date===selectedDate && sameKind(task));
  const weekTasks = ordered.filter(task=>selectedWeek.includes(task.date) && sameKind(task));
  const monthTasks = ordered.filter(task=>selectedMonth.includes(task.date) && sameKind(task));
  const todayTasks = tasks.filter(task=>task.date===today());
  const completed = todayTasks.filter(task=>task.done).length;
  const next = ordered.find(task=>!task.done && task.date>=today());
  const notify = (text:string) => { setMessage(text); window.setTimeout(()=>setMessage(''),3200); };
  const openCreate = () => { setEditing(null); setFormError(''); setFormOpen(true); window.setTimeout(()=>formRef.current?.querySelector<HTMLInputElement>('input[name="title"]')?.focus(),80); };
  const closeForm = () => { setFormOpen(false); setEditing(null); setFormError(''); };
  const toggleTask = (task:Task) => { const done=!task.done; setTasks(all=>all.map(item=>item.id===task.id?{...item,done}:item)); if(done) removeAppReminder(task.id); else if(task.reminder!==undefined && task.reminder!=='' && task.time) syncDatedReminder(task.id,`${kinds[task.kind||'event'].label}: ${task.title}`,task.date,task.time,Number(task.reminder)); };
  const submit = (event:React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setFormError(''); const data=new FormData(event.currentTarget), title=String(data.get('title')).trim(); if(!title){setFormError('Informe o título.'); return;} const repeat=String(data.get('recurrence')), recurrenceEnd=String(data.get('recurrenceEnd')); const value={title,date:String(data.get('date')),time:String(data.get('time')),kind:String(data.get('kind')) as AgendaKind,category:String(data.get('category')),priority:String(data.get('priority')),notes:String(data.get('notes')),reminder:String(data.get('reminder')),recurrence:repeat,recurrenceEnd}; if(value.reminder && !value.time){setFormError('Defina um horário para ativar o lembrete.');return;} if(editing){ setTasks(all=>all.map(item=>item.id===editing.id?{...item,...value}:item)); if(value.reminder!==''&&value.time){syncDatedReminder(editing.id,`${kinds[value.kind].label}: ${title}`,value.date,value.time,Number(value.reminder)); void requestReminderPermission();}else removeAppReminder(editing.id); notify('Item atualizado.'); } else { const dates=recurringDates(value.date,repeat,recurrenceEnd), seriesId=repeat?id():undefined, created=dates.map(date=>({id:id(),...value,date,seriesId,done:false})); setTasks(all=>[...created,...all]); created.forEach(item=>{if(item.reminder!==''&&item.time)syncDatedReminder(item.id,`${kinds[item.kind].label}: ${item.title}`,item.date,item.time,Number(item.reminder))}); if(value.reminder!==''&&value.time) void requestReminderPermission(); notify(repeat?`${dates.length} itens adicionados.`:'Item adicionado à agenda.'); } setSelectedDate(value.date); closeForm(); };
  const dateStep=(amount:number)=>{ const value=new Date(selectedDate+'T12:00:00'); value.setDate(value.getDate()+amount); setSelectedDate(isoDate(value)); };

  return <section className="agenda agenda-v3">
    <article className="agenda-v3-hero">
      <div><small>SEU TEMPO, DO SEU JEITO</small><h3>Agenda inteligente</h3><p>Organize tarefas, hábitos e compromissos no mesmo lugar, no seu ritmo.</p></div>
      <button type="button" className="primary" onClick={openCreate}>+ Novo compromisso</button>
    </article>
    <article className="card agenda-v3-board">
      <div className="agenda-v3-topbar"><b>📅 Agenda</b><button type="button" onClick={()=>setSelectedDate(today())}>Hoje</button></div>
      <div className="agenda-view-switch" role="tablist" aria-label="Visualização da agenda">
        {([['day','Dia'],['week','Semana'],['month','Mês']] as const).map(([value,label])=><button type="button" role="tab" aria-selected={view===value} key={value} className={view===value?'selected':''} onClick={()=>setView(value)}>{value==='day'?'◷':value==='week'?'▥':'▦'} {label}</button>)}
      </div>
      <div className="agenda-kind-filters" aria-label="Filtrar itens da agenda">
        <button type="button" className={kindFilter==='all'?'selected':''} onClick={()=>setKindFilter('all')}>• Todos</button>
        {(Object.entries(kinds) as [AgendaKind,{label:string;icon:string}][]).map(([value,item])=><button type="button" key={value} className={kindFilter===value?'selected '+value:''} onClick={()=>setKindFilter(value)}>{item.icon} {item.label}s</button>)}
      </div>
      {view==='day' && <div className="agenda-day-view">
        <div className="agenda-date-nav"><button type="button" onClick={()=>dateStep(-1)} aria-label="Dia anterior">‹</button><b>{dateLabel(selectedDate)}</b><button type="button" onClick={()=>dateStep(1)} aria-label="Próximo dia">›</button></div>
        <div className="agenda-timeline">
          {Array.from({length:15},(_,index)=>{const hour=String(index+6).padStart(2,'0')+':00'; const entries=selectedTasks.filter(task=>(task.time||'').slice(0,2)===String(index+6).padStart(2,'0')); return <div className="agenda-time-slot" key={hour}><time>{hour}</time><div>{entries.map(task=><article className={'agenda-timeline-entry '+(task.done?'is-done':'')+' '+(task.kind||'event')} key={task.id}><button type="button" className="agenda-round-check" aria-label={task.done?'Reabrir '+task.title:'Concluir '+task.title} onClick={()=>toggleTask(task)}>{task.done?'✓':''}</button><div><span>{kinds[task.kind||'event'].label.toUpperCase()}</span><b>{task.title}</b>{task.notes&&<small>{task.notes}</small>}</div><time>{task.time}</time></article>)}</div></div>})}
        </div>
      </div>}
      {view==='week' && <div className="agenda-week-view"><div className="agenda-date-nav"><button type="button" onClick={()=>dateStep(-7)} aria-label="Semana anterior">‹</button><b>{shortLabel(selectedWeek[0])} — {shortLabel(selectedWeek[6])}</b><button type="button" onClick={()=>dateStep(7)} aria-label="Próxima semana">›</button></div><div className="agenda-week-grid">{selectedWeek.map(date=>{const entries=weekTasks.filter(task=>task.date===date); return <button type="button" key={date} className={date===selectedDate?'selected':''} onClick={()=>{setSelectedDate(date);setView('day')}}><small>{new Intl.DateTimeFormat('pt-BR',{weekday:'short'}).format(new Date(date+'T12:00:00')).replace('.','')}</small><b>{Number(date.slice(-2))}</b><span>{entries.length?entries.length+' itens':'Livre'}</span></button>})}</div></div>}
      {view==='month' && <div className="agenda-month-view"><div className="agenda-date-nav"><button type="button" onClick={()=>dateStep(-31)} aria-label="Mês anterior">‹</button><b>{new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(new Date(selectedDate+'T12:00:00'))}</b><button type="button" onClick={()=>dateStep(31)} aria-label="Próximo mês">›</button></div><div className="agenda-month-grid">{['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(day=><small key={day}>{day}</small>)}{selectedMonth.map(date=>{const count=monthTasks.filter(task=>task.date===date).length; return <button type="button" key={date} className={date===selectedDate?'selected':''} onClick={()=>{setSelectedDate(date);setView('day')}}>{Number(date.slice(-2))}{count>0&&<i>{count}</i>}</button>})}</div></div>}
    </article>
    <div className="agenda-v3-summary"><article className="card"><small>PROGRESSO DE HOJE</small><strong>{todayTasks.length?`${completed}/${todayTasks.length}`:'Livre'}</strong><p>{todayTasks.length?'ações concluídas':'Sem pendências hoje'}</p></article><article className="card"><small>PRÓXIMO PASSO</small><strong>{next?.title||'Seu tempo, seu ritmo'}</strong><p>{next?(next.date===today()?'Hoje':'Em '+shortLabel(next.date))+(next.time?' · '+next.time:''):'Adicione algo quando fizer sentido.'}</p></article></div>
    {formOpen&&<article className="card agenda-v3-form"><div className="card-head"><div><small>{editing?'EDITAR ITEM':'NOVO ITEM'}</small><h3>{editing?'Atualize os detalhes':'Organize um momento'}</h3></div><button type="button" onClick={closeForm}>Fechar</button></div><form ref={formRef} className="form" onSubmit={submit}><label className="wide">Título<input name="title" defaultValue={editing?.title||''} placeholder="Ex.: Consulta, estudar ou caminhar" required/></label><label>Tipo<select name="kind" defaultValue={editing?.kind||'event'}><option value="event">Compromisso</option><option value="task">Tarefa</option><option value="habit">Hábito</option></select></label><label>Categoria<select name="category" defaultValue={editing?.category||'Pessoal'}>{cats.map(value=><option key={value}>{value}</option>)}</select></label><label>Data<input name="date" type="date" defaultValue={editing?.date||selectedDate} required/></label><label>Horário<input name="time" type="time" defaultValue={editing?.time||''}/></label><label>Lembrete<select name="reminder" defaultValue={editing?.reminder||''}><option value="">Sem lembrete</option><option value="0">No horário</option><option value="15">15 min antes</option><option value="30">30 min antes</option><option value="60">1 hora antes</option></select></label><label>Repetir<select name="recurrence" defaultValue={editing?.recurrence||''}><option value="">Não repetir</option><option value="daily">Diariamente</option><option value="weekly">Semanalmente</option><option value="monthly">Mensalmente</option></select></label><label>Repetir até<input name="recurrenceEnd" type="date" min={editing?.date||selectedDate} defaultValue={editing?.recurrenceEnd||''}/></label><label>Prioridade<select name="priority" defaultValue={editing?.priority||'Normal'}><option>Normal</option><option>Alta</option><option>Baixa</option></select></label><label className="wide">Observação<input name="notes" defaultValue={editing?.notes||''} placeholder="Local ou um detalhe importante"/></label>{formError&&<p className="agenda-form-error wide" role="alert">{formError}</p>}<button className="primary wide">{editing?'Salvar alterações':'Adicionar à agenda'}</button></form></article>}
    {message&&<div className="agenda-toast" role="status">✓ {message}</div>}
  </section>;
}
