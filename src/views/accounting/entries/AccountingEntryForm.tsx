import React, { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import dayjs from 'dayjs'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Table, Row, Col } from 'reactstrap'
import { MinusCircle, Plus } from 'react-feather'
import { components } from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useAuthentication } from '@/hooks/useAuthentication'
import type {
  AccountingEntryItem,
  AccountingEntryType,
} from './AccountingEntry.type'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import Input from '@/@core/components/ui/forms/input'
import AccountAutocompleteHint from '@/utils/AccountAutocompleteHint'
import SimpleInput from '@/@core/components/ui/simple-input'
import LiveView from '@/utils/LiveView'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import AccountAdd from '../accounts/AccountAdd'
import {
  accountFilterOptions,
  accountOptions,
  personOptions,
} from '@/utils/select/selectComponents'
import LogCodeAdd from '../logCodes/LogCodeAdd'
import { formatNumber, preventSubmitting } from '@/utils/helpers'
import Button from '@/@core/components/button'
import { toast } from 'react-toastify'
import { formatError } from '@/utils/ErrorHelper'
import { useOperationItems } from '@/hooks/useOperationItems'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import { INPUT_DATE_FORMAT } from '@/utils/constants'
import {
  AccountCreatedDocument,
  AccountingEntryItemDocument,
  AccountingEntryNumberDocument,
  LogCodeCreatedDocument,
  useAccountsQuery,
  useLogCodesQuery,
  usePeopleByEnterpriseQuery,
} from '@/gql/graphql'

interface AccountingEntryFormProps extends BaseFormProps {
  journal?: AccountingEntryType
  modal?: NiceModalHandler
}

