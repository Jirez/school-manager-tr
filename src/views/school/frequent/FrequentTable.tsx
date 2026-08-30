import { useMemo, useState } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from '@ebay/nice-modal-react'
import dayjs from 'dayjs'
import { Card } from 'reactstrap'
import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Printer } from 'react-feather'

import ActiveRenderer from '@/@core/components/base-table/active-renderer'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import FrequentDelete from '@/views/school/frequent/FrequentDelete'
import FrequentsDelete from './FrequentsDelete'
import SchoolCertificateModal from './SchoolCertificateModal'
import CommonTable from '@/@core/components/react-table/common-react-table'
import { showDisplayedRowCount } from '@/utils/helpers'
import MyDropdown, {
  DeleteMenuItem,
  MyDivider,
  MyMenuItem,
} from '@/@core/components/dropdown'

export type TFrequent = {
  className: string
  fullName: string
  registrationNumber: string
  sex: string
  birthDate: string
  birthplace: string
  repeater: boolean
  frequentPK: {
    studentId: number
    schoolYearId: number
    classId: number
  }
  id: number
}

const FrequentTable: FC<CommonTableProps> = (props) => {
  const [checkedRows, setCheckedRows] = useState<any[]>([])
  const { t } = useTranslation()
  const certificateModal = useModal(SchoolCertificateModal)

  const columns = useMemo<ColumnDef<TFrequent>[]>(
    () => [
      {
        accessorFn: (row) => `${row.fullName} ${row.registrationNumber}`,
        id: 'studentName',
        header: () => t('label-names'),
        cell: ({ row: { original } }) => {
          const name = original?.fullName
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
        //cell: info => (info.getValue() as string)?.charAt(0)
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
        accessorKey: 'socialCase',
        header: () => t('label-socialCase'),
        cell: (info) => (
          <ActiveRenderer
            active={info.getValue() as boolean}
            activeText="label.yes"
            inactiveText="label.no"
          />
        ),
      },
      {
        accessorFn: (row) => `${row.id}`,
        id: 'id',
        header: 'Id',
      },
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <MyDropdown
            label={t('label-update')}
            onClick={() =>
              props.modal.show({
                frequent: original,
                update: true,
                refetch: props.refetch,
              })
            }
          >
            <MyMenuItem
              label={t('label-update')}
              onClick={() =>
                props.modal.show({
                  frequent: original,
                  update: true,
                  refetch: props.refetch,
                })
              }
              icon={<Edit size={15} />}
            />
            <DeleteMenuItem>
              <MyDivider />
              <FrequentDelete
                refetch={props.refetch}
                id={{
                  studentId: Number(original.frequentPK.studentId),
                  classId: Number(original.frequentPK.classId),
                  schoolYearId: Number(original.frequentPK.schoolYearId),
                }}
                classic={false}
              />
            </DeleteMenuItem>
            <MyDivider />
            <MyMenuItem
              label={t('label-schoolCertificate')}
              onClick={() =>
                certificateModal.show({ id: original?.frequentPK.studentId })
              }
              icon={<Printer size={18} />}
            />
          </MyDropdown>
        ),
      },
    ],
    [t, props.modal],
  )

  /* const onRowSelected = (data: any[]) => {
        setCheckedRows(data)
    } */

  return (
    <>
      {checkedRows.length > 0 && (
        <div className="mb-1">
          <FrequentsDelete
            ids={checkedRows.map(({ original }) => ({
              studentId: Number(original.frequentPK.studentId),
              classId: Number(original.frequentPK.classId),
              schoolYearId: Number(original.frequentPK.schoolYearId),
            }))}
            count={checkedRows.length}
            refetch={props.refetch}
          />
        </div>
      )}

      <Card className="text-[0.80rem]">
        <CommonTable
          data={props.dataSource!}
          columns={columns}
          onModelUpdate={(rows) => showDisplayedRowCount(rows)}
          onGlobalFilterChanged={props.onGlobalFilterChanged}
          modal={props.modal}
          rowSelection={props.rowSelection}
          onRowSelected={(row) => setCheckedRows(row)}
          loading={props.loading}
        />
      </Card>
    </>
  )
}

export default FrequentTable
