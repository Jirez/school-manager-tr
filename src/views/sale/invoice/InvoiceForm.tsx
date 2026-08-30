import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import Input from '@/@core/components/ui/forms/input'
import InputNumber from '@/@core/components/ui/forms/input-number'
import SimpleInput from '@/@core/components/ui/simple-input'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuthentication } from '@/hooks/useAuthentication'
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from '@/utils/constants'
import { formatError } from '@/utils/ErrorHelper'
import {
  computeCommonPartialTotal,
  computeCommonTotal,
  focusArrayField,
  handleFocusAndScroll,
  preventSubmitting,
  toCurrency,
} from '@/utils/helpers'
import LiveView from '@/utils/LiveView'
import { messageService } from '@/utils/message.service'
import ProductAutocompleteHint from '@/utils/ProductAutocompleteHint'
import { useEventEmitter, useKeyPress } from 'ahooks'
import dayjs from 'dayjs'
import { lazy, useEffect, useRef, useState } from 'react'
import { MinusCircle } from 'react-feather'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Form, Table } from 'reactstrap'
import type { InvoiceType } from './invoice.type'
import { invoiceValidation } from './invoice.validation'
import {
  PaymentConditionCreatedDocument,
  useCustomersQuery,
  usePaymentConditionsQuery,
  usePeopleByEnterpriseQuery,
} from '@/gql/graphql'
import useActionOnBackNavigation from '@/hooks/useActionOnBackNavigation'
//import { matchSentence } from "@utils/SearchFn";

const PaymentConditionAdd = lazy(
  () => import('@/views/sale/condition/PaymentConditionAdd'),
)

