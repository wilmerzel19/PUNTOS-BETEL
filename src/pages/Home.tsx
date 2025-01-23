import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, Trophy, UserPlus } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { getCurrentUser } from '../lib/auth';

export function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }

  const cards = [
    {
      icon: Users,
      title: 'Registrar Participantes',
      description: 'Añadir nuevos participantes y equipos',
      link: '/participants',
    },
    {
      icon: Activity,
      title: 'Gestionar Actividades',
      description: 'Crear y administrar actividades del campamento',
      link: '/activities',
    },
    {
      icon: Trophy,
      title: 'Ver Tabla de Posiciones',
      description: 'Consultar el ranking actual y los puntos',
      link: '/scoreboard',
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <img src="src/img/logo.png" alt="Puntos-Campa" className="mx-auto w-24 mb-8" />
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Bienvenido al Rastreador de Puntos
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Regístrate o inicia sesión para comenzar a gestionar los puntos del campamento.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Comenzar Ahora
          </button>
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            onSuccess={() => {
              checkUser();
              setIsAuthModalOpen(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
        Bienvenido al Rastreador de Puntos Betel 🏆
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {cards.map(({ icon: Icon, title, description, link }) => (
          <Link
            key={link}
            to={link}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow transform hover:-translate-y-1 transition-transform duration-200"
          >
            <Icon className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}