import { useState } from 'react';

type Demo = 'day' | 'water' | 'reminders';

const checkouts = {
  mensal: 'https://pay.kiwify.com.br/yIJKlLK',
  trimestral: 'https://pay.kiwify.com.br/UKuHm32',
  anual: 'https://pay.kiwify.com.br/a1CTCMt',
} as const;

const modules = [
  ['📅', 'Agenda que cabe na vida', 'Tarefas, hábitos e compromissos no mesmo lugar — com horário, categoria e lembrete.'],
  ['🔔', 'Lembretes que aliviam a mente', 'Água, remédios, consultas e o que for importante para você não depender só da memória.'],
  ['💧', 'Autocuidado possível', 'Acompanhe água, sono, alimentação, ciclo, treino e pequenas pausas sem pressão.'],
  ['✦', 'IA quando você travar', 'Uma base para rotina, treino, cardápio e cuidados; você revisa tudo do seu jeito.'],
  ['⏱️', 'Foco sem cobrança', 'Use o Pomodoro para dar atenção a uma coisa de cada vez e retomar seu ritmo.'],
  ['💰', 'Vida prática organizada', 'Finanças, casa e compras para o cotidiano não ficar espalhado em vários aplicativos.'],
];

export default function Landing() {
  const [demo, setDemo] = useState<Demo>('day');
  const [water, setWater] = useState(1000);
  const buy = (plan: keyof typeof checkouts) => window.location.assign(checkouts[plan]);
  const goToPlans = () => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });
  const waterPct = Math.min(100, Math.round(water / 25));
  const waterText = (water / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  return <main className="sales-flow sales-refresh">
    <header className="sales-header">
      <a href="/" className="sales-brand"><img src="/essence-life-logo.png" alt=""/>Essence Life</a>
      <button type="button" onClick={() => window.location.assign('/app')}>Já tenho acesso</button>
    </header>

    <section className="sales-hero sales-refresh-hero">
      <div className="sales-copy">
        <span className="sales-pill">✦ SUA VIDA, NO SEU RITMO</span>
        <h1>Você não precisa lembrar de tudo sozinha.</h1>
        <p>O Essence Life organiza tarefas, compromissos, hábitos e autocuidado para que a correria não faça você esquecer de beber água, tomar um remédio ou cuidar de você.</p>
        <div className="sales-hero-actions">
          <button className="sales-cta" type="button" onClick={() => document.getElementById('recursos')?.scrollIntoView({ behavior: 'smooth' })}>CONHECER O ESSENCE LIFE <b>→</b></button>
          <button className="sales-text-cta" type="button" onClick={goToPlans}>Ver planos</button>
        </div>
        <div className="sales-mini"><span>✦ Organização sem rigidez</span><span>🔔 Lembretes no seu ritmo</span><span>📱 Celular e computador</span></div>
      </div>
      <div className="sales-phone sales-real-phone" aria-label="Tela real do aplicativo Essence Life"/>
    </section>

    <section className="sales-trust sales-refresh-trust">
      <article><i>⚡</i><b>Acesso imediato</b><span>Entre assim que sua compra for confirmada.</span></article>
      <article><i>♡</i><b>7 dias de garantia</b><span>Conheça a experiência com tranquilidade.</span></article>
      <article><i>🔒</i><b>Compra segura</b><span>Pagamento protegido pela Kiwify.</span></article>
    </section>

    <section className="sales-problem">
      <span className="sales-pill">PARA A VIDA REAL</span>
      <h2>Quando a cabeça já está cheia, qualquer detalhe pode escapar.</h2>
      <p>O Essence Life não é sobre fazer mais. É sobre tirar da memória o que pesa e deixar o seu dia mais claro.</p>
      <div>
        <article><span>🧠</span><b>Menos coisas na cabeça</b><small>Registre na hora e pare de tentar guardar tudo.</small></article>
        <article><span>🔔</span><b>Mais chance de lembrar</b><small>Configure alertas para horários e cuidados importantes.</small></article>
        <article><span>🌿</span><b>Mais leveza para continuar</b><small>Planeje o possível, inclusive nos dias que não saem como esperado.</small></article>
      </div>
      <small className="sales-disclaimer">Uma ferramenta de organização e bem-estar; não substitui acompanhamento médico, psicológico ou nutricional.</small>
    </section>

    <section id="recursos" className="sales-modules">
      <span className="sales-pill">TUDO CONVERSA ENTRE SI</span>
      <h2>Um app para lembrar, organizar e se cuidar.</h2>
      <p>Escolha os módulos que fazem sentido hoje. O resto pode esperar.</p>
      <div className="sales-module-grid">{modules.map(([icon,title,copy]) => <article key={title}><i>{icon}</i><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section className="sales-demo">
      <div className="sales-demo-copy"><span className="sales-pill">EXPERIMENTE A SENSAÇÃO</span><h2>Um toque e seu próximo passo fica visível.</h2><p>É assim que o Essence Life ajuda: uma ação pequena por vez, sem bagunça e sem culpa.</p><div className="try-tabs">{([['day','Seu dia'],['water','Água'],['reminders','Lembretes']] as const).map(([key,label]) => <button type="button" key={key} className={demo === key ? 'active' : ''} onClick={() => setDemo(key)}>{label}</button>)}</div></div>
      <article className="sales-demo-device">
        {demo === 'day' && <><img src="/essence-app-home.png" alt="Tela inicial do Essence Life"/><div className="sales-demo-overlay"><small>PRÓXIMO PASSO</small><b>Café da tarde</b><span>Hoje, às 16:00</span></div></>}
        {demo === 'water' && <><img src="/essence-app-water.png" alt="Tela de hidratação do Essence Life"/><div className="sales-water-interaction"><div><small>ÁGUA DE HOJE</small><b>{waterText} L <em>de 2,5 L</em></b></div><div className="water-bar"><i style={{width: `${waterPct}%`}}/></div><button type="button" onClick={() => setWater(value => Math.min(2500, value + 250))}>+ 250 ml</button></div></>}
        {demo === 'reminders' && <div className="sales-reminder-demo"><span>🔔</span><small>LEMBRETE DO ESSENCE LIFE</small><h3>Hora de beber água</h3><p>Um copo agora já conta para a sua meta de hoje.</p><button type="button" onClick={() => setDemo('water')}>Registrar 250 ml</button></div>}
      </article>
    </section>

    <section className="sales-how">
      <span className="sales-pill">COMECE DO SEU JEITO</span>
      <h2>Não é mais uma rotina impossível para cumprir.</h2>
      <div><article><b>1</b><h3>Conte o que importa</h3><p>Algumas respostas rápidas mostram por onde começar.</p></article><article><b>2</b><h3>Monte um dia possível</h3><p>Organize o que cabe na sua realidade, não em uma agenda perfeita.</p></article><article><b>3</b><h3>Use como apoio diário</h3><p>O app lembra, acompanha e ajuda você a recomeçar quando precisar.</p></article></div>
    </section>

    <section id="planos" className="plan-decision sales-plans-refresh">
      <span>ACESSO PREMIUM</span>
      <h2>Escolha o tempo que combina com você.</h2>
      <p>Os três planos incluem todos os módulos e a experiência completa do Essence Life.</p>
      <div className="decision-grid decision-grid-premium">
        <article><small>PREMIUM MENSAL</small><h3>Comece no seu ritmo</h3><strong><b>R$ 39,90</b></strong><em>por mês · renovação mensal</em><ul><li>Todos os módulos do app</li><li>Lembretes, IA e planejamento</li><li>Cancele quando quiser</li></ul><button type="button" onClick={() => buy('mensal')}>QUERO O MENSAL →</button></article>
        <article className="featured"><small>✦ MAIS EQUILÍBRIO</small><h3>Mais tempo para sua rotina</h3><strong><b>R$ 99,90</b></strong><em>a cada 3 meses</em><p className="decision-saving">Economize R$ 19,80</p><ul><li>Todos os módulos do app</li><li>Lembretes, IA e planejamento</li><li>Renovação trimestral</li></ul><button type="button" onClick={() => buy('trimestral')}>QUERO O TRIMESTRAL →</button></article>
        <article className="pro"><small>✦ MELHOR VALOR</small><h3>Um ano de leveza</h3><strong><b>R$ 319,90</b></strong><em>por ano</em><p className="decision-saving">Economize R$ 158,90</p><ul><li>Todos os módulos do app</li><li>Lembretes, IA e planejamento</li><li>Melhor custo por mês</li></ul><button type="button" onClick={() => buy('anual')}>QUERO O ANUAL →</button></article>
      </div>
      <footer>🔒 Compra segura &nbsp; • &nbsp; ⚡ Acesso imediato &nbsp; • &nbsp; ♡ 7 dias de garantia</footer>
    </section>
  </main>;
}
