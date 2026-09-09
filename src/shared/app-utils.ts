export const today = () => new Date().toISOString().slice(0, 10);

export const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
};

export const createId = () => crypto.randomUUID();

// Reads and parses a JSON value from localStorage, falling back safely instead of
// throwing when the stored value is missing or corrupted. A raw `JSON.parse` on a
// bad value inside a `useState(() => ...)` initializer throws during the very first
// render, and with no error boundary in this app that crashes the whole screen to
// blank — this is the safe way to read anything persisted from localStorage.
export const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};


const minutes = (time: string) => {
  const [hours, minutesValue] = time.split(':').map(Number);
  return hours * 60 + minutesValue;
};

export const duration = (start: string, end: string) => {
  const elapsed = minutes(end) - minutes(start);
  return elapsed <= 0 ? elapsed + 1440 : elapsed;
};

export const formatDuration = (value: number) =>
  `${Math.floor(value / 60)}h ${value % 60}min`;

// Portuguese singular/plural helper: plural(2, 'conta', 'contas') -> 'contas'.
export const plural = (n: number, singular: string, plural: string) =>
  n === 1 ? singular : plural;

export const parseMoney = (value: string) => {
  const raw = value.trim();
  if (!raw) return 0;
  return Number(raw.includes(',') ? raw.replace(/\./g, '').replace(',', '.') : raw) || 0;
};

export const formatMoneyInput = (input: HTMLInputElement) => {
  if (!input.value.trim()) return;
  input.value = parseMoney(input.value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};