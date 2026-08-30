import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Table } from 'reactstrap'
import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import SimpleInput from '@/@core/components/ui/simple-input'
import Button from '@/@core/components/button'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import type { FrequentBulkUpdateType } from './Frequent.type'
import SimpleDatePicker from '@/@core/components/ui/forms/simple-date-picker'
import dayjs from 'dayjs'
import { useAuthentication } from '@/hooks/useAuthentication'
import { Save } from 'react-feather'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface FormValues {
  items: FrequentBulkUpdateType[]
}

interface Props extends BaseFormProps {
  classId: number
  frequents?: FrequentBulkUpdateType[]
}

const FrequentBulkUpdateForm: FC<Props> = ({
  frequents,
  classId,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { control, register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      items: frequents?.map((item) => ({
        studentId: item.studentId,
        lastName: item.lastName,
        firstName: item.firstName,
        birthDate: dayjs(item.birthDate).toDate(),
        birthplace: item.birthplace,
        registrationNumber: item.registrationNumber,
      })),
    },
  })

  const { fields } = useFieldArray({ control, name: 'items' })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    // formatting items
    const items = values.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => {
        return {
          studentId: Number(item.studentId),
          lastName: item.lastName,
          firstName: item.firstName,
          birthDate: dayjs(item.birthDate).format(INPUT_DATE_FORMAT),
          birthplace: item.birthplace,
          registrationNumber: item.registrationNumber,
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    // console.log(items);

    action({
      variables: {
        frequents: items,
        schoolId: Number(enterpriseId),
      },
    })
      .then(async ({ data }) => {
        // form.resetFields();
        toast.success(`Répartition des enseignants enregistrée`, {
          ...TOAST_OPTIONS,
        })
        messageService.sendMessage('classDistribution', true)
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer la répartition : ${formatError(error)}`,
        )
      })
  }

  const itemValid = (item: any) => {
    const { studentId, lastName, registrationNumber, birthDate, birthplace } =
      item
    return (
      studentId && lastName && registrationNumber && birthDate && birthplace
    )
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="tableFixHead">
        <Table className="table table-bordered table-condensed table-hover responsive tableur ">
          <thead>
            <tr>
              <th style={{ width: '10px' }}>#</th>
              <th style={{ width: '10%' }}>{t('label-registrationNumber')}</th>
              <th style={{ width: '25%' }}>{t('label-lastName')}</th>
              <th style={{ width: '20%' }}>{t('label-firstName')}</th>
              <th>{t('label-birthDate')}</th>
              <th>{t('label-birthplace')}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.studentId`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.registrationNumber`)}
                  />
                </td>
                <td>
                  <SimpleInput {...register(`items.${index}.lastName`)} />
                </td>

                <td>
                  <SimpleInput {...register(`items.${index}.firstName`)} />
                </td>

                <td>
                  {/* <SimpleInput {...register(`items.${index}.birthDate`)} /> */}
                  <SimpleDatePicker
                    name={`items.${index}.birthDate`}
                    control={control}
                  />
                </td>

                <td>
                  <SimpleInput {...register(`items.${index}.birthplace`)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <StickyActions>
        <div className="flex justify-end mt-2 mb-2">
          <Button
            type="submit"
            loading={props.loading}
            color="primary"
            className="round text-sm flex gap-0.5 md:!gap-1"
          >
            <Save size={15} />
            {t('label-save')}
          </Button>
        </div>
      </StickyActions>
    </Form>
  )
}

export default FrequentBulkUpdateForm
