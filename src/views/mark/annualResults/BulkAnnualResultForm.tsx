import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { default as FormItem } from '@/@core/components/ui/forms/input'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import {
  branchOptions,
  classOptions,
  decisionOptions,
} from '@/utils/select/selectComponents'
import SimpleInput from '@/@core/components/ui/simple-input'
import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Table, Input as BaseInput } from 'reactstrap'
import type { Draft } from 'immer'
import { produce } from 'immer'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import Button from '@/@core/components/button'
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
import { TypeBadge } from '@/@core/components/ui/table/table.style'

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

interface FormValues {
  items: AnnualResult[]
  councilDecision: any
  councilDecisionId: any
  nextBranchId: any
  nextClassId: any
  observation?: string
}

const BulkAnnualResultForm: React.FC<BulkAnnualResultFormProps> = ({
  annualResults,
  nextSchoolYearId,
  currentSchoolYearId,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [checkboxes, setCheckboxes] = useState({
    indeterminate: true,
    checkAll: false,
  })

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

  const { control, register, handleSubmit, setValue, getValues, watch } =
    useForm<FormValues>({
      defaultValues: {
        observation: '',
        nextClassId: null,
        nextBranchId: null,
        councilDecisionId: null,
        items: annualResults,
      },
    })

  const { fields } = useFieldArray({ control, name: 'items' })
  const studentList = watch('items')
  const selectedCount = studentList?.filter((i) => i.checkbox).length || 0

  const onSubmit: SubmitHandler<FormValues> = (values) => {
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
      return false
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
      .then(async ({ data }) => {
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
  }

  const itemValid = (item: any) => {
    const { checkbox, studentId } = item
    return checkbox && studentId
  }

  const onCheckAllChange = (e: any) => {
    setCheckboxes({
      indeterminate: false,
      checkAll: e.target.checked,
    })

    const items = getValues('items')
    const updatedItem = produce(items, (draftState: Draft<any>) => {
      for (let i = 0; i < items.length; i++) {
        draftState[i].checkbox = e.target.checked
      }
    })

    setValue('items', updatedItem)
  }

  const getDecisionBadge = (decision: string) => {
    let $color:
      'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' =
      'primary'
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
    <Form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <ControlledSelect
                name="councilDecisionId"
                control={control}
                label={t('label-councilDecision')}
                required
                loading={loading}
                onChange={(val) => setValue('councilDecisionId', val)}
                options={councilDecisions || undefined}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                optionLabel="name"
                components={{ Option: decisionOptions }}
                prepend={<Gavel size={16} />}
              />
            )}
          </LiveView>

          <ControlledSelect
            name="nextBranchId"
            control={control}
            label={t('label-nextBranch')}
            onChange={(val) => setValue('nextBranchId', val)}
            options={
              dataBranchesBySchoolYear
                ? dataBranchesBySchoolYear.branches
                : undefined
            }
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            optionLabel="name"
            components={{ Option: branchOptions }}
            prepend={<ArrowRight size={16} />}
          />

          <ControlledSelect
            name="nextClassId"
            control={control}
            label={t('label-nextClass')}
            onChange={(val) => setValue('nextClassId', val)}
            options={
              dataClassesBySchoolYear
                ? dataClassesBySchoolYear.clazzes
                : undefined
            }
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            optionLabel="name"
            components={{ Option: classOptions }}
            prepend={<GraduationCap size={16} />}
          />

          <FormItem
            name="observation"
            control={control}
            label={t('label-observation')}
            prepend={<FileText size={16} />}
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
                  onChange={onCheckAllChange}
                  checked={checkboxes.checkAll}
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
            {fields.map((field, index) => (
              <tr
                key={field.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="!py-1 !px-2 text-center text-gray-500">
                  {index + 1}
                </td>
                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.studentId`)}
                    readOnly={true}
                  />
                </td>

                <td className="!py-1 !px-2 text-center">
                  <FormItem
                    name={`items.${index}.checkbox`}
                    control={control}
                    type="checkbox"
                    className="mb-0"
                    checked={watch(`items.${index}.checkbox`)}
                  />
                </td>

                <td className="!py-1 !px-2">
                  <SimpleInput
                    {...register(`items.${index}.studentName`)}
                    readOnly={true}
                    title={watch(`items.${index}.studentName`)}
                    className="font-medium"
                  />
                </td>

                <td className="!py-1 !px-2 text-center">
                  <span className="font-semibold text-primary">
                    {Math.floor(field.average * 100) / 100}
                  </span>
                </td>

                <td className="!py-1 !px-2 text-sm text-gray-500 truncate max-w-[150px]">
                  {watch(`items.${index}.observation`) || '-'}
                </td>

                <td className="!py-1 !px-2 text-sm">
                  {watch(`items.${index}.className`)}
                </td>

                <td className="!py-1 !px-2 text-center">
                  {getDecisionBadge(watch(`items.${index}.decision`))}
                </td>

                <td className="!py-1 !px-2 text-sm text-gray-500">
                  {watch(`items.${index}.newBranch`) || '-'}
                </td>

                <td className="!py-1 !px-2 text-sm text-gray-500">
                  {watch(`items.${index}.newClass`) || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button loading={props.loading} color="primary" className="round">
          {t('label-save')}
        </Button>
      </div>
    </Form>
  )
}

export default BulkAnnualResultForm
