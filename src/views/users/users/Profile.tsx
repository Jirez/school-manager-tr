import type { FC } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Navigate } from '@tanstack/react-router'
import { Form } from 'reactstrap'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useLogout } from '@/hooks/useLogout'
import { formatError } from '@/utils/ErrorHelper'
import Button from '@/@core/components/button'
import { useUser } from '@/views/users/users/useUser'
import Loader from '@/@core/components/spinner/loader'
import PageHeader from '@/@core/components/ui/page-header'
import { passwordChangeSchema } from '@/views/users/users/user.validation'
import {
  useMfaUpdateMutation,
  useUserPasswordUpdateMutation,
} from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'
import { useTitle } from 'ahooks'
import { useAppForm } from '#/hooks/form/form'
import { m } from '@/paraglide/messages'
import { User, Shield, Lock, LogOut, Mail } from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'

interface TwoStepAuthFormProps {
  user?: any
  onSubmit: (values: { mfa: boolean }) => void
  isSubmitting: boolean
}

const TwoStepAuthForm: FC<TwoStepAuthFormProps> = ({
  user,
  onSubmit,
  isSubmitting,
}) => {
  useTitle('Profil')

  const { handleSubmit, AppField } = useAppForm({
    defaultValues: {
      mfa: user ? user.mfa : false,
    },
    onSubmit({ value }) {
      onSubmit({ mfa: value.mfa })
    },
  })

  return (
    <FormSection
      icon={<Shield size={18} />}
      title={m.title_2fa()}
      description={m.label_2faDesc()}
      color="#7367f0"
    >
      <Form
        layout="vertical"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <AppField
          name="mfa"
          children={(field) => <field.Switch label={m.label_enable2fa()} />}
        />

        <div className="mt-4 flex justify-end">
          <Button
            color="primary"
            type="submit"
            loading={isSubmitting}
            className="round"
          >
            {m.label_update()}
          </Button>
        </div>
      </Form>
    </FormSection>
  )
}

interface PasswordFormValues {
  newPassword: string
  originalPassword: string
  confirm: string
}

interface PasswordFormProps {
  user?: any
  onSubmit: (values: PasswordFormValues, callback: () => void) => void
  isSubmitting: boolean
}

const PasswordForm: FC<PasswordFormProps> = ({ onSubmit, isSubmitting }) => {
  const { handleSubmit, AppField, reset } = useAppForm({
    defaultValues: {
      originalPassword: '',
      newPassword: '',
      confirm: '',
    },
    validators: {
      onChange: passwordChangeSchema,
    },
    onSubmit({ value }) {
      onSubmit(value, reset)
    },
  })

  return (
    <FormSection
      icon={<Lock size={18} />}
      title={m.label_password()}
      description={
        m.label_passwordDesc() || 'Changez le mot de passe de votre compte'
      }
      color="#28c76f"
    >
      <Form
        layout="vertical"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <div className="space-y-4">
          <div className="mb-1">
            <AppField
              name="originalPassword"
              children={(field) => (
                <field.InputPasswordToggle
                  className="input-group-merge"
                  placeholder={m.label_originalPassword()}
                  label={m.label_originalPassword()}
                />
              )}
            />
          </div>

          <div className="mb-1">
            <AppField
              name="newPassword"
              children={(field) => (
                <field.InputPasswordToggle
                  className="input-group-merge"
                  placeholder={m.label_newPassword()}
                  label={m.label_newPassword()}
                />
              )}
            />
          </div>

          <div className="mb-1">
            <AppField
              name="confirm"
              children={(field) => (
                <field.InputPasswordToggle
                  className="input-group-merge"
                  placeholder={m.label_confirmNewPassword()}
                  label={m.label_confirmNewPassword()}
                />
              )}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            color="primary"
            type="submit"
            loading={isSubmitting}
            className="round"
          >
            {m.label_update()}
          </Button>
        </div>
      </Form>
    </FormSection>
  )
}

const Profile = () => {
  const [redirect, setRedirect] = useState<string>()
  const [qrImageUrl, setQrImageUrl] = useState()
  const { username } = useAuthentication()
  const [updatePassword, { loading: isSubmittingPassword }] =
    useUserPasswordUpdateMutation()
  const [updateUserMfa, { loading: isSubmittingMfa }] = useMfaUpdateMutation()
  const { logout } = useLogout()
  const { user } = useUser(username)

  const onPasswordFinish: (
    values: PasswordFormValues,
    callback: () => void,
  ) => void = (values, callback) => {
    updatePassword({
      variables: {
        username: username,
        updatePasswordInput: {
          originalPassword: values.originalPassword,
          newPassword: values.newPassword,
        },
      },
    })
      .then(async () => {
        callback()
        toast.success('Mot de passe changé avec succès', { ...TOAST_OPTIONS })
      })
      .catch((error) => {
        toast.error(
          `Impossible de changer le mot de passe : ${formatError(error)}`,
        )
      })
  }

  const onMfaFinish = (values: any) => {
    updateUserMfa({
      variables: {
        username: username,
        mfa: values.mfa,
      },
    })
      .then(async ({ data }) => {
        toast.success('Authentification en 2 étapes modifiée', {
          ...TOAST_OPTIONS,
        })
        if (data?.updateMfa?.mfa) {
          setQrImageUrl(data.updateMfa.secretImageUri as any)
          setRedirect('/qrcode')
        }
      })
      .catch((error) => {
        toast.error(`Opération non effectuée : ${formatError(error)}`)
      })
  }

  const logoutHandler = function () {
    logout(true)
  }

  if (redirect) {
    return (
      <Navigate to={{ pathname: redirect }} state={{ imageUrl: qrImageUrl }} />
    )
  }

  if (!user) {
    return <Loader />
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <PageHeader
          title={m.label_profile()}
          icon={<User size={20} />}
          actions={
            <button
              onClick={logoutHandler}
              type="button"
              className="
                flex items-center gap-2 px-4 py-2
              "
            >
              <LogOut size={16} />
              {m.label_logout()}
            </button>
          }
        />
      </div>

      <div className="w-full md:w-8/12 lg:w-6/12 mx-auto space-y-2 mt-1">
        {/* User Info Card */}
        <FormSection
          icon={<User size={18} />}
          title={m.label_userInfo()}
          description={m.label_userInfoDesc()}
          color="#7367f0"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0">
                <User size={16} className="text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 m-0 leading-tight">
                  {m.label_username()}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white m-0 leading-tight truncate">
                  {username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex-shrink-0">
                <Mail
                  size={16}
                  className="text-green-600 dark:text-green-400"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 m-0 leading-tight">
                  {m.label_email()}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white m-0 leading-tight truncate">
                  {user.email || 'Non renseigné'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex-shrink-0">
                <Shield
                  size={16}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 m-0 leading-tight">
                  {m.label_mfa() || 'Authentification 2FA'}
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white m-0 leading-tight">
                  {user.mfa ? 'Activée' : 'Désactivée'}
                </p>
              </div>
            </div>
          </div>
        </FormSection>

        <PasswordForm
          onSubmit={onPasswordFinish}
          isSubmitting={isSubmittingPassword}
        />

        <TwoStepAuthForm
          onSubmit={onMfaFinish}
          isSubmitting={isSubmittingMfa}
          user={user}
        />

        <div className="h-4" />
      </div>
    </div>
  )
}

export default Profile
