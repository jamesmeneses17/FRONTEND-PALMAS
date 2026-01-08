import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '../components/Input';
import { ProductCounter } from '../components/ProductCounter';
import api from '../api/axios';

export const CustomerForm = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        trigger,
        getValues
    } = useForm({
        mode: 'onChange',
        defaultValues: {
            identificacion: '',
            nombre: '',
            telefono: '',
            telefono_2: '',
            direccion: '',
            proxima_visita: '5',
            items: {}
        }
    });

    /* ===============================
       CARGA DE PRODUCTOS
    =============================== */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProductos(data);

                const initialItems = {};
                data.forEach(p => {
                    initialItems[p.id] = 0;
                });

                reset({
                    identificacion: '',
                    nombre: '',
                    telefono: '',
                    telefono_2: '',
                    direccion: '',
                    proxima_visita: '5',
                    items: initialItems
                });

                setLoading(false);
            } catch (error) {
                console.error('Error cargando productos:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [reset]);

    /* ===============================
       NAVEGACIÓN CON VALIDACIÓN
    =============================== */
    const nextStep = async (e) => {
        if (e) e.preventDefault();

        // PASO 1 → Validar datos obligatorios del cliente y unicidad en BD
        if (step === 1) {
            const valid = await trigger([
                'identificacion',
                'nombre',
                'telefono',
                'direccion'
            ]);

            if (!valid) return;

            // Al permitir ventas recurrentes, ya no bloqueamos si existe el usuario.
            // El backend hará "Upsert" (Actualizar o Crear).
            setStep(2);
            return;
        }

        // PASO 2 → Validar que al menos un producto tenga cantidad
        if (step === 2) {
            const items = getValues('items');
            const hasProducts = Object.values(items || {}).some(v => v > 0);

            if (!hasProducts) {
                alert('⚠️ Debes seleccionar al menos un producto para continuar');
                return;
            }

            setStep(3);
        }
    };

    const prevStep = (e) => {
        if (e) e.preventDefault();
        setStep(step - 1);
    };

    /* ===============================
       SUBMIT FINAL (SOLO PASO 3)
    =============================== */
    const onSubmit = async (formData) => {
        if (step !== 3) return; // Blindaje contra envíos accidentales

        setIsSubmitting(true);
        try {
            const response = await api.post('/sales', formData);

            alert(`✅ ¡Registro Exitoso! Cliente ID: ${response.data.clienteId}`);

            setStep(1);

            const resetItems = {};
            productos.forEach(p => {
                resetItems[p.id] = 0;
            });

            reset({
                identificacion: '',
                nombre: '',
                telefono: '',
                telefono_2: '',
                direccion: '',
                proxima_visita: '5',
                items: resetItems
            });
        } catch (error) {
            console.error('Error al guardar:', error);
            alert(
                '❌ Error: ' +
                (error.response?.data?.message || 'No se pudo completar el registro')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckIdentificacion = async () => {
        const identificacion = getValues('identificacion');
        if (!identificacion || identificacion.length < 5) return;

        try {
            const { data } = await api.get(`/customers/check/${identificacion}`);
            if (data.exists) {
                // UX: Notificación suave en lugar de alerta de error
                const confirmar = window.confirm(`✅ Cliente encontrado: ${data.cliente.nombre}\n\n¿Deseas cargar sus datos y continuar a Productos?`);
                if (confirmar) {
                    const currentValues = getValues();
                    reset({
                        ...currentValues,
                        identificacion: identificacion,
                        nombre: data.cliente.nombre,
                        telefono: data.cliente.telefono,
                        telefono_2: data.cliente.telefono_2 || '',
                        direccion: data.cliente.direccion
                    });

                    // Saltamos al Paso 2 inmediatamente
                    setStep(2);
                }
            }
        } catch (error) {
            console.error("Error al validar identificación:", error);
        }
    };

    const handleCheckTelefono = async () => {
        const telefono = getValues('telefono');
        if (!telefono || telefono.length < 7) return;

        try {
            const { data } = await api.get(`/customers/check-phone/${telefono}`);
            if (data.exists) {
                const confirmar = window.confirm(`✅ Cliente encontrado por teléfono: ${data.cliente.nombre}\n\n¿Deseas cargar sus datos y continuar a Productos?`);
                if (confirmar) {
                    const currentValues = getValues();
                    reset({
                        ...currentValues,
                        identificacion: currentValues.identificacion || data.cliente.identificacion_nit || '',
                        nombre: data.cliente.nombre,
                        telefono: data.cliente.telefono,
                        telefono_2: data.cliente.telefono_2 || '',
                        direccion: data.cliente.direccion
                    });
                    setStep(2);
                }
            }
        } catch (error) {
            console.error("Error al validar teléfono:", error);
        }
    };

    if (loading) {
        return (
            <div className="text-center p-10 font-bold text-[#013ea8]">
                Cargando inventario de Agua Las Palmas...
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden my-4 border-t-8 border-[#013ea8]">
            <div className="p-6">

                {/* INDICADOR DE PASOS VISUAL */}
                <div className="flex justify-between mb-8 text-[10px] font-black uppercase tracking-widest text-gray-300">
                    <span className={step >= 1 ? 'text-[#013ea8]' : ''}>1. Cliente</span>
                    <span className={step >= 2 ? 'text-[#013ea8]' : ''}>2. Productos</span>
                    <span className={step >= 3 ? 'text-[#013ea8]' : ''}>3. Visita</span>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && step < 3 && e.target.tagName !== 'TEXTAREA') {
                            e.preventDefault();
                        }
                    }}
                >
                    {/* PASO 1: DATOS CLIENTE */}
                    {step === 1 && (
                        <div className="animate-in fade-in duration-300">
                            <h3 className="text-sm font-black text-gray-400 mb-4 uppercase">Información del Cliente</h3>
                            <Input
                                label="Identificación / NIT"
                                name="identificacion"
                                register={register}
                                errors={errors}
                                placeholder="Ej: 12345678"
                                required
                                onBlur={handleCheckIdentificacion}
                            />
                            <Input label="Nombre / Razón Social" name="nombre" register={register} errors={errors} placeholder="Ej: Tienda de Doña María" required />
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    label="Teléfono 1"
                                    name="telefono"
                                    register={register}
                                    errors={errors}
                                    placeholder="312..."
                                    required
                                    onBlur={handleCheckTelefono}
                                />
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono 2 <span className="text-gray-400 font-normal">(Opcional)</span></label>
                                    <input
                                        {...register("telefono_2")}
                                        className="shadow-sm appearance-none border rounded-lg w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#013ea8] transition-all border-gray-300"
                                        placeholder="Opcional"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-tighter">Dirección y Referencia</label>
                                <textarea
                                    {...register("direccion", { required: "La dirección es obligatoria" })}
                                    className={`w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#013ea8] outline-none ${errors.direccion ? 'border-red-500' : 'border-gray-200'}`}
                                    placeholder="Barrio Central, frente al parque..."
                                    rows="2"
                                />
                                {errors.direccion && <p className="text-red-500 text-[10px] italic mt-1">{errors.direccion.message}</p>}
                            </div>
                        </div>
                    )}

                    {/* PASO 2: PRODUCTOS */}
                    {step === 2 && (
                        <div className="animate-in fade-in duration-300">
                            <h3 className="text-sm font-black text-gray-400 mb-4 uppercase italic">Productos Entregados</h3>
                            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
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
                        </div>
                    )}

                    {/* PASO 3: VISITA */}
                    {step === 3 && (
                        <div className="animate-in fade-in duration-300">
                            <h3 className="text-sm font-black text-gray-400 mb-6 uppercase text-center">Programar Visita</h3>
                            <div className="grid grid-cols-3 gap-3 mb-8">
                                {['3', '5', '8'].map(dias => (
                                    <label key={dias} className="flex flex-col items-center p-4 border-2 rounded-2xl cursor-pointer transition-all has-[:checked]:border-[#013ea8] has-[:checked]:bg-blue-50">
                                        <input type="radio" {...register("proxima_visita")} value={dias} className="hidden" />
                                        <span className="text-2xl font-black text-gray-700">{dias}</span>
                                        <span className="text-[10px] uppercase font-bold text-gray-400">Días</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* BOTONES DE ACCIÓN */}
                    <div className="flex gap-3 mt-8">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="w-1/3 py-4 bg-gray-100 text-gray-500 font-bold rounded-xl active:scale-95 transition-all uppercase text-[10px]"
                            >
                                Atrás
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="flex-1 py-4 bg-[#013ea8] text-white font-black rounded-xl shadow-lg active:scale-95 transition-all tracking-widest"
                            >
                                SIGUIENTE
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex-1 py-4 text-white font-black rounded-xl shadow-lg transition-all tracking-widest ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#013ea8] active:scale-95'}`}
                            >
                                {isSubmitting ? 'GUARDANDO...' : 'FINALIZAR'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};