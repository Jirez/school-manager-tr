interface ComboboxItemProps {
  name: string
  description?: string | any
  colRight?: string
  colLeft?: string
}

const ComboboxItem = ({
  name,
  description,
  // colLeft = "col-8",
  // colRight = "col-8",
}: ComboboxItemProps) => (
  <div className="flex flex-row items-center gap-3 w-full">
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-gray-9000 dark:text-gray-100 truncate">
        {name}
      </div>
    </div>
    {description && (
      <div className="d-none d-md-block flex-shrink-0 w-1/3 min-w-0">
        <div className="text-xs text-gray-5000 dark:text-gray-400 truncate">
          {description}
        </div>
      </div>
    )}
  </div>
)

export default ComboboxItem
