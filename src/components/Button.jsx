export const Button = ({ children, type = "button", variant = "primary", ...props }) => {
    const styles = variant === "primary"
        ? "bg-blue-500 hover:bg-blue-700 text-white"
        : "bg-gray-500 hover:bg-gray-700 text-white";

    return (
        <button
            type={type}
            className={`${styles} font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors`}
            {...props}
        >
            {children}
        </button>
    );
};