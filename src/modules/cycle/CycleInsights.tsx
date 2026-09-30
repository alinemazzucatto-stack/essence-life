type Entry = { id: string; date: string; flow: string; symptoms: string[]; moods?: string[]; mood?: string };
type Symptom = { name: string; count: number };
type Props = {
  entries: Entry[];
  cycleLength: number;
  cycleDay: number;
  phase: string;
  hasReference: boolean;
  symptoms: Symptom[];
  suggestions: string[];
};

export default function CycleInsights({
  entries,
  cycleLength,
  hasReference,
}: Props) {
  const flowDays = entries.filter(entry => entry.flow !== 'Sem fluxo').length;
  const regularity = hasReference ? 'Regular' : 'Em acompanhamento';
  const menstruationDays = flowDays || 1;
  const lutealDays = Math.max(10, cycleLength - 14);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-pink-100">
        <button className="text-2xl">☰</button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex items-center justify-center text-white">
            ✓
          </div>
          <span className="font-bold text-gray-900">Essence Life</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-2xl">🔔</button>
          <button className="w-8 h-8 rounded-full border-2 border-pink-300 flex items-center justify-center text-gray-600">
            👤
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-2xl p-4 border border-pink-200">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0 text-pink-600">
            ✦
          </div>
          <div>
            <p className="text-pink-600 text-xs font-bold uppercase tracking-wide">Seu ritmo, com gentileza</p>
            <p className="text-gray-700 text-sm mt-1">Observe datas, sintomas, humor e energia sem transformar estimativas em cobranças.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 mt-4 mb-6">
        <button className="px-4 py-2 rounded-full text-gray-700 text-sm flex items-center gap-2">
          🏠 Visão geral
        </button>
        <button className="px-4 py-2 rounded-full text-gray-700 text-sm flex items-center gap-2">
          📊 Histórico
        </button>
        <button className="px-4 py-3 rounded-full bg-pink-500 text-white text-sm font-medium flex items-center gap-2">
          💡 Insights
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4">
        {/* Title Section */}
        <div className="mb-6 relative">
          <h1 className="text-2xl font-bold text-gray-900">Seus insights do ciclo</h1>
          <p className="text-gray-600 text-sm mt-1">Entenda seus padrões e receba recomendações personalizadas.</p>
          <div className="absolute top-0 right-0 text-3xl opacity-40">🌸</div>
        </div>

        {/* Top Cards Section */}
        <div className="space-y-4 mb-6">
          {/* Card 1: Regular Cycle */}
          <div className="bg-pink-50 rounded-2xl p-4 border border-pink-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-pink-200 rounded-full flex items-center justify-center flex-shrink-0 text-pink-600">
                📅
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-bold text-lg">Seu ciclo é</p>
                <p className="text-gray-900 font-bold text-2xl">{regularity}</p>
                <p className="text-gray-600 text-xs mt-1">Seus ciclos têm se mantido estáveis nos últimos meses.</p>
              </div>
            </div>
          </div>

          {/* Card 2: Duration */}
          <div className="bg-white rounded-2xl p-4 border border-pink-100">
            <p className="text-gray-700 text-xs mb-3">Duração média do ciclo</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-bold text-3xl">{cycleLength}</p>
                <p className="text-gray-600 text-xs">dias</p>
                <p className="text-gray-500 text-xs mt-2">Varia entre 27 e 30 dias</p>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#fce7f3" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="8"
                    strokeDasharray={`${(cycleLength / 28) * 251.2} 251.2`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: '🩸', title: 'Duração da menstruação', value: menstruationDays, unit: 'dia', desc: 'Varia entre 4 e 6 dias' },
            { icon: '🌸', title: 'Ovulação', value: 'Dia 14', unit: '', desc: 'Em média' },
            { icon: '❤️', title: 'Fase lútea', value: lutealDays, unit: 'dias', desc: 'Em média' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-3 border border-pink-100 text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-gray-600 text-xs font-medium mb-1">{item.title}</p>
              <p className="text-gray-900 font-bold text-lg">
                {item.value}{item.unit ? ' ' + item.unit : ''}
              </p>
              <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-2xl p-4 border border-pink-100 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Como você se sente ao longo do ciclo</h2>
          <p className="text-gray-600 text-xs mb-4">Com base nos seus registros mais recentes.</p>

          {/* Phase Labels */}
          <div className="flex justify-between mb-4 text-xs font-medium text-gray-700">
            <span className="text-pink-600 bg-pink-50 px-2 py-1 rounded-full">Menstruação</span>
            <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Fase folicular</span>
            <span className="text-pink-600 bg-pink-50 px-2 py-1 rounded-full">Ovulação</span>
            <span className="text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Fase lútea</span>
          </div>

          {/* Simple Chart Placeholder */}
          <div className="h-40 bg-pink-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">Gráfico de padrões emocionais</p>
          </div>
        </div>

        {/* Symptoms Section */}
        <div className="bg-white rounded-2xl p-4 border border-pink-100 mb-6">
          <div className="bg-pink-50 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-2xl">
                〰️
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-bold text-lg">Cólicas</p>
                <p className="text-gray-600 text-xs">dos registros</p>
              </div>
              <p className="text-gray-900 font-bold text-2xl">50%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-pink-500 h-2 rounded-full" style={{ width: '50%' }} />
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-2xl p-4 border border-pink-100 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Recomendações para você</h2>
          <p className="text-gray-600 text-xs mb-4">Pequenos cuidados que combinam com o seu momento.</p>

          <div className="space-y-3">
            {[
              { icon: '🫖', title: 'Chá de conforto', desc: 'Uma sugestão gentil para agora.' },
              { icon: '💨', title: 'Respiração de 5 min', desc: 'Escolha se fizer sentido para você.' },
              { icon: '🧊', title: 'Compressa morna', desc: 'Uma estratégia testada para aliviar.' },
            ].map((rec, idx) => (
              <div key={idx} className="bg-pink-50 rounded-xl p-3 flex items-start gap-3 cursor-pointer hover:bg-pink-100 transition">
                <div className="text-2xl flex-shrink-0">{rec.icon}</div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold text-sm">{rec.title}</p>
                  <p className="text-gray-600 text-xs mt-1">{rec.desc}</p>
                </div>
                <span className="text-pink-500 text-lg flex-shrink-0">›</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}
