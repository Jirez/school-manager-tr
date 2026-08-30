import type { FC } from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import {
  Layers,
  Save,
  ChevronDown,
  Award,
  Hash,
  ChevronsUpDown,
} from 'lucide-react'
import Button from '@/@core/components/button'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import type { CompetenceLevelType } from '../competence.type'
import CompetenceLevelItem from './CompetenceLevelItem'
import SimpleInput from '@/@core/components/ui/simple-input'
import { FormContainer } from '@/views/school/configuration/config-form-helper'

interface FormValues {
  items: CompetenceLevelType[]
}

interface CompetenceFormProps extends BaseFormProps {
  competences: CompetenceLevelType[]
  levelId: number
}

const CompetenceLevelForm: FC<CompetenceFormProps> = ({
  competences,
  action,
  ...props
}) => {
  const { t } = useTranslation()

  const { control, handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      items: competences,
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const items = values.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => {
        return {
          levelId: Number(item.levelId),
          levelName: item.levelName,
          schoolId: item.schoolId,
          items: item.items
            .filter(
              ({ name, numberOrder, marks }: any) =>
                name && numberOrder && marks,
            )
            .map((i: any) => ({
              numberOrder: Number(i.numberOrder),
              name: i.name,
              active: i.active,
              competenceId: i.competenceId || null,
              marks: Number(i.marks),
            })),
        }
      })

    if (items.length === 0) {
      toast.error(
        t('toast-invalidData') || 'Données invalides, rien à enregistrer',
      )
      return
    }

    action({
      variables: {
        competences: items,
      },
    })
      .then(async ({ data }) => {
        toast.success(
          t('toast-competencesSaved') || 'Compétences enregistrées',
          { ...TOAST_OPTIONS },
        )
        messageService.sendMessage('expectedCompetence', true)
      })
      .catch((error) => {
        toast.error(
          t('toast-competencesSaveError', { error: formatError(error) }) ||
            `Impossible d'enregistrer les compétences : ${formatError(error)}`,
        )
      })
  }

  const itemValid = (item: CompetenceLevelType) => {
    const { items } = item
    return (
      items.filter(
        ({ name, numberOrder, marks }) => name && numberOrder && marks,
      ).length > 0
    )
  }

  const { fields } = useFieldArray({ control, name: 'items' })

  // Watch all items to calculate totals
  const watchedItems = useWatch({
    control,
    name: 'items',
    defaultValue: [],
  })

  // Calculate total marks for each level
  const levelTotals = useMemo(() => {
    const totals = new Map<number, { count: number; marks: number }>()

    if (!watchedItems || !Array.isArray(watchedItems)) {
      return totals
    }

    watchedItems.forEach((level: any, levelIndex: number) => {
      if (!level || !level.items || !Array.isArray(level.items)) {
        totals.set(levelIndex, { count: 0, marks: 0 })
        return
      }

      let totalMarks = 0
      let count = 0

      level.items.forEach((competence: any) => {
        if (competence && competence.marks) {
          const marks = parseFloat(competence.marks)
          if (!isNaN(marks)) {
            totalMarks += marks
            count++
          }
        }
      })

      totals.set(levelIndex, { count, marks: totalMarks })
    })

    return totals
  }, [watchedItems])

  // Global summary
  const globalSummary = useMemo(() => {
    let totalComp = 0
    let totalMarks = 0
    levelTotals.forEach(({ count, marks }) => {
      totalComp += count
      totalMarks += marks
    })
    return { totalComp, totalMarks }
  }, [levelTotals])

  // Accordion state - first item open by default
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (fields.length > 0) {
      setOpenAccordions((prev) => {
        if (prev.size === 0) {
          return new Set([fields[0].id])
        }
        return prev
      })
    }
  }, [fields.length])

  const toggleAccordion = (fieldId: string) => {
    setOpenAccordions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(fieldId)) {
        newSet.delete(fieldId)
      } else {
        newSet.add(fieldId)
      }
      return newSet
    })
  }

  const allOpen = fields.length > 0 && openAccordions.size === fields.length

  const toggleAll = () => {
    if (allOpen) {
      setOpenAccordions(new Set())
    } else {
      setOpenAccordions(new Set(fields.map((f) => f.id)))
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormContainer>
        {/* Toolbar */}
        {fields.length > 0 && (
          <div
            className="
              flex flex-wrap items-center justify-between gap-2
              mb-1 px-3 py-1
              bg-gradient-to-r from-emerald-50/80 to-teal-50/80
              dark:!from-gray-800 dark:!to-gray-800/80
              border border-emerald-100 dark:!border-gray-700
              rounded-xl
            "
          >
            {/* Summary Stats */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:!text-emerald-400 bg-emerald-100/80 dark:!bg-emerald-900/30 px-2.5 py-1 rounded-full">
                <Layers size={12} />
                <span className="font-bold">{fields.length}</span>
                {t('label-levels', 'niveaux')}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-teal-700 dark:!text-teal-400 bg-teal-100/80 dark:!bg-teal-900/30 px-2.5 py-1 rounded-full">
                <Award size={12} />
                <span className="font-bold">{globalSummary.totalComp}</span>
                {t('label-competences', 'compétences')}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:!text-amber-400 bg-amber-100/80 dark:!bg-amber-900/30 px-2.5 py-1 rounded-full">
                <Hash size={12} />
                <span className="font-bold">{globalSummary.totalMarks}</span>
                {t('label-totalPoints', 'pts')}
              </div>
            </div>

            {/* Expand/Collapse All */}
            <button
              type="button"
              onClick={toggleAll}
              className="
                flex items-center gap-1.5
                text-xs font-semibold
                px-3 py-1.5
                text-emerald-700 dark:!text-emerald-300
                bg-white dark:!bg-gray-700
                border border-emerald-200 dark:!border-gray-600
                rounded-lg
                hover:bg-emerald-50 dark:hover:!bg-gray-600
                transition-all duration-200
                shadow-sm
              "
            >
              <ChevronsUpDown size={14} />
              {allOpen
                ? t('label-collapseAll', 'Réduire tout')
                : t('label-expandAll', 'Tout déplier')}
            </button>
          </div>
        )}

        {/* Accordion List */}
        <div className="grid grid-cols-1 gap-1.5">
          {fields.map((field, index) => {
            const isOpen = openAccordions.has(field.id)
            const levelStats = levelTotals.get(index) || {
              count: 0,
              marks: 0,
            }

            return (
              <div
                key={field.id}
                className={`
                  bg-white dark:!bg-gray-800
                  border border-gray-200 dark:!border-gray-700
                  rounded-xl
                  overflow-hidden
                  transition-all duration-200
                  ${isOpen ? 'shadow-md ring-1 ring-emerald-200/50 dark:!ring-emerald-800/30' : 'hover:shadow-sm'}
                `}
              >
                {/* Hidden fields */}
                <SimpleInput
                  {...register(`items.${index}.levelId`)}
                  readOnly={true}
                  className="d-none"
                />
                <SimpleInput
                  {...register(`items.${index}.levelName`)}
                  readOnly={true}
                  className="d-none"
                />
                <SimpleInput
                  {...register(`items.${index}.schoolId`)}
                  readOnly={true}
                  className="d-none"
                />

                {/* Level Header - Clickable */}
                <div
                  onClick={() => toggleAccordion(field.id)}
                  className={`
                    flex items-center gap-3
                    px-4 py-1
                    cursor-pointer
                    transition-all duration-200
                    ${
                      isOpen
                        ? 'bg-gradient-to-r from-emerald-100/80 to-teal-100/60 dark:!from-emerald-900/25 dark:!to-teal-900/20 border-b border-emerald-200 dark:!border-gray-700'
                        : 'bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:!from-gray-800 dark:!to-gray-800 hover:from-emerald-100/50 hover:to-teal-100/50'
                    }
                  `}
                >
                  {/* Number Badge */}
                  <div
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      transition-all duration-200
                      ${
                        isOpen
                          ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200 dark:!shadow-emerald-900/40'
                          : 'bg-emerald-100 dark:!bg-emerald-900/30 text-emerald-700 dark:!text-emerald-400'
                      }
                    `}
                  >
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>

                  {/* Level Name */}
                  <span className="text-lg font-semibold text-gray-900 dark:!text-gray-100 flex-1 truncate">
                    {field.levelName}
                  </span>

                  {/* Stats Pills */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs bg-emerald-100 dark:!bg-emerald-900/40 text-emerald-700 dark:!text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                      {levelStats.count} {t('label-competences').toLowerCase()}
                    </span>
                    {levelStats.marks > 0 && (
                      <span
                        className="
                          inline-flex items-center gap-1
                          text-[11px] font-bold
                          px-2 py-0.5 rounded-full
                          bg-amber-100/80 text-amber-700
                          dark:!bg-amber-900/30 dark:!text-amber-400
                        "
                      >
                        <Hash size={10} />
                        {levelStats.marks}
                      </span>
                    )}
                  </div>

                  {/* Chevron */}
                  <div
                    className={`
                      w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                      transition-all duration-300
                      ${
                        isOpen
                          ? 'bg-emerald-200 dark:!bg-emerald-800/40 rotate-180'
                          : 'bg-gray-100 dark:!bg-gray-700'
                      }
                    `}
                  >
                    <ChevronDown
                      size={16}
                      className={`
                        transition-colors duration-200
                        ${isOpen ? 'text-emerald-700 dark:!text-emerald-300' : 'text-gray-500 dark:!text-gray-400'}
                      `}
                    />
                  </div>
                </div>

                {/* Competence Items - Collapsible */}
                <div
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      isOpen
                        ? 'max-h-[5000px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }
                  `}
                >
                  <div className="p-2">
                    <CompetenceLevelItem
                      nestIndex={index}
                      control={control}
                      register={register}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {fields.length === 0 && (
          <div
            className="
              flex flex-col items-center justify-center
              py-12
              bg-emerald-50/30 dark:bg-gray-800/50
              border-2 border-dashed border-emerald-200 dark:border-gray-600
              rounded-xl
            "
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:!from-emerald-900/30 dark:!to-teal-900/20 flex items-center justify-center mb-3 shadow-sm">
              <Award
                size={28}
                className="text-emerald-500 dark:!text-emerald-400"
              />
            </div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t(
                'label-noCompetencesAvailable',
                'Aucune compétence disponible',
              )}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t(
                'label-noCompetencesHint',
                "Aucune compétence n'est configurée pour ce niveau",
              )}
            </p>
          </div>
        )}

        {/* Sticky Save Footer */}
        <div
          className="
            sticky bottom-0
            flex justify-end
            mt-4 -mx-2 px-4 py-1
            bg-white/80 dark:!bg-gray-900/80
            backdrop-blur-sm
            border-t border-gray-200 dark:!border-gray-700
            rounded-b-xl
          "
        >
          <Button
            loading={props.loading}
            color="primary"
            className="round flex gap-0.5 md:!gap-1"
          >
            <Save size={15} />
            {t('label-save')}
          </Button>
        </div>
      </FormContainer>
    </Form>
  )
}

export default CompetenceLevelForm
