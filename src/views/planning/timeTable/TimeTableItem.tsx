import SimpleInput from '@/@core/components/ui/simple-input'
import { useModal } from '@ebay/nice-modal-react'
import { useFieldArray } from 'react-hook-form'
import SubjectAssignmentTableModal from './SubjectAssignmentTableModal'
import {
  CheckTeacherAvailabilityDocument,
  useSubjectAssignmentsQuery,
} from '@/gql/graphql'
import { cutText } from '@/utils/helpers'
import { useApolloClient } from '@apollo/client'
import { toast } from 'react-toastify'
import { XCircle } from 'react-feather'

interface Props {
  nestIndex: number
  control: any
  register: any
  tables: any[]
  errors: any
  getValues: any
  classId: number
  setValue: any
  watch: any
}

const TimeTableItem = ({
  nestIndex,
  control,
  register,
  tables,
  // errors,
  classId,
  getValues,
  setValue,
  watch,
}: Props) => {
  const tableModal = useModal(SubjectAssignmentTableModal)
  const client = useApolloClient()
  const { fields } = useFieldArray({
    control,
    name: `items.${nestIndex}.items`,
  })

  const { data, loading } = useSubjectAssignmentsQuery({
    variables: {
      classId,
    },
    fetchPolicy: 'network-only',
  })

  const displayName = (index: number) => {
    document.getElementById('displayStudentName')!.innerText = tables[index]
  }

  const focusNextField = (e: any, index: number) => {
    if (e.which === 13) {
      const input = document.getElementById(
        `items.${nestIndex + 1}.items.${index}.note`,
      )
      input?.focus()
    }
  }

  const onSelectionChanged = async (
    selectedRow: any,
    selectedIndex: number,
    targetNextLine: boolean,
    closeModal: boolean,
  ) => {
    let index = nestIndex
    if (targetNextLine) {
      const maxIndex = getValues('items').length
      let available = false

      /* do {
        index = nestIndex + 1;
        available = getValues(
          `items.${index}.items.${selectedIndex}.available`
        );
        console.log(available);
      } while (!available && index < maxIndex - 1); */

      for (let i = nestIndex + 1; i <= maxIndex; i++) {
        available = getValues(`items.${i}.items.${selectedIndex}.available`)
        if (available) {
          index = i
          break
        }
      }
    }

    const { dayOfClassId } = getValues(`items.${index}.items.${selectedIndex}`)

    const { timeSlotId } = getValues(`items.${index}`)

    if (!dayOfClassId || !timeSlotId) {
      return
    }

    if (!selectedRow.teacherId) {
      toast.error(
        "Aucun enseignant n'a été assigné à cette matière dans cette classe",
      )
      return
    }

    await client
      .query({
        query: CheckTeacherAvailabilityDocument,
        variables: {
          teacherId: selectedRow.teacherId,
          timeSlotId,
          dayOfClassId,
        },
        fetchPolicy: 'network-only',
      })
      .then(() => {
        setValue(
          `items.${index}.items.${selectedIndex}.teacherId`,
          selectedRow.teacherId,
        )
        setValue(
          `items.${index}.items.${selectedIndex}.subjectId`,
          selectedRow.subjectId,
        )
        setValue(
          `items.${index}.items.${selectedIndex}.subjectName`,
          cutText(selectedRow.subjectName, 30),
        )
      })
      .catch((error) => {
        toast.error(error.message)
        return
      })

    if (closeModal) {
      tableModal.hide()
    }
  }

  const onSubjectClick = async (
    selectedIndex: number,
    isDoubleHour: boolean,
  ) => {
    if (data && data.subjectAssignments) {
      tableModal.show({
        subjects: data.subjectAssignments,
        onRowClicked: async (data: any) => {
          if (isDoubleHour) {
            await onSelectionChanged(data, selectedIndex, false, false)
            await onSelectionChanged(data, selectedIndex, true, true)
          } else {
            await onSelectionChanged(data, selectedIndex, false, true)
          }
        },
      })
    }
  }

  return (
    <>
      {fields.map((field, index) => (
        <td key={`${field.id}`}>
          <SimpleInput
            {...register(`items.${nestIndex}.items.${index}.dayOfClassId`)}
            readOnly={true}
            className="d-none"
          />
          <SimpleInput
            {...register(`items.${nestIndex}.items.${index}.teacherId`)}
            readOnly={true}
            className="d-none"
          />
          <SimpleInput
            {...register(`items.${nestIndex}.items.${index}.dayOfWeek`)}
            readOnly={true}
            className="d-none"
          />
          <span className="flex flex-row items-center">
            <SimpleInput
              {...register(`items.${nestIndex}.items.${index}.subjectName`, {
                required: false,
              })}
              onKeyPress={(e) => {
                e.key === 'Enter' && e.preventDefault()
              }}
              onFocus={() => displayName(nestIndex)}
              onKeyUp={(e) => focusNextField(e, index)}
              disabled={
                !getValues(`items.${nestIndex}.items.${index}.available`)
              }
              className="w-11/12"
              variant={
                getValues(`items.${nestIndex}.items.${index}.available`)
                  ? 'normal'
                  : 'disabled'
              }
              onClick={() => onSubjectClick(index, true)}
            />
            {watch(`items.${nestIndex}.items.${index}.subjectId`) && (
              <XCircle
                className="w-1/12"
                size={20}
                onClick={() => {
                  setValue(`items.${nestIndex}.items.${index}.subjectId`, null)
                  setValue(`items.${nestIndex}.items.${index}.teacherId`, null)
                  setValue(`items.${nestIndex}.items.${index}.subjectName`, '')
                }}
              />
            )}
          </span>
        </td>
      ))}
    </>
  )
}

export default TimeTableItem
