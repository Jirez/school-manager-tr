import { useState, useContext } from 'react'
import styled, { keyframes } from 'styled-components'
import { toast } from 'react-toastify'
import ReactCodeInput from 'react-verification-code-input'
import { Lock, Shield, X, Check } from 'react-feather'
import { authenticationVar } from '../../../ApiClient'
import TokenStorage from '@/utils/TokenStorage'
import { formatError } from '@/utils/ErrorHelper'
import { Form } from 'reactstrap'
import Button from '@/@core/components/button'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { DASHBOARD } from '@/utils/constants'
import { AbilityContext } from '@/context/Can'
import { abilitiesFromAuthorities } from '@/configs/acl/ability'
import { useVerifyMutation } from '@/gql/graphql'
import { useTitle } from 'ahooks'

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.05) 0%,
    rgba(115, 103, 240, 0.02) 100%
  );

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.1) 0%,
      rgba(115, 103, 240, 0.05) 100%
    );
  }
`

const LoginContainer = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 3rem 2.5rem;
  border: 1px solid rgba(115, 103, 240, 0.2);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(255, 255, 255, 0.95) 100%
  );
  border-radius: 16px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(115, 103, 240, 0.05);
  animation: ${fadeIn} 0.4s ease-out;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #7367f0 0%, #9e95f5 50%, #7367f0 100%);
    background-size: 200% 100%;
    animation: ${pulse} 3s ease-in-out infinite;
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(40, 48, 70, 0.98) 0%,
      rgba(40, 48, 70, 0.95) 100%
    );
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.3),
      0 4px 6px -2px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(115, 103, 240, 0.1);
  }

  @media (max-width: 640px) {
    padding: 2rem 1.5rem;
    max-width: 100%;
    margin: 0 1rem;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
  animation: ${slideIn} 0.5s ease-out;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.15) 0%,
    rgba(115, 103, 240, 0.1) 100%
  );
  margin-bottom: 1.5rem;
  box-shadow:
    0 4px 12px rgba(115, 103, 240, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 16px;
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.3),
      rgba(115, 103, 240, 0.1)
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }

  svg {
    color: #7367f0;
    filter: drop-shadow(0 2px 4px rgba(115, 103, 240, 0.3));
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.25) 0%,
      rgba(115, 103, 240, 0.15) 100%
    );
    box-shadow:
      0 4px 12px rgba(115, 103, 240, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);

    svg {
      color: #9e95f5;
    }
  }
`

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: -0.02em;

  .dark-layout & {
    color: #e4e6eb;
  }

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #6c757d;
  margin: 0;
  text-align: center;
  line-height: 1.5;

  .dark-layout & {
    color: #9ca3af;
  }
`

const CodeInputWrapper = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  animation: ${slideIn} 0.6s ease-out;

  .react-verification-code-input {
    display: flex;
    gap: 0.75rem;
    justify-content: center;

    input {
      width: 48px !important;
      height: 56px !important;
      font-size: 1.5rem !important;
      font-weight: 600 !important;
      text-align: center;
      border: 2px solid rgba(115, 103, 240, 0.2) !important;
      border-radius: 12px !important;
      background: rgba(255, 255, 255, 0.8) !important;
      color: #2c3e50 !important;
      transition: all 0.2s ease !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05) !important;

      &:focus {
        border-color: #7367f0 !important;
        background: #ffffff !important;
        box-shadow:
          0 0 0 4px rgba(115, 103, 240, 0.1),
          0 4px 12px rgba(115, 103, 240, 0.2) !important;
        outline: none !important;
        transform: translateY(-2px) !important;
      }

      &:hover:not(:focus) {
        border-color: rgba(115, 103, 240, 0.4) !important;
      }

      .dark-layout & {
        background: rgba(40, 48, 70, 0.8) !important;
        border-color: rgba(115, 103, 240, 0.3) !important;
        color: #e4e6eb !important;

        &:focus {
          background: rgba(40, 48, 70, 1) !important;
          border-color: #7367f0 !important;
          box-shadow:
            0 0 0 4px rgba(115, 103, 240, 0.2),
            0 4px 12px rgba(115, 103, 240, 0.3) !important;
        }

        &:hover:not(:focus) {
          border-color: rgba(115, 103, 240, 0.5) !important;
        }
      }
    }
  }

  @media (max-width: 640px) {
    .react-verification-code-input {
      gap: 0.5rem;

      input {
        width: 42px !important;
        height: 50px !important;
        font-size: 1.25rem !important;
      }
    }
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 2rem;
  animation: ${slideIn} 0.7s ease-out;

  @media (max-width: 640px) {
    flex-direction: column-reverse;
    gap: 0.75rem;

    button {
      width: 100%;
    }
  }
`

