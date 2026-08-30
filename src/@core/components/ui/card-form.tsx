import cs from "classnames";

interface CardFormProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
}

export default function CardForm({
  title,
  children,
  className,
  titleClassName,
  bodyClassName,
}: CardFormProps) {
  return (
    <div
      className={cs(
        "bg-white dark:!bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-2",
        className,
      )}
    >
      {title && (
        <h3
          className={cs(
            "text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2",
            titleClassName,
          )}
        >
          <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
          {title}
        </h3>
      )}
      <div className={cs("flex flex-col gap-1", bodyClassName)}>{children}</div>
    </div>
  );
}
