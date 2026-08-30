import { useParams, useNavigate } from '@tanstack/react-router'
import { useCheckAndConfirmPaymentMutation } from '@/gql/graphql'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { CheckCircle, XCircle, Clock, Loader } from 'react-feather'
import { useTitle } from 'ahooks'

type PaymentStatus = 'valide' | 'non_valide' | 'en_attente' | 'error'

export default function StudentMobilePaymentStatus() {
  const { reference } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  useTitle(t('label-paymentStatus') || 'Payment Status')

  const [checkAndConfirmPayment, { loading }] =
    useCheckAndConfirmPaymentMutation()
  const [status, setStatus] = useState<PaymentStatus>('en_attente')
  const [message, setMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [description, setDescription] = useState('')

  const checkPaymentStatus = async () => {
    if (!reference) {
      setStatus('error')
      setMessage('No payment reference provided')
      return
    }

    try {
      const { data } = await checkAndConfirmPayment({
        variables: { input: { reference } },
      })

      const code = data?.checkPaymentAndConfirm?.result?.statut
      const description = data?.checkPaymentAndConfirm?.result?.description
      setDescription(description ?? '')

      if (code === 'valide') {
        setStatus('valide')
        setMessage(
          t('label-paymentSuccessful') || 'Payment completed successfully!',
        )
      } else if (code === 'non_valide') {
        setStatus('non_valide')
        setMessage(
          t('label-paymentFailed') || 'Payment failed. Please try again.',
        )
      } else {
        setStatus('en_attente')
        setMessage(t('label-paymentPending') || 'Payment is being processed...')
      }
    } catch (error: any) {
      console.error('Payment check error:', error)
      if (attempts < 3) {
        setStatus('en_attente')
        setMessage(t('label-paymentPending') || 'Checking payment status...')
      } else {
        setStatus('error')
        setMessage(error?.message || 'Failed to check payment status')
        toast.error(error?.message || 'An error occurred')
      }
    }
  }

  useEffect(() => {
    checkPaymentStatus()

    // Only set up polling interval if status is still pending
    if (status === 'en_attente') {
      const interval = setInterval(() => {
        setAttempts((prev) => prev + 1)
        checkPaymentStatus()
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [reference, status])

  const getStatusConfig = () => {
    switch (status) {
      case 'valide':
        return {
          icon: <CheckCircle size={80} className="text-green-500" />,
          bgGradient: 'from-green-400/20 to-emerald-400/20',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-600',
          darkTextColor: 'dark:text-green-400',
          title: t('label-paymentSuccessful') || 'Payment Successful!',
          subtitle: description,
        }
      case 'non_valide':
        return {
          icon: <XCircle size={80} className="text-red-500" />,
          bgGradient: 'from-red-400/20 to-rose-400/20',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-600',
          darkTextColor: 'dark:text-red-400',
          title: t('label-paymentFailed') || 'Payment Failed',
          subtitle: description,
        }
      case 'en_attente':
        return {
          icon: <Clock size={80} className="text-blue-500 animate-pulse" />,
          bgGradient: 'from-blue-400/20 to-cyan-400/20',
          borderColor: 'border-blue-500/30',
          textColor: 'text-blue-600',
          darkTextColor: 'dark:text-blue-400',
          title: t('label-paymentPending') || 'Payment Processing',
          subtitle: t('Please wait while we confirm your payment'),
        }
      case 'error':
        return {
          icon: <XCircle size={80} className="text-orange-500" />,
          bgGradient: 'from-orange-400/20 to-amber-400/20',
          borderColor: 'border-orange-500/30',
          textColor: 'text-orange-600',
          darkTextColor: 'dark:text-orange-400',
          title: 'Error',
          subtitle: 'Unable to check payment status',
        }
      default:
        return {
          icon: <Loader size={80} className="text-gray-500 animate-spin" />,
          bgGradient: 'from-gray-400/20 to-slate-400/20',
          borderColor: 'border-gray-500/30',
          textColor: 'text-gray-600',
          darkTextColor: 'dark:text-gray-400',
          title: t('label-checkPayment') || 'Checking Payment',
          subtitle: 'Please wait...',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Main Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all duration-500 hover:scale-[1.02]">
          {/* Gradient Top Bar */}
          <div className={`h-2 bg-gradient-to-r ${config.bgGradient}`} />

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Icon with animated background */}
            <div className="flex justify-center mb-6">
              <div
                className={`relative p-6 rounded-full bg-gradient-to-br ${config.bgGradient} border-2 ${config.borderColor}`}
              >
                {config.icon}
                {status === 'en_attente' ? (
                  <div className="absolute inset-0 rounded-full animate-ping bg-gradient-to-br opacity-20" />
                ) : null}
              </div>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl font-bold text-center mb-3 ${config.textColor} ${config.darkTextColor}`}
            >
              {config.title}
            </h1>

            {/* Subtitle */}
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              {config.subtitle}
            </p>

            {/* Message */}
            {message && (
              <div
                className={`p-4 rounded-lg bg-gradient-to-r ${config.bgGradient} border ${config.borderColor} mb-6`}
              >
                <p
                  className={`text-sm text-center ${config.textColor} ${config.darkTextColor}`}
                >
                  {message}
                </p>
              </div>
            )}

            {/* Reference Number */}
            {reference && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1">
                  {t('label-reference') || 'Reference'}
                </p>
                <p className="text-sm font-mono text-gray-800 dark:text-gray-200 text-center font-semibold">
                  {reference}
                </p>
              </div>
            )}

            {/* Loading indicator for pending/checking */}
            {status === 'en_attente' && (
              <div className="flex flex-col items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('label-autoRefresh') ||
                    'Auto-refreshing every 5 seconds...'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {status === 'valide' && (
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-200 dark:shadow-none transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} />
                  {t('label-backToHome') || 'Back to Home'}
                </button>
              )}

              {status === 'non_valide' && (
                <button
                  onClick={() => navigate(-1)}
                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-200 dark:shadow-none transition-all transform hover:scale-[1.02]"
                >
                  {t('label-tryAgain') || 'Try Again'}
                </button>
              )}

              {status === 'error' && (
                <>
                  <button
                    onClick={checkPaymentStatus}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all transform hover:scale-[1.02]"
                  >
                    {t('label-retry') || 'Retry'}
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3.5 rounded-xl transition-all"
                  >
                    {t('label-backToHome') || 'Back to Home'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          {/* <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("label-paymentHelp") || "Need help? Contact support"}
          </p> */}
          <p className="text-xs font-medium">Sécurisé par NeemaDev</p>
        </div>
      </div>
    </div>
  )
}
