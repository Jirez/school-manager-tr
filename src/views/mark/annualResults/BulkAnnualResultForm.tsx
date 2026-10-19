import LiveView from '@/utils/LiveView'
import {
  branchOptions,
  classOptions,
  decisionOptions,
} from '@/utils/select/selectComponents'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useTranslation } from 'react-i18next'
import { Form, Table, Input as BaseInput } from 'reactstrap'
import { useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  CouncilDecisionCreatedDocument,
  useBranchesBySchoolYearQuery,
  useClassesBySchoolYearQuery,
  useCouncilDecisionsQuery,
} from '@/gql/graphql'
import {
  Gavel,
  ArrowRight,
  GraduationCap,
  FileText,
  Users,
  Hash,
} from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { TypeBadge } from '@/@core/components/ui/table/table.style'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { z } from 'zod'
import { optionalString, requiredSelect } from '#/utils/zod.helpers'

interface AnnualResult {
  average: number
  birthDate: string
  branchName: string
  className: string
  decision: string
  gender: string
  levelName: string
  newBranch: string | null
  newClass: string | null
  numberOrder: number
  studentId: number
  studentName: string
  observation?: string
  checkbox: boolean
}

interface BulkAnnualResultFormProps extends BaseFormProps {
  annualResults: AnnualResult[]
  nextSchoolYearId?: number
  currentSchoolYearId: number
}

const bulkAnnualResultItemSchema = z
  .object({
    studentId: z.number(),
    checkbox: z.boolean().optional().default(false),
    observation: z.string().optional().nullable(),
  })
  .passthrough()

const bulkAnnualResultSchema = z.object({
  councilDecisionId: requiredSelect(),
  nextBranchId: z.any().optional().nullable(),
  nextClassId: z.any().optional().nullable(),
  observation: optionalString(),
  items: z.array(bulkAnnualResultItemSchema),
})

type BulkAnnualResultSchemaType = z.infer<typeof bulkAnnualResultSchema>

