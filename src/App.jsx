import { useState } from 'react';
import { Login } from './pages/Login';
import { CustomerForm } from './pages/CustomerForm';
import { SalesHistory } from './pages/SalesHistory'; // Importamos el nuevo componente

function App() {
  // Mantenemos tu lógica de token
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  // Estado para controlar qué pestaña ve el vendedor
  const [currentView, setCurrentView] = useState('form');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <>
          {/* 1. BARRA DE NAVEGACIÓN PRINCIPAL */}
          <nav
            style={{ backgroundColor: '#013ea8' }}
            className="flex flex-col text-white shadow-md sticky top-0 z-50"
          >
            {/* Cabecera superior */}
            <div className="flex justify-between items-center p-4">
              <span className="font-black tracking-tighter text-xl uppercase italic">Agua Las Palmas</span>
              <button
                onClick={handleLogout}
                className="text-[10px] font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors uppercase tracking-widest border border-white/20"
              >
                Salir
              </button>
            </div>

            {/* 2. SELECTOR DE PESTAÑAS (TABS) */}
            <div className="flex border-t border-white/10">
              <button
                onClick={() => setCurrentView('form')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'form' ? 'bg-white/10 border-b-4 border-white' : 'opacity-60'
                  }`}
              >
                Nuevo Registro
              </button>
              <button
                onClick={() => setCurrentView('history')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${currentView === 'history' ? 'bg-white/10 border-b-4 border-white' : 'opacity-60'
                  }`}
              >
                Mis Ventas
              </button>
            </div>
          </nav>

          {/* 3. CONTENEDOR DINÁMICO SEGÚN LA VISTA */}
          <main className="p-4 md:pt-8 max-w-md mx-auto">
            {currentView === 'form' ? (
              <CustomerForm />
            ) : (
              <SalesHistory />
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default App;