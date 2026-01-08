import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../components/Input';
import { ProductCounter } from '../components/ProductCounter';
import api from '../api/axios'; // Importa tu instancia de axios configurada

export const CustomerForm = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            nombre: '',
            telefono: '',
            direccion: '',
            proxima_visita: '5',
            items: {} // Aquí guardaremos las cantidades dinámicas { id_producto: cantidad }
        }
    });

    // 1. Cargar productos desde la BD al iniciar el componente
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProductos(data);

                // Inicializar los valores de los productos en 0 en el formulario
                const initialItems = {};
                data.forEach(p => {
                    initialItems[p.id] = 0;
                });
                reset(prev => ({ ...prev, items: initialItems }));
                setLoading(false);
            } catch (error) {
                console.error("Error cargando productos:", error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, [reset]);

    const onSubmit = async (data) => {
        console.log("Datos para guardar en la BD:", data);
        // Aquí llamarás a tu endpoint de ventas/clientes
    };

    if (loading) return <div className="text-center p-10 font-bold">Cargando inventario...</div>;

    return (
        <div className="max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden my-4 border-t-8 border-[#013ea8]">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2 text-center uppercase tracking-wider">Nuevo Registro</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* BLOQUE A: DATOS CLIENTE */}
                    <Input label="Nombre / Razón Social" name="nombre" register={register} errors={errors} placeholder="Ej: Tienda de Doña María" required />
                    <Input label="Teléfono" name="telefono" register={register} errors={errors} placeholder="312..." required />

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Dirección y Referencia</label>
                        <textarea
                            {...register("direccion", { required: "La dirección es obligatoria" })}
                            className={`w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#013ea8] outline-none ${errors.direccion ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Barrio Central, frente al parque..."
                            rows="2"
                        />
                        {errors.direccion && <p className="text-red-500 text-xs italic">{errors.direccion.message}</p>}
                    </div>

                    {/* BLOQUE B: PRODUCTOS DINÁMICOS DESDE LA BD */}
                    <h3 className="text-sm font-black text-gray-500 mb-3 uppercase italic">Productos Entregados</h3>
                    <div className="space-y-2">
                        {productos.map((prod) => (
                            <Controller
                                key={prod.id}
                                name={`items.${prod.id}`}
                                control={control}
                                render={({ field }) => (
                                    <ProductCounter
                                        label={prod.nombre}
                                        value={field.value || 0}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        ))}
                    </div>

                    {/* BLOQUE C: PRÓXIMA VISITA */}
                    <div className="mt-6 mb-8">
                        <label className="block text-gray-700 text-sm font-bold mb-3">Sugerir próxima visita en:</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['3', '5', '8'].map(dias => (
                                <label key={dias} className="flex flex-col items-center p-2 border rounded-xl cursor-pointer hover:bg-blue-50 transition-colors has-[:checked]:bg-[#013ea8] has-[:checked]:text-white">
                                    <input type="radio" {...register("proxima_visita")} value={dias} className="hidden" />
                                    <span className="text-lg font-bold">{dias}</span>
                                    <span className="text-[10px] uppercase">Días</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-[#013ea8] text-white font-black rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all text-lg"
                    >
                        GUARDAR Y FINALIZAR
                    </button>
                </form>
            </div>
        </div>
    );
};