const AccountingEntryForm: React.FC<AccountingEntryFormProps> = ({
  journal,
  modal,
  action,
  ...props
}) => {
  const { t, i18n } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const client = useApolloClient()
  const [values, setValues] = useState({ totalCredit: 0, totalDebit: 0 })

  const { data, loading, subscribeToMore } = useAccountsQuery({
    variables: { id: enterpriseId },
  })

  const { data: dataPeople, loading: loadingPeople } =
    usePeopleByEnterpriseQuery({
      variables: { id: enterpriseId },
    })

  const {
    data: dataCode,
    loading: loadingCode,
    subscribeToMore: subscribeToMoreLogCode,
  } = useLogCodesQuery({
    variables: { id: enterpriseId },
  })

  const { operationItems } = useOperationItems(
    AccountingEntryItemDocument,
    'accountingEntryItems',
    journal ? Number(journal.id) : null,
  )

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isDirty },
  } = useForm<AccountingEntryType>({
    defaultValues: {
      operationDate: journal ? dayjs(journal.operationDate).toDate() : null,
      number: journal ? journal.number : '',
      items: [],
    },
    resolver: yupResolver(
      yup.object({
        operationDate: yup.date().required().typeError('Field required'),
      }),
    ) as any,
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  const handleAccountFill = (account: any): void => {
    const defaultValue = {
      account: {
        id: account.id,
        name: account.name,
        number: account.number,
      },
      amount: null,
      debit: null,
      credit: null,
    }
    append(defaultValue)
  }

  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      {props.data.number + ' ' + props.data.name}
    </components.SingleValue>
  )

  const computeTotal = () => {
    const items = getValues('items')

    const totalDebit = items
      .map((item) => item.debit)
      .filter((item) => item !== null && parseFloat(String(item)))
      .reduce((a, b) => Number(a!) + Number(b!), 0)

    const totalCredit = items
      .map((item) => item.credit)
      .filter((item) => item !== null && parseFloat(String(item)))
      .reduce((a, b) => Number(a!) + Number(b!), 0)

    //@ts-ignore
    setValues({ totalDebit, totalCredit })
  }

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = journal ? Number(journal.id) : undefined

      //formatting items
      //console.log(values.items)
      const items = values.items
        .filter((item: any) => itemValid(item))
        .map((item: any) => {
          return {
            accountId: Number(item.account.id),
            logCodeId: Number(item.logCode.id),
            personId: item.person ? Number(item.person.id) : null,
            directionType: item.credit ? 'CREDIT' : 'DEBIT',
            amount: item.credit ? Number(item.credit) : Number(item.debit),
            description: item.description,
          }
        })

      if (items.length === 0) {
        toast.error('Veuillez spécifier les écritures à enregistrer')
        return
      }

      const totalDebit = items
        .filter(({ directionType }: any) => directionType === 'DEBIT')
        .map(({ amount }: any) => parseFloat(amount))
        .reduce((a: number, b: number) => a + b)

      const totalCredit = items
        .filter(({ directionType }: any) => directionType === 'CREDIT')
        .map(({ amount }: any) => parseFloat(amount))
        .reduce((a: number, b: number) => a + b)

      if (totalCredit !== totalDebit) {
        //console.log(totalDebit);
        //console.log(totalCredit);
        toast.error('Veuillez équilibrer les débits et les crédits')
        return
      }

      //console.log(items);

      action({
        variables: {
          entry: {
            id: id,
            operationDate: dayjs(values.operationDate).format(
              INPUT_DATE_FORMAT,
            ),
            number: values.number,
            accountingEntryItemCollection: items,
            enterpriseId: enterpriseId,
          },
        },
      })
        .then(async ({ data }) => {
          //form.resetFields();
          toast.info(`Ecriture de journal ${data.operation.number} effectuée`)
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer l'écriture de journal : ${formatError(
              error,
            )}`,
          )
        })
    })(event)
  }

  const itemValid = (item: any) => {
    const { account, logCode, credit, debit } = item
    return account && logCode && (parseFloat(credit) || parseFloat(debit))
  }

  const populateNumber = async () => {
    const number = getValues('number')

    if (number !== undefined && number !== '') {
      return false
    }

    const id = enterpriseId

    const { data } = await client.query({
      query: AccountingEntryNumberDocument,
      variables: { id },
      fetchPolicy: 'network-only',
    })

    if (data) {
      setValue('number', data.getAccountingEntryNumber)
    }
  }

  useEffect(() => {
    populateNumber()
  }, [])

  useEffect(() => {
    setValue('items', [])
    //setAccountingEntryItems(operationItems);
    if (operationItems) {
      const defaultValues = operationItems.map((item: AccountingEntryItem) => ({
        account: item.account as any,
        debit: item.directionType === 'DEBIT' ? (item.amount as number) : null,
        credit:
          item.directionType === 'CREDIT' ? (item.amount as number) : null,
        description: item.description,
        person: item.person as any,
        logCode: item.logCode as any,
      }))

      for (let i = 0; i < defaultValues.length; i++) {
        append(defaultValues[i])
      }

      computeTotal()
    }
  }, [operationItems])

  return (
    <Form onSubmit={onSubmit}>
      <Row className="mb-2">
        <Col md={4} lg={3}>
          <DatePicker
            name="operationDate"
            control={control}
            label={t('label-operationDate')}
            required
            placeholder={t('label-selectDate')}
          />
        </Col>

        <Col md={4} lg={3}>
          <Input name="number" control={control} label={t('label-number')} />
        </Col>
      </Row>

      <div className="flex flex-col">
        <div className="w-full mb-3">
          <AccountAutocompleteHint onFill={handleAccountFill} />
        </div>

        <div className="w-full overflow-auto" style={{ maxHeight: '60vh' }}>
          <Table className="table table-bordered table-condensed responsive tableur table-hover tableFixHead">
            <thead className="table-light text-uppercase">
              <tr>
                <th className="text-center px-1" style={{ width: '40px' }}>
                  #
                </th>
                <th style={{ width: '25%' }}>Compte</th>
                <th style={{ width: '15%' }}>Journal</th>
                <th className="text-end" style={{ width: '130px' }}>
                  Débit
                </th>
                <th className="text-end" style={{ width: '130px' }}>
                  Crédit
                </th>
                <th>Description</th>
                <th style={{ width: '15%' }}>Tiers</th>
                <th style={{ width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id}>
                  <td className="text-center align-middle font-medium px-1">
                    {index + 1}
                  </td>
                  <td>
                    <LiveView
                      document={AccountCreatedDocument}
                      subscribeToMore={subscribeToMore}
                      listVar="accounts"
                      singleVar="account"
                      data={data}
                      sortField="name"
                      enterpriseId={enterpriseId}
                    >
                      {({ accounts }) => (
                        <ControlledSelect
                          name={`items.${index}.account`}
                          control={control}
                          loading={loading}
                          onChange={(val) =>
                            setValue(`items.${index}.account`, val)
                          }
                          options={accounts ? accounts : []}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          components={{ Option: accountOptions, SingleValue }}
                          filterOption={accountFilterOptions}
                          form={<AccountAdd />}
                          //formId="accountId"
                          optionLabel="name"
                          className="inline border-0"
                        />
                      )}
                    </LiveView>
                  </td>
                  <td>
                    <LiveView
                      document={LogCodeCreatedDocument}
                      subscribeToMore={subscribeToMoreLogCode}
                      listVar="logCodes"
                      singleVar="logCode"
                      data={dataCode}
                      sortField="name"
                      enterpriseId={enterpriseId}
                    >
                      {({ logCodes }) => (
                        <ControlledSelect
                          name={`items.${index}.logCode`}
                          control={control}
                          loading={loading}
                          onChange={(val) =>
                            setValue(`items.${index}.logCode`, val)
                          }
                          options={logCodes ? logCodes : []}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          //components = {{ Option: accountOptions, SingleValue }}
                          //filterOption={accountFilterOptions}
                          form={<LogCodeAdd />}
                          formId="logCode"
                          optionLabel="name"
                          className="inline border-0"
                        />
                      )}
                    </LiveView>
                  </td>
                  <td>
                    <SimpleInput
                      {...register(`items.${index}.debit`)}
                      className="text-end"
                      onKeyPress={preventSubmitting}
                      onBlur={() => {
                        if (getValues(`items.${index}.debit`) !== null) {
                          setValue(`items.${index}.credit`, null)
                        }
                      }}
                      onChange={(e) => {
                        setValue(`items.${index}.debit`, e.target.value)
                        computeTotal()
                      }}
                    />
                  </td>
                  <td>
                    <SimpleInput
                      {...register(`items.${index}.credit`)}
                      className="text-end"
                      onKeyPress={preventSubmitting}
                      onBlur={() => {
                        if (getValues(`items.${index}.credit`) !== null) {
                          setValue(`items.${index}.debit`, null)
                        }
                      }}
                      onChange={(e) => {
                        setValue(`items.${index}.credit`, e.target.value)
                        computeTotal()
                      }}
                    />
                  </td>
                  <td>
                    <SimpleInput
                      {...register(`items.${index}.description`)}
                      onKeyPress={preventSubmitting}
                    />
                  </td>

                  <td>
                    <ControlledSelect
                      name={`items.${index}.person`}
                      control={control}
                      loading={loadingPeople}
                      onChange={(val) => setValue(`items.${index}.person`, val)}
                      options={
                        dataPeople && dataPeople.people
                          ? dataPeople.people.filter(
                              ({ __typename }: any) =>
                                __typename === 'Student0' ||
                                __typename === 'Teacher' ||
                                __typename === 'Guardian',
                            )
                          : undefined
                      }
                      getOptionLabel={(option) => option.lastName}
                      getOptionValue={(option) => option.id}
                      components={{ Option: personOptions }}
                      className="inline border-0"
                    />
                  </td>
                  <td className="text-center align-middle px-1">
                    <MinusCircle
                      size={18}
                      className="cursor-pointer"
                      onClick={() => {
                        remove(index)
                        computeTotal()
                      }}
                      color="#ea5455"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-light">
              <tr className="font-bold">
                <td colSpan={3} className="align-middle py-1">
                  <div className="flex justify-between items-center px-1">
                    <Button
                      size="sm"
                      type="button"
                      color="primary"
                      outline
                      onClick={() =>
                        append({
                          credit: null,
                          debit: null,
                        })
                      }
                    >
                      <Plus size={14} className="me-50" />
                      Ajouter une ligne
                    </Button>
                    <span className="text-uppercase">Total</span>
                  </div>
                </td>
                <td
                  className="text-end font-bolder text-primary px-1 py-1 align-middle"
                  style={{ fontSize: '1rem' }}
                >
                  {formatNumber(values.totalDebit, i18n.language)}
                </td>
                <td
                  className="text-end font-bolder text-primary px-1 py-1 align-middle"
                  style={{ fontSize: '1rem' }}
                >
                  {formatNumber(values.totalCredit, i18n.language)}
                </td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>

      <ActionButtons
        cancelAction={modal?.hide}
        isSubmitting={props.loading}
        popover={props.popover}
        dirty={isDirty}
        onSubmit={onSubmit}
        fixed={true}
      />
    </Form>
  )
}

export default AccountingEntryForm
