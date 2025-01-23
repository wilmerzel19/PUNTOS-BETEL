import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Participant, Activity } from '../types/database';
import { Award } from 'lucide-react';

export function Admin() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [pointsToAssign, setPointsToAssign] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

  useEffect(() => {
    Promise.all([loadParticipants(), loadActivities()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Update points when activity is selected
    const activity = activities.find(a => a.id === selectedActivity);
    if (activity) {
      setPointsToAssign(activity.points);
    } else {
      setPointsToAssign(0);
    }
  }, [selectedActivity, activities]);

  async function loadParticipants() {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('name');

      if (error) throw error;
      setParticipants(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar participantes');
    }
  }

  async function loadActivities() {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('name');

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar actividades');
    }
  }

  async function handleAssignPoints() {
    if (!selectedParticipant || !selectedActivity) return;

    try {
      const activity = activities.find(a => a.id === selectedActivity);
      if (!activity) return;

      // Record the activity completion with custom points
      const { error: activityError } = await supabase
        .from('participant_activities')
        .insert([{
          participant_id: selectedParticipant,
          activity_id: selectedActivity,
          points_earned: pointsToAssign
        }]);

      if (activityError) throw activityError;

      // Update participant's total points with custom points value
      const { error: updateError } = await supabase
        .rpc('increment_participant_points', {
          p_participant_id: selectedParticipant,
          p_points: pointsToAssign
        });

      if (updateError) throw updateError;

      // Play success sound
      try {
        await successSound.play();
      } catch (soundError) {
        console.warn('Could not play sound effect:', soundError);
      }

      setSelectedParticipant('');
      setSelectedActivity('');
      setPointsToAssign(0);
      loadParticipants();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar puntos');
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Panel de Administración</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Asignar Puntos</h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Participante
            </label>
            <select
              value={selectedParticipant}
              onChange={(e) => setSelectedParticipant(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccionar participante</option>
              {participants.map((participant) => (
                <option 
                  key={participant.id} 
                  value={participant.id}
                  style={{ paddingLeft: '20px' }}
                >
                  {participant.name}
                </option>
              ))}
            </select>
            {selectedParticipant && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm text-gray-500">Equipo:</span>
                <span 
                  className="inline-block w-4 h-4 rounded-full border border-gray-200"
                  style={{ 
                    backgroundColor: participants.find(p => p.id === selectedParticipant)?.team 
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Actividad
            </label>
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Seleccionar actividad</option>
              {activities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name} (máx {activity.points} puntos)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puntos a Asignar
            </label>
            <input
              type="number"
              value={pointsToAssign}
              onChange={(e) => setPointsToAssign(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="0"
              max={activities.find(a => a.id === selectedActivity)?.points || 0}
            />
            {selectedActivity && (
              <p className="text-sm text-gray-500 mt-1">
                Máximo: {activities.find(a => a.id === selectedActivity)?.points} puntos
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleAssignPoints}
          disabled={!selectedParticipant || !selectedActivity}
          className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Award className="w-5 h-5 mr-2" />
          Asignar Puntos
        </button>
      </div>
    </div>
  );
}