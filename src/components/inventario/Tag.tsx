type TagProps = {
    children: React.ReactNode;
    variant?: "default" | "warning";
};

/* Define as tags usadas para mostrar a informação do material, e as suas variações */
export default function Tag({ children, variant = "default" }: TagProps) {
    const base =
        "inline-flex items-center rounded-full border px-2.5 py-1 ";

    const variants = {
        // tag default
        default: "border-gray-200 bg-gray-50 text-gray-700 text-xs font-semibold",

        // tag warning de stock baixo
        warning: "border-yellow-300 bg-yellow-200 text-yellow-900 rounded-full text-xs font-bold",
    };

    return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}
