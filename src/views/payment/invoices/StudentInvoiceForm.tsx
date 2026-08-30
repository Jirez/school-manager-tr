import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Form, Table } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useModal } from '@ebay/nice-modal-react'
import { useTranslation } from 'react-i18next'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import dayjs from 'dayjs'
import { useDebounce, useUpdateEffect } from 'ahooks'

import LiveView from '@/utils/LiveView'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useStudentByClass } from '@/views/school/frequent/useStudentByClass'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { classOptions } from '@/utils/select/selectComponents'
import ClassAdd from '@/views/school/classes/ClassAdd'
import Input from '@/@core/components/ui/forms/input'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import SimpleInput from '@/@core/components/ui/simple-input'
import StudentTableModal from '@/views/school/students/StudentTableModal'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { setOffcanvasSize, toCurrency } from '@/utils/helpers'
import type { StudentInvoiceType } from './StudentInvoice.type'
import { studentInvoiceValidationSchema } from './studentInvoice.validation'
import InputNumber from '@/@core/components/ui/forms/input-number'
import { useFrequentByRegistrationNumber } from '@/views/school/frequent/useFrequentByRegistrationNumber'
import { useUnpaidSchoolFeeWithInvoice } from './useUnpaidSchoolFeeWithInvoice'
import { ClassCreatedDocument, useClassesQuery } from '@/gql/graphql'

interface StudentPaymentFormProps extends BaseFormProps {
  studentInvoice?: StudentInvoiceType
  modal?: NiceModalHandler
}

