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
import type { TimeTableForm } from './time.table'
import TimeTableItem from './TimeTableItem'
import { Save, Clock } from 'lucide-react'
import { styled } from 'styled-components'

interface Props extends BaseFormProps {
  timeTables: TimeTableForm[]
  classId: number
}

interface FormValues {
  items: TimeTableForm[]
}

const TableContainer = styled.div`
  border: 1px solid rgba(115, 103, 240, 0.15);
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.25);
  }
`

const StyledTable = styled(Table)`
  margin-bottom: 0;
  font-size: 0.875rem;

  thead {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.1) 0%,
      rgba(115, 103, 240, 0.05) 100%
    );
    border-bottom: 2px solid rgba(115, 103, 240, 0.2);

    th {
      padding: 0.75rem 0.5rem;
      font-weight: 600;
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #2c3e50;
      border-bottom: 2px solid rgba(115, 103, 240, 0.2);
      white-space: nowrap;
      vertical-align: middle;

      &:first-child {
        text-align: center;
        width: 50px;
      }

      &:nth-child(2) {
        text-align: center;
        min-width: 120px;
      }
    }

    .dark-layout & {
      background: linear-gradient(
        135deg,
        rgba(115, 103, 240, 0.15) 0%,
        rgba(115, 103, 240, 0.1) 100%
      );
      border-bottom-color: rgba(115, 103, 240, 0.3);

      th {
        color: #e4e6eb;
        border-bottom-color: rgba(115, 103, 240, 0.3);
      }
    }
  }

  tbody {
    tr {
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(115, 103, 240, 0.03);
      }

      td {
        padding: 0.325rem 0.2rem;
        border-bottom: 1px solid rgba(115, 103, 240, 0.1);
        vertical-align: middle;

        &:first-child {
          text-align: center;
          font-weight: 600;
          color: #7367f0;
          background: rgba(115, 103, 240, 0.05);
        }

        &:nth-child(2) {
          text-align: center;
          font-weight: 500;
          color: #2c3e50;
        }
      }
    }

    .dark-layout & {
      tr {
        &:hover {
          background-color: rgba(115, 103, 240, 0.08);
        }

        td {
          border-bottom-color: rgba(115, 103, 240, 0.15);

          &:first-child {
            color: #9e95f5;
            background: rgba(115, 103, 240, 0.1);
          }

          &:nth-child(2) {
            color: #e4e6eb;
          }
        }
      }
    }
  }
`

const TimeSlotDisplay = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: rgba(115, 103, 240, 0.08);
  border: 1px solid rgba(115, 103, 240, 0.2);
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.8125rem;
  color: #7367f0;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.15);
    border-color: rgba(115, 103, 240, 0.3);
    color: #9e95f5;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(115, 103, 240, 0.02);
  border-top: 1px solid rgba(115, 103, 240, 0.1);
  margin-top: 0.5rem;
  border-radius: 0 0 8px 8px;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.05);
    border-top-color: rgba(115, 103, 240, 0.2);
  }
`

const TimeTableForm: React.FC<Props> = ({ timeTables, action, ...props }) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [dayOfWeeks, setDayOfWeeks] = useState<any[]>([])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      items: timeTables,
    },
    mode: 'all',
  })

  const { fields } = useFieldArray({ control, name: 'items' })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    //formatting items
    const items = values.items
      .filter((item) => itemValid(item))
      .map((item) => ({
        timeSlotId: item.timeSlotId,
        //startTime: item.startTime,
        //endTime: item.endTime,
        items: item.items
          .filter((i) => !!i.subjectId && !!i.teacherId)
          .map((i) => ({
            dayOfClassId: i.dayOfClassId,
            //dayOfWeek: i.dayOfWeek,
            subjectId: i.subjectId,
            //subjectName: i.subjectName,
            //available: i.available,
            teacherId: i.teacherId,
          })),
      }))

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    //console.log(items);

    action({
      variables: {
        items,
        classId: Number(props.classId),
        schoolId: enterpriseId,
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Emploi du temps enregistré`, { ...TOAST_OPTIONS })
        document.getElementById('displayStudentName')!.innerText = ''
        messageService.sendMessage('pSequentialNote', true)
        //history.push('/sequential-notes');
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer l'emploi du temps : ${formatError(error)}`,
        )
      })
  }

  const itemValid = (item: TimeTableForm) => {
    const { items } = item
    return items.filter((i) => !!i.subjectId && !!i.teacherId).length > 0
  }

  useEffect(() => {
    if (timeTables.length > 0) {
      setDayOfWeeks(
        timeTables[0].items.map((item: any) => ({
          id: item.dayOfClassId,
          dayOfWeek: item.dayOfWeek,
          //marks: item.marks,
        })),
      )
    }
  }, [timeTables])

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <TableContainer>
        <div className="overflow-x-auto">
          <StyledTable className="table table-bordered table-hover responsive tableFixHead">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('label-timeSlots')}</th>
                {dayOfWeeks.map((dow: any) => (
                  <th key={dow.id}>{t(dow.dayOfWeek)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td>{index + 1}</td>
                  <td>
                    <SimpleInput
                      {...register(`items.${index}.timeSlotId`)}
                      readOnly={true}
                      className="hidden"
                    />
                    <SimpleInput
                      {...register(`items.${index}.startTime`)}
                      readOnly={true}
                      className="hidden"
                    />
                    <SimpleInput
                      {...register(`items.${index}.endTime`)}
                      readOnly={true}
                      className="hidden"
                    />
                    <TimeSlotDisplay>
                      <Clock size={14} />
                      <span>
                        {getValues(`items.${index}.startTime`)} -{' '}
                        {getValues(`items.${index}.endTime`)}
                      </span>
                    </TimeSlotDisplay>
                  </td>

                  <TimeTableItem
                    nestIndex={index}
                    control={control}
                    register={register}
                    tables={timeTables.map(
                      (note) => `${note.startTime} - ${note.endTime}`,
                    )}
                    errors={errors}
                    getValues={getValues}
                    classId={props.classId}
                    setValue={setValue}
                    watch={watch}
                  />
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </div>
      </TableContainer>

      <ActionBar>
        <Button
          loading={props.loading}
          color="primary"
          className="round flex items-center gap-2"
        >
          <Save size={16} />
          {t('label-save')}
        </Button>
      </ActionBar>
    </Form>
  )
}

export default TimeTableForm
