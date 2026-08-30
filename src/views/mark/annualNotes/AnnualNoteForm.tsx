import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Table } from 'reactstrap'
import SimpleInput from '@/@core/components/ui/simple-input'
import Button from '@/@core/components/button'
import { toast } from 'react-toastify'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import type { AnnualNoteType } from './AnnualNote.type'
import { TOAST_OPTIONS } from '@/utils/constants'

interface AnnualNoteFormProps extends BaseFormProps {
  annualNotes: AnnualNoteType[]
  classId: number
  subjectId: number
  schoolId: number
}

interface FormValues {
  items: AnnualNoteType[]
}

const AnnualNoteForm: React.FC<AnnualNoteFormProps> = ({
  annualNotes,
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
      items: annualNotes,
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
          note3: Number(item.note3),
          note4: Number(item.note4),
          note5: Number(item.note5),
          note6: Number(item.note6),
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
        schoolId: Number(props.schoolId),
        subjectId: Number(props.subjectId),
        //schoolId: enterpriseId,
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Evaluation enregistrée`, { ...TOAST_OPTIONS })
        document.getElementById('displayStudentName')!.innerText = ''
        messageService.sendMessage('annualNote', true)
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

  const itemValid = (item: AnnualNoteType) => {
    const { note1, note2, note3, note4, note5, note6 } = item
    return (
      note1 !== null &&
      note2 !== null &&
      note3 !== null &&
      note4 !== null &&
      note5 !== null &&
      note6 !== null
    )
  }

  const focusNextField = (e: any, index: number, i: number) => {
    if (e.which === 13) {
      const input = document.getElementById(`items.${index + 1}.note${i}`)
      input?.focus()
    }
  }

  const displayName = (index: number) => {
    document.getElementById('displayStudentName')!.innerText =
      annualNotes[index].studentFullName
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Table className="table table-bordered table-condensed table-hover responsive tableur tableFixHead">
        <thead>
          <tr>
            <th style={{ width: '10px' }}>#</th>
            <th>{t('label-registrationNumber')}</th>
            <th style={{ width: '40%' }}>{t('label-names')}</th>
            <th>{t('label-notes')} 1</th>
            <th>{t('label-notes')} 2</th>
            <th>{t('label-notes')} 3</th>
            <th>{t('label-notes')} 4</th>
            <th>{t('label-notes')} 5</th>
            <th>{t('label-notes')} 6</th>
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
                  onKeyUp={(e) => focusNextField(e, index, 1)}
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
                  onKeyUp={(e) => focusNextField(e, index, 2)}
                  onFocus={() => displayName(index)}
                  onKeyPress={(e) => {
                    e.key === 'Enter' && e.preventDefault()
                  }}
                  invalid={errors.items?.[index]?.note2?.type && true}
                />
              </td>

              <td>
                <SimpleInput
                  //type="number"
                  {...register(`items.${index}.note3`, {
                    required: true,
                    pattern:
                      /^(?:[0-9]|0[1-9]|1[0-9]|[0-9]+.+[0-9]{1,2}|0[1-9]+.+[0-9]{1,2}|1[0-9]+.+[0-9]{1,2}|20|-1)$/,
                  })}
                  onKeyUp={(e) => focusNextField(e, index, 3)}
                  onFocus={() => displayName(index)}
                  onKeyPress={(e) => {
                    e.key === 'Enter' && e.preventDefault()
                  }}
                  invalid={errors.items?.[index]?.note3?.type && true}
                />
              </td>

              <td>
                <SimpleInput
                  //type="number"
                  {...register(`items.${index}.note4`, {
                    required: true,
                    pattern:
                      /^(?:[0-9]|0[1-9]|1[0-9]|[0-9]+.+[0-9]{1,2}|0[1-9]+.+[0-9]{1,2}|1[0-9]+.+[0-9]{1,2}|20|-1)$/,
                  })}
                  onKeyUp={(e) => focusNextField(e, index, 4)}
                  onFocus={() => displayName(index)}
                  onKeyPress={(e) => {
                    e.key === 'Enter' && e.preventDefault()
                  }}
                  invalid={errors.items?.[index]?.note4?.type && true}
                />
              </td>

              <td>
                <SimpleInput
                  //type="number"
                  {...register(`items.${index}.note5`, {
                    required: true,
                    pattern:
                      /^(?:[0-9]|0[1-9]|1[0-9]|[0-9]+.+[0-9]{1,2}|0[1-9]+.+[0-9]{1,2}|1[0-9]+.+[0-9]{1,2}|20|-1)$/,
                  })}
                  onKeyUp={(e) => focusNextField(e, index, 5)}
                  onFocus={() => displayName(index)}
                  onKeyPress={(e) => {
                    e.key === 'Enter' && e.preventDefault()
                  }}
                  invalid={errors.items?.[index]?.note5?.type && true}
                />
              </td>

              <td>
                <SimpleInput
                  //type="number"
                  {...register(`items.${index}.note6`, {
                    required: true,
                    pattern:
                      /^(?:[0-9]|0[1-9]|1[0-9]|[0-9]+.+[0-9]{1,2}|0[1-9]+.+[0-9]{1,2}|1[0-9]+.+[0-9]{1,2}|20|-1)$/,
                  })}
                  onKeyUp={(e) => focusNextField(e, index, 6)}
                  onFocus={() => displayName(index)}
                  onKeyPress={(e) => {
                    e.key === 'Enter' && e.preventDefault()
                  }}
                  invalid={errors.items?.[index]?.note6?.type && true}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="flex justify-end mt-2 mb-2">
        <Button loading={props.loading} color="primary" className="round">
          {t('label-save')}
        </Button>
      </div>
    </Form>
  )
}

export default AnnualNoteForm
