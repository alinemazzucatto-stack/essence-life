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

function generateChartData(entries: Entry[], cycleLength: number) {
  const chartData = [];
  for (let day = 1; day <= cycleLength; day++) {
    chartData.push({
      day,
      energia: 5 + Math.sin(day / 3) * 2,
      humor: 5 + Math.sin(day / 4) * 2,
      sensibilidade: 5 + Math.cos(day / 3) * 2,
      descanso: 5 + Math.cos(day / 2) * 2,
    });
  }
  return chartData;
}

const symptomData = [
  { icon: '⚡', name: 'Cólicas', percent: 62 },
  { icon: '🩸', name: 'Inchaço', percent: 48 },
  { icon: '🤕', name: 'Dor de cabeça', percent: 38 },
  { icon: '😔', name: 'Sensibilidade', percent: 35 },
];

const recommendations = [
  {
    icon: '🍵',
    title: 'Chá de conforto',
    description: 'Pode ajudar a aliviar as cólicas e o inchaço.',
  },
  {
    icon: '🏋️',
    title: 'Exercício leve',
    description: 'Ajuda a reduzir o estresse e melhora o humor.',
  },
  {
    icon: '🧘',
    title: 'Rotina de descanso',
    description: 'Priorize uma boa noite de sono na fase lútea para equilibrar a energia.',
  },
];

export default function CycleInsights({
  entries,
  cycleLength,
  hasReference,
  symptoms,
}: Props) {
  const total = Math.max(entries.length, 1);
  const frequent = symptoms.filter(item => item.count > 0).slice(0, 4);
  const flowDays = entries.filter(entry => entry.flow !== 'Sem fluxo').length;
  const regularity = hasReference ? 'Regular' : 'Em acompanhamento';
  const menstruationDays = flowDays || 5;
  const lutealDays = Math.max(10, cycleLength - 14);
  const chartData = generateChartData(entries, cycleLength);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-pink-50 rounded-lg">☰</button>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✦</span>
                <span className="text-xl font-bold text-gray-900">Essence Life</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-pink-50 rounded-lg">🔔</button>
              <button className="w-10 h-10 rounded-full border-2 border-pink-300 flex items-center justify-center hover:bg-pink-50">
                👤
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-3">
            <button className="px-6 py-2 rounded-full text-gray-600 hover:bg-pink-50">
              🏠 Visão geral
            </button>
            <button className="px-6 py-2 rounded-full text-gray-600 hover:bg-pink-50">
              📊 Histórico
            </button>
            <button className="px-6 py-3 rounded-full bg-pink-500 text-white font-medium">
              💡 Insights
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Seus insights do ciclo</h1>
          <p className="text-gray-600">Entenda seus padrões e receba recomendações personalizadas.</p>
        </div>

        {/* Top Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Card 1: Regular Cycle */}
          <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-3xl p-8 relative overflow-hidden border border-pink-200">
            <div className="absolute top-8 right-8 opacity-30 text-5xl">🌸</div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-gray-600 text-sm mb-1">Seu ciclo é</p>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{regularity}</h2>
                <p className="text-gray-600 text-sm">Seus ciclos têm se mantido estáveis nos últimos meses.</p>
              </div>
              <div className="text-5xl flex-shrink-0">📅</div>
            </div>
            <div className="absolute bottom-0 right-0 opacity-20 text-6xl">🌿</div>
          </div>

          {/* Card 2: Duration */}
          <div className="bg-white rounded-3xl p-8 border border-pink-100 shadow-sm">
            <p className="text-gray-600 text-sm mb-6">Duração média do ciclo</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs mb-2">Varia entre 27 e 30 dias</p>
              </div>
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#fce7f3" strokeWidth="10" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="10"
                    strokeDasharray="280 351.86"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: '🩸', title: 'Duração da menstruação', value: menstruationDays, unit: 'dias', desc: 'Varia entre 4 e 6 dias' },
            { icon: '🌸', title: 'Ovulação', value: 'Dia 14', desc: 'Em média' },
            { icon: '❤️', title: 'Fase lútea', value: lutealDays, unit: 'dias', desc: 'Em média' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-pink-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-xl">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {item.value}{item.unit ? ' ' + item.unit : ''}
              </p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-3xl p-8 border border-pink-100 shadow-sm mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Como você se sente ao longo do ciclo</h2>
          <p className="text-gray-600 text-sm mb-8">Média dos seus registros dos últimos 3 ciclos.</p>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#999"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#999" style={{ fontSize: '12px' }} domain={[0, 10]} ticks={[0, 5, 10]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #f0f0f0',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#999' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="energia"
                stroke="#f59e0b"
                strokeWidth={2.5}
                dot={false}
                name="Energia"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="humor"
                stroke="#ec4899"
                strokeWidth={2.5}
                dot={false}
                name="Humor"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="sensibilidade"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={false}
                name="Sensibilidade"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="descanso"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                name="Descanso"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Symptoms Section */}
        <div className="bg-white rounded-3xl p-8 border border-pink-100 shadow-sm mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">Sintomas mais recorrentes</h2>
            <button className="text-pink-500 font-medium text-sm hover:text-pink-600">Ver todos ›</button>
          </div>
          <p className="text-gray-600 text-sm mb-8">Com base nos seus últimos registros.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {symptomData.map((symptom, idx) => (
              <div key={idx} className="bg-pink-50 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-3">{symptom.icon}</div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{symptom.name}</p>
                <p className="text-2xl font-bold text-pink-500 mb-3">{symptom.percent}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-400 to-pink-500 h-2 rounded-full"
                    style={{ width: `${symptom.percent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">dos ciclos</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-3xl p-8 border border-pink-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Recomendações para você</h2>
          <p className="text-gray-600 text-sm mb-8">Com base nos seus padrões e sintomas mais frequentes.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-6 hover:shadow-md transition cursor-pointer group border border-pink-100"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{rec.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{rec.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
                <div className="text-pink-500 font-medium text-sm flex items-center gap-1">
                  Saiba mais <span className="ml-1">›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
