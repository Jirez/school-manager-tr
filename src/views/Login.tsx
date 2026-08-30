// ** Custom Hooks
import { useSkin } from '@/hooks/useSkin'

// ** Third Party Components
import { Link } from '@tanstack/react-router'
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'
import { useTranslation } from 'react-i18next'

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText } from 'reactstrap'

import json from '../../package.json'
import darkImg from '@/assets/images/pages/login-v9.svg'
import lightImg from '@/assets/images/pages/login-v9.svg'

// ** Styles
import '@/@core/scss/react/pages/page-authentication.scss'

import ThemeToggler from '@/@core/components/theme/theme-toggler'
import { useTitle } from 'ahooks'
import LoginForm from './users/login-form'
import { SocialIconButton, SocialIconsContainer } from './login.style'

// let renderCount = 0;

const Login = () => {
  const { t } = useTranslation()
  const { skin } = useSkin()
  useTitle(t('app.userAuth'))

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link
          className="brand-logo w-96"
          to="/"
          onClick={(e) => e.preventDefault()}
        >
          <svg viewBox="0 0 139 95" version="1.1" height="28">
            <defs>
              <linearGradient
                x1="100%"
                y1="10.5120544%"
                x2="50%"
                y2="89.4879456%"
                id="linearGradient-1"
              >
                <stop stopColor="#000000" offset="0%" />
                <stop stopColor="#FFFFFF" offset="100%" />
              </linearGradient>
              <linearGradient
                x1="64.0437835%"
                y1="46.3276743%"
                x2="37.373316%"
                y2="100%"
                id="linearGradient-2"
              >
                <stop stopColor="#EEEEEE" stopOpacity="0" offset="0%" />
                <stop stopColor="#FFFFFF" offset="100%" />
              </linearGradient>
            </defs>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="Artboard" transform="translate(-400.000000, -178.000000)">
                <g id="Group" transform="translate(400.000000, 178.000000)">
                  <path
                    d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                    id="Path"
                    className="text-primary"
                    style={{ fill: 'currentColor' }}
                  />
                  <path
                    d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                    id="Path"
                    fill="url(#linearGradient-1)"
                    opacity="0.2"
                  />
                  <polygon
                    id="Path-2"
                    fill="#000000"
                    opacity="0.049999997"
                    points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                  />
                  <polygon
                    id="Path-2"
                    fill="#000000"
                    opacity="0.099999994"
                    points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                  />
                  <polygon
                    id="Path-3"
                    fill="url(#linearGradient-2)"
                    opacity="0.099999994"
                    points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                  />
                </g>
              </g>
            </g>
          </svg>
          <h2 className="brand-text text-primary ms-1">
            SchoolManager {json.version}
          </h2>
        </Link>

        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img
              className="img-fluid w-[70%]"
              src={skin === 'dark' ? darkImg : lightImg}
              alt="Login Cover"
            />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <div
              className=""
              style={{
                position: 'absolute',
                top: '25px',
                right: '40px',
                zIndex: 1000,
              }}
            >
              <ThemeToggler />
            </div>
            <CardTitle tag="h2" className="fw-bold !font-semibold text-xl mb-1">
              {t('text-welcome-to')} SchoolManager {json.version}
            </CardTitle>
            <CardText className="mb-2">{t('text-invite-login')}</CardText>

            <LoginForm />

            {/* <p className='text-center mt-2'>
                            <span className='me-25'>New on our platform?</span>
                            <Link to='/pages/register-cover'>
                                <span>Create an account</span>
                            </Link>
                        </p>
                        <div className='divider my-2'>
                            <div className='divider-text'>or</div>
                        </div>*/}

            <p className="text-center mt-2">
              &copy; {new Date().getFullYear()} NeemaDev
            </p>

            <div className="divider my-2"></div>

            <SocialIconsContainer>
              <SocialIconButton
                $brand="facebook"
                href="#"
                title="Facebook"
                onClick={(e) => e.preventDefault()}
              >
                <Facebook />
              </SocialIconButton>
              <SocialIconButton
                $brand="twitter"
                href="#"
                title="Twitter"
                onClick={(e) => e.preventDefault()}
              >
                <Twitter />
              </SocialIconButton>
              <SocialIconButton
                $brand="google"
                href="#"
                title="Google"
                onClick={(e) => e.preventDefault()}
              >
                <Mail />
              </SocialIconButton>
              <SocialIconButton
                $brand="github"
                href="#"
                title="GitHub"
                onClick={(e) => e.preventDefault()}
              >
                <GitHub />
              </SocialIconButton>
            </SocialIconsContainer>
          </Col>
        </Col>
      </Row>
    </div>
  )
}

export default Login
