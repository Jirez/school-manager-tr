import SimpleInput from '@/@core/components/ui/simple-input'
import { StyledCheckbox } from '@/@core/components/ui/styled-checkbox'
import { Plus, Trash2, Hash, FileText, Award, ShieldCheck } from 'lucide-react'
import { useFieldArray, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

interface CompetenceLevelItemProps {
  nestIndex: number
  control: any
  register: any
}

const CompetenceLevelItem = ({
  nestIndex,
  control,
  register,
}: CompetenceLevelItemProps) => {
  const { t } = useTranslation()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${nestIndex}.items`,
  })

  return (
    <div className="space-y-1">
      {/* Column Headers */}
      {fields.length > 0 && (
        <div className="grid grid-cols-12 gap-2 px-2 pb-1">
          <div className="col-span-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <Hash size={9} />
              {t('label-numberOrder', 'Ordre')}
            </span>
          </div>
          <div className="col-span-7">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <FileText size={9} />
              {t('label-name', 'Nom')}
            </span>
          </div>
          <div className="col-span-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <Award size={9} />
              {t('label-marks', 'Notes')}
            </span>
          </div>
          <div className="col-span-1 text-center">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1">
              <ShieldCheck size={9} />
              {t('label-active', 'Actif')}
            </span>
          </div>
          <div className="col-span-1" />
        </div>
      )}

      {fields.length === 0 ? (
        <div
          className="
            flex flex-col items-center justify-center
            py-6
            bg-gray-50/50 dark:bg-gray-700/20
            border border-dashed border-gray-200 dark:border-gray-600
            rounded-lg
          "
        >
          <Award
            size={24}
            className="text-gray-300 dark:text-gray-600 mb-1.5"
          />
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t('label-noCompetencesYet', 'Aucune compétence ajoutée')}
          </p>
        </div>
      ) : (
        fields.map((field, index) => (
          <CompetenceRow
            key={field.id}
            nestIndex={nestIndex}
            index={index}
            control={control}
            register={register}
            onRemove={() => remove(index)}
          />
        ))
      )}

      {/* Add Button */}
      <button
        type="button"
        className="
          w-full
          flex items-center justify-center gap-1.5
          text-xs font-medium
          py-2 mt-1
          text-emerald-600 dark:!text-emerald-400
          bg-emerald-50/50 dark:!bg-emerald-900/10
          border border-dashed border-emerald-200 dark:!border-emerald-800/40
          rounded-lg
          hover:bg-emerald-100/60 dark:hover:!bg-emerald-900/20
          hover:border-emerald-300 dark:hover:!border-emerald-700/50
          hover:border-solid
          transition-all duration-200
        "
        onClick={() =>
          append({
            numberOrder: undefined,
            name: undefined,
            active: true,
            marks: undefined,
          })
        }
      >
        <Plus size={14} />
        {t('label-addCompetence') || t('label-addLines')}
      </button>
    </div>
  )
}

/** Individual row — isolated for reactive `useWatch` on `active` */
const CompetenceRow = ({
  nestIndex,
  index,
  control,
  register,
  onRemove,
}: {
  nestIndex: number
  index: number
  control: any
  register: any
  onRemove: () => void
}) => {
  const { t } = useTranslation()

  const isActive = useWatch({
    control,
    name: `items.${nestIndex}.items.${index}.active`,
    defaultValue: true,
  })

  return (
    <div
      className={`
        group
        bg-white dark:!bg-gray-700/40
        border rounded-lg
        p-1
        transition-all duration-150
        hover:shadow-sm
        ${
          isActive
            ? 'border-emerald-100 dark:!border-gray-600 hover:border-emerald-300 dark:hover:!border-emerald-700'
            : 'border-gray-200 dark:!border-gray-600 opacity-60 hover:opacity-80'
        }
      `}
    >
      {/* Hidden competenceId */}
      <SimpleInput
        {...register(`items.${nestIndex}.items.${index}.competenceId`)}
        readOnly={true}
        className="d-none"
      />

      <div className="grid grid-cols-12 gap-2 items-center">
        {/* Number Order */}
        <div className="col-span-2">
          <SimpleInput
            {...register(`items.${nestIndex}.items.${index}.numberOrder`)}
            type="number"
            className="
              w-full text-center text-sm
              border border-gray-200 dark:!border-gray-600
              rounded-md
              focus:ring-emerald-500 focus:border-emerald-500
            "
            placeholder="#"
          />
        </div>

        {/* Name */}
        <div className="col-span-7">
          <SimpleInput
            {...register(`items.${nestIndex}.items.${index}.name`)}
            className="
              w-full text-sm
              border border-gray-200 dark:!border-gray-600
              rounded-md
              focus:ring-emerald-500 focus:border-emerald-500
            "
            placeholder={t('label-competenceName') || 'Nom de la compétence'}
          />
        </div>

        {/* Marks */}
        <div className="col-span-1">
          <SimpleInput
            {...register(`items.${nestIndex}.items.${index}.marks`)}
            type="number"
            className="
              w-full text-center text-sm
              border border-gray-200 dark:!border-gray-600
              rounded-md
              focus:ring-emerald-500 focus:border-emerald-500
            "
            placeholder="0"
          />
        </div>

        {/* Active */}
        <div className="col-span-1 flex items-center justify-center">
          <StyledCheckbox
            {...register(`items.${nestIndex}.items.${index}.active`)}
            checked={isActive}
            activeColorClass="bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
          />
        </div>

        {/* Delete */}
        <div className="col-span-1 flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            className="
              w-7 h-7
              flex items-center justify-center
              text-red-400
              hover:text-red-600 hover:bg-red-50
              dark:hover:bg-red-900/20
              rounded-md
              transition-colors duration-150
            "
            title={t('label-delete')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompetenceLevelItem
