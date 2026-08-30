import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import dayjs from 'dayjs'

import { useAuthentication } from '@/hooks/useAuthentication'
import Input from '@/@core/components/ui/forms/input'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { setOffcanvasSize, toCurrency } from '@/utils/helpers'
import type { StudentInvoiceType } from './StudentInvoice.type'
import { studentInvoiceValidationSchema } from './studentInvoice.validation'

interface StudentPaymentFormProps extends BaseFormProps {
  studentInvoice: StudentInvoiceType
  modal?: NiceModalHandler
}

const StudentInvoiceUpdateForm: FC<StudentPaymentFormProps> = ({
  studentInvoice,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [total, _] = useState(studentInvoice.totalAmount)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<StudentInvoiceType>({
    defaultValues: {
      items: [],
      student: studentInvoice.studentName,
      studentId: studentInvoice.studentId,
      //classId: studentInvoice.classId,
      operationDate: dayjs(studentInvoice.operationDate).toDate(),
      //note: '',
      reference: studentInvoice.reference,
      registrationNumber: studentInvoice.registrationNumber,
    },
    resolver: yupResolver(studentInvoiceValidationSchema),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      /* const items = values.items
        .filter((item: any) => itemValid(item))
        .map((item: any) => ({
          amount: Number(item.amount),
          studentInvoiceItemPK: {
            paymentSliceId: Number(item.paymentSliceId),
            schoolFeeId: Number(item.schoolFeeId),
          },
        }));

      if (items.length === 0) {
        toast.error("Veuillez spécifier les rubriques à enregistrer");
        return;
      } */

      action({
        variables: {
          invoice: {
            id: studentInvoice.id,
            studentId: Number(values.studentId),
            schoolId: enterpriseId,
            reference: values.reference !== '' ? values.reference : null,
            registrationNumber: '',
            studentName: '',
            //note: values.note,
            operationDate: dayjs(values.operationDate).format(
              INPUT_DATE_FORMAT,
            ),
            //studentInvoiceItemCollection: items.length !== 0 ? items : null,
          },
        },
      })
        .then(async ({ data }) => {
          props.refetch?.()
          setValue('items', [])
          toast.success(`Facture enregistrée`, { ...TOAST_OPTIONS })

          //if (close) {
          modal?.hide()
          //}
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer la facture: ${formatError(error)}`,
          )
        })
    })(event)
  }

  /* const itemValid = (item: any) => {
    const { paymentSliceId, schoolFeeId, amount, requiredAmount } = item;
    return (
      paymentSliceId &&
      schoolFeeId &&
      parseFloat(amount) &&
      parseFloat(requiredAmount) >= parseFloat(amount)
    );
  }; */

  useEffect(() => {
    setOffcanvasSize('100%')
  }, [])

  return (
    <Form onSubmit={onSubmit}>
      <div className="flex flex-col md:flex-row w-full gap-x-6">
        <div className="w-full md:w-3/12 md:order-4">
          <label />
          <span className="font-medium text-3xl flex justify-end">
            {toCurrency(total)} FCFA
          </span>
        </div>

        <div className="w-full md:w-3/12">
          <Input
            name="registrationNumber"
            label={t('label-registrationNumber')}
            control={control}
            placeholder={"Matricule de l'élève"}
            readOnly
          />
        </div>

        <div className="w-full md:w-3/12">
          <Input
            name="studentId"
            label={t('label-note')}
            control={control}
            className="hidden"
          />

          <Input
            name="student"
            label={t('label-student')}
            control={control}
            readOnly
            required
            placeholder={t('label-selectStudent')}
          />
        </div>

        <div className="w-full md:w-3/12"></div>

        {/* <div className="w-full md:w-3/12">

                </div>

                <div className="w-full md:w-3/12">

                </div> */}
      </div>

      <div className="flex flex-col md:flex-row w-full gap-x-6">
        <div className="w-full md:w-3/12">
          <DatePicker
            name="operationDate"
            label={t('label-operationDate')}
            control={control}
            required
          />
        </div>

        <div className="w-full md:w-3/12">
          <Input
            name="reference"
            label={t('label-reference')}
            control={control}
          />
        </div>

        <div className="w-full md:w-3/12"></div>

        <div className="w-full md:w-3/12"></div>

        {/* <div className="w-full md:w-3/12">
                    <Input
                        name="note"
                        label={t('label-note')}
                        control={control}
                    />
                </div> */}
      </div>

      {/*Buttons*/}
      <ActionButtons
        cancelAction={modal?.hide}
        isSubmitting={props.loading}
        popover={props.popover}
        dirty={isDirty}
        onSubmit={onSubmit}
        fixed={true}
      />
    </Form>
  )
}

export default StudentInvoiceUpdateForm
