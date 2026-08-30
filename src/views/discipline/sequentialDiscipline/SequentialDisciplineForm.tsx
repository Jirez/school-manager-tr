import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { SequentialDisciplineType } from '@/views/discipline/sequentialDiscipline/SequentialDiscipline.type'
import { useFieldArray, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { Form, Table } from 'reactstrap'
import { useAuthentication } from '@/hooks/useAuthentication'
import SimpleInput from '@/@core/components/ui/simple-input'
import Button from '@/@core/components/button'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { concat } from '@/utils/helpers'
import { TOAST_OPTIONS } from '@/utils/constants'
import { Save } from 'react-feather'

interface SequentialDisciplineFormProps extends BaseFormProps {
  subPeriodId: number
  classId: number
  sequentialDisciplines: SequentialDisciplineType[]
}

interface FormValues {
  items: SequentialDisciplineType[]
}

const SequentialDisciplineForm: FC<SequentialDisciplineFormProps> = ({
  sequentialDisciplines,
  subPeriodId,
  classId,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      items: sequentialDisciplines.map((value) => ({
        ...value,
        fullName: concat(value.student.lastName, value.student.firstName),
      })),
    },
  })

  const { fields } = useFieldArray({ control, name: 'items' })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    //formatting items
    const items = values.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => ({
        sequentialDisciplinePK: {
          studentId: Number(item.sequentialDisciplinePK.studentId),
          subPeriodId: Number(item.sequentialDisciplinePK.subPeriodId),
        },
        unjustifiedAbsence: item.unjustifiedAbsence
          ? Number(item.unjustifiedAbsence)
          : null,
        justifiedAbsence: item.justifiedAbsence
          ? Number(item.justifiedAbsence)
          : null,
        detention: item.detention ? Number(item.detention) : null,
        warning: item.warning ? Number(item.warning) : null,
        behaviorBlame: item.behaviorBlame ? Number(item.behaviorBlame) : null,
        disciplinaryBoard: item.disciplinaryBoard
          ? Number(item.disciplinaryBoard)
          : null,
        temporaryExclusion: item.temporaryExclusion
          ? Number(item.temporaryExclusion)
          : null,
      }))

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    action({
      variables: {
        disciplines: items,
        classId: Number(classId),
        subPeriodId: Number(subPeriodId),
        schoolId: enterpriseId,
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Discipline séquentielle enregistrée`, {
          ...TOAST_OPTIONS,
        })
        document.getElementById('displayStudentName')!.innerText = ''
        messageService.sendMessage('sequentialDiscipline', true)
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer la discipline : ${formatError(error)}`,
        )
      })
  }

  const itemValid = (item: any) => {
    const {
      unjustifiedAbsence,
      justifiedAbsence,
      detention,
      warning,
      behaviorBlame,
      disciplinaryBoard,
      temporaryExclusion,
    } = item
    return (
      unjustifiedAbsence ||
      justifiedAbsence ||
      detention ||
      warning ||
      behaviorBlame ||
      disciplinaryBoard ||
      temporaryExclusion
    )
  }

  const focusNextField = (e: any, index: number) => {
    if (e.which === 13) {
      document.getElementById(`items.${index + 1}.unjustifiedAbsence`)?.focus()
    }
  }

  const displayName = (index: number) => {
    document.getElementById('displayStudentName')!.innerText = concat(
      sequentialDisciplines[index].student.lastName,
      sequentialDisciplines[index].student.firstName,
    )
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="tableFixHead">
        <Table className="table table-bordered table-condensed table-hover responsive tableur ">
          <thead>
            <tr>
              <th style={{ width: '10px' }}>#</th>
              <th>{t('label-registrationNumber')}</th>
              <th style={{ width: '25%' }}>Noms et prénoms</th>
              <th>Absence NJ</th>
              <th>Absence J</th>
              <th>Consigne</th>
              <th>Avertissement</th>
              <th>Blâme</th>
              <th>Conseil discipline</th>
              <th>Exclusion temporaire</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(
                      `items.${index}.sequentialDisciplinePK.studentId`,
                    )}
                    readOnly={true}
                  />
                </td>
                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(
                      `items.${index}.sequentialDisciplinePK.subPeriodId`,
                    )}
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
                    {...register(`items.${index}.fullName`)}
                    readOnly={true}
                    //defaultValue={concat(field.student.lastName, field.student.firstName)}
                    //defaultValue={concat(field.student.lastName, field.student.firstName || '')}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.unjustifiedAbsence`)}
                    onKeyUp={(e) => focusNextField(e, index)}
                    onFocus={() => displayName(index)}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && e.preventDefault()
                    }}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.justifiedAbsence`)}
                    onFocus={() => displayName(index)}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && e.preventDefault()
                    }}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.detention`)}
                    onFocus={() => displayName(index)}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && e.preventDefault()
                    }}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.warning`)}
                    onFocus={() => displayName(index)}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && e.preventDefault()
                    }}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.behaviorBlame`)}
                    onFocus={() => displayName(index)}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && e.preventDefault()
                    }}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.disciplinaryBoard`)}
                    onFocus={() => displayName(index)}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && e.preventDefault()
                    }}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.temporaryExclusion`)}
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
      </div>

      <div className="flex justify-end mt-2 mb-4">
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

export default SequentialDisciplineForm
