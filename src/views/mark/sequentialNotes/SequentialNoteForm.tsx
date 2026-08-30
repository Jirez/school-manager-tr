import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { SequentialNoteType } from '@/views/mark/sequentialNotes/SequentialNote.type'
import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { Form, Table } from 'reactstrap'
import SimpleInput from '@/@core/components/ui/simple-input'
import Button from '@/@core/components/button'
import { concat } from '@/utils/helpers'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import { Save } from 'react-feather'

interface FormValues {
  items: SequentialNoteType[]
}

interface SequentialNoteFormProps extends BaseFormProps {
  sequentialNotes: SequentialNoteType[]
  classId: number
  subjectId: number
  subPeriodId: number
}

const SequentialNoteForm: FC<SequentialNoteFormProps> = ({
  sequentialNotes,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      items: sequentialNotes,
    },
    mode: 'all',
  })

  const { fields } = useFieldArray({ control, name: 'items' })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    //formatting items
    const items = values.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => {
        return {
          sequentialNotePK: {
            studentId: Number(item.sequentialNotePK.studentId),
            subjectId: Number(props.subjectId),
            subPeriodId: Number(props.subPeriodId),
          },
          note: Number(item.note),
          studentFullName: item.studentFullName,
          appreciation: item.appreciation,
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
        subPeriodId: Number(props.subPeriodId),
        subjectId: Number(props.subjectId),
        schoolId: enterpriseId,
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Evaluation enregistrée`, { ...TOAST_OPTIONS })
        document.getElementById('displayStudentName')!.innerText = ''
        messageService.sendMessage('sequentialNote', true)
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

  const itemValid = (item: any) => {
    const { note } = item
    return note
  }

  const focusNextField = (e: any, index: number) => {
    if (e.which === 13) {
      const input = document.getElementById(`items.${index + 1}.note`)
      input?.focus()
    }
  }

  const displayName = (index: number) => {
    document.getElementById('displayStudentName')!.innerText = sequentialNotes[
      index
    ].student.firstName
      ? sequentialNotes[index].student.lastName +
        ' ' +
        sequentialNotes[index].student.firstName
      : sequentialNotes[index].student.lastName
  }

  //console.log(errors)

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* Scrollable table container with sticky header */}
      <div className="tableFixHead">
        <Table
          className="table table-bordered table-condensed table-hover responsive tableur"
          style={{ zIndex: 10 }}
        >
          <thead>
            <tr>
              <th style={{ width: '10px' }}>#</th>
              <th>{t('label-registrationNumber')}</th>
              <th style={{ width: '40%' }}>{t('label-names')}</th>
              <th>
                {t('label-notes')}
                <span className="text-xs md:text-sm">
                  {' ('}
                  {
                    watch('items')?.filter((f) => {
                      //i.competenceId === competence.id &&
                      return (
                        f.note !== null &&
                        f.note !== undefined &&
                        ((Number(f.note) >= 0 && Number(f.note) <= 20) ||
                          Number(f.note) === -1)
                      )
                    }).length
                  }
                  {'/' + watch('items')?.length + ')'}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.sequentialNotePK.studentId`)}
                    readOnly={true}
                  />
                </td>

                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.sequentialNotePK.subPeriodId`)}
                    readOnly={true}
                  />
                </td>

                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.sequentialNotePK.subjectId`)}
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
                  {/*<FormItem name={[field.name, "studentFullName"]} initialValue={sequentialNotes[field.key].student.firstName ? sequentialNotes[field.key].student.lastName + ' ' + sequentialNotes[field.key].student.firstName : sequentialNotes[field.key].student.lastName}>
                                <Input readOnly={true}/>
                            </FormItem>*/}
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
                  {/*<FormItem name={[field.name, "note"]} rules={[
                                {required: true, message: "La note est obligatoire"},
                                {
                                    pattern: /^(?:[0-9]|0[1-9]|1[0-9]|[0-9]+.+[0-9]{1,2}|0[1-9]+.+[0-9]{1,2}|1[0-9]+.+[0-9]{1,2}|20|-1)$/,
                                    message: 'Note invalide'
                                },
                            ]}>
                                <Input onKeyUp={(e) => focusNextField(e, field.key)}
                                       onFocus={() => displayName(field.key)}
                                       onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                />
                            </FormItem>*/}
                  <SimpleInput
                    //type="number"
                    {...register(`items.${index}.note`, {
                      required: true,
                      pattern:
                        /^(?:[0-9]|0[1-9]|1[0-9]|[0-9]+.+[0-9]{1,2}|0[1-9]+.+[0-9]{1,2}|1[0-9]+.+[0-9]{1,2}|20|-1)$/,
                    })}
                    onKeyUp={(e) => focusNextField(e, index)}
                    onFocus={() => displayName(index)}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && e.preventDefault()
                    }}
                    invalid={errors.items?.[index]?.note?.type && true}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="flex justify-end mt-2 mb-2">
        <Button
          loading={props.loading}
          color="primary"
          className="round flex items-center gap-0.5 md:!gap-1"
        >
          <Save size={15} />
          {t('label-save')}
        </Button>
      </div>
    </Form>
  )
}

export default SequentialNoteForm
