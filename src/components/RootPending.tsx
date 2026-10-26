export default function RootPending() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        </div>

        {/* Label */}
        <p className="text-sm font-medium tracking-wide text-gray-500 dark:text-gray-400">
          Loading…
        </p>
      </div>
    </div>
  )
}
