import type { FC } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Power } from 'react-feather'
import { Navigate } from '@tanstack/react-router'
import { Card, Form, Label } from 'reactstrap'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import type { SubmitHandler } from 'react-hook-form'
import { useForm, Controller } from 'react-hook-form'

import { useAuthentication } from '@/hooks/useAuthentication'
import { useLogout } from '@/hooks/useLogout'
import { formatError } from '@/utils/ErrorHelper'
import Button from '@/@core/components/button'
import { useUser } from '@/views/users/users/useUser'
import Switch from '@/@core/components/ui/forms/swith'
import { Box } from '@/@core/components/box/Box'
import Loader from '@/@core/components/spinner/loader'
import PageHeader from '@/@core/components/ui/page-header'
import InputPasswordToggle from '@/@core/components/input-password-toggle'
import { passwordChangeValidationSchema } from '@/views/users/users/user.validation'
import {
  useMfaUpdateMutation,
  useUserPasswordUpdateMutation,
} from '@/gql/graphql'
import { TOAST_OPTIONS } from '@/utils/constants'
import { useTitle } from 'ahooks'

interface TwoStepAuthFormProps {
  user?: any
  onSubmit: SubmitHandler<any>
  isSubmitting: boolean
}

const TwoStepAuthForm: FC<TwoStepAuthFormProps> = ({
  user,
  onSubmit,
  isSubmitting,
}) => {
  const { t } = useTranslation()
  useTitle('Profil')
  const { control, handleSubmit, getValues } = useForm({
    defaultValues: {
      mfa: user ? user.mfa : false,
    },
  })

  return (
    <Box
      title={'Authentification en 2 étapes'}
      description={
        "Utiliser l'authentification à 2 facteurs pour renforcer votre sécurité"
      }
    >
      <Form layout="vertical" onSubmit={handleSubmit(onSubmit)}>
        <Switch
          name="mfa"
          control={control}
          label={"Activer l'authentification en 2 étapes"}
          defaultChecked={getValues('mfa')}
        />

        <div className="mt-2 flex justify-end">
          <Button
            color="primary"
            type="submit"
            loading={isSubmitting}
            className="round"
          >
            {t('label-update')}
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
  onSubmit: SubmitHandler<any>
  isSubmitting: boolean
}

const PasswordForm: FC<PasswordFormProps> = ({ onSubmit, isSubmitting }) => {
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    defaultValues: {
      originalPassword: '',
      newPassword: '',
      confirm: '',
    },
    resolver: yupResolver(passwordChangeValidationSchema),
    mode: 'all',
  })

  return (
    <Box
      title={'Mot de passe'}
      description={
        'Changez le mot de passe de votre compte souvent pour prévenir les accès non autorisés à votre compte.'
      }
    >
      <Form layout="vertical" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label">{t('label-originalPassword')}</Label>
          <Controller
            control={control}
            name="originalPassword"
            render={({ field }) => (
              <InputPasswordToggle
                className="input-group-merge"
                placeholder={t('label-originalPassword')}
                invalid={errors.originalPassword && true}
                {...field}
              />
            )}
          />
        </div>

        <div className="mb-1">
          <Label className="form-label">{t('label-newPassword')}</Label>
          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
              <InputPasswordToggle
                className="input-group-merge"
                placeholder={t('label-newPassword')}
                invalid={errors.newPassword && true}
                {...field}
              />
            )}
          />
        </div>

        <div className="mb-1">
          <Label className="form-label">{t('label-confirmNewPassword')}</Label>
          <Controller
            control={control}
            name="confirm"
            render={({ field }) => (
              <InputPasswordToggle
                className="input-group-merge"
                placeholder={t('label-confirmNewPassword')}
                invalid={errors.confirm && true}
                {...field}
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
            {t('label-update')}
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
  const { t } = useTranslation()

  const onPasswordFinish: SubmitHandler<any> = (values) => {
    updatePassword({
      variables: {
        username: username,
        updatePasswordInput: {
          originalPassword: values.originalPassword,
          newPassword: values.newPassword,
        },
      },
    })
      .then(async ({ data }) => {
        //form.resetFields();
        toast.success('Mot de passe changé avec succès', { ...TOAST_OPTIONS })
      })
      .catch((error) => {
        toast.error(
          `Impossible de changer le mot de passe : ${formatError(error)}`,
        )
      })
  }

  const onMfaFinish: SubmitHandler<any> = (values) => {
    //setDisabled(true);
    updateUserMfa({
      variables: {
        username: username,
        mfa: values.mfa,
      },
    })
      .then(async ({ data }) => {
        //setDisabled(false);
        //form.resetFields();
        toast.success('Authentification en 2 étapes modifiée', {
          ...TOAST_OPTIONS,
        })
        //console.log(data)
        if (data?.updateMfa?.mfa) {
          setQrImageUrl(data?.updateMfa?.secretImageUri as any)
          setRedirect('/qrcode')
        }
      })
      .catch((error) => {
        //setDisabled(false);
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
        <PageHeader title={t('text-profile')} />
      </div>

      <div className="w-full md:w-8/12 lg:w-6/12 mx-auto">
        <Card
          //style={{ width: 820, border: "1px solid #e1e0e0", position: "relative"}}
          actions={[<Power onClick={logoutHandler} />]}
        >
          {/*<Meta
                        avatar={
                            <Avatar
                                src={""}
                                className="user-avatar-circle0"
                                style={{
                                    width: "150px !important",
                                    height: "150px !important",
                                    cursor: "pointer"
                                }}
                            />
                        }
                        title={displayName}
                        description={"@" + username}
                    />*/}
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
