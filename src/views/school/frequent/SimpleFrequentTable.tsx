import type { FC } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import type { ColumnDef } from '@tanstack/react-table'

import { showDisplayedRowCount } from '@/utils/helpers'
import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import type { TFrequent } from './FrequentTable'
import CommonTable from '@/@core/components/react-table/common-react-table'

interface Props extends CommonTableProps {
  onRowClicked: (data: any) => void
}

const SimpleFrequentTable: FC<Props> = (props) => {
  const { t } = useTranslation()

  const columns = useMemo<ColumnDef<TFrequent>[]>(
    () => [
      {
        accessorFn: (row) => row.registrationNumber,
        id: 'registrationNumber',
        header: () => t('label-registrationNumber'),
      },
      {
        accessorFn: (row) => `${row.fullName}`,
        id: 'studentName',
        header: () => t('label-names'),
        cell: ({ row: { original } }) => {
          const name = original.fullName
          const registrationNumber = original.registrationNumber

          return (
            <TextWithAvatar
              letter={name!.charAt(0)}
              title={name!}
              subtitle={registrationNumber}
            />
          )
        },
      },
      {
        accessorFn: (row) => row.sex,
        id: 'gender',
        header: () => t('label-gender'),
        cell: (info) => (info.getValue() as string)?.charAt(0),
      },
      {
        accessorFn: (row) => row.birthDate,
        id: 'birthDate',
        header: () => t('label-birthDate'),
        cell: (info) => dayjs(info.getValue() as string).format('DD MMM YYYY'),
      },
      {
        accessorFn: (row) => row.birthplace,
        id: 'birthplace',
        header: () => t('label-birthplace'),
      },
      {
        id: 'age',
        header: () => t('label-age'),
        cell: ({ row: { original } }) =>
          dayjs().diff(dayjs(original?.birthDate), 'years'),
      },
      {
        accessorFn: (row) => row.className,
        id: 'clazz',
        header: () => t('label-class'),
      },
      {
        accessorKey: 'repeater',
        header: () => t('label-repeater'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            activeText="label.yes"
            inactiveText="label.no"
          />
        ),
      },
      {
        accessorFn: (row) => row.id,
        id: 'id',
        header: 'Id',
      },
    ],
    [],
  )

  return (
    <CommonTable
      data={props.dataSource!}
      columns={columns}
      onModelUpdate={(rows) => showDisplayedRowCount(rows)}
      showQuickFilter={false}
      onGlobalFilterChanged={props.onGlobalFilterChanged}
      showCheckbox={false}
      onRowClicked={props.onRowClicked}
    />
  )
}

export default SimpleFrequentTable
