"use-client";

type Props = {
  label: string;
  className?: string;
  variant?: "default" | "outline";
  onClick?: () => void;
};

export default function ActionBtn({
  label,
  className,
  variant = "outline",
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg ${variant === "outline" ? "text-primary border-primary" : "bg-primary text-white"} border text-lg font-semibold ${className}`}
    >
      <p>{label}</p>
    </button>
  );
}
