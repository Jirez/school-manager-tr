import type { FC } from 'react'
import { Form, Table } from 'reactstrap'
import { toast } from 'react-toastify'
import SimpleInput from '@/@core/components/ui/simple-input'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import type { FrequentBulkUpdateType } from './Frequent.type'
import dayjs from 'dayjs'
import { useAuthentication } from '@/hooks/useAuthentication'
import { Save } from 'lucide-react'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { useAppForm } from '#/hooks/form/form'
import { m } from '@/paraglide/messages'
import Button from '#/@core/components/button'

interface Props extends BaseFormProps {
  classId: number
  frequents?: FrequentBulkUpdateType[]
}

const FrequentBulkUpdateForm: FC<Props> = ({
  frequents,
  classId,
  action,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()

  const { handleSubmit, AppField } = useAppForm({
    defaultValues: {
      items:
        frequents?.map((item) => ({
          studentId: item.studentId,
          lastName: item.lastName,
          firstName: item.firstName,
          birthDate: dayjs(item.birthDate).toDate(),
          birthplace: item.birthplace,
          registrationNumber: item.registrationNumber,
        })) || [],
    } as any,
    onSubmit({ value }) {
      const values = value

      const items = values.items
        .filter((item: any) => itemValid(item))
        .map((item: any) => {
          return {
            studentId: Number(item.studentId),
            lastName: item.lastName,
            firstName: item.firstName,
            birthDate: dayjs(item.birthDate).format(INPUT_DATE_FORMAT),
            birthplace: item.birthplace,
            registrationNumber: item.registrationNumber,
          }
        })

      if (items.length === 0) {
        toast.error('Données invalides, rien à enregistrer')
        return
      }

      action({
        variables: {
          frequents: items,
          schoolId: Number(enterpriseId),
        },
      })
        .then(async () => {
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
    },
  })

  const itemValid = (item: any) => {
    const { studentId, lastName, registrationNumber, birthDate, birthplace } =
      item
    return (
      studentId && lastName && registrationNumber && birthDate && birthplace
    )
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleSubmit()
      }}
    >
      <div className="tableFixHead">
        <Table className="table table-bordered table-condensed table-hover responsive tableur ">
          <thead>
            <tr>
              <th style={{ width: '10px' }}>#</th>
              <th style={{ width: '10%' }}>{m.label_registrationNumber()}</th>
              <th style={{ width: '25%' }}>{m.label_lastName()}</th>
              <th style={{ width: '20%' }}>{m.label_firstName()}</th>
              <th>{m.label_birthDate()}</th>
              <th>{m.label_birthplace()}</th>
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
                          <AppField name={`items[${index}].studentId`}>
                            {(field) => (
                              <SimpleInput
                                value={field.state.value || ''}
                                readOnly={true}
                              />
                            )}
                          </AppField>
                        </td>

                        <td>
                          <AppField name={`items[${index}].registrationNumber`}>
                            {(field) => (
                              <SimpleInput
                                value={field.state.value || ''}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                            )}
                          </AppField>
                        </td>
                        <td>
                          <AppField name={`items[${index}].lastName`}>
                            {(field) => (
                              <SimpleInput
                                value={field.state.value || ''}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                            )}
                          </AppField>
                        </td>

                        <td>
                          <AppField name={`items[${index}].firstName`}>
                            {(field) => (
                              <SimpleInput
                                value={field.state.value || ''}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
                              />
                            )}
                          </AppField>
                        </td>

                        <td>
                          <AppField name={`items[${index}].birthDate`}>
                            {(field) => (
                              <input
                                type="date"
                                value={
                                  field.state.value
                                    ? dayjs(field.state.value).format(
                                        'YYYY-MM-DD',
                                      )
                                    : ''
                                }
                                onChange={(e) =>
                                  field.handleChange(new Date(e.target.value))
                                }
                                className="form-control"
                              />
                            )}
                          </AppField>
                        </td>

                        <td>
                          <AppField name={`items[${index}].birthplace`}>
                            {(field) => (
                              <SimpleInput
                                value={field.state.value || ''}
                                onChange={(e) =>
                                  field.handleChange(e.target.value)
                                }
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
      </div>

      <StickyActions>
        <div className="flex justify-end mt-1 mb-0">
          <Button
            type="submit"
            loading={props.loading}
            color="primary"
            className="round text-sm flex gap-0.5 md:!gap-1"
          >
            <Save size={15} />
            {m.label_save()}
          </Button>
        </div>
      </StickyActions>
    </Form>
  )
}

export default FrequentBulkUpdateForm
