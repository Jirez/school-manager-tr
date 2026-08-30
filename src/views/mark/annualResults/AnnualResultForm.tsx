import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Table } from 'reactstrap'

import type { AnnualResultType } from './AnnualResult.type'
import SimpleInput from '@/@core/components/ui/simple-input'
import { concat, round } from '@/utils/helpers'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import Button from '@/@core/components/button'
import { toast } from 'react-toastify'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  useBranchesBySchoolYearQuery,
  useClassesBySchoolYearQuery,
  useCouncilDecisionsQuery,
} from '@/gql/graphql'

interface AnnualResultFormProps extends BaseFormProps {
  nextSchoolYearId?: number
  schoolYearId: number
  classId: number
  annualResults: AnnualResultType[]
}

interface FormValues {
  items: AnnualResultType[]
}

const AnnualResultForm: React.FC<AnnualResultFormProps> = ({
  annualResults,
  nextSchoolYearId,
  schoolYearId,
  classId,
  action,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  const { data, loading } = useCouncilDecisionsQuery({
    variables: { id: enterpriseId },
  })

  const { data: dataClasses } = useClassesBySchoolYearQuery({
    variables: { id: Number(nextSchoolYearId) },
    skip: !nextSchoolYearId,
  })

  const { data: dataBranches } = useBranchesBySchoolYearQuery({
    variables: { id: Number(nextSchoolYearId) },
    skip: !nextSchoolYearId,
  })

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      items: annualResults.map((value) => ({
        ...value,
        councilDecisionId: value.councilDecision,
        classId: value.clazz,
        branchId: value.branch,
      })),
    },
  })

  //console.log(annualResults.map(value => ({ ...value, councilDecisionId: value.councilDecision?.id })))

  const { fields } = useFieldArray({ control, name: 'items' })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    //formatting items
    const items = values.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => {
        const { __typename, ...rest } = item.annualReportPK
        return {
          annualReportPK: {
            ...rest,
            studentId: Number(rest.studentId),
            schoolYearId: Number(rest.schoolYearId),
          },
          observation: item.observation ? item.observation : null,
          councilDecisionId: item.councilDecisionId
            ? Number(item.councilDecisionId.id)
            : null,
          classId: item.classId ? Number(item.classId.id) : null,
          branchId: item.branchId ? Number(item.branchId.id) : null,
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    action({
      variables: {
        results: items,
        classId: Number(classId),
        schoolYearId: Number(schoolYearId),
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success(`Résultats annuels enregistrés`, {
          ...TOAST_OPTIONS,
        })
        document.getElementById('displayStudentName')!.innerText = ''
        messageService.sendMessage('annualResult', true)
        //history.push('/sequential-notes');
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
    const { observation, councilDecisionId } = item
    return observation || councilDecisionId
  }

  const focusNextField = (e: any, index: number) => {
    if (e.which === 13) {
      document.getElementById(`items.${index + 1}.observation`)?.focus()
    }
  }

  const displayName = (index: number) => {
    document.getElementById('displayStudentName')!.innerText = annualResults[
      index
    ].student.firstName
      ? annualResults[index].student.lastName +
        ' ' +
        annualResults[index].student.firstName
      : annualResults[index].student.lastName
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="tableFixHead">
        <Table
          className="table table-bordered table-condensed table-hover responsive tableur "
          style={{ zIndex: 10 }}
        >
          <thead>
            <tr>
              <th style={{ width: '10px' }}>#</th>
              <th>{t('label-registrationNumber')}</th>
              <th style={{ width: '25%' }}>{t('label-names')}</th>
              <th style={{ width: '10px' }}>{t('label-average')}</th>
              <th style={{ width: '10px' }}>{t('label-ranking')}</th>
              <th>{t('label-observation')}</th>
              <th>{t('label-councilDecision')}</th>
              <th>{t('label-newBranch')}</th>
              <th>{t('label-newClass')}</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.annualReportPK.studentId`)}
                    readOnly={true}
                  />
                </td>
                <td style={{ display: 'none' }}>
                  <SimpleInput
                    {...register(`items.${index}.annualReportPK.schoolYearId`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.student.registrationNumber`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.studentFullName`)}
                    readOnly={true}
                    defaultValue={concat(
                      field.student.lastName,
                      field.student.firstName || '',
                    )}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.average`)}
                    readOnly={true}
                    defaultValue={round(field.annualReport?.average)}
                  />
                </td>
                <td>
                  <SimpleInput
                    {...register(`items.${index}.annualReport.rank`)}
                    readOnly={true}
                  />
                </td>

                <td>
                  <SimpleInput
                    {...register(`items.${index}.observation`, {
                      required: false,
                    })}
                    onKeyUp={(e) => focusNextField(e, index)}
                    onFocus={() => displayName(index)}
                    onKeyPress={(e) => {
                      e.key === 'Enter' && e.preventDefault()
                    }}
                    invalid={errors.items?.[index]?.observation?.type && true}
                  />
                </td>

                <td>
                  <ControlledSelect
                    name={`items.${index}.councilDecisionId`}
                    control={control}
                    onChange={(val) =>
                      setValue(`items.${index}.councilDecisionId`, val)
                    }
                    options={data ? data.councilDecisions : undefined}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    className="inline border-0"
                    loading={loading}
                  />
                  {/* <LiveView
                                    document={councilDecisionSubscription}
                                    subscribeToMore={subscribeToMore}
                                    listVar="councilDecisions"
                                    singleVar="councilDecision"
                                    data={data}
                                    sortField="name"
                                    enterpriseId={enterpriseId}
                                >
                                    {({ councilDecisions }) => (
                                        <ControlledSelect
                                            name={`items.${index}.councilDecisionId`}
                                            //label=""
                                            control={control}
                                            loading={loading}
                                            onChange={val => setValue(`items.${index}.councilDecisionId`, val)}
                                            options={councilDecisions ? councilDecisions : []}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                            //value={form.getFieldValue(`items.[${field.key}].paymentSliceId`)}
                                            className="inline border-0"
                                        />
                                    )}
                                </LiveView> */}
                </td>

                <td>
                  <ControlledSelect
                    name={`items.${index}.branchId`}
                    control={control}
                    onChange={(val) => setValue(`items.${index}.branchId`, val)}
                    options={dataBranches ? dataBranches.branches : undefined}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    className="inline border-0"
                  />
                </td>

                <td>
                  <ControlledSelect
                    name={`items.${index}.classId`}
                    control={control}
                    onChange={(val) => setValue(`items.${index}.classId`, val)}
                    options={dataClasses ? dataClasses.clazzes : undefined}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    className="inline border-0"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="flex justify-end mt-2 mb-2">
        <Button loading={props.loading} color="primary" className="round">
          {t('label-save')}
        </Button>
      </div>
    </Form>
  )
}

export default AnnualResultForm
