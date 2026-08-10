import { useState } from 'react';

type Profile = { goal: string; restrictions: string; meals: string };
type AiItem = { id: string; day: number; mealType: string; title: string; ingredients: string[]; note: string };
type PlanDraft = { mealType: string; title: string; ingredients: string };

export default function AiMenuGenerator({ profile, onAdd }: { profile: Profile; onAdd: (item: PlanDraft) => void }) {
  const [days, setDays] = useState(1);
  const [extra, setExtra] = useState('');
  const [items, setItems] = useState<AiItem[]>([]);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const generate = async () => {
    setLoading(true); setError(''); setItems([]); setAdded(new Set());
    try {
      const response = await fetch('/api/nutrition/menu', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ goal: profile.goal, restrictions: profile.restrictions, meals: profile.meals, days, extra })
      });
      const data = await response.json() as { summary?: string; items?: AiItem[]; error?: string };
      if (!response.ok) throw new Error(data.error || 'Não foi possível gerar as sugestões.');
      setSummary(data.summary || 'Sugestões criadas para você adaptar.');
      setItems(data.items || []);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível gerar as sugestões.');
    } finally { setLoading(false); }
  };

  const add = (item: AiItem) => {
    onAdd({ mealType: item.mealType, title: item.title, ingredients: item.ingredients.join(', ') });
    setAdded(current => new Set(current).add(item.id));
  };
  const addAll = () => {
    items.forEach(item => { if (!added.has(item.id)) onAdd({ mealType: item.mealType, title: item.title, ingredients: item.ingredients.join(', ') }); });
    setAdded(new Set(items.map(item => item.id)));
  };
  return <article className="card nutrition-ai-card">
    <div className="nutrition-ai-heading"><span aria-hidden="true">✨</span><div><small>RECURSO PRO COM IA</small><h3>Criar sugestões de cardápio</h3><p>A IA usa seu objetivo, número de refeições e preferências para montar uma prévia editável.</p></div></div>
    <div className="nutrition-ai-profile"><span><small>OBJETIVO</small><b>{profile.goal}</b></span><span><small>REFEIÇÕES</small><b>{profile.meals} por dia</b></span><span><small>PREFERÊNCIAS</small><b>{profile.restrictions || 'Não informadas'}</b></span></div>
    <div className="nutrition-ai-controls">
      <label>Período<select value={days} onChange={event => setDays(Number(event.target.value))}><option value={1}>1 dia</option><option value={3}>3 dias</option></select></label>
      <label>Algo mais que a IA deve considerar?<input value={extra} maxLength={300} onChange={event => setExtra(event.target.value)} placeholder="Ex.: refeições rápidas e econômicas" /></label>
      <button className="primary" type="button" disabled={loading} onClick={generate}>{loading ? 'Criando sugestões…' : '✨ Gerar cardápio com IA'}</button>
    </div>
    <p className="nutrition-ai-safety">Sugestões gerais, não prescrição. Confira ingredientes e alergênicos antes de consumir. Condições clínicas exigem acompanhamento profissional.</p>
    {error && <div className="notice nutrition-ai-error" role="alert">{error}</div>}
    {items.length > 0 && <div className="nutrition-ai-results"><div className="card-head"><div><small>PRÉVIA EDITÁVEL</small><h3>{summary}</h3></div><button type="button" onClick={addAll}>Adicionar todas ao plano</button></div>{items.map(item => <article key={item.id} className="nutrition-ai-item"><div><small>DIA {item.day} · {item.mealType}</small><h4>{item.title}</h4><p>{item.ingredients.join(', ')}</p>{item.note && <em>{item.note}</em>}</div><button type="button" className={added.has(item.id) ? 'added' : ''} disabled={added.has(item.id)} onClick={() => add(item)}>{added.has(item.id) ? '✓ Adicionada' : '+ Adicionar'}</button></article>)}</div>}
  </article>;
}
