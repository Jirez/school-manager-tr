import { useMemo, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'

import { concat } from '@/utils/helpers'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import type { GuardianType } from './Guardian.type'
import CommonTable from '@/@core/components/react-table/common-react-table'

interface Props extends CommonTableProps {
  onRowClicked: (data: any) => void
  onAddButtonClick?: () => void
}

const SimpleGuardianTable: FC<Props> = (props) => {
  const { t } = useTranslation()
  const [currentRows, setCurrentRows] = useState<number>(0)

  const columns = useMemo<ColumnDef<GuardianType>[]>(
    () => [
      {
        accessorFn: (row) => `${row.lastName} ${row.firstName}`,
        id: 'name',
        header: () => t('label-name'),
        cell: ({ row: { original } }) => {
          const name = concat(
            original?.lastName || '',
            original?.firstName || '',
          )
          // const registrationNumber = original.registrationNumber;

          return (
            <TextWithAvatar
              letter={name!.charAt(0)}
              title={name!}
              subtitle={''}
            />
          )
        },
      },
      {
        accessorKey: 'gender',
        header: () => t('label-gender'),
        cell: (info) => (info.getValue() as string).charAt(0),
      },
      {
        accessorKey: 'profession',
        header: () => t('label-profession'),
      },
      /* table.createDataColumn(row => row.language.name, {
            id: 'language',
            header: () => t('label-language'),
        }), */
      {
        accessorFn: (row) => row.address?.town,
        id: 'town',
        header: () => t('label-town'),
      },
      {
        accessorFn: (row) => row.contactInfo?.telephone,
        id: 'telephone',
        header: () => t('label-telephone'),
      },
      {
        accessorFn: (row) => `${row.id}`,
        id: 'guardianId',
        header: 'Id',
      },
    ],
    [],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => {
        setCurrentRows(rows.length)
        //showDisplayedRowCount(rows)
      }}
      showQuickFilter={true}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      showCheckbox={false}
      onRowClicked={props.onRowClicked}
      pageSize={10}
      showAddButton={currentRows === 0}
      onAddButtonClick={props.onAddButtonClick}
    />
  )
}

export default SimpleGuardianTable
