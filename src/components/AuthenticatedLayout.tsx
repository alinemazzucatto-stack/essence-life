import { useState, type ReactNode } from 'react';
import type { LocalSession } from '../shared/app.types';
import { pageMeta, planNames, requiredPlanForPage } from '../shared/access-control';
import type { AppPage } from '../shared/access-control';
import './AuthenticatedLayout.css';

type AuthenticatedLayoutProps = { session: LocalSession; page: AppPage; mobileNavOpen: boolean; onToggleMobileNav: () => void; openPage: (page: AppPage) => void; isLocked: (page: AppPage) => boolean; showPlanLocks: boolean; onLogout: () => void; children: ReactNode };
const sleepLinks = ['Visão geral', 'Ambiente', 'Relaxar', 'Sons'];

function AuthenticatedLayout({ session, page, mobileNavOpen, onToggleMobileNav, openPage, isLocked, showPlanLocks, onLogout, children }: AuthenticatedLayoutProps) {
  const [sleepOpen, setSleepOpen] = useState(false);
  const selectSleepSection = (target: string, attempt = 0) => {
    const button = [...document.querySelectorAll<HTMLButtonElement>('.sleep-tabs button')].find(item => item.textContent?.trim() === target);
    if (button) { button.click(); return; }
    if (attempt < 10) window.setTimeout(() => selectSleepSection(target, attempt + 1), 80);
  };
  const openSleep = (target?: string) => {
    openPage('sleep');
    if (target) window.setTimeout(() => selectSleepSection(target), 80);
  };
  const nav = (key: AppPage, label: string, icon: string) => <button type="button" className={(page === key ? 'active' : '') + (!['home', 'settings', 'profile'].includes(key) && isLocked(key) ? ' locked' : '')} onClick={event => { event.preventDefault(); event.stopPropagation(); if (key === 'settings') window.dispatchEvent(new CustomEvent('essence:open-settings')); else openPage(key); }}><span>{icon}</span><span>{label}</span>{showPlanLocks && !['home', 'settings', 'profile'].includes(key) && isLocked(key) && <small>{planNames[requiredPlanForPage(key)]}</small>}</button>;
  const currentMeta = pageMeta[page];

  return <div className="app">
    <header className="mobile-topbar">
      <button type="button" className="mobile-menu-button" onClick={onToggleMobileNav} aria-expanded={mobileNavOpen} aria-label={mobileNavOpen ? 'Fechar menu' : 'Abrir menu'}><span aria-hidden="true">{mobileNavOpen ? '×' : '☰'}</span><small>{mobileNavOpen ? 'Fechar' : 'Menu'}</small></button>
      <button type="button" className="mobile-brand" onClick={() => openPage('home')} aria-label="Ir para o início"><img src="/essence-life-logo.png" alt="" className="brand-logo"/><span><strong>Essence Life</strong><small>Seu bem-estar em equilíbrio</small></span></button>
      <span className="mobile-topbar-actions"><button type="button" className="mobile-bell-button" aria-label="Notificações"><span aria-hidden="true">🔔</span></button><button type="button" className="mobile-profile-button" onClick={() => openPage('profile')} aria-label="Abrir perfil">{session.avatar ? <img src={session.avatar} alt={'Foto de ' + session.name}/> : <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}<i aria-hidden="true"/></button></span>
    </header>
    <aside className={mobileNavOpen ? 'mobile-open' : ''}>
      <div className="nav-identity"><img src="/essence-life-logo.png" alt="" className="nav-logo"/><div><h1 className="nav-brand">Essence Life</h1><small>Olá, {session.name.split(' ')[0]}</small></div></div>
      <div className="nav-groups">
        <section className="nav-group"><p className="nav-section-title">Meu dia</p>{nav('home', 'Início', '🏠')}{nav('agenda', 'Agenda', '📅')}{nav('pomodoro', 'Pomodoro', '⏱️')}{nav('routine', 'Hábitos', '🗓️')}{nav('diary', 'Diário', '📘')}{nav('insights', 'Insights', '✨')}</section>
        <section className="nav-group"><p className="nav-section-title">Bem-estar</p><div className={'nav-expandable ' + (sleepOpen ? 'open' : '')}><div className="nav-expandable-row"><button type="button" className={page === 'sleep' ? 'active' : ''} onClick={() => openSleep()}><span>🌙</span><span>Sono</span></button><button type="button" className="nav-expand-toggle" aria-label={sleepOpen ? 'Fechar opções de Sono' : 'Abrir opções de Sono'} aria-expanded={sleepOpen} onClick={() => setSleepOpen(value => !value)}>⌄</button></div>{sleepOpen && <div className="nav-submenu">{sleepLinks.map(link => <button type="button" key={link} onClick={() => openSleep(link)}>{link}</button>)}</div>}</div>{nav('nutrition', 'Nutrição', '🥗')}{nav('cycle', 'Ciclo', '🌸')}{nav('workouts', 'Treinos', '🏋️')}{nav('beauty', 'Beleza & Cuidados', '🪞')}</section>
        <section className="nav-group"><p className="nav-section-title">Organização</p>{nav('finance', 'Finanças', '💰')}{nav('house', 'Casa & Compras', '🏡')}</section>
        <section className="nav-group nav-account-group"><p className="nav-section-title">Conta</p>{nav('settings', 'Configurações', '⚙️')}{nav('profile', 'Perfil', '👤')}<button className="logout" type="button" onClick={onLogout}><span>↪</span><span>Sair</span></button></section>
      </div>
    </aside>
    <nav className="mobile-bottom-nav" aria-label="Navegação principal"><button type="button" className={page === 'home' ? 'active' : ''} onClick={() => openPage('home')}><span>Início</span></button><button type="button" className={page === 'agenda' ? 'active' : ''} onClick={() => openPage('agenda')}><span>Agenda</span></button><button type="button" onClick={() => openPage('agenda')}><span>Tarefas</span></button><button type="button" className={page === 'routine' ? 'active' : ''} onClick={() => openPage('routine')}><span>Hábitos</span></button><button type="button" className={mobileNavOpen ? 'active' : ''} onClick={onToggleMobileNav}><span>Mais</span></button></nav>
    <main>{page === 'profile' ? <header className="content-header"><div><h2>{currentMeta.title}</h2><p>{currentMeta.copy}</p></div></header> : null}{children}</main>
  </div>;
}

export default AuthenticatedLayout;
