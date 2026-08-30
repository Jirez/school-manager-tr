interface Props {
  children: React.ReactNode;
}

export default function StickyActions({ children }: Props) {
  return (
    <div
      className="
        sticky bottom-0
        bg-white dark:!bg-gray-800
        border-t border-gray-100 dark:border-gray-700
        -mx-6 !-mb-6 px-1 py-1 pt-0
        mt-6
        rounded-b-xl
      "
    >
      {children}
    </div>
  );
}