interface InvoiceFormProps extends BaseFormProps {
  invoice?: InvoiceType
  modal?: NiceModalHandler
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoice,
  action,
  modal,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId, username } = useAuthentication()

  const [total, setTotal] = useState(0)
  //const receiptModal = useModal(SaleReceiptModal);

  const bottomTableRef = useRef<HTMLSpanElement>(null)

  const focus$ = useEventEmitter()
  const reload$ = useEventEmitter()

  const {
    data: dataCondition,
    loading: loadingCondition,
    subscribeToMore: subscribeToMoreCondition,
  } = usePaymentConditionsQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataCustomer,
    loading: loadingCustomer,
    subscribeToMore: subscribeToMoreCustomer,
  } = useCustomersQuery({
    variables: { id: enterpriseId },
  })

  const {
    data: dataPeople,
    loading: loadingPeople,
    subscribeToMore: subscribeToMorePeople,
  } = usePeopleByEnterpriseQuery({
    variables: { id: enterpriseId },
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
    setValue,
    getValues,
    register,
  } = useForm<InvoiceType>({
    defaultValues: {
      items: invoice ? invoice.items : [],
      number: invoice ? invoice.number : '',
      conditionId: invoice ? invoice.condition : null,
      operationDate: invoice
        ? dayjs(invoice.operationDate).toDate()
        : new Date(),
      deadline: invoice ? dayjs(invoice.deadline).toDate() : new Date(),
      note: invoice?.note || '',
      personId: invoice ? invoice.person : null,
    },
    // @ts-ignore
    resolver: yupResolver(invoiceValidation),
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const focusPriceField = focusArrayField(fields, 'quantityF', bottomTableRef)

  const onProductFill = async (product: any) => {
    const item = {
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
      },
      id: null,
      unitPrice: product.salePrice,
      unitPriceF: product.salePrice,
      quantity: 1,
      quantityF: 1,
      total: product.salePrice,
      inStock: product.quantity ?? 0,
    }

    //@ts-ignore
    append(item)

    //focus quantity Field
    focusPriceField()
    computeTotal()
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'paymentCondition') {
          setValue('conditionId', message.value)
        }
      }
    })
  }, [messageService])

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = invoice ? Number(invoice.id) : undefined

      const items = values.items
        ? values.items
            .filter((item: any) => itemValid(item))
            .map((item: any) => ({
              id: item.id ? Number(item.id) : null,
              productId: Number(item.product.id),
              unitPrice: Number(item.unitPrice),
              quantity: Number(item.quantity),
              description: item.description ? item.description : null,
              discount: item.discount ? Number(item.discount) : null,
              invoiceId: id,
              paidAmount: 0,
            }))
        : null

      if (items?.length === 0) {
        toast("Veuillez spécifier les produits qui font l'objet de la facture")
        return
      }

      action({
        variables: {
          invoice: {
            id,
            operationDate: dayjs(values.operationDate).format(
              INPUT_DATE_FORMAT,
            ),
            deadline: dayjs(values.deadline).format(INPUT_DATE_FORMAT),
            number: values.number,
            items: items,
            enterpriseId,
            personId: values.personId ? Number(values.personId.id) : null,
            conditionId: values.conditionId
              ? Number(values.conditionId.id)
              : null,
            note: values.note,
            address: null,
            invoiceType: 'OTHER',
            operator: username,
            //personType: values.personType,
          },
        },
      })
        .then(async ({ data }) => {
          //form.resetFields();
          toast.success(`Facture enregistrée`, { ...TOAST_OPTIONS })

          props.refetch?.()
          reload$.emit()
          //if (!close) {
          modal?.hide()
          //}

          /* if (close) {
            receiptModal.show({
              id: data.operation.id,
              type: data.operation.operationType,
            });
          } */
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer la Facture: ${formatError(error)}`,
          )
        })
    })(event)
  }

  const itemValid = (item: any) => {
    const { quantity, unitPrice, id } = item
    return parseFloat(quantity) && parseFloat(unitPrice) && id
  }

  const updatePartialTotal = (index: number) => {
    const items = getValues('items')
    computeCommonPartialTotal(items, index, setValue)
  }

  const onChange = (index: number) => {
    updatePartialTotal(index)

    computeTotal()
  }

  const computeTotal = () => {
    const keys = getValues('items')
    computeCommonTotal(keys, setTotal)
  }

  const onConditionChange = (val: any) => {
    setValue('conditionId', val)
    const operationDate = dayjs(getValues('operationDate')).isValid()
      ? dayjs(getValues('operationDate'))
      : dayjs()

    if (val) {
      setValue('deadline', operationDate.add(val.days, 'days').toDate())
    } else {
      setValue('deadline', operationDate)
    }
  }

  useEffect(() => {
    computeTotal()
  }, [])

  useKeyPress('alt+r', () => {
    if (fields.length > 0) {
      remove(fields.length - 1)
      computeTotal()
    }
  })

  const isBackNavigation = useActionOnBackNavigation('/operations')

  useEffect(() => {
    if (isBackNavigation) {
      modal?.hide()
    }
  }, [isBackNavigation])

  return (
    <Form onSubmit={onSubmit}>
      <div className="flex flex-col md:flex-row w-full gap-x-6">
        <div className="w-full md:w-3/12 md:order-4">
          <label />
          <span className="font-medium text-3xl flex justify-end">
            {toCurrency(total)} FCFA
          </span>
        </div>

        <div className="w-full md:w-3/12">
          <ControlledSelect
            name="personId"
            control={control}
            required
            label={t('label-customer')}
            loading={loadingPeople}
            onChange={(val) => {
              setValue('personId', val)
              setValue('personType', val.__typename.toUpperCase())
            }}
            options={
              dataPeople
                ? dataPeople.people?.filter(({ active }) => active)
                : []
            }
            getOptionLabel={(option) =>
              option.lastName + ' ' + option.firstName
            }
            getOptionValue={(option) => option.id}
            //filterOption={matchSentence}
            //formId="customer"
            //optionLabel="name"
            //formTitle={t("action.add_customer")}
          />
        </div>

        <div className="w-full md:w-3/12"></div>

        <div className="w-full md:w-3/12">
          <LiveView
            document={PaymentConditionCreatedDocument}
            singleVar="paymentCondition"
            data={dataCondition}
            listVar="paymentConditions"
            subscribeToMore={subscribeToMoreCondition}
            sortField="name"
            triggerUpdate={true}
            enterpriseId={enterpriseId}
          >
            {({ paymentConditions }) => (
              <ControlledSelect
                name="conditionId"
                control={control}
                label={t('label-paymentCondition')}
                loading={loadingCondition}
                onChange={onConditionChange}
                options={paymentConditions || undefined}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                //components={{ Option: classOptions }}
                form={<PaymentConditionAdd />}
                formId="paymentCondition"
                optionLabel="name"
                formTitle={t('action.add_paymentCondition')}
                modalClassName="modal-md"
              />
            )}
          </LiveView>
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-x-6">
        <div className="w-full md:w-3/12">
          <DatePicker
            name="operationDate"
            label={t('label-operationDate')}
            control={control}
            required
          />
        </div>

        <div className="w-full md:w-3/12">
          <DatePicker
            name="deadline"
            label={t('label-deadline')}
            control={control}
            required
          />
        </div>

        <div className="w-full md:w-3/12">
          <Input
            name="number"
            label={t('label-number')}
            control={control}
            placeholder={'Référence opération'}
          />
        </div>

        <div className="w-full md:w-3/12"></div>
      </div>

      {/* Deposit information  */}

      <div className="flex flex-col md:flex-row w-full gap-x-6">
        <div className="w-full md:w-3/12"></div>

        <div className="w-full md:w-3/12"></div>

        <div className="w-full md:w-3/12"></div>
      </div>

      <div className="w-full">
        <Input
          name="note"
          label={t('label-note')}
          control={control}
          type="textarea"
        />
      </div>

      <div className="flex flex-col">
        <div className="w-full mb-2">
          <ProductAutocompleteHint
            onFill={onProductFill}
            focus$={focus$}
            reload$={reload$}
          />
        </div>

        <div className="w-full">
          <Table className="table table-bordered table-condensed table-hover responsive tableur">
            <thead>
              <tr>
                <th style={{ width: '10px' }}>#</th>
                <th style={{ width: '5%' }}>{t('label-sku')}</th>
                <th style={{ width: '25%' }}>{t('label-product')}</th>
                {/* <th style={{ width: "15px" }}>{t("label-inStock")}</th> */}
                <th>{t('label-qty')}</th>
                <th>P.U.</th>
                <th>{t('label-total')}</th>
                <th>{t('label-discount')}</th>
                <th>{t('label-description')}</th>
                {/* <th style={{ width: "15%" }}>{t("label-class")}</th> */}
                <th className="text-center">#</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ display: 'none' }}>
                    <SimpleInput {...register(`items.${index}.id`)} readOnly />
                    <SimpleInput
                      {...register(`items.${index}.product.id`)}
                      readOnly
                    />
                  </td>
                  <td>
                    <SimpleInput
                      {...register(`items.${index}.product.sku`)}
                      readOnly
                    />
                  </td>
                  <td>
                    <SimpleInput
                      {...register(`items.${index}.product.name`)}
                      readOnly
                    />
                  </td>

                  {/* <td>
                    <InputNumber
                      {...register(`items.${index}.inStock`)}
                      readOnly
                      value={watch(`items.${index}.inStock`)}
                    />
                  </td> */}

                  <td>
                    <InputNumber
                      {...register(`items.${index}.quantityF`)}
                      value={watch(`items.${index}.quantityF`)}
                      onKeyPress={preventSubmitting}
                      onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                      onValueChange={(val: any) => {
                        setValue(`items.${index}.quantityF`, val.formattedValue)
                        setValue(`items.${index}.quantity`, val.value)
                        onChange(index)
                      }}
                      /* invalid={
                        (watch(`items.${index}.inStock`) || 0) -
                          Number(watch(`items.${index}.quantity`)) <
                          0 && true
                      } */
                    />
                  </td>

                  <td>
                    <InputNumber
                      {...register(`items.${index}.unitPriceF`)}
                      value={watch(`items.${index}.unitPriceF`)}
                      onKeyPress={preventSubmitting}
                      onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                      onValueChange={(val: any) => {
                        setValue(
                          `items.${index}.unitPriceF`,
                          val.formattedValue,
                        )
                        setValue(`items.${index}.unitPrice`, val.value)
                        onChange(index)
                      }}
                    />
                  </td>

                  <td>
                    <InputNumber
                      {...register(`items.${index}.total`)}
                      readOnly
                      value={watch(`items.${index}.total`)}
                    />
                  </td>

                  <td>
                    <SimpleInput
                      {...register(`items.${index}.discount`)}
                      onKeyPress={preventSubmitting}
                      onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                    />
                  </td>

                  <td>
                    <SimpleInput
                      {...register(`items.${index}.description`)}
                      onKeyPress={preventSubmitting}
                      onKeyUp={(e) => handleFocusAndScroll(e, focus$)}
                    />
                  </td>

                  <td className="flex justify-around">
                    <MinusCircle
                      size={24}
                      onClick={() => {
                        remove(index)
                        computeTotal()
                      }}
                      color="red"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <span ref={bottomTableRef} />
        </div>

        {/* Discount, Tax, deposit */}
      </div>

      <ActionButtons
        cancelAction={modal?.hide}
        isSubmitting={props.loading}
        popover={props.popover}
        dirty={isDirty}
        onSubmit={onSubmit}
        fixed={true}
        saveCloseLabel={t('label-savePrint')}
      />
    </Form>
  )
}

export default InvoiceForm
