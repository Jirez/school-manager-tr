import { useTranslation } from 'react-i18next'
import { useApolloClient } from '@apollo/client'
import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { Card, Form, Table } from 'reactstrap'
import type { Draft } from 'immer'
import { produce } from 'immer'
import { toast } from 'react-toastify'
import { MinusCircle } from 'react-feather'

import PageHeader from '@/@core/components/ui/page-header'
import LiveView from '@/utils/LiveView'
import { useAuthentication } from '@/hooks/useAuthentication'
import LevelAdd from '@/views/school/levels/LevelAdd'
import type {
  SchoolFeeLevelFormValues,
  SchoolFeeLevelItem,
} from '@/views/payment/schoolFeeLevels/SchoolFeeLevel.type'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import PaymentSliceAdd from '@/views/payment/slices/PaymentSliceAdd'
import Scrollbar from '@/@core/components/ui/scrollbar'
import PaymentGroupAdd from '@/views/payment/groups/PaymentGroupAdd'
import SchoolFeeAdd from '@/views/payment/schoolFees/SchoolFeeAdd'
import { formatError } from '@/utils/ErrorHelper'
import InputNumber from '@/@core/components/ui/forms/input-number'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  LevelCreatedDocument,
  PaymentGroupCreatedDocument,
  PaymentSliceCreatedDocument,
  SchoolFeeCreatedDocument,
  SchoolFeeLevelsDocument,
  useLevelsQuery,
  usePaymentGroupsQuery,
  usePaymentSlicesQuery,
  useSchoolFeeLevelSaveMutation,
  useSchoolFeesQuery,
} from '@/gql/graphql'
import { useTitle } from 'ahooks'
import Button from '#/@core/components/button'

const initialValues = {
  levelId: null,
  modelId: null,
  items: [],
}

