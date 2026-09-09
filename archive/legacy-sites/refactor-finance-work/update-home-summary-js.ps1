$ErrorActionPreference = 'Stop'
$path = Join-Path $PSScriptRoot 'dist\essence-home-summary-v1.js'
$content = @'
(() => {
  const root = () => document.querySelector('#root, main[data-module="home"], main.home, main, #app, .app-shell, .app');
  const parseJSON = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  };
  const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value || 0));
  const toDate = (value) => {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const currentMonthKey = () => {
    const d = new Date();
    return String(d.getFullYear()) + '-' + String(d.getMonth() + 1).padStart(2, '0');
  };
  const periodKey = (date) => {
    const d = date ? new Date(date) : new Date();
    return String(d.getFullYear()) + '-' + String(d.getMonth() + 1).padStart(2, '0');
  };
  const sleepDuration = (sleep) => {
    const bed = toDate(sleep.wentToBedAt || sleep.bedtime || sleep.startAt);
    const wake = toDate(sleep.gotOutOfBedAt || sleep.wokeUpAt || sleep.endAt);
    if (!bed || !wake) return null;
    const diff = wake.getTime() - bed.getTime();
    if (diff <= 0) return null;
    return diff / 3600000;
  };
  const labelTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };
  const findArray = (keys) => {
    for (const key of keys) {
      const value = parseJSON(key, null);
      if (Array.isArray(value)) return value;
    }
    return [];
  };
  const financeItems = findArray(['essence:finance']);
  const tasks = findArray(['essence:tasks']);
  const routines = findArray(['essence:routine-items', 'essence:routine-items-v1', 'essence:routine', 'essence:routine-items-v2']);
  const sleepEntries = findArray(['essence:sleep-entries', 'essence:sleep', 'essence:sleepEntries', 'essence:sleep-records']);
  const agendaItems = findArray(['essence:agenda', 'essence:agenda-items', 'essence:agenda-events']);
  const monthKey = currentMonthKey();

  const mount = () => {
    const host = root();
    if (!host) return;
    host.classList.add('module-polished');

    const oldCard = host.querySelector('.home-personal-summary');
    if (oldCard) oldCard.remove();

    const financeBalance = financeItems
      .filter((item) => periodKey(item.date || item.createdAt || item.dueDate) === monthKey)
      .reduce((sum, item) => {
        const amount = Number(item.amount || item.value || item.total || 0);
        const type = String(item.type || item.kind || '').toLowerCase();
        return type.indexOf('sa') >= 0 ? sum - amount : sum + amount;
      }, 0);

    const tasksDone = tasks.filter((item) => item.completed || item.done || item.status === 'done').length;
    const routineDone = routines.filter((item) => item.completed || item.done || item.status === 'done').length;
    const routineTotal = routines.length;
    const sleepLast = sleepEntries.length ? sleepEntries[sleepEntries.length - 1] : null;
    const sleepHours = sleepLast ? sleepDuration(sleepLast) : null;
    const sleepQuality = sleepLast && (sleepLast.quality || sleepLast.sleepQuality) ? (sleepLast.quality || sleepLast.sleepQuality) : 'Sem registro';
    let nextAgenda = null;
    for (let i = 0; i < agendaItems.length; i += 1) {
      const item = agendaItems[i];
      const when = toDate(item.date || item.datetime || item.startAt || item.start);
      if (when && when.getTime() >= Date.now()) {
        nextAgenda = item;
        break;
      }
    }

    const card = document.createElement('section');
    card.className = 'home-personal-summary polished-card';
    card.innerHTML =
      '<h2>RESUMO PESSOAL</h2>' +
      '<div class="summary-subtitle">Seu espaço em um olhar, sem excesso de informação.</div>' +
      '<div class="summary-grid">' +
      '<div class="summary-row"><div class="summary-label">Sono</div><div class="summary-value">' + (sleepHours ? sleepHours.toFixed(1) + 'h' : 'Sem registro') + '</div><div class="summary-note">' + sleepQuality + '</div></div>' +
      '<div class="summary-row"><div class="summary-label">Rotina</div><div class="summary-value">' + routineDone + '/' + (routineTotal || 0) + ' concluídos</div><div class="summary-note">' + labelTime() + ' • ' + tasksDone + ' tarefas concluídas</div></div>' +
      '<div class="summary-row"><div class="summary-label">Finanças</div><div class="summary-value">' + money(financeBalance) + '</div><div class="summary-note">' + (nextAgenda ? 'Próximo: ' + (nextAgenda.title || nextAgenda.name || 'compromisso') : 'Nenhum compromisso próximo') + '</div></div>' +
      '</div>' +
      '<div class="summary-note">Acompanhe o essencial e siga com leveza.</div>';

    const insertionPoint = host.querySelector('.home-header, .hero, .module-header, .welcome-card, header, .page-header, .module-title, .title-block');
    if (insertionPoint && insertionPoint.parentElement) {
      insertionPoint.insertAdjacentElement('afterend', card);
    } else {
      host.prepend(card);
    }

    host.querySelectorAll('.home-shortcuts, .growth, .weekly-inspiration, [data-home-role="weekly-inspiration"], .water-tracker, .water-card, [data-home-role="water"], [data-card-type="water"]').forEach((el) => el.remove());
    host.querySelectorAll('.module-card, .home-card, .card, article, section').forEach((el) => {
      const text = (el.textContent || '').toLowerCase();
      if (text.indexOf('registrar 250 ml') >= 0 || text.indexOf('meta de água') >= 0 || text.indexOf('250 ml') >= 0) {
        el.remove();
      }
    });

    document.querySelectorAll('.weekly-inspiration, [data-home-role="weekly-inspiration"], .water-tracker, .water-card, [data-home-role="water"], [data-card-type="water"]').forEach((el) => el.remove());

    const greeting = host.querySelector('.home-greeting, .welcome-title, .hero-title, h1, .page-title, .title, .module-title');
    if (greeting) greeting.textContent = labelTime() + ', Aline!';
    host.classList.add('module-polished');
  };

  const observer = new MutationObserver(() => mount());
  const init = () => {
    mount();
    if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
'@
[IO.File]::WriteAllText($path, $content, (New-Object Text.UTF8Encoding($false)))
Write-Host 'home-summary-js-replaced'
