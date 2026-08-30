import { useState, useEffect, useMemo } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form } from 'reactstrap'
import { Layers, Save, ChevronDown } from 'lucide-react'
import Button from '@/@core/components/button'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import type {
  FeeStructureItemItem,
  FeeStructureType,
} from './fee.structure.type'
import FSItemForm from './FSItemForm'
import { useAuthentication } from '@/hooks/useAuthentication'
import dayjs from 'dayjs'
import { FormContainer } from '@/views/school/configuration/config-form-helper'

interface FormValues {
  items: FeeStructureType[]
}

interface CompetenceFormProps extends BaseFormProps {
  fees: FeeStructureType[]
  levelId: number
}

const FeeStructureForm: FC<CompetenceFormProps> = ({
  fees,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { control, handleSubmit, register, getValues, watch, setValue } =
    useForm<FormValues>({
      defaultValues: {
        items: fees,
      },
    })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    //formatting items
    const items = values.items
      .filter((item) => itemValid(item))
      .map((item) => {
        return {
          feeGroupId: Number(item.feeGroupId),
          feeGroupName: item.feeGroupName,
          schoolId: enterpriseId,
          items: item.items
            .filter(
              ({ installmentId, items }) =>
                installmentId && subItemValid(items),
            )
            .map((i) => ({
              installmentId: i.installmentId,
              installmentName: i.installmentName,
              items: i.items
                .filter(
                  ({ tuitionId, requiredAmount }) =>
                    tuitionId && requiredAmount,
                )
                .map((i) => ({
                  tuitionId: Number(i.tuitionId),
                  tuitionName: i.tuitionName,
                  requiredAmount: Number(i.requiredAmount),
                  lateFee: i.lateFee ? Number(i.lateFee) : null,
                  dueDate: dayjs(i.dueDate).isValid()
                    ? dayjs(i.dueDate).format(INPUT_DATE_FORMAT)
                    : null,
                  gracePeriodDays: i.gracePeriodDays
                    ? Number(i.gracePeriodDays)
                    : null,
                })),
            })),
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }
    //console.log(items);

    action({
      variables: {
        form: items,
        levelId: Number(props.levelId),
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Structure des frais de scolarité enregistrée`, {
          ...TOAST_OPTIONS,
        })
        messageService.sendMessage('expectedCompetence', true)
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer la structure des frais de scolarité : ${formatError(
            error,
          )}`,
        )
      })
  }

  const itemValid = (item: FeeStructureType) => {
    const { items } = item
    return (
      items.filter(
        ({ installmentId, items }) => installmentId && subItemValid(items),
      ).length > 0
    )
  }

  const subItemValid = (items: FeeStructureItemItem[]) => {
    return (
      items.filter(
        ({ tuitionId, requiredAmount }) => tuitionId && requiredAmount,
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

  // Calculate total for each fee group
  const groupTotals = useMemo(() => {
    const totals = new Map<number, number>()

    if (!watchedItems || !Array.isArray(watchedItems)) {
      return totals
    }

    watchedItems.forEach((group: any, groupIndex: number) => {
      if (!group || !group.items || !Array.isArray(group.items)) {
        totals.set(groupIndex, 0)
        return
      }

      let groupTotal = 0

      // Sum all installments in the group
      group.items.forEach((installment: any) => {
        if (
          !installment ||
          !installment.items ||
          !Array.isArray(installment.items)
        ) {
          return
        }

        // Sum all tuition items in the installment
        const installmentTotal = installment.items.reduce(
          (acc: number, tuitionItem: any) => {
            if (!tuitionItem || !tuitionItem.requiredAmount) {
              return acc
            }
            const amount = parseFloat(tuitionItem.requiredAmount)
            return acc + (isNaN(amount) ? 0 : amount)
          },
          0,
        )

        groupTotal += installmentTotal
      })

      totals.set(groupIndex, groupTotal)
    })

    return totals
  }, [watchedItems])

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

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormContainer>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {fields.map((field, index) => {
            const isOpen = openAccordions.has(field.id)
            const groupTotal = groupTotals.get(index) || 0
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
                {/* Fee Group Header - Clickable */}
                <div
                  onClick={() => toggleAccordion(field.id)}
                  className="
                    flex items-center gap-2
                    px-3 py-2
                    bg-gradient-to-r from-purple-50 to-indigo-50
                    dark:!from-purple-900/20 dark:!to-indigo-900/20
                    border-b border-gray-200 dark:!border-gray-700
                    cursor-pointer
                    transition-colors duration-150
                    hover:from-purple-100 hover:to-indigo-100
                    dark:hover:from-purple-900/30 dark:hover:to-indigo-900/30
                  "
                >
                  <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-purple-100 dark:!bg-purple-900/40">
                    <Layers
                      size={14}
                      className="text-purple-600 dark:!text-purple-400"
                    />
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:!text-gray-100 flex-1">
                    {field.feeGroupName}
                  </span>
                  <span className="text-xs font-semibold text-purple-600 dark:!text-purple-400 mr-1">
                    {groupTotal.toLocaleString()} FCFA
                  </span>
                  <span className="text-xs text-gray-500 dark:!text-gray-400">
                    #{index + 1}
                  </span>
                  <div
                    className={`
                      ml-2 transition-transform duration-300
                      ${isOpen ? 'rotate-180' : ''}
                    `}
                  >
                    <ChevronDown
                      size={18}
                      className="text-gray-600 dark:!text-gray-400"
                    />
                  </div>
                </div>

                {/* Installment Items - Collapsible */}
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
                    <FSItemForm
                      nestIndex={index}
                      getValues={getValues}
                      {...{ control, register, watch }}
                      setValue={setValue}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Layers size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Aucun groupe de frais disponible</p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end mt-4 mb-4">
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

export default FeeStructureForm
