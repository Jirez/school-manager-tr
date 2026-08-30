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
import { TOAST_OPTIONS } from '@/utils/constants'
import { useEffect, useState } from 'react'
import type { PFreeSequentialNoteType } from './p.free.sequential.note.type'
import PFreeSequentialNoteItem from './PFreeSequentialNoteItem'
import React from 'react'

interface Props extends BaseFormProps {
  sequentialNotes: PFreeSequentialNoteType[]
  classId: number
  subCompetenceId: number
  subPeriodId: number
}

interface FormValues {
  items: PFreeSequentialNoteType[]
}

const PFreeSequentialNoteForm: React.FC<Props> = ({
  sequentialNotes,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [subPeriods, setSubPeriods] = useState<any[]>([])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
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
      .filter((item) => itemValid(item))
      .map((item) => ({
        studentId: item.studentId,
        registrationNumber: item.registrationNumber,
        studentFullName: item.studentFullName,
        items: item.items.map((i) => ({
          subPeriodId: i.subPeriodId,
          subPeriodName: i.subPeriodName,
          items: i.items.map((ii) => ({
            evalTypeId: ii.evalTypeId,
            note: Number(ii.note),
            evalTypeName: ii.evalTypeName,
            marks: Number(ii.marks),
          })),
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
        //subPeriodId: Number(props.subPeriodId),
        subCompetenceId: Number(props.subCompetenceId),
        schoolId: enterpriseId,
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Evaluation enregistrée`, { ...TOAST_OPTIONS })
        document.getElementById('displayStudentName')!.innerText = ''
        messageService.sendMessage('pSequentialNote', true)
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

  const itemValid = (item: PFreeSequentialNoteType) => {
    const { items } = item
    return items.length > 0
  }

  useEffect(() => {
    if (sequentialNotes.length > 0) {
      setSubPeriods(
        sequentialNotes[0].items.map((item: any) => ({
          id: item.subPeriodId,
          name: item.subPeriodName,
          items: item.items.map((i: any) => ({
            id: i.evalTypeId,
            name: i.evalTypeName,
            marks: i.marks,
          })),
        })),
      )
    }
  }, [sequentialNotes])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="tableFixHead">
        <Table className="table table-bordered table-condensed table-hover responsive tableur text-sm">
          <thead>
            <tr>
              <th
                style={{ width: '10px' }}
                rowSpan={2}
                className="align-middle"
              >
                #
              </th>
              <th rowSpan={2} className="align-middle">
                {t('label-registrationNumber')}
              </th>
              <th rowSpan={2} className="align-middle min-w-[15%]">
                {t('label-names')}
              </th>
              {subPeriods.map((subPeriod: any) => (
                <th
                  key={`SubPeriod - ${subPeriod.id}`}
                  colSpan={3}
                  className="text-center"
                >
                  {subPeriod.name}
                </th>
              ))}
            </tr>
            <tr>
              {subPeriods.map((subPeriod: any) => (
                <React.Fragment key={subPeriod.id}>
                  {subPeriod.items.map((item: any) => (
                    <th key={item.id}>
                      {item.name} / {item.marks}
                    </th>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td>
                  <SimpleInput
                    {...register(`items.${index}.registrationNumber`)}
                    readOnly={true}
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
                  />
                </td>

                <PFreeSequentialNoteItem
                  nestIndex={index}
                  control={control}
                  register={register}
                  notes={sequentialNotes.map((note) => note.studentFullName)}
                  errors={errors}
                />
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

export default PFreeSequentialNoteForm
