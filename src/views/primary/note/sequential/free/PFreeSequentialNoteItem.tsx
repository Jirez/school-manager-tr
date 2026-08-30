import { useFieldArray } from 'react-hook-form'
import PFreeSequentialNoteItemItem from './PFreeSequentialNoteItemItem'
import SimpleInput from '@/@core/components/ui/simple-input'
import React from 'react'

interface Props {
  nestIndex: number
  control: any
  register: any
  notes: any[]
  errors: any
}

const PFreeSequentialNoteItem = ({
  nestIndex,
  control,
  register,
  notes,
  errors,
}: Props) => {
  const { fields } = useFieldArray({
    control,
    name: `items.${nestIndex}.items`,
  })

  return (
    <>
      {fields.map((field, index) => (
        <React.Fragment key={`${field.id}`}>
          <SimpleInput
            {...register(`items.${nestIndex}.items.${index}.subPeriodId`)}
            readOnly={true}
            className="d-none"
          />
          <SimpleInput
            {...register(`items.${nestIndex}.items.${index}.subPeriodName`)}
            readOnly={true}
            className="d-none"
          />
          <PFreeSequentialNoteItemItem
            nestIndex={nestIndex}
            subIndex={index}
            control={control}
            register={register}
            notes={notes}
            errors={errors}
          />
        </React.Fragment>
      ))}
    </>
  )
}

export default PFreeSequentialNoteItem
