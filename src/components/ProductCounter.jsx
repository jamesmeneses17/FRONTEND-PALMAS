export const ProductCounter = ({ name, label, value, onChange }) => (
    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200 mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <div className="flex items-center gap-4">
            <button
                type="button"
                onClick={() => onChange(Math.max(0, value - 1))}
                className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center">-</button>
            <span className="font-bold text-lg w-4 text-center">{value}</span>
            <button
                type="button"
                onClick={() => onChange(value + 1)}
                className="w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold flex items-center justify-center">+</button>
        </div>
    </div>
);