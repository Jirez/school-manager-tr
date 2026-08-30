import SimpleInput from '@/@core/components/ui/simple-input'
import { StyledCheckbox } from '@/@core/components/ui/styled-checkbox'
import {
  Plus,
  Trash2,
  Code,
  FileText,
  ToggleLeft,
  Layers,
  Zap,
  ShieldCheck,
} from 'lucide-react'
import { useFieldArray, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import SubCompetenceItemItemForm from './SubCompetenceItemItemForm'

interface SubCompetenceItemFormProps {
  nestIndex: number
  control: any
  register: any
  getValues: any
}

const SubCompetenceItemForm = ({
  nestIndex,
  control,
  register,
  getValues,
}: SubCompetenceItemFormProps) => {
  const { t } = useTranslation()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${nestIndex}.items`,
  })

  return (
    <div className="space-y-2">
      {fields.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500 bg-amber-50/50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-amber-200 dark:border-gray-600">
          <Layers
            size={28}
            className="mb-2 text-amber-300 dark:text-gray-600"
          />
          <span className="text-sm font-medium">
            {t('label-noSubCompetencesYet') || 'Aucune sous-competence ajoutee'}
          </span>
          <span className="text-xs mt-1 text-gray-400 dark:text-gray-500">
            {t('label-clickAddBelow') ||
              'Cliquez sur le bouton ci-dessous pour ajouter'}
          </span>
        </div>
      ) : (
        fields.map((field, index) => (
          <SubCompetenceCard
            key={field.id}
            field={field}
            index={index}
            nestIndex={nestIndex}
            control={control}
            register={register}
            getValues={getValues}
            remove={remove}
            t={t}
          />
        ))
      )}

      {/* Add Button */}
      <button
        type="button"
        className="
          w-full
          flex items-center justify-center gap-1.5
          text-sm font-semibold
          py-1
          text-amber-600 dark:text-amber-400
          bg-amber-50/50 hover:bg-amber-100
          dark:bg-amber-900/10 dark:hover:bg-amber-900/20
          border-2 border-dashed border-amber-300 dark:border-amber-700
          hover:border-solid hover:border-amber-400 dark:hover:border-amber-600
          rounded-lg
          transition-all duration-200
          hover:shadow-sm
          active:scale-[0.99]
        "
        onClick={() =>
          append({
            code: undefined,
            name: undefined,
            active: true,
            optional: false,
            items: [],
          })
        }
      >
        <div className="w-6 h-6 rounded-full bg-amber-200 dark:bg-amber-800/50 flex items-center justify-center">
          <Plus size={14} className="text-amber-700 dark:text-amber-300" />
        </div>
        {t('label-addSubCompetence') || t('label-addLines')}
      </button>
    </div>
  )
}

/* ── Individual sub-competence card (extracted so useWatch can observe per-row) ── */

interface SubCompetenceCardProps {
  field: any
  index: number
  nestIndex: number
  control: any
  register: any
  getValues: any
  remove: (index: number) => void
  t: any
}

const SubCompetenceCard = ({
  field,
  index,
  nestIndex,
  control,
  register,
  getValues,
  remove,
  t,
}: SubCompetenceCardProps) => {
  const isActive = useWatch({
    control,
    name: `items.${nestIndex}.items.${index}.active`,
  })
  const isOptional = useWatch({
    control,
    name: `items.${nestIndex}.items.${index}.optional`,
  })

  return (
    <div
      className="
        bg-white dark:!bg-gray-700/50
        border-2 border-amber-100 dark:!border-gray-600
        rounded-xl
        overflow-hidden
        transition-all duration-200
        hover:shadow-md
        hover:border-amber-300 dark:hover:border-amber-600
        shadow-sm
        group
      "
    >
      {/* Hidden subCompetenceId */}
      <SimpleInput
        {...register(`items.${nestIndex}.items.${index}.subCompetenceId`)}
        readOnly={true}
        className="d-none"
      />

      {/* Card Header */}
      <div
        className="
          flex items-center gap-2
          px-2 py-0.5
          bg-gradient-to-r from-amber-50 to-amber-100/50
          dark:!from-gray-700 dark:!to-gray-700/80
          border-b-2 border-amber-100 dark:!border-gray-600
        "
      >
        <div className="w-7 h-7 rounded-lg bg-amber-200 dark:!bg-amber-900/40 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-xs font-bold text-amber-700 dark:!text-amber-300">
            {index + 1}
          </span>
        </div>
        <span className="flex-1 text-sm font-semibold text-amber-800 dark:!text-amber-300 truncate">
          {t('label-subCompetence')} #{index + 1}
        </span>

        {/* Status Pills */}
        <div className="flex items-center gap-1">
          {isActive && (
            <span className="inline-flex items-center gap-1 px-1 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-100 text-emerald-700 dark:!bg-emerald-900/30 dark:!text-emerald-400">
              <Zap size={9} />
              {t('label-active')}
            </span>
          )}
          {isOptional && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-100 text-blue-700 dark:!bg-blue-900/30 dark:!text-blue-400">
              <ToggleLeft size={9} />
              {t('label-optional')}
            </span>
          )}
        </div>

        {/* Delete Button */}
        <button
          type="button"
          onClick={() => remove(index)}
          className="
            p-1.5
            text-gray-400 hover:text-red-600
            hover:bg-red-50 dark:hover:bg-red-900/30
            rounded-lg
            transition-all duration-200
            opacity-0 group-hover:opacity-100
            focus:opacity-100
          "
          title={t('label-delete')}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Side - Sub-Competence Info */}
        <div className="lg:w-1/3 p-2 border-b-2 lg:border-b-0 lg:border-r-2 border-amber-50 dark:!border-gray-600/50 bg-gray-50/50 dark:!bg-gray-800/30">
          <div className="space-y-2">
            {/* Code */}
            <div>
              <label className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1.5">
                <Code size={12} />
                {t('label-code')}
              </label>
              <SimpleInput
                {...register(`items.${nestIndex}.items.${index}.code`)}
                className="
                  w-full text-sm font-medium
                  bg-white dark:!bg-gray-700
                  border border-gray-200 dark:!border-gray-500
                  rounded-md
                  focus:ring-2 focus:ring-amber-400 focus:border-amber-400
                  placeholder:text-gray-400
                "
                placeholder={t('label-enterCode', 'Code')}
              />
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1.5">
                <FileText size={12} />
                {t('label-name')}
              </label>
              <SimpleInput
                {...register(`items.${nestIndex}.items.${index}.name`)}
                as="textarea"
                rows={2}
                className="
                  w-full text-sm
                  bg-white dark:!bg-gray-700
                  border border-gray-200 dark:!border-gray-500
                  rounded-md
                  focus:ring-2 focus:ring-amber-400 focus:border-amber-400
                  resize-none
                  placeholder:text-gray-400
                "
                placeholder={
                  t('label-subCompetenceName') || 'Nom de la sous-competence'
                }
              />
            </div>

            {/* Toggle Cards — Active & Optional */}
            <div className="space-y-2">
              {/* Active Toggle Card */}
              <label
                className={`
                  flex items-center gap-3 p-2.5 rounded-lg cursor-pointer
                  border transition-all duration-200
                  ${
                    isActive
                      ? 'bg-emerald-50/80 border-emerald-200 shadow-sm dark:!bg-emerald-900/15 dark:!border-emerald-700/40'
                      : 'bg-white border-gray-150 hover:border-gray-300 dark:!bg-gray-700/40 dark:!border-gray-600 dark:hover:!border-gray-500'
                  }
                `}
              >
                <div
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/40'
                        : 'bg-gray-100 text-gray-400 dark:!bg-gray-600 dark:!text-gray-400'
                    }
                  `}
                >
                  <ShieldCheck size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-semibold leading-tight ${isActive ? 'text-emerald-800 dark:!text-emerald-300' : 'text-gray-600 dark:!text-gray-400'}`}
                  >
                    {t('label-active')}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:!text-gray-500 leading-tight mt-0.5">
                    {t(
                      'label-activeDescription',
                      'Activer cette sous-compétence',
                    )}
                  </div>
                </div>
                <StyledCheckbox
                  {...register(`items.${nestIndex}.items.${index}.active`)}
                  activeColorClass="bg-emerald-500 border-emerald-500 hover:bg-emerald-600"
                  checked={isActive}
                />
              </label>

              {/* Optional Toggle Card */}
              <label
                className={`
                  flex items-center gap-3 p-2.5 rounded-lg cursor-pointer
                  border transition-all duration-200
                  ${
                    isOptional
                      ? 'bg-blue-50/80 border-blue-200 shadow-sm dark:!bg-blue-900/15 dark:!border-blue-700/40'
                      : 'bg-white border-gray-150 hover:border-gray-300 dark:!bg-gray-700/40 dark:!border-gray-600 dark:hover:!border-gray-500'
                  }
                `}
              >
                <div
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    transition-all duration-200
                    ${
                      isOptional
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/40'
                        : 'bg-gray-100 text-gray-400 dark:!bg-gray-600 dark:!text-gray-400'
                    }
                  `}
                >
                  <ToggleLeft size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm font-semibold leading-tight ${isOptional ? 'text-blue-800 dark:!text-blue-300' : 'text-gray-600 dark:!text-gray-400'}`}
                  >
                    {t('label-optional')}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:!text-gray-500 leading-tight mt-0.5">
                    {t(
                      'label-optionalDescription',
                      'Rendre cette sous-compétence facultative',
                    )}
                  </div>
                </div>
                <StyledCheckbox
                  {...register(`items.${nestIndex}.items.${index}.optional`)}
                  activeColorClass="bg-blue-500 border-blue-500 hover:bg-blue-600"
                  checked={isOptional}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Side - Eval Types Table */}
        <div className="lg:w-2/3 p-2 bg-white dark:!bg-gray-800/30">
          <SubCompetenceItemItemForm
            nestIndex={nestIndex}
            subIndex={index}
            control={control}
            register={register}
            getValues={getValues}
          />
        </div>
      </div>
    </div>
  )
}

export default SubCompetenceItemForm
