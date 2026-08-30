import { useState, useEffect } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import Button from '@/@core/components/button'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import type { EvalCompType } from './eval.comp.type'
import NestedFieldArray from './NestedFieldArray'
import { BookOpen, Save, ClipboardList, ChevronDown } from 'lucide-react'
import { styled } from 'styled-components'

interface FormValues {
  items: EvalCompType[]
}

interface CompetenceFormProps extends BaseFormProps {
  competences: EvalCompType[]
  classId: number
  period: number
}

const AccordionHeader = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: ${({ $isOpen }) =>
    $isOpen
      ? 'linear-gradient(135deg, rgba(115, 103, 240, 0.08) 0%, rgba(115, 103, 240, 0.05) 100%)'
      : 'rgba(249, 250, 251, 0.8)'};
  border-bottom: 1px solid
    ${({ $isOpen }) =>
      $isOpen ? 'rgba(115, 103, 240, 0.2)' : 'rgba(229, 231, 235, 0.5)'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;

  &:hover {
    background: ${({ $isOpen }) =>
      $isOpen
        ? 'linear-gradient(135deg, rgba(115, 103, 240, 0.1) 0%, rgba(115, 103, 240, 0.07) 100%)'
        : 'rgba(115, 103, 240, 0.04)'};
    border-bottom-color: rgba(115, 103, 240, 0.3);
  }

  .dark-layout & {
    background: ${({ $isOpen }) =>
      $isOpen
        ? 'linear-gradient(135deg, rgba(115, 103, 240, 0.15) 0%, rgba(115, 103, 240, 0.1) 100%)'
        : 'rgba(31, 41, 55, 0.5)'};
    border-bottom-color: ${({ $isOpen }) =>
      $isOpen ? 'rgba(115, 103, 240, 0.3)' : 'rgba(55, 65, 81, 0.5)'};

    &:hover {
      background: ${({ $isOpen }) =>
        $isOpen
          ? 'linear-gradient(135deg, rgba(115, 103, 240, 0.18) 0%, rgba(115, 103, 240, 0.12) 100%)'
          : 'rgba(115, 103, 240, 0.08)'};
    }
  }
`

const ChevronIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(115, 103, 240, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  margin-left: auto;

  svg {
    color: #7367f0;
    transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.2);

    svg {
      color: #a78bfa;
    }
  }
`

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? '5000px' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`

const AccordionContentInner = styled.div`
  padding: 1rem;
`

const EvalCompForm: FC<CompetenceFormProps> = ({
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
          subjectId: Number(item.subjectId),
          classId: Number(item.classId),
          periodId: Number(item.periodId),
          subjectName: item.subjectName,
          items: item.items
            .filter((competence: any) => competence)
            .map((i: any) => ({
              numberOrder: Number(i.numberOrder),
              competence: i.competence,
              active: i.active,
              id: i.id,
            })),
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    action({
      variables: {
        competences: items,
      },
    })
      .then(async ({ data }) => {
        toast.success(`Compétences enregistrées`, { ...TOAST_OPTIONS })
        document.getElementById('displayStudentName')!.innerText = ''
        messageService.sendMessage('expectedCompetence', true)
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer les compétences : ${formatError(error)}`,
        )
      })
  }

  const itemValid = (item: EvalCompType) => {
    const { items } = item
    return items.filter((competence: any) => competence).length > 0
  }

  const { fields } = useFieldArray({ control, name: 'items' })

  // Accordion state - first item open by default
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Set first item as open by default when fields are first populated
    if (fields.length > 0) {
      setOpenAccordions((prev) => {
        // Only set if no accordion is currently open
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

  // Color palette for subject badges
  const subjectColors = [
    { bg: '#7367f0', light: '#7367f022' },
    { bg: '#28c76f', light: '#28c76f22' },
    { bg: '#ff9f43', light: '#ff9f4322' },
    { bg: '#00cfe8', light: '#00cfe822' },
    { bg: '#ea5455', light: '#ea545522' },
  ]

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mb-4">
      {/* Header */}
      {/* <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #28c76f 0%, #48da89 100%)",
            boxShadow: "0 3px 8px rgba(40, 199, 111, 0.3)",
          }}
        >
          <LuClipboardList size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white m-0">
            {t("label-competences") || "Compétences"}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 m-0">
            {t("label-competenceFormDescription") ||
              "Définissez les compétences attendues"}
          </p>
        </div>
      </div> */}

      {/* Subject Competences List */}
      <div className="space-y-2">
        {fields.map((field, index) => {
          const colorIndex = index % subjectColors.length
          const color = subjectColors[colorIndex]
          const isOpen = openAccordions.has(field.id)

          return (
            <div
              key={field.id}
              className="
                bg-white dark:!bg-gray-800
                border border-gray-200 dark:!border-gray-700
                rounded-lg
                overflow-hidden
                transition-all duration-200
                hover:shadow-sm
              "
            >
              {/* Subject Header - Accordion Toggle */}
              <AccordionHeader
                $isOpen={isOpen}
                onClick={() => toggleAccordion(field.id)}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${color.light} 0%, ${color.light} 100%)`,
                  }}
                >
                  <BookOpen size={12} style={{ color: color.bg }} />
                </div>
                <span
                  className="text-sm font-semibold flex-1"
                  style={{ color: color.bg }}
                >
                  {field.subjectName}
                </span>
                <span className="text-xs text-gray-400">#{index + 1}</span>
                <ChevronIcon $isOpen={isOpen}>
                  <ChevronDown size={16} />
                </ChevronIcon>
              </AccordionHeader>

              {/* Competence Items - Accordion Content */}
              <AccordionContent $isOpen={isOpen}>
                <AccordionContentInner>
                  <NestedFieldArray
                    nestIndex={index}
                    control={control}
                    register={register}
                  />
                </AccordionContentInner>
              </AccordionContent>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <ClipboardList size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">
            {t('label-noSubjects') || 'Aucune matière disponible'}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div
        className="
          flex justify-end
          pt-2
          border-t border-gray-200 dark:border-gray-700
        "
      >
        <Button
          loading={props.loading}
          color="primary"
          className="
            flex items-center gap-1.5
            text-sm font-medium
            rounded-lg
          "
          /* style={{
            background: "linear-gradient(135deg, #28c76f 0%, #48da89 100%)",
          }} */
        >
          <Save size={14} />
          {t('label-save')}
        </Button>
      </div>
    </Form>
  )
}

export default EvalCompForm
