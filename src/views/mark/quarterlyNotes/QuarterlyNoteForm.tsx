import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Table } from 'reactstrap'
import type { QuarterlyNoteType } from './QuarterlyNote.type'
import SimpleInput from '@/@core/components/ui/simple-input'
import Button from '@/@core/components/button'
import { toast } from 'react-toastify'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'

interface QuarterlyNoteFormProps extends BaseFormProps {
  quarterlyNotes: QuarterlyNoteType[]
  classId: number
  subjectId: number
  periodId: number
}

interface FormValues {
  items: QuarterlyNoteType[]
}

const QuarterlyNoteForm: React.FC<QuarterlyNoteFormProps> = ({
  quarterlyNotes,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      items: quarterlyNotes,
    },
    mode: 'all',
  })

  const { fields } = useFieldArray({ control, name: 'items' })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    //formatting items
    const items = values.items
      .filter((item) => itemValid(item))
      .map((item) => {
        return {
          note1: Number(item.note1),
          note2: Number(item.note2),
          studentFullName: item.studentFullName,
          studentId: Number(item.student.id),
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    action({
      variables: {
        notes: items,
        classId: Number(props.classId),
        periodId: Number(props.periodId),
        subjectId: Number(props.subjectId),
        schoolId: enterpriseId,
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Evaluation enregistrée`, { ...TOAST_OPTIONS })
        document.getElementById('displayStudentName')!.innerText = ''
        messageService.sendMessage('quarterlyNote', true)
        //history.push('/sequential-notes');
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer les notes de l'évaluation : ${formatError(
            error,
          )}`,
        )
      })
  }

  const itemValid = (item: QuarterlyNoteType) => {
    const { note1, note2 } = item
    return note1 !== null && note2 !== null
  }

  const focusNextField1 = (e: any, index: number) => {
    if (e.which === 13) {
      const input = document.getElementById(`items.${index + 1}.note1`)
      input?.focus()
    }
  }

  const focusNextField2 = (e: any, index: number) => {
    if (e.which === 13) {
      const input = document.getElementById(`items.${index + 1}.note2`)
      input?.focus()
    }
  }

  const displayName = (index: number) => {
    document.getElementById('displayStudentName')!.innerText =
      quarterlyNotes[index].studentFullName
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="tableFixHead">
        <Table className="table table-bordered table-condensed table-hover responsive tableur">
          <thead>
            <tr>
              <th style={{ width: '10px' }}>#</th>
              <th>{t('label-registrationNumber')}</th>
              <th style={{ width: '40%' }}>{t('label-names')}</th>
              <th>{t('label-notes')} 1</th>
              <th>{t('label-notes')} 2</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td>
                  <SimpleInput
                    {...register(`items.${index}.student.registrationNumber`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.student.id`)}
                    readOnly={true}
                    className="d-none"
                  />

                  <SimpleInput
                    {...register(`items.${index}.studentFullName`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    //type="number"
                    {...register(`items.${index}.note1`, {
                      required: true,
                      pattern:
                        /^(?:[0-9]|0[1-9]|1[0-9]|[0-9]+.+[0-9]{1,2}|0[1-9]+.+[0-9]{1,2}|1[0-9]+.+[0-9]{1,2}|20|-1)$/,
                    })}
                    onKeyUp={(e) => focusNextField1(e, index)}
                    onFocus={() => displayName(index)}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && e.preventDefault()
                    }}
                    invalid={errors.items?.[index]?.note1?.type && true}
                  />
                </td>
                <td>
                  <SimpleInput
                    //type="number"
                    {...register(`items.${index}.note2`, {
                      required: true,
                      pattern:
                        /^(?:[0-9]|0[1-9]|1[0-9]|[0-9]+.+[0-9]{1,2}|0[1-9]+.+[0-9]{1,2}|1[0-9]+.+[0-9]{1,2}|20|-1)$/,
                    })}
                    onKeyUp={(e) => focusNextField2(e, index)}
                    onFocus={() => displayName(index)}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && e.preventDefault()
                    }}
                    invalid={errors.items?.[index]?.note2?.type && true}
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

export default QuarterlyNoteForm
