import type { FC } from 'react'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { Form } from 'reactstrap'
import { components } from 'react-select'
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
} from 'lucide-react'

import type { UserType } from '@/views/users/users/User.type'
import { useAuthentication } from '@/hooks/useAuthentication'
import {
  userCreateSchema,
  userUpdateSchema,
} from '@/views/users/users/user.validation'
import type {
  UserCreateSchemaType,
  UserUpdateSchemaType,
} from '@/views/users/users/user.validation'
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
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { m } from '@/paraglide/messages'

interface UserFormProps extends BaseFormProps {
  user?: UserType
  modal?: NiceModalHandler
  history: any
}

const UserForm: FC<UserFormProps> = ({ user, action, modal, ...props }) => {
  const { enterpriseId } = useAuthentication()
  const navigate = useNavigate()

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
    handleSubmit,
    AppField,
    reset,
    store,
    AppForm,
    SubmitButton,
    setFieldValue,
  } = useAppForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      password: '',
      confirm: '',
      personId: user ? user.person : null,
      isEnabled: user ? user.isEnabled : true,
      mfa: user ? (user.mfa ? user.mfa : false) : false,
      roles: user?.roles || null,
    } as UserCreateSchemaType | UserUpdateSchemaType | any,
    validators: {
      // @ts-ignore desc
      onChange: user ? userUpdateSchema : userCreateSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      const id = user ? Number(user.id) : undefined
      const values = user
        ? userUpdateSchema.parse(value)
        : userCreateSchema.parse(value)

      const userGroups = values.roles
        ? values.roles.map((val: any) => Number(val.id))
        : []

      action({
        variables: {
          user: {
            id,
            personId: user ? user.person.id : Number(values.personId?.id),
            username: values.username,
            password: values.password,
            email: values.email,
            isEnabled: values.isEnabled,
            mfa: values.mfa,
            roles: userGroups,
          },
        },
      })
        .then(async ({ data: result }) => {
          reset()
          toast.success(`Utilisateur ${result.user.username} enregistré`, {
            ...TOAST_OPTIONS,
          })
          if (result.user.mfa) {
            navigate({
              to: '/qrcode',
              state: { imageUrl: result.user.secretImageUri },
            })
          }
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (meta.close) {
            modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(
            `Impossible d'enregistrer l'utilisateur : ${formatError(error)}`,
          )
        })
    },
  })

  const isEnabled = useSelector(store, (state) => state.values.isEnabled)
  const mfa = useSelector(store, (state) => state.values.mfa)

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
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1">
        {/* Account Holder Section - Only for new users */}
        {!user && (
          <FormSection
            title={m.label_accountHolder() || 'Titulaire du compte'}
            description={
              m.label_accountHolderDesc() || 'Sélectionnez la personne associée'
            }
            icon={<UserCheck size={18} />}
            color="#7367f0"
            className="col-span-full"
          >
            <div className="">
              <AppField
                name="personId"
                children={(field) => (
                  <field.ControlledSelect
                    label={''}
                    required={true}
                    prepend={<User size={16} />}
                    loading={loading}
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
                    onChange={(val: any) => setFieldValue('personId', val)}
                  />
                )}
              />
            </div>
          </FormSection>
        )}

        {/* Basic Information Section */}
        <FormSection
          title={m.label_loginInfo() || 'Informations de connexion'}
          description={
            m.label_loginInfoDesc() || "Identifiants de l'utilisateur"
          }
          icon={<User size={18} />}
          color="#28c76f"
        >
          <div className="space-y-3">
            <AppField
              name="username"
              children={(field) => (
                <field.Input
                  label={m.label_username()}
                  required={true}
                  prepend={<User size={16} />}
                  autoComplete="new-password"
                  readOnly={!!user?.username}
                  placeholder="Nom d'utilisateur"
                />
              )}
            />

            <AppField
              name="email"
              children={(field) => (
                <field.Input
                  label={m.label_email()}
                  type="email"
                  prepend={<Mail size={16} />}
                  placeholder="adresse@exemple.com"
                />
              )}
            />
          </div>
        </FormSection>

        {/* Password Section */}
        <FormSection
          title={m.label_password() || 'Mot de passe'}
          description={
            user
              ? m.label_passwordCurrentDesc() ||
                'Laisser vide pour ne pas changer'
              : m.label_passwordDesc() || 'Créez un mot de passe sécurisé'
          }
          icon={<Lock size={18} />}
          color="#ff9f43"
        >
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-0">
              <AppField
                name="password"
                children={(field) => (
                  <field.InputPasswordToggle
                    label={m.label_password()}
                    required={!user}
                    autoComplete="new-password"
                    prepend={<Lock size={16} />}
                    placeholder={m.label_password()}
                    type="password"
                  />
                )}
              />

              <AppField
                name="confirm"
                children={(field) => (
                  <field.InputPasswordToggle
                    label={m.label_confirm()}
                    required={!user}
                    autoComplete="new-password"
                    prepend={<Key size={16} />}
                  />
                )}
              />
            </div>

            {/* Password Tips - More compact */}
            <div className="p-1 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700">
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <Shield size={10} className="text-warning" />
                <span>Min 8 car., majuscule, chiffre et car. spécial.</span>
              </p>
            </div>
          </div>
        </FormSection>

        {/* Security Settings Section */}
        <FormSection
          title={m.label_securitySettings() || 'Sécurité'}
          description={
            m.label_securitySettingsDesc() || 'Authentification et accès'
          }
          icon={<Shield size={18} />}
          color="#ea5455"
        >
          <div className="space-y-2">
            <ToggleOption
              icon={<UserCheck size={16} />}
              title={m.label_active()}
              description={m.label_activeUserDesc() || 'Compte activé'}
              isActive={isEnabled}
            >
              <AppField
                name="isEnabled"
                children={(field) => <field.Switch label="" />}
              />
            </ToggleOption>

            <ToggleOption
              icon={<Smartphone size={16} />}
              title={m.label_mfa()}
              description={m.label_mfaDesc() || 'Authentification 2FA'}
              isActive={mfa}
            >
              <AppField
                name="mfa"
                children={(field) => <field.Switch label="" />}
              />
            </ToggleOption>
          </div>
        </FormSection>

        {/* Roles Section */}
        <FormSection
          title={m.label_roles() || 'Rôles & Permissions'}
          description={
            m.label_rolesDesc() || "Accès et privilèges de l'utilisateur"
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
                <AppField
                  name="roles"
                  children={(field) => (
                    <field.ControlledSelect
                      label={''}
                      loading={loadingGroup}
                      prepend={<Shield size={16} />}
                      options={roles || undefined}
                      getOptionLabel={(option) => option.name}
                      getOptionValue={(option) => option.id}
                      isMulti={true}
                      onChange={(val) => setFieldValue('roles', val)}
                    />
                  )}
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
        <AppForm>
          <SubmitButton
            cancelAction={modal?.hide}
            isSubmitting={props.loading}
            popover={props.popover}
            onSubmit={(_, meta) => handleSubmit(meta)}
          />
        </AppForm>
      </StickyActions>
    </Form>
  )
}

export default UserForm
