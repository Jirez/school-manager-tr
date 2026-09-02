import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Table } from 'reactstrap'
import { useApolloClient } from '@apollo/client'
import type { ClassDistribution } from '@/views/planning/distributions/ClassDistribution.type'
import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
// import {useReactive} from "ahooks";
import { XCircle } from 'react-feather'
import SimpleInput from '@/@core/components/ui/simple-input'
import Button from '@/@core/components/button'
import { useModal } from '@ebay/nice-modal-react'
import TeacherTableModal from '@/views/school/teacher/TeacherTableModal'
import { concat } from '@/utils/helpers'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import { TeacherByDepartmentDocument } from '@/gql/graphql'

interface FormValues {
  items: ClassDistribution[]
}

interface ClassDistributionFormProps extends BaseFormProps {
  classId: number
  distributions?: ClassDistribution[]
}

const ClassDistributionForm: FC<ClassDistributionFormProps> = ({
  distributions,
  classId,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const client = useApolloClient()
  const tableModal = useModal(TeacherTableModal)

  const { control, register, handleSubmit, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        items: distributions,
      },
    })

  const { fields } = useFieldArray({ control, name: 'items' })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    //formatting items
    console.log(values.items)
    const items = values.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => {
        return {
          distributionPK: {
            subjectId: Number(item.distributionPK.subjectId),
            schoolYearId: Number(item.distributionPK.schoolYearId),
            classId: Number(item.distributionPK.classId),
          },
          teacherId: Number(item.teacher.id),
          coTeacherId: Number(item.coTeacher?.id)
            ? Number(item.coTeacher.id)
            : null,
          weekHoursCount: item.weekHoursCount
            ? Number(item.weekHoursCount)
            : null,
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    action({
      variables: {
        distributions: items,
        classId: Number(classId),
      },
    })
      .then(async () => {
        //form.resetFields();
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
    const { id } = item.teacher
    return id
  }

  const onSelectionChanged = (
    selectedRow: any,
    selectedIndex: number,
    coTeacher: boolean,
  ) => {
    if (coTeacher) {
      setValue(`items.${selectedIndex}.coTeacher.id`, selectedRow.id)
      setValue(
        `items.${selectedIndex}.coLastName`,
        concat(selectedRow.lastName, selectedRow.firstName),
      )
    } else {
      setValue(`items.${selectedIndex}.teacher.id`, selectedRow.id)
      setValue(
        `items.${selectedIndex}.lastName`,
        concat(selectedRow.lastName, selectedRow.firstName),
      )
    }

    tableModal.hide()
  }

  const onTeacherClick = async (selectedIndex: number, coTeacher: boolean) => {
    const department =
      distributions?.[selectedIndex].subject.subjectDepartment.id

    const { data } = await client.query({
      query: TeacherByDepartmentDocument,
      variables: { id: Number(department) },
      fetchPolicy: 'network-only',
    })

    if (data && data.teachers) {
      tableModal.show({
        teachers: data.teachers,
        onRowClicked: (data: any) =>
          onSelectionChanged(data, selectedIndex, coTeacher),
      })
    }
  }

  //console.log(distributions)

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Table className="table table-bordered table-condensed table-hover responsive tableur tableFixHead">
        <thead>
          <tr>
            <th style={{ width: '10px' }} className="d-none d-md-block">
              #
            </th>
            <th>{t('label-subjects')}</th>
            <th style={{ width: '25%' }}>{t('label-teacher')}</th>
            <th style={{ width: '25%' }}>{t('label-coTeacher')}</th>
            <th>Quota horaire hebdo</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td
                style={{ textAlign: 'center' }}
                className="text-sm font-medium d-none d-md-block"
              >
                {index + 1}
              </td>
              <td style={{ display: 'none' }}>
                <SimpleInput
                  {...register(`items.${index}.distributionPK.schoolYearId`)}
                  readOnly={true}
                />
              </td>
              <td style={{ display: 'none' }}>
                <SimpleInput
                  {...register(`items.${index}.distributionPK.subjectId`)}
                  readOnly={true}
                />
              </td>

              <td style={{ display: 'none' }}>
                <SimpleInput
                  {...register(`items.${index}.distributionPK.classId`)}
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
                <span className="flex flex-row items-center">
                  <SimpleInput
                    {...register(`items.${index}.lastName`)}
                    //readOnly={true}
                    onClick={() => onTeacherClick(index, false)}
                    className="w-11/12"
                    defaultValue={concat(
                      field.teacher?.lastName || '',
                      field.teacher?.firstName || '',
                    )}
                  />
                  {watch(`items.${index}.teacher.id`) && (
                    <XCircle
                      className="w-1/12"
                      size={20}
                      onClick={() => {
                        setValue(`items.${index}.teacher.id`, null)
                        setValue(`items.${index}.lastName`, '')
                      }}
                    />
                  )}
                </span>
              </td>

              <td>
                <span className="flex flex-row items-center">
                  <SimpleInput
                    {...register(`items.${index}.coLastName`)}
                    //readOnly={true}
                    onClick={() => onTeacherClick(index, true)}
                    className="w-11/12"
                    defaultValue={concat(
                      field.coTeacher?.lastName || '',
                      field.coTeacher?.firstName || '',
                    )}
                  />
                  {watch(`items.${index}.coTeacher.id`) && (
                    <XCircle
                      className="w-1/12"
                      size={20}
                      onClick={() => {
                        setValue(`items.${index}.coTeacher.id`, null)
                        setValue(`items.${index}.coLastName`, '')
                      }}
                    />
                  )}
                </span>
              </td>

              <td style={{ display: 'none' }}>
                <SimpleInput
                  {...register(`items.${index}.teacher.id`)}
                  readOnly={true}
                />
              </td>

              <td style={{ display: 'none' }}>
                <SimpleInput
                  {...register(`items.${index}.coTeacher.id`)}
                  readOnly={true}
                />
              </td>

              <td>
                <SimpleInput {...register(`items.${index}.weekHoursCount`)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="flex justify-end mt-2 mb-2">
        <Button
          type="submit"
          loading={props.loading}
          color="primary"
          className="round"
        >
          {t('label-save')}
        </Button>
      </div>
    </Form>
  )
}

export default ClassDistributionForm
