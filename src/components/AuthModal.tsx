import React, { useState } from 'react';
import { X } from 'lucide-react';
import { signIn, signUp } from '../lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        // Translate common error messages
        if (error.message === 'User already registered') {
          throw new Error('Este correo electrónico ya está registrado. Por favor, inicia sesión.');
        } else if (error.message === 'Invalid login credentials') {
          throw new Error('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
        } else if (error.message.includes('password')) {
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        }
        throw error;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              minLength={6}
            />
            <p className="text-sm text-gray-500 mt-1">
              {!isLogin && 'La contraseña debe tener al menos 6 caracteres'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null); // Clear any errors when switching modes
            }}
            className="w-full text-sm text-blue-600 hover:text-blue-500"
          >
            {isLogin ? '¿No tienes una cuenta? Regístrate' : '¿Ya tienes una cuenta? Inicia sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}