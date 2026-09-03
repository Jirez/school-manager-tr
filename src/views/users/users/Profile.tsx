import type { FC } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Power } from 'react-feather'
import { Navigate } from '@tanstack/react-router'
import { Card, Form } from 'reactstrap'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useLogout } from '@/hooks/useLogout'
import { formatError } from '@/utils/ErrorHelper'
import Button from '@/@core/components/button'
import { useUser } from '@/views/users/users/useUser'
import { Box } from '@/@core/components/box/Box'
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
    <Box title={m.title_2fa()} description={m.label_2faDesc()}>
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

        <div className="mt-2 flex justify-end">
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
    </Box>
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
    <Box
      title={'Mot de passe'}
      description={
        'Changez le mot de passe de votre compte souvent pour prévenir les accès non autorisés à votre compte.'
      }
    >
      <Form
        layout="vertical"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
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

        <div className="mt-2 flex justify-end">
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
    </Box>
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
    // setDisabled(true);
    updateUserMfa({
      variables: {
        username: username,
        mfa: values.mfa,
      },
    })
      .then(async ({ data }) => {
        // setDisabled(false);
        // form.resetFields();
        toast.success('Authentification en 2 étapes modifiée', {
          ...TOAST_OPTIONS,
        })
        // console.log(data)
        if (data?.updateMfa?.mfa) {
          setQrImageUrl(data.updateMfa.secretImageUri as any)
          setRedirect('/qrcode')
        }
      })
      .catch((error) => {
        // setDisabled(false);
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
        <PageHeader title={m.label_profile()} />
      </div>

      <div className="w-full md:w-8/12 lg:w-6/12 mx-auto">
        <Card
          // style={{ width: 820, border: "1px solid #e1e0e0", position: "relative"}}
          actions={[<Power onClick={logoutHandler} />]}
        >
          {username}
        </Card>

        <PasswordForm
          onSubmit={onPasswordFinish}
          isSubmitting={isSubmittingPassword}
        />

        <TwoStepAuthForm
          onSubmit={onMfaFinish}
          isSubmitting={isSubmittingMfa}
          user={user}
        />
      </div>
    </div>
  )
}

export default Profile
