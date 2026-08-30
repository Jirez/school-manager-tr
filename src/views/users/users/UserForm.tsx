import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { Form } from 'reactstrap'
import { components } from 'react-select'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { useNavigate } from '@tanstack/react-router'
import {
  User,
  Lock,
  Shield,
  UserCheck,
  Smartphone,
  Mail,
  CheckCircle,
  Key,
  Eye,
  EyeOff,
} from 'lucide-react'

import type { UserType } from '@/views/users/users/User.type'
import { useAuthentication } from '@/hooks/useAuthentication'
import {
  userUpdateValidationSchema,
  userValidationSchema,
} from '@/views/users/users/user.validation'
import Input from '@/@core/components/ui/forms/input'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import Switch from '@/@core/components/ui/forms/swith'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import ComboboxItem from '@/@core/components/ui/combobox-item'
import { concat } from '@/utils/helpers'
import LiveView from '@/utils/LiveView'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  UserGroupCreatedDocument,
  usePeopleWithoutAccountQuery,
  useRolesQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

interface UserFormProps extends BaseFormProps {
  user?: UserType
  modal?: NiceModalHandler
  history: any
}

const UserForm: FC<UserFormProps> = ({ user, action, modal, ...props }) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const { data, loading } = usePeopleWithoutAccountQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'no-cache',
  })

  const {
    data: dataGroup,
    loading: loadingGroup,
    subscribeToMore: subscribeToMoreGroup,
  } = useRolesQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'no-cache',
  })

  const {
    control,
    formState: { isDirty, errors },
    handleSubmit,
    setValue,
    getValues,
  } = useForm<UserType>({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      confirm: '',
      personId: user ? user.person : null,
      isEnabled: user ? user.isEnabled : true,
      mfa: user ? (user.mfa ? user.mfa : false) : false,
      roles: user?.roles || null,
    },
    resolver: yupResolver(
      user ? userUpdateValidationSchema : userValidationSchema,
    ),
  })

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      const id = user ? Number(user.id) : undefined

      const userGroups = values.roles
        ? values.roles.map((val: any) => Number(val.id))
        : []

      action({
        variables: {
          user: {
            id,
            personId: user ? user.person.id : Number(values.personId.id),
            username: values.username,
            password: values.password,
            email: values.email,
            isEnabled: values.isEnabled,
            mfa: values.mfa,
            roles: userGroups,
          },
        },
      })
        .then(async ({ data }) => {
          toast.success(`Utilisateur ${data.user.username} enregistré`, {
            ...TOAST_OPTIONS,
          })
          if (data.user.mfa) {
            navigate('/qrcode', {
              state: { imageUrl: data.user.secretImageUri },
            })
          }
          if (close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer l'utilisateur : ${formatError(error)}`,
          )
        })
    })(event)
  }

  const componentOptions = (props: any) => (
    <components.Option {...props}>
      <ComboboxItem
        name={concat(props.data.lastName, props.data.firstName)}
        description={props.data.__typename}
      />
    </components.Option>
  )

  const SingleValue = (props: any) => (
    <components.SingleValue {...props}>
      {concat(props.data.lastName, props.data.firstName)}
    </components.SingleValue>
  )

  return (
    <Form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1">
        {/* Account Holder Section - Only for new users */}
        {!user && (
          <FormSection
            title={t('label-accountHolder') || 'Titulaire du compte'}
            description={
              t('label-accountHolderDesc') ||
              'Sélectionnez la personne associée'
            }
            icon={<UserCheck size={18} />}
            color="#7367f0"
            className="col-span-full"
          >
            <div className="">
              <ControlledSelect
                name="personId"
                label={''}
                control={control}
                loading={loading}
                prepend={<User size={16} />}
                onChange={(val: any) => setValue('personId', val)}
                options={
                  data && data.people
                    ? data.people.filter(
                        ({ __typename }: any) =>
                          __typename === 'Teacher' ||
                          __typename === 'Agent' ||
                          __typename === 'Administrator',
                      )
                    : undefined
                }
                getOptionLabel={(option: any) => option.displayName}
                getOptionValue={(option: any) => option.id}
                components={{ Option: componentOptions, SingleValue }}
              />
            </div>
          </FormSection>
        )}

        {/* Basic Information Section */}
        <FormSection
          title={t('label-loginInfo') || 'Informations de connexion'}
          description={
            t('label-loginInfoDesc') || "Identifiants de l'utilisateur"
          }
          icon={<User size={18} />}
          color="#28c76f"
        >
          <div className="space-y-3">
            <Input
              name="username"
              label={t('label-username')}
              control={control}
              required={true}
              prepend={<User size={16} />}
              autoComplete="new-password"
              readOnly={!!user?.username}
              placeholder="Nom d'utilisateur"
            />

            <Input
              name="email"
              label={t('label-email')}
              control={control}
              type="email"
              prepend={<Mail size={16} />}
              placeholder="adresse@exemple.com"
            />
          </div>
        </FormSection>

        {/* Password Section */}
        <FormSection
          title={t('label-password') || 'Mot de passe'}
          description={
            user
              ? t('label-passwordCurrentDesc') ||
                'Laisser vide pour ne pas changer'
              : t('label-passwordDesc') || 'Créez un mot de passe sécurisé'
          }
          icon={<Lock size={18} />}
          color="#ff9f43"
        >
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              <Input
                name="password"
                label={t('text-password')}
                control={control}
                required={!user}
                autoComplete="new-password"
                type={showPassword ? 'text' : 'password'}
                prepend={<Lock size={16} />}
                append={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="bg-transparent border-0 p-0 cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                placeholder={t('text-password')}
                invalid={!!errors.password}
              />

              <Input
                name="confirm"
                label={t('label-confirm')}
                control={control}
                required={!user}
                autoComplete="new-password"
                type="password"
                prepend={<Key size={16} />}
              />
            </div>

            {/* Password Tips - More compact */}
            <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700">
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <Shield size={10} className="text-warning" />
                <span>Min 8 car., majuscule, chiffre et car. spécial.</span>
              </p>
            </div>
          </div>
        </FormSection>

        {/* Security Settings Section */}
        <FormSection
          title={t('label-securitySettings') || 'Sécurité'}
          description={
            t('label-securitySettingsDesc') || 'Authentification et accès'
          }
          icon={<Shield size={18} />}
          color="#ea5455"
        >
          <div className="space-y-2">
            <ToggleOption
              icon={<UserCheck size={16} />}
              title={t('label-active')}
              description={t('label-activeUserDesc') || 'Compte activé'}
              isActive={getValues('isEnabled')}
            >
              <Switch
                name="isEnabled"
                control={control}
                defaultChecked={getValues('isEnabled')}
                label=""
                onChange={(e: any) =>
                  setValue('isEnabled', e.target.checked, { shouldDirty: true })
                }
              />
            </ToggleOption>

            <ToggleOption
              icon={<Smartphone size={16} />}
              title={t('label-mfa')}
              description={t('label-mfaDesc') || 'Authentification 2FA'}
              isActive={getValues('mfa')}
            >
              <Switch
                name="mfa"
                control={control}
                defaultChecked={getValues('mfa')}
                label=""
                onChange={(e: any) =>
                  setValue('mfa', e.target.checked, { shouldDirty: true })
                }
              />
            </ToggleOption>
          </div>
        </FormSection>

        {/* Roles Section */}
        <FormSection
          title={t('label-roles') || 'Rôles & Permissions'}
          description={
            t('label-rolesDesc') || "Accès et privilèges de l'utilisateur"
          }
          icon={<CheckCircle size={18} />}
          color="#00cfe8"
        >
          <div className="space-y-2">
            <LiveView
              document={UserGroupCreatedDocument}
              singleVar="role"
              data={dataGroup}
              loading={loadingGroup}
              listVar="roles"
              subscribeToMore={subscribeToMoreGroup}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ roles }) => (
                <ControlledSelect
                  name="roles"
                  label={''}
                  control={control}
                  loading={loadingGroup}
                  prepend={<Shield size={16} />}
                  onChange={(val) =>
                    setValue('roles', val, { shouldDirty: true })
                  }
                  options={roles || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  formId="role"
                  optionLabel="name"
                  isMulti={true}
                />
              )}
            </LiveView>

            <div className="p-2 bg-blue-50/50 dark:bg-blue-900/10 rounded border border-blue-100 dark:border-blue-800/50">
              <p className="text-[10px] text-blue-600 dark:text-blue-400 leading-tight">
                Les rôles définissent les permissions. Vous pouvez en attribuer
                plusieurs.
              </p>
            </div>
          </div>
        </FormSection>
      </div>

      {/* Action Buttons */}
      <StickyActions>
        <ActionButtons
          cancelAction={modal?.hide}
          isSubmitting={props.loading}
          popover={props.popover}
          dirty={isDirty}
          onSubmit={onSubmit}
        />
      </StickyActions>
    </Form>
  )
}

export default UserForm