const StudentInvoiceForm: FC<StudentPaymentFormProps> = ({
  studentInvoice,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [clazz, setClazz] = useState<number | null>(null)
  const [student, setStudent] = useState<number | null>(null)
  const [total, setTotal] = useState(0)
  const tableModal = useModal(StudentTableModal)

  const {
    data: dataClass,
    loading: loadingClass,
    subscribeToMore: subscribeToMoreClass,
  } = useClassesQuery({
    variables: { id: enterpriseId },
  })

  const { students } = useStudentByClass(clazz)

  const { schoolFeeLevels } = useUnpaidSchoolFeeWithInvoice(
    student,
    enterpriseId,
  )

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
    register,
    watch,
  } = useForm<StudentInvoiceType>({
    defaultValues: {
      items: [],
      student: '',
      studentId: '',
      classId: null,
      operationDate: null,
      //note: '',
      reference: '',
      registrationNumber: '',
    },
    resolver: yupResolver(studentInvoiceValidationSchema),
  })

  const { fields, append } = useFieldArray({ control, name: 'items' })

  const studentRegistrationNumber = useDebounce(watch('registrationNumber'), {
    wait: 200,
  })
  const items = watch('items')

  const { frequent } = useFrequentByRegistrationNumber(
    studentRegistrationNumber,
    enterpriseId,
  )

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const items = values.items
        .filter((item: any) => itemValid(item))
        .map((item: any) => ({
          amount: Number(item.amount),
          studentInvoiceItemPK: {
            paymentSliceId: Number(item.paymentSliceId),
            schoolFeeId: Number(item.schoolFeeId),
          },
        }))

      if (items.length === 0) {
        toast.error('Veuillez spécifier les rubriques à enregistrer')
        return
      }

      action({
        variables: {
          invoice: {
            studentId: Number(values.studentId),
            schoolId: enterpriseId,
            reference: values.reference !== '' ? values.reference : null,
            //note: values.note,
            operationDate: dayjs(values.operationDate).format(
              INPUT_DATE_FORMAT,
            ),
            studentInvoiceItemCollection: items.length !== 0 ? items : null,
          },
        },
      })
        .then(async ({ data }) => {
          //form.resetFields();
          setValue('items', [])
          setStudent(null)
          setClazz(null)
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

  const itemValid = (item: any) => {
    const { paymentSliceId, schoolFeeId, amount, requiredAmount } = item
    return (
      paymentSliceId &&
      schoolFeeId &&
      parseFloat(amount) &&
      parseFloat(requiredAmount) >= parseFloat(amount)
    )
  }

  const onSelectionChanged = (selectedRow: any) => {
    setValue('studentId', selectedRow.id)
    setValue(
      'student',
      selectedRow.firstName
        ? selectedRow.lastName + ' ' + selectedRow.firstName
        : selectedRow.lastName,
    )

    setStudent(selectedRow.id)
    tableModal.hide()
  }

  const onStudentClick = () => {
    if (!clazz) {
      toast.error(t('label-selectClass').toString())
      return
    }

    tableModal.show({ students, onRowClicked: onSelectionChanged })
  }

  useUpdateEffect(() => {
    setValue('items', [])
    if (schoolFeeLevels) {
      const defaultValues = schoolFeeLevels.map((item) => ({
        paymentSliceId: item.paymentSlice?.id,
        schoolFeeId: item.schoolFee?.id,
        //@ts-ignore
        paymentSlice: `${item.paymentSlice.name} -- (${item.paymentSlice.deadline})`,
        schoolFee: item.schoolFee?.name,
        requiredAmount: item.requiredAmount,
        amount: null,
      }))

      for (let i = 0; i < defaultValues.length; i++) {
        append(defaultValues[i])
      }
    }
  }, [schoolFeeLevels, append, setValue])

  useEffect(() => {
    setOffcanvasSize('100%')
  }, [])

  useUpdateEffect(() => {
    if (frequent !== null) {
      setStudent(frequent.frequentPK.studentId)
      setValue('student', frequent.fullName)
      setValue('studentId', frequent.frequentPK.studentId)
      setValue('classId', frequent.className)
      setClazz(frequent.frequentPK.classId)
    } else {
      setValue('items', [])
      setValue('classId', null)
      setValue('student', '')
      setValue('studentId', '')
      setClazz(null)
    }
  }, [frequent])

  const computeTotal = () => {
    const amounts = items
      .map((item) => item.amount)
      .filter((value) => value !== null)
      .filter((value) => parseFloat(String(value)))

    if (amounts.length > 0) {
      setTotal(
        amounts.reduce(
          (a, b) => parseFloat(String(a)) + parseFloat(String(b)),
        ) || 0,
      )
    } else {
      setTotal(0)
    }
  }

  const focusNextField = (index: number) => {
    return (e: any) => {
      if (e.which === 13) {
        const input = document.getElementById(`items.${index + 1}.amount`)
        input?.focus()
      }
    }
  }

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
          />
        </div>

        <div className="w-full md:w-3/12">
          <LiveView
            document={ClassCreatedDocument}
            singleVar="clazz"
            data={dataClass}
            listVar="clazzes"
            subscribeToMore={subscribeToMoreClass}
            sortField="name"
            triggerUpdate={true}
            enterpriseId={enterpriseId}
          >
            {({ clazzes }) => (
              <ControlledSelect
                name="classId"
                control={control}
                label={t('label-class')}
                required
                loading={loadingClass}
                onChange={(val) => {
                  setValue('classId', val)
                  if (val) {
                    setClazz(val.id)
                  } else {
                    setClazz(null)
                  }
                }}
                options={clazzes || undefined}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                components={{ Option: classOptions }}
                form={<ClassAdd />}
                formId="clazz"
                optionLabel="name"
                formTitle={t('action.add_class')}
              />
            )}
          </LiveView>
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
            readOnly={false}
            required
            placeholder={t('label-selectStudent')}
            onClick={onStudentClick}
          />
        </div>

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

      <div className="w-full">
        <Table className="table table-bordered table-condensed table-hover responsive tableur">
          <thead>
            <tr>
              <th style={{ width: '10px' }}>#</th>
              <th style={{ width: '25%' }}>{t('label-slice')}</th>
              <th>{t('label-schoolFee')}</th>
              <th>{t('label-requiredAmount')}</th>
              <th>{t('label-amountToPay')}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.paymentSliceId`)}
                    readOnly={true}
                  />
                </td>

                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.schoolFeeId`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.paymentSlice`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.schoolFee`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <InputNumber
                    {...register(`items.${index}.requiredAmount`)}
                    readOnly
                    value={watch(`items.${index}.requiredAmount`)}
                  />
                </td>

                <td>
                  <InputNumber
                    {...register(`items.${index}.amount`)}
                    value={watch(`items.${index}.amount`)}
                    onKeyUp={focusNextField(index)}
                    onChange={(e) => {
                      const val = e.target.value
                      setValue(
                        `items.${index}.amount`,
                        val ? Number(val) : null,
                      )
                      computeTotal()
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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

export default StudentInvoiceForm
