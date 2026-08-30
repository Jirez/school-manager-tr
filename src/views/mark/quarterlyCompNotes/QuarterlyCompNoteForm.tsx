import { useFieldArray, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Table } from 'reactstrap'
import SimpleInput from '@/@core/components/ui/simple-input'
import Button from '@/@core/components/button'
import { toast } from 'react-toastify'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import type { QuarterlyCompNoteType } from './quarterly.comp.note.type'
import { useEffect, useState } from 'react'
import CompetenceItems from './CompetenceItem'
import { Save } from 'react-feather'

interface QuarterlyNoteFormProps extends BaseFormProps {
  quarterlyNotes: QuarterlyCompNoteType[]
  classId: number
  subjectId: number
  periodId: number
}

interface FormValues {
  items: QuarterlyCompNoteType[]
}

const QuarterlyCompNoteForm: React.FC<QuarterlyNoteFormProps> = ({
  quarterlyNotes,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [competences, setCompetences] = useState<any[]>([])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
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
      .map((item) => ({
        studentId: item.studentId,
        registrationNumber: item.registrationNumber,
        studentFullName: item.studentFullName,
        items: item.items.map((i) => ({
          competenceId: i.competenceId,
          note: Number(i.note),
          numberOrder: i.numberOrder,
        })),
      }))

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    //console.log(items);

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

  const itemValid = (item: QuarterlyCompNoteType) => {
    const { items } = item
    return items.length > 0
  }

  useEffect(() => {
    if (quarterlyNotes.length > 0) {
      setCompetences(
        quarterlyNotes[0].items.map((item: any) => ({
          id: item.competenceId,
          numberOrder: item.numberOrder,
        })),
      )
    }
  }, [quarterlyNotes])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* Scrollable table container with sticky header */}
      <div className="tableFixHead">
        <Table className="table table-bordered table-condensed table-hover responsive tableur">
          <thead>
            <tr>
              <th style={{ width: '10px' }} className="d-none d-md-block">
                #
              </th>
              <th className="text-xs md:text-sm" style={{ width: '20px' }}>
                {t('label-registrationNumber')}
              </th>
              <th className="text-xs md:text-sm" style={{ width: '35%' }}>
                {t('label-names')}
              </th>
              {competences.map((competence: any) => (
                <th key={competence.id} className="text-xs md:text-sm">
                  <span className="d-none d-md-inline">Compétence </span>
                  <span className="d-inline d-md-none">Comp.</span>
                  <span>{competence.numberOrder}</span>
                  {/* Add the number of valid notes */}
                  <span className="text-xs md:text-sm">
                    {' ('}
                    {
                      watch('items')?.filter(
                        (f) =>
                          f.items.find(
                            (i) =>
                              i.competenceId === competence.id &&
                              i.note !== null &&
                              i.note !== undefined &&
                              ((Number(i.note) >= 0 && Number(i.note) <= 20) ||
                                Number(i.note) === -1),
                          ) !== undefined,
                      ).length
                    }
                    {'/' + watch('items')?.length + ')'}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td
                  style={{ textAlign: 'center' }}
                  className="d-none d-md-block text-sm"
                >
                  {index + 1}
                </td>
                <td>
                  <SimpleInput
                    {...register(`items.${index}.registrationNumber`)}
                    readOnly={true}
                    className="text-xs md:text-sm"
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.studentId`)}
                    readOnly={true}
                    className="d-none"
                  />

                  <SimpleInput
                    {...register(`items.${index}.studentFullName`)}
                    readOnly={true}
                    className="text-xs md:text-sm"
                  />
                </td>

                <CompetenceItems
                  nestIndex={index}
                  control={control}
                  register={register}
                  notes={quarterlyNotes.map((note) => note.studentFullName)}
                  errors={errors}
                />

                <td></td>
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

export default QuarterlyCompNoteForm
