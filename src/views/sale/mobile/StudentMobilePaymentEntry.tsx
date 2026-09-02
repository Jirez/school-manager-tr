import {
  useInitiatePaymentMutation,
  usePaymentOfStudentBalanceLazyQuery,
  useSchoolByIdentifierQuery,
  useSchoolYearByIdentifierQuery,
  PersonType,
  GiselPayObject,
} from '@/gql/graphql'

import { yupResolver } from '@hookform/resolvers/yup'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { mobilePaymentValidation } from './mobile.payment.validation'
import Input from '@/@core/components/ui/forms/input'
import { FormFeedback, Label } from 'reactstrap'
import { NumericFormat } from 'react-number-format'
import { preventSubmitting, toCurrency } from '@/utils/helpers'
import { useTranslation } from 'react-i18next'
import Loader from '@/@core/components/spinner/loader'
import ErrorComponent from '@/@core/components/ui/error-component'
import { useState } from 'react'
import { formatError } from '@/utils/ErrorHelper'
import PhoneInput from '@/@core/components/ui/forms/phone-input'
import { useTitle } from 'ahooks'
import { Check, AlertCircle, User, CreditCard, Shield } from 'react-feather'
import { toast } from 'react-toastify'
import orangeMoney from '@/assets/images/logo/orange-money.png'
import mobileMoney from '@/assets/images/logo/mobile-money.png'
import Button from '#/@core/components/button'

interface FormValue {
  amount: number | string
  amountF: string
  phone: string
  registrationNumber: string
}

