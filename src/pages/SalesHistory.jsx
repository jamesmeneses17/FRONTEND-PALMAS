import { useEffect, useState } from 'react';
import api from '../api/axios';

export const SalesHistory = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Trae las ventas registradas por el vendedor actual
                const { data } = await api.get('/sales/my-sales');
                setVentas(data);
                setLoading(false);
            } catch (error) {
                console.error("Error cargando historial:", error);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="text-center p-10 font-bold text-[#013ea8]">Cargando tu actividad...</div>;

    return (
        <div className="max-w-md mx-auto my-4 px-4 pb-20">
            <h2 className="text-lg font-black text-gray-800 mb-4 uppercase tracking-tight border-b-2 border-[#013ea8] inline-block">
                Mis Registros Recientes
            </h2>

            {ventas.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-400">
                    No has registrado ventas hoy.
                </div>
            ) : (
                <div className="space-y-4">
                    {ventas.map((v) => (
                        <div key={v.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            {/* Cabecera del Cliente */}
                            <div className="p-4 bg-gray-50 border-b">
                                <h3 className="font-black text-[#013ea8] uppercase text-sm leading-tight">
                                    {v.cliente?.nombre_cliente}
                                </h3>
                                <p className="text-[10px] text-gray-500 font-bold mt-1">
                                    📍 {v.cliente?.direccion}
                                </p>
                            </div>

                            {/* Detalle de Productos */}
                            <div className="p-4 space-y-2">
                                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-400 mb-1">
                                    <span>Producto</span>
                                    <span>Cant.</span>
                                </div>
                                {v.detalles?.map((det, idx) => (
                                    <div key={idx} className="flex justify-between text-xs text-gray-700 border-b border-dotted pb-1">
                                        <span>{det.producto?.nombre_producto}</span>
                                        <span className="font-black text-[#013ea8]">{det.cantidad}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Pie con Info de Visita */}
                            <div className="px-4 py-2 bg-blue-50 flex justify-between items-center">
                                <span className="text-[9px] font-black text-blue-600 uppercase">
                                    Próxima visita: {new Date(v.cliente?.proxima_visita_sugerida).toLocaleDateString()}
                                </span>
                                <a
                                    href={`tel:${v.cliente?.telefono_1}`}
                                    className="bg-white p-1.5 rounded-full shadow-sm text-[#013ea8]"
                                >
                                    📞
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};