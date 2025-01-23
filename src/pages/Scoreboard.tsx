import  { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Participant } from '../types/database';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Medal } from 'lucide-react';

export function Scoreboard() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadParticipants();
  }, []);

  async function loadParticipants() {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('total_points', { ascending: false });

      if (error) throw error;
      setParticipants(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading scoreboard');
    } finally {
      setLoading(false);
    }
  }

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-400';
      case 1: return 'text-gray-400';
      case 2: return 'text-amber-600';
      default: return 'text-transparent';
    }
  };

  // Add unique IDs to the data for Recharts
  const chartData = participants.map((participant, index) => ({
    ...participant,
    chartId: `participant-${index}` // Add unique ID for chart elements
  }));

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Puntuacion</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Clasificaciones</h2>
          <div className="min-w-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rango
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipo
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Color
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participants.map((participant, index) => (
                  <tr key={participant.id}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">{index + 1}</span>
                        <Medal className={`w-5 h-5 ${getMedalColor(index)}`} />
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{participant.name}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: participant.team }}
                        />
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap font-semibold">
                      {participant.total_points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Distribución de puntos</h2>
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 shadow-md rounded border">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: data.team }}
                            />
                            <p className="font-medium">{data.name}</p>
                          </div>
                          <p className="text-sm">{data.total_points} Puntos</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="total_points"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                  // Add key function to ensure unique keys
                  key={`bar-${Date.now()}`}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}