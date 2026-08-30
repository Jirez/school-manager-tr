import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import type { CompetenceType } from '@/views/mark/expectedCompetences/Competence.type'
import { Form, Table } from 'reactstrap'
import SimpleInput from '@/@core/components/ui/simple-input'
import Button from '@/@core/components/button'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'

interface FormValues {
  items: CompetenceType[]
}

interface CompetenceFormProps extends BaseFormProps {
  competences: CompetenceType[]
  classId: number
  period: number
}

const CompetenceForm: FC<CompetenceFormProps> = ({
  competences,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { control, handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      items: competences,
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    //formatting items
    const items = values.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => {
        return {
          expectedCompetencePK: {
            classId: Number(item.expectedCompetencePK.classId),
            periodId: Number(item.expectedCompetencePK.periodId),
            subjectId: Number(item.expectedCompetencePK.subjectId),
          },
          competence: item.competence,
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    //console.log(items)

    action({
      variables: {
        competences: items,
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Compétences enregistrées`, { ...TOAST_OPTIONS })
        document.getElementById('displayStudentName')!.innerText = ''
        messageService.sendMessage('expectedCompetence', true)
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer les compétences : ${formatError(error)}`,
        )
      })
  }

  const itemValid = (item: any) => {
    const { competence } = item
    return competence
  }

  const { fields } = useFieldArray({ control, name: 'items' })

  const focusNextField = (e: any, index: number) => {
    if (e.which === 13) {
      document.getElementById(`items.${index + 1}.competence`)?.focus()
    }
  }

  const displayName = (index: number) => {
    document.getElementById('displayStudentName')!.innerText =
      competences[index].subject.name
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Table
        className="table table-bordered table-condensed table-hover responsive tableur tableFixHead"
        style={{ zIndex: 10 }}
      >
        <thead>
          <tr>
            <th style={{ width: '10px' }}>#</th>
            <th>{t('label-subjects')}</th>
            <th>{t('label-expectedCompetences')}</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td className="font-semibold text-center">{index + 1}</td>
              <td style={{ display: 'none' }}>
                <SimpleInput
                  {...register(`items.${index}.expectedCompetencePK.subjectId`)}
                  readOnly={true}
                />
              </td>

              <td style={{ display: 'none' }}>
                <SimpleInput
                  {...register(`items.${index}.expectedCompetencePK.periodId`)}
                  readOnly={true}
                />
              </td>

              <td style={{ display: 'none' }}>
                <SimpleInput
                  {...register(`items.${index}.expectedCompetencePK.classId`)}
                  readOnly={true}
                />
              </td>
              <td>
                <SimpleInput
                  {...register(`items.${index}.subject.name`)}
                  readOnly={true}
                />
              </td>

              <td>
                {/*<FormItem name={[field.name, "competence"]} rules={[
                                {required: false, message: "La compétence est obligatoire"},
                                //{pattern: /^(?:[1-9]|0[1-9]|1[0-9]|20)$/, message: 'Note invalide'},
                                {
                                    min: 1,
                                    message: 'Compétence invalide'
                                }]}>
                                <Input onKeyUp={(e) => focusNextField(e, field.key)}
                                       onFocus={() => displayName(index)}
                                       onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                                />
                            </FormItem>*/}
                <SimpleInput
                  {...register(`items.${index}.competence`)}
                  onKeyUp={(e) => focusNextField(e, index)}
                  onFocus={() => displayName(index)}
                  onKeyPress={(e) => {
                    e.key === 'Enter' && e.preventDefault()
                  }}
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

export default CompetenceForm
