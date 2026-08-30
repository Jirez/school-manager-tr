import Button from '@/@core/components/button'
import { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
// import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useLocation, useNavigate, Link } from '@tanstack/react-router'
import { Form } from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
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
import Input from '@/@core/components/ui/forms/input'

interface FormValues {
  username: string
  password: string
}

const loginSchema = yup.object().shape({
  username: yup.string().required().min(5),
  password: yup.string().required(),
})

export default function LoginForm() {
  // ** Hooks
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const { t } = useTranslation()

  const ability = useContext(AbilityContext)
  const location: any = useLocation()
  const browserInfo = browserDetect()
  const [_, setSchoolFeeCompulsory] = useLocalStorageState<boolean>(
    'schoolFeeCompulsory',
    {
      defaultValue: false,
    },
  )
  const { run } = useDebounceFn(
    () => {
      navigate({ to: location?.state?.returnUrl || DASHBOARD })
    },
    { wait: 20 },
  )

  // console.log(location?.state?.returnUrl)
  const {
    control,
    // setError,
    handleSubmit,
    // formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      password: '',
      username: '',
    },
    resolver: yupResolver(loginSchema),
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
    const returnUrl = location?.state?.returnUrl

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
      returnUrl: returnUrl === LOGIN ? '/' : returnUrl,
      schoolCategory: data?.loginUser?.user?.schoolCategory,
    }
  }

  const [loginUser, { loading }] = useLoginMutation()

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    loginUser({
      variables: {
        authRequest: {
          username: values.username,
          password: values.password,
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
          authenticationVar({ ...authenticationVar(), isAuthenticated: false })
          // setUsername(values.username);
          // setRedirect(VERIFY_CODE);
          // navigate(VERIFY_CODE, { state: { username: username } })
          navigate({ to: VERIFY_CODE, state: { username: values.username } })
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
  }

  /* if (redirect) {
    return (
      <Navigate to={{ pathname: redirect }} state={{ username: username }} />
    );
  } */

  return (
    <div>
      <Form className="auth-login-form mt-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-0.5">
          <label className="form-label mb-0">{t('text-username')}</label>
        </div>
        <Input
          name="username"
          // label={t("text-username")}
          control={control}
          autoFocus
          prepend={<User size={16} />}
          placeholder={t('label-username')}
        />

        <div className="mb-1 mt-1">
          <div className="flex justify-between items-center mb-0.5">
            <label className="form-label mb-0">{t('text-password')}</label>
            <Link to="/forgot-password" tabIndex={-1}>
              <small>{t('text-forgot-password')}</small>
            </Link>
          </div>
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            control={control}
            prepend={<Lock size={16} />}
            append={
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </span>
            }
            placeholder={t('label-password')}
            className="mb-0"
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
          <span className="mr-1">{t('app.userAuth.login')}</span>
          <ArrowRight size={16} className="inline-block" />
        </Button>
      </Form>
    </div>
  )
}
