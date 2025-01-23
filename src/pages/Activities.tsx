import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Activity } from '../types/database';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  async function loadActivities() {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading activities');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('activities')
          .update({ 
            name: formData.name,
            description: formData.description,
            points: parseInt(formData.points)
          })
          .eq('id', editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase
          .from('activities')
          .insert([{ 
            name: formData.name,
            description: formData.description,
            points: parseInt(formData.points)
          }]);

        if (error) throw error;
      }

      setFormData({ name: '', description: '', points: '' });
      loadActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving activity');
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadActivities();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting activity');
    }
  }

  function handleEdit(activity: Activity) {
    setFormData({
      name: activity.name,
      description: activity.description,
      points: String(activity.points),
    });
    setEditingId(activity.id);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">
          {editingId ? 'Editar Actividad' : 'Gestionar actividades'}
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
               Actividadad
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
                Puntos
              </label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripcion
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          <div className="mt-4 flex justify-between">
            <button
              type="submit"
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editingId ? (
                <>
                  <Edit2 className="w-5 h-5 mr-2" />
                  Actualizar Actividad
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                 Agregar Actividad
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: '', description: '', points: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actividad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripcion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actiones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : activities.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                Aún no se han creado actividades
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr key={activity.id}>
                  <td className="px-6 py-4">{activity.name}</td>
                  <td className="px-6 py-4">{activity.description}</td>
                  <td className="px-6 py-4">{activity.points}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(activity.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}