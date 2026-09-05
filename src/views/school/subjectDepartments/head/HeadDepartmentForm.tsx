import type { FC } from 'react'
import { Form, Table } from 'reactstrap'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { XCircle } from 'lucide-react'
import SimpleInput from '@/@core/components/ui/simple-input'
import { useModal } from '@ebay/nice-modal-react'
import TeacherTableModal from '@/views/school/teacher/TeacherTableModal'
import { concat } from '@/utils/helpers'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import { TeacherByDepartmentDocument } from '@/gql/graphql'
import type { HeadDepartmentType } from './head.department.type'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useAppForm } from '#/hooks/form/form'
// import { z } from 'zod'
import { m } from '@/paraglide/messages'
import Button from '#/@core/components/button'

/* const headDepartmentItemSchema = z.object({
  headDepartmentPK: z.object({
    schoolYearId: z.number(),
    departmentId: z.number(),
  }),
  teacher: z
    .object({
      id: z.number().nullable(),
      firstName: z.string().optional(),
      lastName: z.string(),
      code: z.string(),
    })
    .optional()
    .nullable(),
  department: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .optional()
    .nullable(),
  teacherId: z.number().optional(),
  lastName: z.string().optional(),
})

const headDepartmentSchema = z.object({
  items: z
    .array(headDepartmentItemSchema)
    .min(0, 'Au moins un animateur pédagogique est requis'),
}) */

// type HeadDepartmentSchemaType = z.input<typeof headDepartmentSchema>

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
  const client = useApolloClient()
  const tableModal = useModal(TeacherTableModal)
  const { enterpriseId } = useAuthentication()

  const { handleSubmit, AppField, setFieldValue } = useAppForm({
    defaultValues: {
      items: headDepartments || [],
    } as any,
    validators: {
      // onChange: headDepartmentSchema,
    },
    onSubmit({ value }) {
      const values = value // headDepartmentSchema.parse(value)

      const items = values.items
        .filter((item: any) => itemValid(item))
        .map((item: any) => {
          return {
            headDepartmentPK: {
              schoolYearId: Number(item.headDepartmentPK.schoolYearId),
              departmentId: Number(item.headDepartmentPK.departmentId),
            },
            teacherId: Number(item.teacher?.id),
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
        .then(async () => {
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
    },
  })

  const itemValid = (item: any) => {
    const { id } = item.teacher || {}
    return id
  }

  const onSelectionChanged = (
    selectedRow: any,
    selectedIndex: number,
    _coTeacher: boolean,
  ) => {
    setFieldValue(`items.${selectedIndex}.teacher.id`, selectedRow.id)
    setFieldValue(
      `items.${selectedIndex}.lastName`,
      concat(selectedRow.lastName, selectedRow.firstName),
    )

    tableModal.hide()
  }

  const onTeacherClick = async (selectedIndex: number, _coTeacher: boolean) => {
    const department = headDepartments?.[selectedIndex]?.department?.id

    const { data } = await client.query({
      query: TeacherByDepartmentDocument,
      variables: { id: Number(department) },
      fetchPolicy: 'network-only',
    })

    if (data && data.teachers) {
      tableModal.show({
        teachers: data.teachers,
        onRowClicked: (row: any) =>
          onSelectionChanged(row, selectedIndex, _coTeacher),
      })
    }
  }

  const clearTeacher = (index: number) => {
    setFieldValue(`items.${index}.teacher.id`, null)
    setFieldValue(`items.${index}.lastName`, '')
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleSubmit()
      }}
    >
      <Table className="table table-bordered table-condensed table-hover responsive tableur tableFixHead">
        <thead>
          <tr>
            <th style={{ width: '10px' }}>#</th>
            <th>{m.label_departments()}</th>
            <th style={{ width: '45%' }}>{m.label_teacher()}</th>
          </tr>
        </thead>
        <tbody>
          <AppField name="items" mode="array">
            {(fieldArray) => {
              return (
                <>
                  {fieldArray.state.value.map((_: any, index: number) => (
                    <tr key={index}>
                      <td style={{ textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ display: 'none' }}>
                        <AppField
                          name={`items[${index}].headDepartmentPK.schoolYearId`}
                        >
                          {(field) => (
                            <SimpleInput
                              value={field.state.value || ''}
                              readOnly={true}
                            />
                          )}
                        </AppField>
                      </td>
                      <td style={{ display: 'none' }}>
                        <AppField
                          name={`items[${index}].headDepartmentPK.departmentId`}
                        >
                          {(field) => (
                            <SimpleInput
                              value={field.state.value || ''}
                              readOnly={true}
                            />
                          )}
                        </AppField>
                      </td>

                      <td>
                        <AppField name={`items[${index}].department.name`}>
                          {(field) => (
                            <SimpleInput
                              value={field.state.value || ''}
                              readOnly={true}
                            />
                          )}
                        </AppField>
                      </td>

                      <td>
                        <span className="flex flex-row items-center">
                          <AppField name={`items[${index}].lastName`}>
                            {(field) => (
                              <SimpleInput
                                value={field.state.value || ''}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                                onClick={() => onTeacherClick(index, false)}
                                className="w-11/12"
                              />
                            )}
                          </AppField>
                          <AppField name={`items[${index}].teacher.id`}>
                            {(field) =>
                              field.state.value && (
                                <XCircle
                                  className="w-1/12 cursor-pointer"
                                  size={20}
                                  onClick={() => clearTeacher(index)}
                                />
                              )
                            }
                          </AppField>
                        </span>
                      </td>

                      <td style={{ display: 'none' }}>
                        <AppField name={`items[${index}].teacher.id`}>
                          {(field) => (
                            <SimpleInput
                              value={field.state.value || ''}
                              readOnly={true}
                            />
                          )}
                        </AppField>
                      </td>
                    </tr>
                  ))}
                </>
              )
            }}
          </AppField>
        </tbody>
      </Table>

      <div className="flex justify-end mt-2 mb-2">
        <Button
          type="submit"
          loading={props.loading}
          color="primary"
          className="round"
        >
          {m.label_save()}
        </Button>
      </div>
    </Form>
  )
}

export default HeadDepartmentForm
