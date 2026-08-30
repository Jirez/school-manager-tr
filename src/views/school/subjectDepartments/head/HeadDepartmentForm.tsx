import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Table } from 'reactstrap'
import { useApolloClient } from '@apollo/client'
import { useFieldArray, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
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
import type { HeadDepartmentType } from './head.department.type'
import { useAuthentication } from '@/hooks/useAuthentication'

interface FormValues {
  items: HeadDepartmentType[]
}

interface HeadDepartmentFormProps extends BaseFormProps {
  classId: number
  headDepartments?: HeadDepartmentType[]
}

const HeadDepartmentForm: FC<HeadDepartmentFormProps> = ({
  headDepartments,
  classId,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const client = useApolloClient()
  const tableModal = useModal(TeacherTableModal)
  const { enterpriseId } = useAuthentication()

  const { control, register, handleSubmit, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        items: headDepartments,
      },
    })

  const { fields } = useFieldArray({ control, name: 'items' })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    // formatting items
    console.log(values.items)
    const items = values.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => {
        return {
          headDepartmentPK: {
            schoolYearId: Number(item.headDepartmentPK.schoolYearId),
            departmentId: Number(item.headDepartmentPK.departmentId),
          },
          teacherId: Number(item.teacher.id),
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    action({
      variables: {
        headDepartments: items,
        schoolId: enterpriseId,
      },
    })
      .then(async ({ data }) => {
        // form.resetFields();
        toast.success(`Animateurs pédagogiques enregistrés`, {
          ...TOAST_OPTIONS,
        })
        messageService.sendMessage('headDepartment', true)
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer les animateurs pédagogiques : ${formatError(
            error,
          )}`,
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
    setValue(`items.${selectedIndex}.teacher.id`, selectedRow.id)
    setValue(
      `items.${selectedIndex}.lastName`,
      concat(selectedRow.lastName, selectedRow.firstName),
    )

    tableModal.hide()
  }

  const onTeacherClick = async (selectedIndex: number, coTeacher: boolean) => {
    const department = headDepartments?.[selectedIndex]?.department?.id

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

  // console.log(distributions)

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Table className="table table-bordered table-condensed table-hover responsive tableur tableFixHead">
        <thead>
          <tr>
            <th style={{ width: '10px' }}>#</th>
            <th>{t('label-departments')}</th>
            <th style={{ width: '45%' }}>{t('label-teacher')}</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id}>
              <td style={{ textAlign: 'center' }}>{index + 1}</td>
              <td style={{ display: 'none' }}>
                <SimpleInput
                  {...register(`items.${index}.headDepartmentPK.schoolYearId`)}
                  readOnly={true}
                />
              </td>
              <td style={{ display: 'none' }}>
                <SimpleInput
                  {...register(`items.${index}.headDepartmentPK.departmentId`)}
                  readOnly={true}
                />
              </td>

              <td>
                <SimpleInput
                  {...register(`items.${index}.department.name`)}
                  readOnly={true}
                />
              </td>

              <td>
                <span className="flex flex-row items-center">
                  <SimpleInput
                    {...register(`items.${index}.lastName`)}
                    // readOnly={true}
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

              <td style={{ display: 'none' }}>
                <SimpleInput
                  {...register(`items.${index}.teacher.id`)}
                  readOnly={true}
                />
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

export default HeadDepartmentForm
