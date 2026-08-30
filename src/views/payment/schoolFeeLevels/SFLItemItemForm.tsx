import InputNumber from '@/@core/components/ui/forms/input-number'
import SimpleInput from '@/@core/components/ui/simple-input'
import { handleFocusAndScroll, preventSubmitting } from '@/utils/helpers'
import SchoolFeeAutocompleteHint from '@/utils/SchoolFeeAutocompleteHint'
import { useDebounceFn, useEventEmitter } from 'ahooks'
import { useRef } from 'react'
import { MinusCircle } from 'react-feather'
import { useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Table } from 'reactstrap'

interface Props {
  nestIndex: number
  subIndex: number
  control: any
  register: any
  getValues: any
  watch: any
}

const SFLItemItemForm = ({
  nestIndex,
  subIndex,
  control,
  register,
  getValues,
  watch,
}: Props) => {
  const { t } = useTranslation()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${nestIndex}.items.${subIndex}.items`,
    //rules: { minLength: 0 },
  })

  const bottomTableRef = useRef<HTMLSpanElement>(null)

  const focus$ = useEventEmitter()

  const { run: focusMarksField } = useDebounceFn(
    () => {
      const keys = getValues(`items.${nestIndex}.items.${subIndex}.items`)
      const input = document.getElementById(
        `items.${nestIndex}.items.${subIndex}.items.${
          keys.length - 1
        }.requiredAmount`,
      )
      input?.focus()
      bottomTableRef.current?.scrollIntoView(true)
    },
    {
      wait: 200,
    },
  )

  const onFill = (selectedRow: any) => {
    const sb = {
      schoolFeeName: selectedRow.name,
      schoolFeeId: selectedRow.id,
      requiredAmount: '',
    }

    append(sb)
    focusMarksField()
  }

  return (
    <div className="w-full">
      <div className="w-full mb-2">
        <SchoolFeeAutocompleteHint onFill={onFill} focus$={focus$} />
      </div>

      <Table
        className="table table-bordered table-condensed table-hover responsive tableur tableFixHead text-sm"
        style={{ zIndex: 10 }}
      >
        <thead>
          <tr>
            <th style={{ width: '10px' }}>#</th>
            <th style={{ width: '40%' }}>{t('label-schoolFee')}</th>
            <th>{t('label-requiredAmount')}</th>
            <th className="text-center">#</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field, index) => (
            <tr key={`${field.id}`}>
              <td className="text-center">{index + 1}</td>
              <td>
                <SimpleInput
                  {...register(
                    `items.${nestIndex}.items.${subIndex}.items.${index}.schoolFeeId`,
                  )}
                  readOnly={true}
                  className="d-none"
                />
                <SimpleInput
                  {...register(
                    `items.${nestIndex}.items.${subIndex}.items.${index}.schoolFeeName`,
                  )}
                  readOnly={true}
                />
              </td>
              <td>
                <InputNumber
                  label={undefined}
                  {...register(
                    `items.${nestIndex}.items.${subIndex}.items.${index}.requiredAmount`,
                  )}
                  value={watch(
                    `items.${nestIndex}.items.${subIndex}.items.${index}.requiredAmount`,
                  )}
                  readOnly={false}
                  onKeyPress={preventSubmitting}
                  onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                />
              </td>
              <td className="flex justify-around">
                <MinusCircle onClick={() => remove(index)} color="red" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <span ref={bottomTableRef} />
    </div>
  )
}

export default SFLItemItemForm
