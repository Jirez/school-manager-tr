import Button from '@/@core/components/button'
import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useLocation,
  useNavigate,
  Link,
  useSearch,
} from '@tanstack/react-router'
import { Form } from 'reactstrap'
import { z } from 'zod'
import { toast, Slide } from 'react-toastify'
import { useDebounceFn, useLocalStorageState } from 'ahooks'
import browserDetect from 'browser-detect'
import { AbilityContext } from '@/context/Can'
import { abilitiesFromAuthorities } from '@/configs/acl/ability'
import { DASHBOARD, LOGIN, VERIFY_CODE } from '@/utils/constants'
import { concat } from '@/utils/helpers'
import { useLoginMutation } from '@/gql/graphql'
import TokenStorage from '@/utils/TokenStorage'
import { ToastContent } from '@/@core/components/toast'
import { authenticationVar } from '../../ApiClient'
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react'
import { useAppForm } from '#/hooks/form/form'
import { m } from '@/paraglide/messages'

const loginSchema = z.object({
  username: z.string().min(5, m.string_min({ min: 5 })),
  password: z.string().min(8, m.string_min({ min: 8 })),
})

export default function LoginForm() {
  // ** Hooks
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { t } = useTranslation()

  const ability = useContext(AbilityContext)
  const location: any = useLocation()
  const search = useSearch({ strict: false }) as { returnUrl?: string }
  const returnUrl = search?.returnUrl || location?.state?.returnUrl
  const targetUrl =
    returnUrl && returnUrl !== LOGIN && returnUrl !== '/'
      ? returnUrl
      : DASHBOARD

  const browserInfo = browserDetect()
  const [_, setSchoolFeeCompulsory] = useLocalStorageState<boolean>(
    'schoolFeeCompulsory',
    {
      defaultValue: false,
    },
  )
  const { run } = useDebounceFn(
    () => {
      navigate({ to: targetUrl })
    },
    { wait: 20 },
  )

  const { handleSubmit, AppField } = useAppForm({
    defaultValues: {
      password: '',
      username: '',
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit({ value }) {
      loginUser({
        variables: {
          authRequest: {
            username: value.username,
            password: value.password,
            browserInfo: {
              name: browserInfo.name,
              versionNumber: String(browserInfo.versionNumber),
              version: browserInfo.version,
              mobile: browserInfo.mobile,
              os: browserInfo.os,
            },
          },
        },
      })
        .then(async ({ data }) => {
          if (data?.loginUser?.mfa) {
            authenticationVar({
              ...authenticationVar(),
              isAuthenticated: false,
            })
            navigate({
              to: VERIFY_CODE,
              state: { username: value.username, returnUrl: targetUrl },
            })
          } else {
            authenticationVar(dataToAuthentication(data))
            TokenStorage.write(data?.loginUser?.token!)
            localStorage.setItem(
              TokenStorage.authUserKey(),
              JSON.stringify(data?.loginUser),
            )
            // props.loginUserSuccess(data.loginUser);
            ability.update(abilitiesFromAuthorities())
            setSchoolFeeCompulsory(
              data?.loginUser?.user?.schoolFeeCompulsory ?? false,
            )
            //                    navigate(location?.state?.returnUrl || DASHBOARD);
            run() // redirect
            toast.success(
              <ToastContent
                title={`${t('text-welcome')} ${data?.loginUser?.user?.username}`}
                type="success"
              />,
              {
                icon: false,
                transition: Slide,
                hideProgressBar: true,
                autoClose: 2000,
              },
            )
          }
        })
        .catch((error) => {
          // message.error(`Impossible de se connecter : ${formatError(error)}`, 10);
          if (error.networkError) {
            toast.error(
              <ToastContent title={t('label-networkError')} type="danger" />,
              {
                icon: false,
                transition: Slide,
                hideProgressBar: true,
                autoClose: 10000,
              },
            )
            return
          }

          toast.error(<ToastContent title={error.message} type="danger" />, {
            icon: false,
            transition: Slide,
            hideProgressBar: true,
            autoClose: 5000,
          })
        })
    },
  })

  /* const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
        source = require(`@myAssets/images/pages/${illustration}`).default*/

  const dataToAuthentication = (data: any) => {
    const {
      loginUser: {
        token,
        mfa,
        user: {
          username,
          authorities,
          enterprise: { id, name },
          person: { id: personId, displayName, lastName, firstName },
        },
      },
    } = data
    return {
      displayName: displayName ? displayName : concat(firstName, lastName),
      username,
      isAuthenticated: true,
      authorities,
      personId,
      enterpriseId: id,
      enterprise: name,
      token,
      mfa,
      returnUrl: targetUrl,
      schoolCategory: data?.loginUser?.user?.schoolCategory,
    }
  }

  const [loginUser, { loading }] = useLoginMutation()

  /* if (redirect) {
    return (
      <Navigate to={{ pathname: redirect }} state={{ username: username }} />
    );
  } */

  return (
    <div>
      <Form
        className="auth-login-form mt-2"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <div className="flex justify-between items-center mb-0.5">
          <label className="form-label mb-0">{m.label_username()}</label>
        </div>
        <AppField
          name="username"
          // label={t("text-username")}
          children={(field) => (
            <field.Input
              autoFocus
              prepend={<User size={16} />}
              placeholder={m.label_username()}
            />
          )}
        />

        <div className="mb-1 mt-1">
          <div className="flex justify-between items-center mb-0.5">
            <label className="form-label mb-0">{m.label_password()}</label>
            <Link to="/forgot-password" tabIndex={-1}>
              <small>{t('text-forgot-password')}</small>
            </Link>
          </div>

          <AppField
            name="password"
            children={(field) => (
              <field.Input
                type={showPassword ? 'text' : 'password'}
                prepend={<Lock size={16} />}
                append={
                  <span onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </span>
                }
                placeholder={m.label_password()}
                className="mb-0"
              />
            )}
          />
        </div>
        {/* <div className='form-check mb-1'>
                                <Input type='checkbox' id='remember-me' />
                                <Label className='form-check-label' for='remember-me'>
                                    Remember Me
                                </Label>
                            </div>*/}

        <Button
          color="primary"
          type="submit"
          block
          loading={loading}
          className="mt-2"
        >
          <span className="mr-1">{m.login()}</span>
          <ArrowRight size={16} className="inline-block" />
        </Button>
      </Form>
    </div>
  )
}
