import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { loginRequest } from '../api/auth';

// Importamos el logo desde la carpeta assets
import logoPalmas from '../assets/palmasptoasis.jpg';

export const Login = ({ onLoginSuccess }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMsg, setErrorMsg] = useState('');

    const onSubmit = async (data) => {
        try {
            const res = await loginRequest(data);
            localStorage.setItem('token', res.data.access_token);
            onLoginSuccess();
        } catch (err) {
            setErrorMsg(typeof err === 'string' ? err : 'Credenciales incorrectas');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-xs">
                {/* Cabecera con el nuevo color #11c9f5 */}
                <div
                    style={{ backgroundColor: '#013ea8' }}
                    className="rounded-t-lg p-6 flex flex-col items-center shadow-md"
                >
                    {/* Contenedor del logo ampliado de w-24 a w-28 */}
                    <div className="bg-white w-28 h-28 rounded-full shadow-lg overflow-hidden border-4 border-white mb-2">
                        <img
                            src={logoPalmas}
                            alt="Agua las Palmas Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    /* Borde inferior con el nuevo color #11c9f5 */
                    className="bg-white shadow-xl rounded-b-lg px-8 pt-6 pb-8 mb-4 border-b-2 border-[#013ea8]"
                >
                    <div className="mb-6 text-center">
                        <h2 className="text-gray-600 text-sm font-bold uppercase tracking-widest">Iniciar Sesión</h2>
                    </div>

                    {/* Campo Correo */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="correo">
                            Correo Electrónico
                        </label>
                        <input
                            {...register("correo", { required: "El correo es obligatorio" })}
                            /* focus:ring-2 con color personalizado #11c9f5 */
                            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#013ea8] transition-all ${errors.correo ? 'border-red-500' : 'border-gray-300'}`}
                            id="correo"
                            type="email"
                            placeholder="juan@gmail.com"
                        />
                        {errors.correo && <p className="text-red-500 text-xs italic mt-1">{errors.correo.message}</p>}
                    </div>

                    {/* Campo Contraseña */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            {...register("password", { required: "La contraseña es obligatoria" })}
                            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-[#11c9f5] transition-all ${errors.password || errorMsg ? 'border-red-500' : 'border-gray-300'}`}
                            id="password"
                            type="password"
                            placeholder="******************"
                        />
                        {(errors.password || errorMsg) && (
                            <p className="text-red-500 text-xs italic">
                                {errors.password?.message || errorMsg}
                            </p>
                        )}
                    </div>

                    <div className="pt-2">
                        <button
                            /* Botón con el nuevo color #11c9f5 */
                            style={{ backgroundColor: '#013ea8' }}
                            className="hover:brightness-95 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-all w-full shadow-lg active:scale-95 text-lg"
                            type="submit"
                        >
                            Acceder
                        </button>
                    </div>
                </form>
                <p className="text-center text-gray-500 text-xs font-semibold">
                    &copy; 2026 Agua las Palmas. All rights reserved.
                </p>
            </div>
        </div>
    );
};