import { useState } from 'react';
import { Login } from './pages/Login';
import { CustomerForm } from './pages/CustomerForm';

function App() {
  // Mantenemos tu lógica de token
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token'); // Es más seguro remover solo el token si usas más cosas
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        <Login onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <>
          {/* Barra de navegación con color #11c9f5 */}
          <nav
            style={{ backgroundColor: '#013ea8' }}
            className="flex justify-between items-center p-4 text-white shadow-md sticky top-0 z-50"
          >
            <span className="font-black tracking-tighter text-xl uppercase italic">Agua Las Palmas</span>
            <button
              onClick={handleLogout}
              className="text-xs font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors uppercase tracking-widest"
            >
              Salir
            </button>
          </nav>

          {/* Contenedor del formulario principal */}
          <main className="p-4 md:pt-8">
            <CustomerForm />
          </main>
        </>
      )}
    </div>
  );
}

export default App;