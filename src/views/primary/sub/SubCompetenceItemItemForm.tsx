import SimpleInput from '@/@core/components/ui/simple-input'
import EvalTypeAutocompleteHint from '@/utils/EvalTypeAutocompleteHint'
import { handleFocusAndScroll, preventSubmitting } from '@/utils/helpers'
import { useDebounceFn, useEventEmitter } from 'ahooks'
import { useRef } from 'react'
import { Trash2, Award, ClipboardList, Hash } from 'lucide-react'
import { useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface SubCompetenceItemFormProps {
  nestIndex: number
  subIndex: number
  control: any
  register: any
  getValues: any
}

const SubCompetenceItemItemForm = ({
  nestIndex,
  subIndex,
  control,
  register,
  getValues,
}: SubCompetenceItemFormProps) => {
  const { t } = useTranslation()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${nestIndex}.items.${subIndex}.items`,
  })

  const bottomTableRef = useRef<HTMLSpanElement>(null)

  const focus$ = useEventEmitter()

  const { run: focusMarksField } = useDebounceFn(
    () => {
      const keys = getValues(`items.${nestIndex}.items.${subIndex}.items`)
      const input = document.getElementById(
        `items.${nestIndex}.items.${subIndex}.items.${keys.length - 1}.marks`,
      )
      input?.focus()
      //bottomTableRef.current?.scrollIntoView(false);
    },
    {
      wait: 550,
    },
  )

  const onEvalTypeFill = (selectedRow: any) => {
    const sb = {
      evalTypeName: selectedRow.name,
      evalTypeId: selectedRow.id,
      marks: null,
    }

    append(sb)
    focusMarksField()
  }

  return (
    <div className="space-y-2">
      {/* Header with Autocomplete */}
      <div
        className="
          flex items-center gap-3
          px-2 py-1
          bg-gradient-to-r from-orange-50 to-orange-100/60
          dark:!from-gray-800 dark:!to-gray-800/60
          rounded-lg
          border border-orange-100 dark:!border-gray-600
        "
      >
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-orange-200 dark:!bg-orange-900/40 flex items-center justify-center shadow-sm">
            <ClipboardList
              size={14}
              className="text-orange-700 dark:!text-orange-300"
            />
          </div>
          <span className="text-sm font-semibold text-orange-800 dark:!text-orange-300 hidden sm:inline">
            {t('label-evaluations') || "Types d'évaluation"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <EvalTypeAutocompleteHint onFill={onEvalTypeFill} focus$={focus$} />
        </div>
      </div>

      {/* Eval Type Items */}
      {fields.length === 0 ? (
        <div
          className="
            flex flex-col items-center justify-center
            py-5
            text-orange-500 dark:text-orange-400
            bg-orange-50/50 dark:bg-gray-800/50
            rounded-lg
            border-2 border-dashed border-orange-200 dark:border-gray-600
          "
        >
          <Award
            size={24}
            className="mb-1.5 text-orange-300 dark:text-gray-600"
          />
          <span className="text-sm font-medium">
            {t('label-noEvalTypesYet') || "Aucun type d'évaluation ajouté"}
          </span>
          <span className="text-xs mt-0.5 text-orange-400 dark:text-gray-500">
            {t('label-useSearchAbove') ||
              'Utilisez la recherche ci-dessus pour ajouter'}
          </span>
        </div>
      ) : (
        <div className="space-y-0 rounded-lg overflow-hidden border border-orange-100 dark:!border-gray-600">
          {/* Column Headers */}
          <div
            className="
              flex items-center gap-2
              px-2 py-0.5
              bg-orange-50 dark:!bg-gray-800
              border-b border-orange-100 dark:!border-gray-600
              text-xs font-semibold uppercase tracking-wider text-orange-600/80 dark:!text-orange-400/70
            "
          >
            <div className="w-7 flex-shrink-0 text-center">#</div>
            <div className="flex-1 flex items-center gap-1">
              <Award size={10} />
              {t('label-evalType') || t('label-name')}
            </div>
            <div className="w-20 text-center flex items-center justify-center gap-1">
              <Hash size={10} />
              {t('label-marks')}
            </div>
            <div className="w-7 flex-shrink-0 text-center">#</div>
          </div>

          {/* Rows */}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className={`
                flex items-center gap-2
                px-2 py-[4px]
                group
                transition-all duration-200
                hover:bg-orange-50/80 dark:hover:!bg-gray-700/50
                ${
                  index < fields.length - 1
                    ? 'border-b border-orange-50 dark:!border-gray-700'
                    : ''
                }
              `}
            >
              {/* Row Number */}
              <div
                className="
                  w-7 h-7
                  rounded-full
                  bg-gradient-to-br from-orange-100 to-orange-200
                  dark:!from-orange-900/30 dark:!to-orange-800/20
                  flex items-center justify-center
                  flex-shrink-0
                  text-xs font-bold text-orange-700 dark:!text-orange-300
                  shadow-sm
                  group-hover:from-orange-200 group-hover:to-orange-300
                  dark:group-hover:!from-orange-900/50 dark:group-hover:!to-orange-800/40
                  transition-all duration-200
                "
              >
                {index + 1}
              </div>

              {/* Hidden ID */}
              <SimpleInput
                {...register(
                  `items.${nestIndex}.items.${subIndex}.items.${index}.id`,
                )}
                readOnly={true}
                className="d-none"
              />

              {/* Eval Type Name */}
              <div className="flex-1 min-w-0">
                <SimpleInput
                  {...register(
                    `items.${nestIndex}.items.${subIndex}.items.${index}.evalTypeName`,
                  )}
                  readOnly={true}
                  className="
                    w-full text-sm font-medium
                    bg-white dark:!bg-gray-700/60
                    border border-gray-200 dark:!border-gray-600
                    rounded-md
                    text-gray-800 dark:!text-gray-200
                    cursor-default
                  "
                />
              </div>

              {/* Marks */}
              <div className="w-20 flex-shrink-0">
                <SimpleInput
                  {...register(
                    `items.${nestIndex}.items.${subIndex}.items.${index}.marks`,
                  )}
                  id={`items.${nestIndex}.items.${subIndex}.items.${index}.marks`}
                  type="number"
                  readOnly={false}
                  onKeyPress={preventSubmitting}
                  onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                  className="
                    w-full text-center text-sm font-bold
                    bg-white dark:!bg-gray-700/60
                    border border-gray-200 dark:!border-gray-600
                    rounded-md
                    focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                    text-gray-900 dark:!text-gray-100
                    placeholder:text-gray-400
                  "
                  placeholder="0"
                />
              </div>

              {/* Delete */}
              <div className="w-7 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="
                    w-7 h-7
                    flex items-center justify-center
                    text-red-400
                    hover:text-red-600 hover:bg-red-50
                    dark:hover:!bg-red-900/30 dark:hover:!text-red-400
                    rounded-md
                    transition-all duration-200
                  "
                  title={t('label-delete')}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <span ref={bottomTableRef} />
    </div>
  )
}

export default SubCompetenceItemItemForm