export default function StudentMobilePaymentEntry({
  identifier,
}: {
  identifier: string
}) {
  useTitle('Paiement mobile')
  const { t } = useTranslation()
  // const { identifier } = useParams()
  const navigate = useNavigate()
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [registrationNumberValid, setRegistrationNumberValid] = useState(false)
  const [info, setInfo] = useState<{
    studentId: number
    studentName: string
    amount: number
    studentClass: string
  }>({
    studentId: 0,
    studentName: '',
    amount: 0,
    studentClass: '',
  })
  const baseImageUrl = 'https://static.syscabh.com/ltko/'

  const { data, error, loading } = useSchoolByIdentifierQuery({
    variables: {
      identifier: identifier!!,
    },
    fetchPolicy: 'network-only',
    skip: !identifier,
  })

  const {
    data: schoolYearData,
    error: schoolYearError,
    loading: schoolYearLoading,
  } = useSchoolYearByIdentifierQuery({
    variables: {
      identifier: identifier!!,
    },
    fetchPolicy: 'network-only',
    skip: !identifier,
  })

  const [loadPaymentData, { loading: verifying, error: checkError }] =
    usePaymentOfStudentBalanceLazyQuery({
      fetchPolicy: 'network-only',
    })

  const [initiatePayment, { loading: loadingPayment, error: paymentError }] =
    useInitiatePaymentMutation()

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValue>({
    //@ts-ignore
    resolver: yupResolver(mobilePaymentValidation),
    defaultValues: {
      amount: '',
      amountF: '',
      phone: '',
      registrationNumber: '',
    },
  })

  const onSubmit: SubmitHandler<FormValue> = (data) => {
    // if the amountToPay is greater than the balance, display toast error
    if (Number(data.amount) > info.amount) {
      toast.error('Le montant à payer ne peut dépasser la somme exigée.')
      return
    }
    initiatePayment({
      variables: {
        input: {
          amount: Number(data.amount),
          phone: data.phone,
          personId: info.studentId,
          payObject: GiselPayObject.Tuition,
          identifier: identifier!!,
          personType: PersonType.Student,
        },
      },
    })
      .then(({ data }) => {
        toast.success('Paiement initié avec succès.')
        //console.log(data?.reference);
        // redirect to the payment status page
        navigate({ to: `/payment-status/${data?.reference}` })
      })
      .catch((error) => {
        toast.error(formatError(error))
      })
  }

  if (loading || schoolYearLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader />
      </div>
    )
  }

  if (error || schoolYearError) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
        <ErrorComponent title="Erreur" message="Une erreur est survenue" />
      </div>
    )
  }

  if (!data?.school || !schoolYearData?.schoolYear) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
        <ErrorComponent
          title="Erreur"
          message="L'indentifiant de l'école est invalide. Veuillez vérifier votre lien de paiement ou contactez l'etablissement."
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-1">
      <div className="w-full max-w-lg bg-white dark:!bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 mx-auto">
        <div className="!p-6">
          <div className="flex flex-col items-center text-center mb-8">
            {data?.school?.logo ? (
              <img
                src={baseImageUrl + data?.school?.logo}
                alt={data?.school?.name}
                className="w-24 h-24 object-contain mb-2 drop-shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-gray-400 text-xl">Logo</span>
              </div>
            )}
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {data?.school?.name}
            </h1>
            <h2 className="text-gray-500 dark:text-gray-400 font-medium text-sm bg-gray-100 dark:bg-gray-700 px-5 py-1 rounded-full">
              {schoolYearData?.schoolYear?.label}
            </h2>
          </div>

          {/* Display error here */}
          {checkError && (
            <div className="bg-red-50 text-red-500 text-sm p-2 rounded-lg mb-2 flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {formatError(checkError)}
            </div>
          )}

          {/* @ts-ignore */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <div className="relative">
              <Input
                control={control}
                name="registrationNumber"
                label={t('label-studentRegistrationNumber')}
                required
                className="mb-1"
                onChange={(e) => {
                  setRegistrationNumber(e.target.value)
                  setValue('registrationNumber', e.target.value)
                  setRegistrationNumberValid(false)
                }}
              />
            </div>

            {!registrationNumberValid && (
              <Button
                type="button"
                color="primary"
                loading={verifying}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-2.5 rounded-lg shadow-md transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                onClick={() => {
                  loadPaymentData({
                    variables: {
                      registrationNumber: registrationNumber,
                      identifier: identifier!!,
                    },
                  }).then((res) => {
                    if (res.data?.info) {
                      setRegistrationNumberValid(true)
                      setInfo(res.data.info)
                    }
                  })
                }}
                disabled={!registrationNumber}
              >
                <Check size={18} />
                {t('label-check')}
              </Button>
            )}

            {registrationNumberValid && (
              <div className="animate__animated animate__fadeIn">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-1 md:p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-800 p-1 md:p-2 rounded-full text-blue-600 dark:text-blue-300">
                      <User size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Élève
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg leading-tight mb-1">
                        {info.studentName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Classe:{' '}
                        <span className="font-medium">{info.studentClass}</span>
                      </p>

                      <div className="border-t border-blue-200 dark:border-blue-800 pt-2 mt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">
                          Reste à payer
                        </p>
                        <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {toCurrency(info.amount)}{' '}
                          <span className="text-sm font-normal text-gray-500">
                            FCFA
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Add orange money and mobile money logo here */}
                  <div className="relative">
                    <PhoneInput
                      control={control}
                      name="phone"
                      label={t('label-paymentNumber')}
                      required
                      className="mb-1 bg-transparent"
                    />
                    <div className="absolute right-10 top-12 transform -translate-y-1/2 pointer-events-none">
                      <div className="flex items-center gap-0">
                        <img
                          src={orangeMoney}
                          alt="Orange Money"
                          className="w-6 h-6"
                        />
                        <img
                          src={mobileMoney}
                          alt="Mobile Money"
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="mb- block font-medium text-gray-700 dark:text-gray-300">
                      {t('label-amountToPay')} *
                    </Label>
                    <div className="relative">
                      <NumericFormat
                        {...register(`amountF`)}
                        value={watch(`amountF`)}
                        onKeyPress={preventSubmitting}
                        onValueChange={(val) => {
                          setValue(`amountF`, val.formattedValue)
                          setValue(`amount`, val.value)
                        }}
                        className={`form-control w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all !text-xl !font-bold ${
                          errors.amount ? 'is-invalid' : ''
                        }`}
                        thousandSeparator=" "
                        placeholder="0"
                      />
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                        FCFA
                      </div>
                    </div>
                    {errors.amount && (
                      <FormFeedback className="d-block mt-1">
                        {t(errors?.amount?.message as string)}
                      </FormFeedback>
                    )}
                  </div>

                  <div className="pt-0">
                    <Button
                      type="submit"
                      color="primary"
                      loading={loadingPayment}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <CreditCard size={18} />
                      {t('label-payNow')}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-2 border-t border-gray-100 dark:border-gray-700 text-center flex items-center justify-center gap-2 text-gray-400">
          <Shield size={12} />
          <p className="text-xs font-medium">Sécurisé par NeemaDev</p>
        </div>
      </div>
    </div>
  )
}