const SchoolFeeLevelForm = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.payments.schoolFeeLevels'))
  const { enterpriseId } = useAuthentication()
  const client = useApolloClient()

  const { data, loading, subscribeToMore } = useLevelsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataSlice,
    loading: loadingSlice,
    subscribeToMore: subscribeToMoreSlice,
  } = usePaymentSlicesQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataGroup,
    loading: loadingGroup,
    subscribeToMore: subscribeToMoreGroup,
  } = usePaymentGroupsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataSchoolFee,
    loading: loadingSchoolFee,
    subscribeToMore: subscribeToMoreSchoolFee,
  } = useSchoolFeesQuery({
    variables: { id: enterpriseId },
  })

  const [action, { loading: isSubmitting }] = useSchoolFeeLevelSaveMutation()

  const { control, register, handleSubmit, setValue, getValues, reset, watch } =
    useForm<SchoolFeeLevelFormValues>({
      defaultValues: {
        levelId: null,
        modelId: null,
        items: [],
      },
    })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const onSubmit: SubmitHandler<SchoolFeeLevelFormValues> = (values) => {
    const items = values.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => ({
        requiredAmount: Number(item.requiredAmount),
        paymentSliceId: item.paymentSliceId
          ? Number(item.paymentSliceId.id)
          : -1,
        paymentGroupId: item.paymentGroupId
          ? Number(item.paymentGroupId.id)
          : -1,
        schoolFeeId: item.schoolFeeId ? Number(item.schoolFeeId.id) : -1,
      }))

    if (items.length === 0) {
      toast.error('Veuillez spécifier les rubriques à enregistrer')
      return
    }

    action({
      variables: {
        form: {
          levelId: values.levelId ? Number(values.levelId.id) : -1,
          items: items.length !== 0 ? items : null,
        },
      },
    })
      .then(async ({ data }) => {
        reset(initialValues)
        toast.success(`Montants des droits enregistrés`, {
          ...TOAST_OPTIONS,
        })
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer les montants des droits: ${formatError(
            error,
          )}`,
        )
      })
  }

  const itemValid = (item: any) => {
    const { paymentSliceId, paymentGroupId, schoolFeeId, requiredAmount } = item
    return (
      paymentSliceId &&
      paymentGroupId &&
      schoolFeeId &&
      parseFloat(requiredAmount)
    )
  }

  const findItems = async (levelId: number) => {
    const { data } = await client.query({
      query: SchoolFeeLevelsDocument,
      variables: { id: Number(levelId) },
      fetchPolicy: 'no-cache',
    })

    if (data) {
      const defaultValues = data.schoolFeeLevels.map(
        (item: SchoolFeeLevelItem) => ({
          paymentSliceId: item.paymentSlice,
          paymentGroupId: item.paymentGroup,
          schoolFeeId: item.schoolFee,
          requiredAmount: item.requiredAmount,
        }),
      )

      for (let i = 0; i < defaultValues.length; i++) {
        append(defaultValues[i])
      }

      for (let i = 0; i < 10 - defaultValues.length; i++) {
        append({
          amount: undefined,
          requiredAmount: undefined,
          paymentGroupId: null,
          paymentSliceId: null,
          schoolFeeId: null,
          paymentGroup: { id: undefined },
          paymentSlice: {},
          schoolFee: {},
        })
      }
    }
  }

  const onLevelChange = (val: any) => {
    setValue('levelId', val)
    setValue('items', [])
    if (val) {
      findItems(val.id)
    }
  }

  const onModelChange = (val: any) => {
    setValue('modelId', val)
    setValue('items', [])
    if (val) {
      findItems(val.id)
    }
  }

  const onSliceChange = (val: any, k: number) => {
    const items = getValues('items')
    const updatedItems = produce(items, (draftState: Draft<any>) => {
      draftState[k].paymentSliceId = val
    })

    setValue('items', updatedItems)
  }

  const onGroupChange = (val: any, k: number) => {
    const items = getValues('items')
    const updatedItems = produce(items, (draftState: Draft<any>) => {
      draftState[k].paymentGroupId = val
    })

    setValue('items', updatedItems)
  }

  const onSchoolFeeChange = (val: any, k: number) => {
    const items = getValues('items')
    const updatedItems = produce(items, (draftState: Draft<any>) => {
      draftState[k].schoolFeeId = val
    })

    setValue('items', updatedItems)
  }

  return (
    <Scrollbar className="flex flex-col w-full">
      <PageHeader title={t('action.add_schoolFeeLevel')} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row md:space-x-6 mb-2">
          <div className="w-full md:w-4/12 lg:w-3/12">
            <LiveView
              document={LevelCreatedDocument}
              singleVar="level"
              data={data}
              listVar="levels"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ levels }) => (
                <ControlledSelect
                  name="levelId"
                  label={t('label-level')}
                  control={control}
                  loading={loading}
                  onChange={(val) => {
                    onLevelChange(val)
                  }}
                  options={levels || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  //components = {{ Option: classOptions }}
                  form={<LevelAdd />}
                  formId="level"
                  optionLabel="name"
                  placeholder="Sélectionnez un niveau"
                />
              )}
            </LiveView>
          </div>

          <div className="w-full md:w-4/12 lg:w-3/12">
            <LiveView
              document={LevelCreatedDocument}
              singleVar="level"
              data={data}
              listVar="levels"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ levels }) => (
                <ControlledSelect
                  name="modelId"
                  label={t('label-useModel')}
                  control={control}
                  loading={loading}
                  onChange={(val) => {
                    onModelChange(val)
                  }}
                  options={levels || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  //components = {{ Option: classOptions }}
                  formId="level"
                  optionLabel="name"
                  placeholder={t('label-selectLevel')}
                />
              )}
            </LiveView>
          </div>
        </div>

        <Card className="w-full">
          <Table className="table table-bordered table-condensed table-hover responsive tableur">
            <thead>
              <tr>
                <th style={{ width: '10px' }}>#</th>
                <th style={{ width: '25%' }}>{t('label-slice')}</th>
                <th>{t('label-group')}</th>
                <th>{t('label-schoolFee')}</th>
                <th>{t('label-amount')}</th>
                <th className="text-center">#</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td>
                    <LiveView
                      document={PaymentSliceCreatedDocument}
                      subscribeToMore={subscribeToMoreSlice}
                      listVar="paymentSlices"
                      singleVar="paymentSlice"
                      data={dataSlice}
                      sortField="name"
                      enterpriseId={enterpriseId}
                    >
                      {({ paymentSlices }) => (
                        <ControlledSelect
                          name={`items.${index}.paymentSliceId`}
                          //label=""
                          control={control}
                          loading={loadingSlice}
                          onChange={(val) => onSliceChange(val, index)}
                          options={paymentSlices ? paymentSlices : []}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          form={<PaymentSliceAdd />}
                          formId="paymentSlice"
                          optionLabel="name"
                          className="inline border-0"
                          formTitle={t('action.add_paymentSlice')}
                        />
                      )}
                    </LiveView>
                  </td>

                  <td>
                    <LiveView
                      document={PaymentGroupCreatedDocument}
                      subscribeToMore={subscribeToMoreGroup}
                      listVar="paymentGroups"
                      singleVar="paymentGroup"
                      data={dataGroup}
                      sortField="name"
                      enterpriseId={enterpriseId}
                    >
                      {({ paymentGroups }) => (
                        <ControlledSelect
                          name={`items.${index}.paymentGroupId`}
                          control={control}
                          loading={loadingGroup}
                          onChange={(val) => onGroupChange(val, index)}
                          options={paymentGroups ? paymentGroups : []}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          form={<PaymentGroupAdd />}
                          formId="paymentGroup"
                          optionLabel="name"
                          className="inline border-0"
                          formTitle={t('action.add_paymentGroup')}
                        />
                      )}
                    </LiveView>
                  </td>

                  <td>
                    <LiveView
                      document={SchoolFeeCreatedDocument}
                      subscribeToMore={subscribeToMoreSchoolFee}
                      listVar="schoolFees"
                      singleVar="schoolFee"
                      data={dataSchoolFee}
                      sortField="name"
                      enterpriseId={enterpriseId}
                    >
                      {({ schoolFees }) => (
                        <ControlledSelect
                          name={`items.${index}.schoolFeeId`}
                          control={control}
                          loading={loadingSchoolFee}
                          onChange={(val) => onSchoolFeeChange(val, index)}
                          options={schoolFees ? schoolFees : []}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          form={<SchoolFeeAdd />}
                          formId="schoolFee"
                          optionLabel="name"
                          className="inline border-0"
                          formTitle={t('action.add_schoolFee')}
                        />
                      )}
                    </LiveView>
                  </td>

                  <td>
                    <InputNumber
                      onKeyPress={(e) => {
                        e.key === 'Enter' && e.preventDefault()
                      }}
                      value={watch(`items.${index}.requiredAmount`)}
                      {...register(`items.${index}.requiredAmount`)}
                    />
                  </td>
                  <td className="flex justify-around">
                    <MinusCircle onClick={() => remove(index)} color="red" />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>
                  <Button
                    type="button"
                    size="sm"
                    color="success"
                    className="round my-1 mx-1"
                    onClick={() =>
                      append({
                        paymentGroupId: null,
                        paymentSliceId: null,
                        schoolFeeId: null,
                        requiredAmount: undefined,
                      })
                    }
                    disabled={!getValues('levelId')}
                  >
                    {t('label-addLines')}
                  </Button>
                </td>
                <td> </td>
                <td> </td>
                <td colSpan={3}> </td>
              </tr>
            </tfoot>
          </Table>
        </Card>

        <div className="flex justify-end mt-2 mb-2">
          <Button loading={isSubmitting} color="primary" className="round">
            {t('label-save')}
          </Button>
        </div>
      </Form>
    </Scrollbar>
  )
}

export default SchoolFeeLevelForm