const BulkAnnualResultForm: React.FC<BulkAnnualResultFormProps> = ({
  annualResults,
  nextSchoolYearId,
  currentSchoolYearId,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const checkAllRef = useRef<HTMLInputElement>(null)

  const { data, loading, subscribeToMore } = useCouncilDecisionsQuery({
    variables: { id: enterpriseId },
  })

  const { data: dataClassesBySchoolYear } = useClassesBySchoolYearQuery({
    variables: { id: Number(nextSchoolYearId) },
    skip: !nextSchoolYearId,
  })

  const { data: dataBranchesBySchoolYear } = useBranchesBySchoolYearQuery({
    variables: { id: Number(nextSchoolYearId) },
    skip: !nextSchoolYearId,
  })

  const {
    handleSubmit,
    AppField,
    AppForm,
    SubmitButton,
    setFieldValue,
    getFieldValue,
    store,
  } = useAppForm({
    defaultValues: {
      observation: '',
      nextClassId: null,
      nextBranchId: null,
      councilDecisionId: null,
      items: annualResults.map((item) => ({
        ...item,
        checkbox: Boolean((item as any).checkbox),
      })),
    } as any,
    validators: {
      // @ts-ignore desc
      onChange: bulkAnnualResultSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value }) {
      const values = bulkAnnualResultSchema.parse(value)

      const items = values.items
        .filter((item: any) => itemValid(item))
        .map((item: any) => {
          return {
            studentId: Number(item.studentId),
            observation: item.observation ? item.observation : null,
          }
        })

      if (items.length === 0) {
        toast.error('Données invalides, rien à enregistrer')
        return
      }

      action({
        variables: {
          anForm: {
            items: items,
            currentSchoolYearId: Number(currentSchoolYearId),
            nextSchoolYearId: Number(nextSchoolYearId),
            councilDecisionId: values.councilDecisionId
              ? Number(values.councilDecisionId.id)
              : null,
            nextClassId: values.nextClassId
              ? Number(values.nextClassId.id)
              : null,
            nextBranchId: values.nextBranchId
              ? Number(values.nextBranchId.id)
              : null,
            observation: values.observation ? values.observation : null,
          },
        },
      })
        .then(async () => {
          toast.success(`Résultats annuel enregistrés`, {
            ...TOAST_OPTIONS,
          })
          messageService.sendMessage('annualResults', true)
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer les résultats annuels : ${formatError(
              error,
            )}`,
          )
        })
    },
  })

  const items = useSelector(store, (state) => state.values.items)
  const selectedCount = items.filter((i: any) => i.checkbox).length || 0
  const allChecked = items.length > 0 && items.every((i: any) => i.checkbox)
  const someChecked = items.some((i: any) => i.checkbox) || false

  useEffect(() => {
    if (checkAllRef.current) {
      checkAllRef.current.indeterminate = !allChecked && someChecked
    }
  }, [allChecked, someChecked])

  const itemValid = (item: any) => {
    const { checkbox, studentId } = item
    return checkbox && studentId
  }

  const onCheckAllChange = (e: any) => {
    const checked = e.target.checked
    const current = getFieldValue('items') as any[]
    setFieldValue(
      'items',
      current.map((item) => ({ ...item, checkbox: checked })),
    )
  }

  const getDecisionBadge = (decision: string) => {
    let $color:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'danger'
      | 'warning'
      | 'info' = 'primary'
    if (decision === 'ADMISSIBLE') $color = 'success'
    else if (decision === 'REPEAT') $color = 'warning'
    else if (decision === 'EXCLUDED') $color = 'danger'
    return (
      <TypeBadge $color={$color} className="!py-0 !px-2">
        {decision}
      </TypeBadge>
    )
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className="space-y-6"
    >
      <FormSection
        icon={<Gavel className="w-5 h-5" />}
        title={t('label-councilDecision') || 'Décision du conseil'}
        description="Paramètres de passage à l'année prochaine"
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <LiveView
            document={CouncilDecisionCreatedDocument}
            singleVar="councilDecision"
            data={data}
            listVar="councilDecisions"
            subscribeToMore={subscribeToMore}
            sortField="code"
            triggerUpdate={true}
            enterpriseId={enterpriseId}
          >
            {({ councilDecisions }) => (
              <AppField
                name="councilDecisionId"
                children={(field) => (
                  <field.ControlledSelect
                    label={t('label-councilDecision')}
                    required
                    isLoading={loading}
                    onChange={(val) =>
                      setFieldValue('councilDecisionId', val)
                    }
                    options={councilDecisions || undefined}
                    getOptionLabel={(option: any) => option.name}
                    getOptionValue={(option: any) => option.id}
                    optionLabel="name"
                    components={{ Option: decisionOptions }}
                    prepend={<Gavel size={16} />}
                  />
                )}
              />
            )}
          </LiveView>

          <AppField
            name="nextBranchId"
            children={(field) => (
              <field.ControlledSelect
                label={t('label-nextBranch')}
                onChange={(val) => setFieldValue('nextBranchId', val)}
                options={
                  dataBranchesBySchoolYear
                    ? dataBranchesBySchoolYear.branches
                    : undefined
                }
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                optionLabel="name"
                components={{ Option: branchOptions }}
                prepend={<ArrowRight size={16} />}
              />
            )}
          />

          <AppField
            name="nextClassId"
            children={(field) => (
              <field.ControlledSelect
                label={t('label-nextClass')}
                onChange={(val) => setFieldValue('nextClassId', val)}
                options={
                  dataClassesBySchoolYear
                    ? dataClassesBySchoolYear.clazzes
                    : undefined
                }
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                optionLabel="name"
                components={{ Option: classOptions }}
                prepend={<GraduationCap size={16} />}
              />
            )}
          />

          <AppField
            name="observation"
            children={(field) => (
              <field.Input
                label={t('label-observation')}
                prepend={<FileText size={16} />}
              />
            )}
          />
        </div>
      </FormSection>

      <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
        <Table className="tableFixHead w-full" style={{ zIndex: 10 }}>
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="!py-2 !px-2 text-center" style={{ width: '50px' }}>
                <div className="flex items-center justify-center gap-1">
                  <Hash size={14} />#
                </div>
              </th>
              <th className="!py-2 !px-2 text-center" style={{ width: '40px' }}>
                <BaseInput
                  type="checkbox"
                  innerRef={checkAllRef}
                  onChange={onCheckAllChange}
                  checked={allChecked}
                  className="mx-auto"
                />
              </th>
              <th className="!py-2 !px-2">
                <div className="flex items-center gap-1">
                  <Users size={14} className="text-primary" />
                  {t('label-names')}
                  {selectedCount > 0 && (
                    <span className="badge badge-primary bg-danger rounded-full ml-1">
                      {selectedCount}
                    </span>
                  )}
                </div>
              </th>
              <th className="!py-2 !px-2 text-center" style={{ width: '80px' }}>
                <div className="flex items-center justify-center gap-1">
                  <Hash size={14} />
                  {t('label-average')}
                </div>
              </th>
              <th className="!py-2 !px-2" style={{ width: '150px' }}>
                <div className="flex items-center gap-1">
                  <FileText size={14} />
                  {t('label-observation')}
                </div>
              </th>
              <th className="!py-2 !px-2" style={{ width: '120px' }}>
                <div className="flex items-center gap-1">
                  <GraduationCap size={14} />
                  Ancienne classe
                </div>
              </th>
              <th
                className="!py-2 !px-2 text-center"
                style={{ width: '100px' }}
              >
                <div className="flex items-center justify-center gap-1">
                  <Gavel size={14} />
                  Décision
                </div>
              </th>
              <th className="!py-2 !px-2" style={{ width: '120px' }}>
                <div className="flex items-center gap-1">
                  <ArrowRight size={14} />
                  Nouvelle série
                </div>
              </th>
              <th className="!py-2 !px-2" style={{ width: '120px' }}>
                <div className="flex items-center gap-1">
                  <GraduationCap size={14} />
                  Nouvelle classe
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            <AppField name="items" mode="array">
              {(fieldArray) => (
                <>
                  {fieldArray.state.value.map((item: any, index: number) => (
                    <tr
                      key={item.studentId ?? index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="!py-1 !px-2 text-center text-gray-500">
                        {index + 1}
                      </td>

                      <td className="!py-1 !px-2 text-center">
                        <AppField name={`items[${index}].checkbox`}>
                          {(field) => (
                            <BaseInput
                              type="checkbox"
                              checked={!!field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.checked)
                              }
                              onBlur={field.handleBlur}
                              className="mx-auto"
                            />
                          )}
                        </AppField>
                      </td>

                      <td
                        className="!py-1 !px-2 font-medium"
                        title={item.studentName}
                      >
                        {item.studentName}
                      </td>

                      <td className="!py-1 !px-2 text-center">
                        <span className="font-semibold text-primary">
                          {item.average != null
                            ? Math.floor(item.average * 100) / 100
                            : '-'}
                        </span>
                      </td>

                      <td className="!py-1 !px-2 text-sm text-gray-500 truncate max-w-[150px]">
                        {item.observation || '-'}
                      </td>

                      <td className="!py-1 !px-2 text-sm">
                        {item.className}
                      </td>

                      <td className="!py-1 !px-2 text-center">
                        {getDecisionBadge(item.decision)}
                      </td>

                      <td className="!py-1 !px-2 text-sm text-gray-500">
                        {item.newBranch || '-'}
                      </td>

                      <td className="!py-1 !px-2 text-sm text-gray-500">
                        {item.newClass || '-'}
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </AppField>
          </tbody>
        </Table>
      </div>

      <StickyActions>
        <AppForm>
          <SubmitButton
            isSubmitting={props.loading}
            popover={props.popover}
            onSubmit={(_, meta) => handleSubmit(meta)}
          />
        </AppForm>
      </StickyActions>
    </Form>
  )
}

export default BulkAnnualResultForm
