import type { ColumnDef } from '@tanstack/react-table'
import { IndeterminateCheckbox } from './indeterminate-checkbox'

const checkboxColumn: ColumnDef<any, any> = {
  id: 'selection',
  header: ({ table }) => (
    <IndeterminateCheckbox
      {...{
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomeRowsSelected(),
        onChange: table.getToggleAllPageRowsSelectedHandler(),
        id: 'selection',
      }}
    />
  ),
  footer: ({ table }) => (
    <IndeterminateCheckbox
      {...{
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomeRowsSelected(),
        onChange: table.getToggleAllPageRowsSelectedHandler(),
        id: 'selection',
      }}
    />
  ),
  cell: ({ row }) => (
    <div className="">
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
          id: row.id,
        }}
      />
    </div>
  ),
  enableHiding: false,
  size: 50,
}

export default checkboxColumn
