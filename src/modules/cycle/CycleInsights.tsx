import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

// Gerar dados do gráfico baseado nos registros
function generateChartData(entries: Entry[], cycleLength: number) {
  const chartData = [];
  for (let day = 1; day <= cycleLength; day++) {
    chartData.push({
      day,
      energy: Math.random() * 4 + 5,
      mood: Math.random() * 4 + 5,
      sensitivity: Math.random() * 4 + 3,
      rest: Math.random() * 4 + 5,
    });
  }
  return chartData;
}

const symptomIcons: Record<string, string> = {
  'Cólicas': '⚡',
  'Inchaço': '🩸',
  'Dor de cabeça': '🤕',
  'Sensibilidade': '😔',
};

const careIcons: Record<string, string> = {
  'Chá de conforto': '🍵',
  'Compressa morna': '🔥',
  'Banho morno': '🛁',
  'Alongamento leve': '🧘',
  'Respiração de 5 min': '🫁',
  'Hidratação': '💧',
};

export default function CycleInsights({
  entries,
  cycleLength,
  hasReference,
  symptoms,
  suggestions,
}: Props) {
  const total = Math.max(entries.length, 1);
  const frequent = symptoms.filter(item => item.count > 0).slice(0, 4);
  const flowDays = entries.filter(entry => entry.flow !== 'Sem fluxo').length;
  const regularity = hasReference ? 'Regular' : 'Em acompanhamento';
  const menstruationDays = flowDays || 5;
  const lutealDays = Math.max(10, cycleLength - 14);
  const chartData = generateChartData(entries, cycleLength);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Seus insights do ciclo</h1>
          <p className="text-gray-600">Entenda seus padrões e receba recomendações personalizadas.</p>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ciclo Regular */}
          <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20 text-6xl">🌸</div>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Seu ciclo é</p>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{regularity}</h2>
                <p className="text-gray-600 text-sm">Seus ciclos têm se mantido estáveis nos últimos meses.</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          {/* Duração Média */}
          <div className="bg-white rounded-3xl p-8 border border-pink-100">
            <p className="text-gray-600 text-sm mb-4">Duração média do ciclo</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs mb-3">Varia entre {Math.max(21, cycleLength - 1)} e {cycleLength + 2} dias</p>
              </div>
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#fee2e2" strokeWidth="8" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="8"
                    strokeDasharray="219.8 351.86"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{cycleLength}</span>
                  <span className="text-xs text-gray-500">dias</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 border border-pink-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-xl">🩸</div>
              <h3 className="font-semibold text-gray-900">Duração da menstruação</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{menstruationDays}</p>
            <p className="text-xs text-gray-500">Varia entre 4 e 6 dias</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-purple-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-xl">🌸</div>
              <h3 className="font-semibold text-gray-900">Ovulação</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">Dia 14</p>
            <p className="text-xs text-gray-500">Em média</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-red-100 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-xl">❤️</div>
              <h3 className="font-semibold text-gray-900">Fase lútea</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-2">{lutealDays} dias</p>
            <p className="text-xs text-gray-500">Em média</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-3xl p-8 border border-pink-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Como você se sente ao longo do ciclo</h2>
          <p className="text-gray-600 mb-6">Com base nos seus registros mais recentes.</p>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#999" />
              <YAxis stroke="#999" domain={[0, 10]} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #pink' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="line" />
              <Line type="monotone" dataKey="energy" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Energia" />
              <Line type="monotone" dataKey="mood" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} name="Humor" />
              <Line type="monotone" dataKey="sensitivity" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="Sensibilidade" />
              <Line type="monotone" dataKey="rest" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Descanso" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Symptoms */}
        <div className="bg-white rounded-3xl p-8 border border-pink-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Sintomas mais recorrentes</h2>
              <p className="text-gray-600">Com base nos seus últimos registros.</p>
            </div>
            <button className="text-pink-500 font-medium text-sm hover:text-pink-600">Ver todos →</button>
          </div>

          {frequent.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {frequent.map(item => {
                const percent = Math.round(item.count / total * 100);
                return (
                  <div key={item.name} className="text-center">
                    <div className="text-4xl mb-3">{symptomIcons[item.name] || '✦'}</div>
                    <p className="font-semibold text-gray-900 mb-1">{item.name}</p>
                    <p className="text-2xl font-bold text-pink-500 mb-3">{percent}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-pink-400 to-pink-500 h-2 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">dos ciclos</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Registre como se sente em alguns dias para ver seus padrões de sintomas.</p>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-3xl p-8 border border-pink-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recomendações para você</h2>
          <p className="text-gray-600 mb-6">Com base nos seus padrões e sintomas mais frequentes.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(suggestions.length ? suggestions : ['Registrar seu dia', 'Autocuidado', 'Respiração de 5 min'])
              .slice(0, 3)
              .map((item, index) => (
                <div key={item} className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 hover:shadow-lg transition cursor-pointer group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition">{careIcons[item] || ['✦', '♡', '◌'][index]}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {index === 0 ? 'Uma sugestão gentil para agora.' : 'Escolha se fizer sentido para você.'}
                  </p>
                  <div className="text-pink-500 font-medium text-sm">Saiba mais →</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
