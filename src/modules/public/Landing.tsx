import { useState } from 'react';

type Demo = 'day' | 'agenda' | 'pomodoro' | 'reminders';

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
  const demoScreens: Record<Demo, { label: string; description: string; src: string }> = {
    day: { label: 'Início', description: 'Prioridades, hábitos e o próximo passo em um só lugar.', src: '/sales-home.png' },
    agenda: { label: 'Agenda', description: 'Seu dia visualizado por horário, com tarefas e compromissos.', src: '/sales-agenda.png' },
    pomodoro: { label: 'Foco', description: 'Um ciclo de cada vez para proteger sua concentração.', src: '/sales-pomodoro.png' },
    reminders: { label: 'Lembretes', description: 'Lembretes configuráveis para aquilo que você não quer esquecer.', src: '/sales-reminders.png' },
  };
  const buy = (plan: keyof typeof checkouts) => window.location.assign(checkouts[plan]);
  const goToPlans = () => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' });

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
      <div className="sales-demo-copy"><span className="sales-pill">CONHEÇA POR DENTRO</span><h2>Um toque e seu próximo passo fica visível.</h2><p>Veja as telas reais do Essence Life: organização, foco e lembretes para a sua rotina.</p><div className="try-tabs">{(['day', 'agenda', 'pomodoro', 'reminders'] as Demo[]).map((item) => <button type="button" key={item} className={demo === item ? 'active' : ''} onClick={() => setDemo(item)}>{demoScreens[item].label}</button>)}</div></div>
      <article className="sales-demo-device sales-demo-screen">
        <img src={demoScreens[demo].src} alt={`Tela ${demoScreens[demo].label} do aplicativo Essence Life`}/>
        <div className="sales-screen-caption"><small>{demoScreens[demo].label}</small><b>{demoScreens[demo].description}</b></div>
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