const StyledForm = styled(Form)`
  width: 100%;
`

const VerifyCode = (props: any) => {
  const [code, setCode] = useState<string>()
  const [complete, setComplete] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location: any = useLocation()
  const { t } = useTranslation()
  useTitle('Verify Code | SchoolManager')
  const ability = useContext(AbilityContext)

  //console.log(location.state.username)

  const dataToAuthentication = (data: any) => {
    const {
      verify: {
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
      displayName: displayName
        ? displayName
        : firstName
          ? lastName + ' ' + firstName
          : lastName,
      username,
      isAuthenticated: true,
      authorities,
      personId,
      enterpriseId: id,
      enterprise: name,
      token,
      mfa,
      returnUrl: '/',
    }
  }

  const [verifyUserCode] = useVerifyMutation()

  const onFinish = (e: any) => {
    e?.preventDefault()
    setLoading(true)
    verifyUserCode({
      variables: {
        username: location.state.username,
        code: String(code),
      },
    })
      .then(async ({ data }) => {
        authenticationVar(dataToAuthentication(data))
        TokenStorage.write(data?.verify?.token!)
        localStorage.setItem('schoolAuthUser', JSON.stringify(data?.verify))
        setLoading(false)
        ability.update(abilitiesFromAuthorities())
        navigate(location?.state?.returnUrl || DASHBOARD)
      })
      .catch((error) => {
        //console.log(error)
        setLoading(false)
        toast.error(`Impossible de se connecter : ${formatError(error)}`)
      })
  }

  /*useEffect(() => {
        if (isAuthenticated) {
            history.push('/');
        }
    }, [isAuthenticated, history]);*/

  const onComplete = function () {
    setComplete(true)
  }

  const handleChange = function (val: any) {
    if (val.length >= 6) {
      setComplete(true)
      setCode(val)
    } else {
      setComplete(false)
    }
  }

  return (
    <Container>
      <LoginContainer>
        <Header>
          <IconWrapper>
            <Shield size={32} strokeWidth={2.5} />
          </IconWrapper>
          <Title>
            <Lock size={24} />
            SchoolManager
          </Title>
          <Subtitle>
            {t('label-verifyCodeDescription') ||
              'Entrez le code de vérification à 6 chiffres envoyé à votre appareil'}
          </Subtitle>
        </Header>

        <StyledForm
          name="normal_login"
          className="login-form"
          onSubmit={onFinish}
        >
          <CodeInputWrapper>
            <ReactCodeInput
              onComplete={onComplete}
              onChange={handleChange}
              autoFocus={true}
            />
          </CodeInputWrapper>

          <ButtonGroup>
            <Button
              onClick={() => navigate({ to: '/login' })}
              className="round flex flex-row items-center gap-2"
              size="large"
              color="danger"
              outline
              style={{
                minWidth: '140px',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={18} />
              {t('label-cancel')}
            </Button>
            <Button
              type="submit"
              className="round flex flex-row items-center gap-2"
              color="primary"
              size="large"
              loading={loading}
              disabled={!complete}
              style={{
                minWidth: '140px',
                transition: 'all 0.2s ease',
                opacity: complete ? 1 : 0.6,
                cursor: complete ? 'pointer' : 'not-allowed',
              }}
            >
              <Check size={18} />
              {t('label-verify')}
            </Button>
          </ButtonGroup>
        </StyledForm>
      </LoginContainer>
    </Container>
  )
}

export default VerifyCode
