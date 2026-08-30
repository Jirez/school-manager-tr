import type { FC } from 'react'
import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import {
  Award,
  Save,
  ChevronDown,
  Target,
  Layers,
  Hash,
  ChevronsUpDown,
} from 'lucide-react'
import Button from '@/@core/components/button'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import type {
  SubCompetenceType,
  SubCompetenceItemItem,
} from './sub.competence.type'
import SubCompetenceItemForm from './SubCompetenceItemForm'
import { FormContainer } from '@/views/school/configuration/config-form-helper'

interface FormValues {
  items: SubCompetenceType[]
}

interface CompetenceFormProps extends BaseFormProps {
  competences: SubCompetenceType[]
  levelId: number
}

const SubCompetenceForm: FC<CompetenceFormProps> = ({
  competences,
  action,
  ...props
}) => {
  const { t } = useTranslation()

  const { control, handleSubmit, register, getValues } = useForm<FormValues>({
    defaultValues: {
      items: competences,
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const items = values.items
      .filter((item) => itemValid(item))
      .map((item) => {
        return {
          competenceId: Number(item.competenceId),
          competenceName: item.competenceName,
          schoolId: item.schoolId,
          items: item.items
            .filter(
              ({ name, code, items }) => name && code && subItemValid(items),
            )
            .map((i) => ({
              code: i.code,
              name: i.name,
              active: i.active,
              optional: i.optional,
              subCompetenceId: i.subCompetenceId || null,
              items: i.items
                .filter(({ evalTypeId, marks }) => evalTypeId && marks)
                .map((i) => ({
                  evalTypeId: Number(i.evalTypeId),
                  evalTypeName: i.evalTypeName,
                  marks: Number(i.marks),
                  id: i.id || null,
                })),
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
        levelId: Number(props.levelId),
      },
    })
      .then(async ({ data }) => {
        toast.success(
          t('toast-subCompetencesSaved') || 'Sous compétences enregistrées',
          { ...TOAST_OPTIONS },
        )
        messageService.sendMessage('expectedCompetence', true)
      })
      .catch((error) => {
        toast.error(
          t('toast-subCompetencesSaveError', { error: formatError(error) }) ||
            `Impossible d'enregistrer les sous-compétences : ${formatError(error)}`,
        )
      })
  }

  const itemValid = (item: SubCompetenceType) => {
    const { items } = item
    return (
      items.filter(
        ({ name, code, items }) => name && code && subItemValid(items),
      ).length > 0
    )
  }

  const subItemValid = (items: SubCompetenceItemItem[]) => {
    return (
      items.filter(({ evalTypeId, marks }) => evalTypeId && marks).length > 0
    )
  }

  const { fields } = useFieldArray({ control, name: 'items' })

  // Watch all items to calculate totals
  const watchedItems = useWatch({
    control,
    name: 'items',
    defaultValue: [],
  })

  // Calculate totals for each competence
  const competenceTotals = useMemo(() => {
    const totals = new Map<
      number,
      { subCount: number; evalCount: number; marks: number }
    >()

    if (!watchedItems || !Array.isArray(watchedItems)) {
      return totals
    }

    watchedItems.forEach((competence: any, competenceIndex: number) => {
      if (
        !competence ||
        !competence.items ||
        !Array.isArray(competence.items)
      ) {
        totals.set(competenceIndex, { subCount: 0, evalCount: 0, marks: 0 })
        return
      }

      let totalMarks = 0
      let evalCount = 0
      let subCount = 0

      competence.items.forEach((subCompetence: any) => {
        if (!subCompetence) return

        if (subCompetence.name && subCompetence.code) {
          subCount++
        }

        if (subCompetence.items && Array.isArray(subCompetence.items)) {
          subCompetence.items.forEach((evalItem: any) => {
            if (evalItem && evalItem.marks) {
              const marks = parseFloat(evalItem.marks)
              if (!isNaN(marks)) {
                totalMarks += marks
                evalCount++
              }
            }
          })
        }
      })

      totals.set(competenceIndex, { subCount, evalCount, marks: totalMarks })
    })

    return totals
  }, [watchedItems])

  // Global summary
  const globalSummary = useMemo(() => {
    let totalSub = 0
    let totalEval = 0
    let totalMarks = 0
    competenceTotals.forEach(({ subCount, evalCount, marks }) => {
      totalSub += subCount
      totalEval += evalCount
      totalMarks += marks
    })
    return { totalSub, totalEval, totalMarks }
  }, [competenceTotals])

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
              mb-1 px-2 py-0.5
              bg-gradient-to-r from-amber-50/80 to-orange-50/80
              dark:!from-gray-800 dark:!to-gray-800/80
              border border-amber-100 dark:!border-gray-700
              rounded-lg
            "
          >
            {/* Summary Stats */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:!text-amber-400 bg-amber-100/80 dark:!bg-amber-900/30 px-2.5 py-0.5 rounded-full">
                <Award size={12} />
                <span className="font-bold">{fields.length}</span>
                {t('label-competences', 'compétences')}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-orange-700 dark:!text-orange-400 bg-orange-100/80 dark:!bg-orange-900/30 px-2.5 py-0.5 rounded-full">
                <Layers size={12} />
                <span className="font-bold">{globalSummary.totalSub}</span>
                {t('label-subCompetences', 'sous-comp.')}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:!text-emerald-400 bg-emerald-100/80 dark:!bg-emerald-900/30 px-2.5 py-0.5 rounded-full">
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
                text-amber-700 dark:!text-amber-300
                bg-white dark:!bg-gray-700
                border border-amber-200 dark:!border-gray-600
                rounded-lg
                hover:bg-amber-50 dark:hover:!bg-gray-600
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
        <div className="grid grid-cols-1 gap-3.5">
          {fields.map((field, index) => {
            const isOpen = openAccordions.has(field.id)
            const stats = competenceTotals.get(index) || {
              subCount: 0,
              evalCount: 0,
              marks: 0,
            }

            return (
              <div
                key={field.id}
                className={`
                  bg-white dark:!bg-gray-800
                  border border-gray-200 dark:!border-gray-700
                  rounded-lg
                  overflow-hidden
                  transition-all duration-200
                  ${isOpen ? 'shadow-md ring-1 ring-amber-200/50 dark:!ring-amber-800/30' : 'hover:shadow-sm'}
                `}
              >
                {/* Competence Header - Clickable */}
                <div
                  onClick={() => toggleAccordion(field.id)}
                  className={`
                    flex items-center gap-1
                    px-2 py-1
                    cursor-pointer
                    transition-all duration-200
                    ${
                      isOpen
                        ? 'bg-gradient-to-r from-amber-100/80 to-orange-100/60 dark:!from-amber-900/25 dark:!to-orange-900/20 border-b border-amber-200 dark:!border-gray-700'
                        : 'bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:!from-gray-800 dark:!to-gray-800 hover:from-amber-100/50 hover:to-orange-100/50 dark:hover:!from-gray-750 dark:hover:!to-gray-750'
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
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200 dark:!shadow-amber-900/40'
                          : 'bg-amber-100 dark:!bg-amber-900/30 text-amber-700 dark:!text-amber-400'
                      }
                    `}
                  >
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <span
                    title={field.competenceName}
                    className="text-base font-semibold truncate text-gray-900 dark:!text-gray-100 flex-1"
                  >
                    {field.competenceName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-amber-100 dark:!bg-amber-900/40 text-amber-700 dark:!text-amber-300 px-2 py-0.5 rounded-full font-medium">
                      {stats.subCount} {t('label-subCompetences').toLowerCase()}
                    </span>
                    <span className="text-xs bg-orange-100 dark:!bg-orange-900/40 text-orange-700 dark:!text-orange-300 px-2 py-0.5 rounded-full font-medium">
                      {stats.evalCount}{' '}
                      {t('label-evaluations') || 'évaluations'}
                    </span>
                    {stats.marks > 0 && (
                      <span
                        className="
                          inline-flex items-center gap-1
                          text-[11px] font-bold
                          px-2 py-0.5 rounded-full
                          bg-emerald-100/80 text-emerald-700
                          dark:!bg-emerald-900/30 dark:!text-emerald-400
                        "
                      >
                        <Hash size={10} />
                        {stats.marks}
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
                          ? 'bg-amber-200 dark:!bg-amber-800/40 rotate-180'
                          : 'bg-gray-100 dark:!bg-gray-700'
                      }
                    `}
                  >
                    <ChevronDown
                      size={16}
                      className={`
                        transition-colors duration-200
                        ${isOpen ? 'text-amber-700 dark:!text-amber-300' : 'text-gray-500 dark:!text-gray-400'}
                      `}
                    />
                  </div>
                </div>

                {/* Sub-Competence Items - Collapsible */}
                <div
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      isOpen
                        ? 'max-h-[10000px] opacity-100'
                        : 'max-h-0 opacity-0'
                    }
                  `}
                >
                  <div className="p-2">
                    <SubCompetenceItemForm
                      nestIndex={index}
                      getValues={getValues}
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
              bg-amber-50/30 dark:bg-gray-800/50
              border-2 border-dashed border-amber-200 dark:border-gray-600
              rounded-xl
            "
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:!from-amber-900/30 dark:!to-orange-900/20 flex items-center justify-center mb-3 shadow-sm">
              <Target
                size={28}
                className="text-amber-500 dark:!text-amber-400"
              />
            </div>
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
              {t(
                'label-noSubCompetencesAvailable',
                'Aucune compétence disponible',
              )}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {t(
                'label-noSubCompetencesHint',
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
            mt-2 -mx-2 px-2 py-0
            backdrop-blur-sm
            rounded-b-xl
          "
        >
          <Button
            loading={props.loading}
            color="primary"
            className="round flex gap-0.5 md:!gap-1 text-xs"
          >
            <Save size={15} />
            {t('label-save')}
          </Button>
        </div>
      </FormContainer>
    </Form>
  )
}

export default SubCompetenceForm
