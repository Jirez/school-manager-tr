import DatePicker from '@/@core/components/ui/forms/date-picker'
import InputNumber from '@/@core/components/ui/forms/input-number'
import SimpleInput from '@/@core/components/ui/simple-input'
import { handleFocusAndScroll, preventSubmitting } from '@/utils/helpers'
import TuitionAutocompleteHint from '@/utils/TuitionAutocompleteHint'
import { useDebounceFn, useEventEmitter } from 'ahooks'
import { useRef } from 'react'
import { Trash2, FileText } from 'lucide-react'
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
  setValue: any
}

const FSItemItemForm = ({
  nestIndex,
  subIndex,
  control,
  register,
  getValues,
  watch,
  setValue,
}: Props) => {
  const { t } = useTranslation()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${nestIndex}.items.${subIndex}.items`,
    //rules: { minLength: 0 },
  })

  const bottomTableRef = useRef<HTMLSpanElement>(null)

  const focus$ = useEventEmitter()
  const reload$ = useEventEmitter()

  const { run: focusField } = useDebounceFn(
    () => {
      const keys = getValues(`items.${nestIndex}.items.${subIndex}.items`)
      const input = document.getElementById(
        `items.${nestIndex}.items.${subIndex}.items.${
          keys.length - 1
        }.requiredAmountF`,
      )
      input?.focus()
      //bottomTableRef.current?.scrollIntoView(true);
    },
    {
      wait: 500,
    },
  )

  const onFill = (selectedRow: any) => {
    const sb = {
      tuitionName: selectedRow.name,
      tuitionId: selectedRow.id,
      requiredAmount: '',
      requiredAmountF: '',
      dueDate: '',
      lateFee: '',
      gracePeriodDays: '',
    }

    append(sb)
    focusField()
  }

  return (
    <div className="w-full">
      {/* Autocomplete Input */}
      <div className="mb-1">
        <TuitionAutocompleteHint
          onFill={onFill}
          focus$={focus$}
          reload$={reload$}
        />
      </div>

      {/* Table Container */}
      {fields.length > 0 ? (
        <div className="border border-gray-200 dark:!border-gray-700 rounded-lg overflow-hidden bg-white dark:!bg-gray-800">
          <div className="overflow-x-auto">
            <Table className="mb-0 table-compact" style={{ zIndex: 10 }}>
              <thead className="bg-gray-50 dark:!bg-gray-800/80">
                <tr>
                  <th className="w-10 text-center text-xs font-semibold text-gray-700 dark:!text-gray-300 px-2 py-2">
                    #
                  </th>
                  <th className="text-xs font-semibold text-gray-700 dark:!text-gray-300 px-2 py-2 min-w-[200px]">
                    {t('label-schoolFee')}
                  </th>
                  <th className="text-xs font-semibold text-gray-700 dark:!text-gray-300 px-2 py-2">
                    {t('label-requiredAmount')}
                  </th>
                  <th className="text-xs font-semibold text-gray-700 dark:!text-gray-300 px-2 py-2">
                    {t('label-dueDate')}
                  </th>
                  <th className="text-xs font-semibold text-gray-700 dark:!text-gray-300 px-2 py-2">
                    {t('label-lateFee')}
                  </th>
                  <th className="text-xs font-semibold text-gray-700 dark:!text-gray-300 px-2 py-2">
                    {t('label-gracePeriodDays')}
                  </th>
                  <th className="w-12 text-center text-xs font-semibold text-gray-700 dark:!text-gray-300 px-2 py-2">
                    #
                  </th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr
                    key={`${field.id}`}
                    className="
                      border-b border-gray-100 dark:!border-gray-700
                      hover:bg-gray-50/50 dark:hover:!bg-gray-700/30
                      transition-colors duration-150
                    "
                  >
                    <td className="text-center text-xs text-gray-600 dark:!text-gray-400 px-2 py-1.5">
                      {index + 1}
                    </td>
                    <td className="px-2 py-1.5">
                      <SimpleInput
                        {...register(
                          `items.${nestIndex}.items.${subIndex}.items.${index}.tuitionId`,
                        )}
                        readOnly={true}
                        className="d-none"
                      />
                      <SimpleInput
                        {...register(
                          `items.${nestIndex}.items.${subIndex}.items.${index}.tuitionName`,
                        )}
                        readOnly={true}
                        className="text-xs font-semibold"
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <InputNumber
                        {...register(
                          `items.${nestIndex}.items.${subIndex}.items.${index}.requiredAmountF`,
                        )}
                        value={watch(
                          `items.${nestIndex}.items.${subIndex}.items.${index}.requiredAmountF`,
                        )}
                        onKeyPress={preventSubmitting}
                        onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                        onValueChange={(val: any) => {
                          setValue(
                            `items.${nestIndex}.items.${subIndex}.items.${index}.requiredAmountF`,
                            val.formattedValue,
                          )
                          setValue(
                            `items.${nestIndex}.items.${subIndex}.items.${index}.requiredAmount`,
                            val.value,
                          )
                        }}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <DatePicker
                        name={`items.${nestIndex}.items.${subIndex}.items.${index}.dueDate`}
                        label={''}
                        className="mb-0"
                        control={control}
                        onKeyPress={preventSubmitting}
                        onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                        showIcon={false}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <InputNumber
                        label={undefined}
                        {...register(
                          `items.${nestIndex}.items.${subIndex}.items.${index}.lateFee`,
                        )}
                        value={watch(
                          `items.${nestIndex}.items.${subIndex}.items.${index}.lateFee`,
                        )}
                        readOnly={false}
                        onKeyPress={preventSubmitting}
                        onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <SimpleInput
                        {...register(
                          `items.${nestIndex}.items.${subIndex}.items.${index}.gracePeriodDays`,
                        )}
                        readOnly={false}
                        onKeyPress={preventSubmitting}
                        onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                        className="text-xs"
                      />
                    </td>
                    <td className="text-center px-2 py-1.5">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="
                          inline-flex items-center justify-center
                          w-6 h-6 rounded
                          text-red-500 hover:text-red-700
                          hover:bg-red-50 dark:hover:!bg-red-900/20
                          transition-colors duration-150
                          cursor-pointer
                        "
                        title={t('label-delete') || 'Supprimer'}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      ) : (
        <div
          className="
            border border-gray-200 dark:!border-gray-700
            rounded-lg
            bg-gray-50/50 dark:!bg-gray-800/50
            p-1
            text-center
          "
        >
          <div className="flex flex-col items-center justify-center">
            <div
              className="
                w-12 h-12 rounded-full
                bg-purple-100 dark:!bg-purple-900/40
                flex items-center justify-center
                mb-1
              "
            >
              <FileText
                size={20}
                className="text-purple-600 dark:!text-purple-400"
              />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:!text-gray-400 mb-0.5">
              {t('label-noData') || 'Aucune donnée'}
            </p>
            <p className="text-xs text-gray-500 dark:!text-gray-500">
              {t('label-addSchoolFeeHint') ||
                'Utilisez le champ ci-dessus pour ajouter une frais de scolarité'}
            </p>
          </div>
        </div>
      )}
      <span ref={bottomTableRef} />

      {/* Compact Table Styles */}
      <style>{`
        .table-compact th,
        .table-compact td {
          padding: 0.375rem 0.5rem !important;
          font-size: 0.8125rem !important;
          vertical-align: middle !important;
        }
        .table-compact thead th {
          padding: 0.5rem 0.5rem !important;
          font-size: 0.75rem !important;
          font-weight: 600 !important;
        }
        .table-compact .form-control,
        .table-compact input {
          padding: 0.25rem 0.5rem !important;
          font-size: 0.8125rem !important;
          height: auto !important;
          min-height: 28px !important;
        }
        .table-compact tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.02) !important;
        }
        .dark-layout .table-compact tbody tr:hover {
          background-color: rgba(255, 255, 255, 0.03) !important;
        }
      `}</style>
    </div>
  )
}

export default FSItemItemForm
