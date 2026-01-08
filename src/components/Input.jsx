export const Input = ({ label, name, type = "text", register, errors, ...props }) => (
    <div className="mb-4 text-left">
        <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
        <input
            type={type}
            {...register(name, { required: props.required ? `${label} es obligatorio` : false })}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors[name] ? 'border-red-500' : ''
                }`}
            {...props}
        />
        {errors[name] && <p className="text-red-500 text-xs italic">{errors[name].message}</p>}
    </div>
);