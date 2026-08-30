import SimpleInput from '@/@core/components/ui/simple-input'
import { useFieldArray } from 'react-hook-form'

interface Props {
  nestIndex: number
  subIndex: number
  control: any
  register: any
  notes: any[]
  errors: any
}

const PFreeSequentialNoteItemItem = ({
  nestIndex,
  subIndex,
  control,
  register,
  notes,
  errors,
}: Props) => {
  const { fields } = useFieldArray({
    control,
    name: `items.${nestIndex}.items.${subIndex}.items`,
  })

  const displayName = (index: number) => {
    document.getElementById('displayStudentName')!.innerText = notes[index]
  }

  const focusNextField = (e: any, index: number) => {
    if (e.which === 13) {
      const input = document.getElementById(
        `items.${nestIndex + 1}.items.${subIndex}.items.${index}.note`,
      )
      input?.focus()
    }
  }

  return (
    <>
      {fields.map((field, index) => (
        <td key={`${field.id}`}>
          <SimpleInput
            {...register(
              `items.${nestIndex}.items.${subIndex}.items.${index}.evalTypeId`,
            )}
            readOnly={true}
            className="d-none"
          />
          <SimpleInput
            {...register(
              `items.${nestIndex}.items.${subIndex}.items.${index}.evalTypeName`,
            )}
            readOnly={true}
            className="d-none"
          />
          <SimpleInput
            {...register(
              `items.${nestIndex}.items.${subIndex}.items.${index}.note`,
              {
                required: true,
                pattern:
                  /^(?:[0-9]|0[1-9]|1[0-9]|[0-9]+.+[0-9]{1,2}|0[1-9]+.+[0-9]{1,2}|1[0-9]+.+[0-9]{1,2}|20|-1)$/,
              },
            )}
            onKeyPress={(e) => {
              e.key === 'Enter' && e.preventDefault()
            }}
            onFocus={() => displayName(nestIndex)}
            onKeyUp={(e) => focusNextField(e, index)}
            invalid={
              errors.items?.[nestIndex]?.items?.[subIndex]?.items?.[index]?.note
            }
          />
        </td>
      ))}
    </>
  )
}

export default PFreeSequentialNoteItemItem
