export const today = () => new Date().toISOString().slice(0, 10);

export const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
};

export const createId = () => crypto.randomUUID();

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