import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useModal } from '@ebay/nice-modal-react'
import { Badge, Card } from 'reactstrap'
import dayjs from 'dayjs'
import type { ColumnDef } from '@tanstack/react-table'

import { concat, showDisplayedRowCount, toCurrency } from '@/utils/helpers'
import TextWithAvatar from '@/@core/components/ui/text-with-avatar'
import { Edit, Printer } from 'react-feather'
import CommonTable from '@/@core/components/react-table/common-react-table'
import type { StudentInvoiceType } from './StudentInvoice.type'
import StudentInvoiceReportModal from './StudentInvoiceReportModal'
import MyDropdown, {
  DeleteMenuItem,
  MyDivider,
  MyMenuItem,
} from '@/@core/components/dropdown'
import Button from '@/@core/components/button'
import StudentInvoiceDelete from './StudentInvoiceDelete'
import StudentInvoicesDelete from './StudentInvoicesDelete'

const StudentInvoiceTable: FC<CommonTableProps> = (props) => {
  const [checkedRows, setCheckedRows] = useState<any[]>([])
  const { t } = useTranslation()
  const receiptModal = useModal(StudentInvoiceReportModal)
  const receiptsModal = useModal('MultipleStudentPaymentReceipt')

  const columns = useMemo<ColumnDef<StudentInvoiceType>[]>(
    () => [
      {
        accessorFn: (row) => `${row.student.lastName} ${row.student.firstName}`,
        id: 'studentName',
        header: () => t('label-names'),
        cell: ({ row: { original } }) => {
          const student = original?.student || ({} as any)
          const name = concat(student.lastName, student.firstName)
          const registrationNumber = student.registrationNumber

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
        accessorFn: (row) => row.student.gender,
        id: 'gender',
        header: () => t('label-gender'),
        cell: (info) => (info.getValue() as string)?.charAt(0),
      },
      {
        accessorFn: (row) => row.student.birthDate,
        id: 'birthDate',
        header: () => t('label-birthDate'),
        cell: (info) => dayjs(info.getValue() as string).format('DD MMM YYYY'),
      },
      {
        accessorFn: (row) => row.student.birthplace,
        id: 'birthplace',
        header: () => t('label-birthplace'),
      },
      {
        accessorFn: (row) => row.frequent.clazz.name,
        id: 'clazz',
        header: () => t('label-class'),
      },
      {
        accessorKey: 'reference',
        header: () => t('label-reference'),
      },
      {
        accessorKey: 'totalAmount',
        header: () => t('label-amountToPay'),
        cell: (info) => toCurrency(Number(info.getValue())),
      },
      {
        accessorKey: 'operationDate',
        header: () => t('label-operationDate'),
        cell: (info) => dayjs(info.getValue() as string).format('DD MMM YYYY'),
      },
      {
        id: 'status',
        header: () => t('label-status'),
        cell: ({ row: { original } }) =>
          original.amountPaid !== null ? (
            <Badge color="success" className="badge-glow !text-xs" pill>
              {t('label-paid')}
            </Badge>
          ) : (
            <Badge color="danger" className="badge-glow" pill>
              {t('label-unpaid')}
            </Badge>
          ),
      },
      /* {
            accessorKey: 'id',
            header: 'Id',
        }, */
      {
        id: 'actions',
        header: () => t('label-actions'),
        cell: ({ row: { original } }) => (
          <span className="flex flex-row items-center">
            <MyDropdown
              label={t('label-print')}
              onClick={() => receiptModal.show({ id: original?.id })}
            >
              <MyMenuItem
                label={t('label-update')}
                onClick={() =>
                  props.modal.show({
                    studentInvoice: original,
                    update: true,
                    refetch: props.refetch,
                  })
                }
                icon={<Edit size={15} />}
              />
              <MyMenuItem
                label={t('label-print')}
                onClick={() => receiptModal.show({ id: original?.id })}
                icon={<Printer size={18} />}
              />
              {original.amountPaid === null && (
                <DeleteMenuItem>
                  <MyDivider />
                  <StudentInvoiceDelete
                    refetch={props.refetch}
                    id={original?.id}
                    classic={false}
                  />
                </DeleteMenuItem>
              )}
            </MyDropdown>
          </span>
        ),
      },
    ],
    [t, props.modal],
  )

  return (
    <>
      {checkedRows.length > 0 && (
        <div className="mb-1">
          <StudentInvoicesDelete
            ids={checkedRows.map(({ original }) => original.id)}
            count={checkedRows.length}
          />

          {checkedRows.length === 1 && (
            <span>
              <Button
                onClick={() =>
                  receiptModal.show({ id: checkedRows[0].original.id })
                }
                color="primary"
                size="sm"
                className="round ml-1"
              >
                {t('label-studentInvoiceReceipt')}
              </Button>

              <Button
                onClick={() =>
                  receiptModal.show({
                    id: checkedRows[0].original.id,
                    duplicated: true,
                  })
                }
                color="primary"
                size="sm"
                className="round ml-1"
              >
                {t('label-duplicatedStudentInvoiceReceipt')}
              </Button>
            </span>
          )}
          {/* {checkedRows.length > 1 && (
            <span>
              <Button
                onClick={() =>
                  receiptsModal.show({
                    id: buildOptions(
                      checkedRows.map(({ original }) => original)
                    ),
                  })
                }
                color="primary"
                size="sm"
                className="round ml-1"
              >
                {t("label-studentInvoiceReceipts")}
              </Button>
            </span>
          )} */}
        </div>
      )}
      <Card className="text-[0.80rem]">
        <CommonTable
          data={props.dataSource!}
          columns={columns}
          onModelUpdate={(rows) => showDisplayedRowCount(rows)}
          showQuickFilter={false}
          onGlobalFilterChanged={props.onGlobalFilterChanged}
          onRowSelected={(row) => setCheckedRows(row)}
          modal={props.modal}
        />
      </Card>
    </>
  )
}

export default StudentInvoiceTable
