import Button from '@/@core/components/button'
import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Table } from 'reactstrap'
import type { QuarterlyObservationType } from '../sequentialNotes/SequentialNote.type'
import SimpleInput from '@/@core/components/ui/simple-input'
import { concat, round } from '@/utils/helpers'
import { toast } from 'react-toastify'
import { messageService } from '@/utils/message.service'
import { TOAST_OPTIONS } from '@/utils/constants'

interface QuarterlyReportObservationFormProps extends BaseFormProps {
  classId: number
  periodId: number
  quarterlyObservations: QuarterlyObservationType[]
}

interface FormValues {
  items: QuarterlyObservationType[]
}

const QuarterlyObservationForm: React.FC<
  QuarterlyReportObservationFormProps
> = ({ quarterlyObservations, action, ...props }) => {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      items: quarterlyObservations,
    },
  })

  const { fields } = useFieldArray({ control, name: 'items' })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const items = values.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => {
        return {
          quarterlyReportPK: {
            studentId: Number(item.quarterlyReportPK.studentId),
            periodId: Number(item.quarterlyReportPK.periodId),
          },
          observation: item.observation,
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    action({
      variables: {
        observations: items,
        classId: Number(props.classId),
        periodId: Number(props.periodId),
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Observations trimestrielles enregistrée`, {
          ...TOAST_OPTIONS,
        })
        document.getElementById('displayStudentName')!.innerText = ''
        messageService.sendMessage('quarterlyReportObservation', true)
        //history.push('/sequential-notes');
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer les observations trimestrielles : ${error.message}`,
        )
      })
  }

  const itemValid = (item: any) => {
    const { observation } = item
    return observation
  }

  const focusNextField = (e: any, index: number) => {
    if (e.which === 13) {
      const input = document.getElementById(`items.${index + 1}.observation`)
      input?.focus()
    }
  }

  const displayName = (index: number) => {
    document.getElementById('displayStudentName')!.innerText =
      quarterlyObservations[index].student.firstName
        ? quarterlyObservations[index].student.lastName +
          ' ' +
          quarterlyObservations[index].student.firstName
        : quarterlyObservations[index].student.lastName
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="tableFixHead">
        <Table
          className="table table-bordered table-condensed table-hover responsive tableur "
          style={{ zIndex: 10 }}
        >
          <thead>
            <tr>
              <th style={{ width: '10px' }}>#</th>
              <th>{t('label-registrationNumber')}</th>
              <th style={{ width: '25%' }}>{t('label-names')}</th>
              <th style={{ width: '10px' }}>{t('label-average')}</th>
              <th style={{ width: '10px' }}>{t('label-ranking')}</th>
              <th>{t('label-observation')}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.quarterlyReportPK.studentId`)}
                    readOnly={true}
                  />
                </td>
                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.quarterlyReportPK.periodId`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.student.registrationNumber`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.studentFullName`)}
                    readOnly={true}
                    defaultValue={concat(
                      field.student.lastName,
                      field.student.firstName,
                    )}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.average`)}
                    readOnly={true}
                    defaultValue={round(field.quarterlyReport?.average)}
                  />
                </td>
                <td>
                  <SimpleInput
                    {...register(`items.${index}.quarterlyReport.rank`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    //type="number"
                    {...register(`items.${index}.observation`, {
                      required: false,
                    })}
                    onKeyUp={(e) => focusNextField(e, index)}
                    onFocus={() => displayName(index)}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && e.preventDefault()
                    }}
                    invalid={errors.items?.[index]?.observation?.type && true}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="flex justify-end mt-2 mb-2">
        <Button loading={props.loading} color="primary" className="round">
          {t('label-save')}
        </Button>
      </div>
    </Form>
  )
}

export default QuarterlyObservationForm
