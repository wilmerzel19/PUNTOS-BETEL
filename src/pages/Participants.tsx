import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Participant } from '../types/database';
import { UserPlus, Edit2, Trash2, Clock } from 'lucide-react';

export function Participants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    team: '#3B82F6', // Default color - blue
    group: '',
    total_points: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [activityHistory, setActivityHistory] = useState<any[]>([]);

  useEffect(() => {
    loadParticipants();
  }, []);

  useEffect(() => {
    if (showHistory) {
      loadParticipantHistory(showHistory);
    }
  }, [showHistory]);

  async function loadParticipants() {
    try {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParticipants(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading participants');
    } finally {
      setLoading(false);
    }
  }

  async function loadParticipantHistory(participantId: string) {
    try {
      const { data, error } = await supabase
        .from('participant_activities')
        .select(`
          *,
          activities (
            name,
            description
          )
        `)
        .eq('participant_id', participantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivityHistory(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading activity history');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('participants')
          .update({ 
            name: formData.name,
            team: formData.team,
            group: formData.group,
            total_points: parseInt(String(formData.total_points))
          })
          .eq('id', editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('participants')
          .insert([{ ...formData, total_points: parseInt(String(formData.total_points)) }]);

        if (error) throw error;
      }

      setFormData({ name: '', team: '#3B82F6', group: '', total_points: 0 });
      loadParticipants();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving participant');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this participant?')) return;
    
    try {
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadParticipants();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting participant');
    }
  }

  function handleEdit(participant: Participant) {
    setFormData({
      name: participant.name,
      team: participant.team,
      group: participant.group,
      total_points: participant.total_points,
    });
    setEditingId(participant.id);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          {editingId ? 'Editar Equipos' : 'Registrar a los Equipos'}
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lider de Equipo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color del Equipo
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="h-10 w-full rounded-md border-gray-300 shadow-sm cursor-pointer"
                  required
                />
                <div 
                  className="w-10 h-10 rounded-md border border-gray-300"
                  style={{ backgroundColor: formData.team }}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grupo
              </label>
              <input
                type="text"
                value={formData.group}
                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Puntos Totales
              </label>
              <input
                type="number"
                value={formData.total_points}
                onChange={(e) => setFormData({ ...formData, total_points: parseInt(e.target.value) || 0 })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2">
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editingId ? (
                <>
                  <Edit2 className="w-5 h-5 mr-2" />
                  Atualizar Participante
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Agregar Participante
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', team: '#3B82F6', group: '', total_points: 0 });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre del Lider
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Color del Equipo
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grupo
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntos Totales
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actiones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 sm:px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 sm:px-6 py-4 text-center text-gray-500">
                  Aún no se han registrado participantes
                  </td>
                </tr>
              ) : (
                participants.map((participant) => (
                  <React.Fragment key={participant.id}>
                    <tr>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{participant.name}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div 
                          className="w-6 h-6 rounded-md border border-gray-300"
                          style={{ backgroundColor: participant.team }}
                          title={participant.team}
                        />
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{participant.group}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{participant.total_points}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(participant)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(participant.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setShowHistory(showHistory === participant.id ? null : participant.id)}
                            className={`${showHistory === participant.id ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-900`}
                            title="Historial de actividades"
                          >
                            <Clock className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {showHistory === participant.id && (
                      <tr>
                        <td colSpan={5} className="px-3 sm:px-6 py-4 bg-gray-50">
                          <div className="text-sm">
                            <h4 className="font-medium text-gray-900 mb-2">Historial de actividades</h4>
                            {activityHistory.length === 0 ? (
                              <p className="text-gray-500">Aún no se han registrado actividades</p>
                            ) : (
                              <div className="space-y-2">
                                {activityHistory.map((activity) => (
                                  <div key={activity.id} className="flex justify-between items-start border-b border-gray-200 pb-2">
                                    <div>
                                      <p className="font-medium text-gray-900">{activity.activities.name}</p>
                                      <p className="text-gray-600">{activity.activities.description}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium text-gray-900">+{activity.points_earned} puntos</p>
                                      <p className="text-gray-500 text-xs">{formatDate(activity.created_at)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}