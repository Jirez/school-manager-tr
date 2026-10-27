// ** Custom Hooks
import { useSkin } from '@/hooks/useSkin'

// ** Third Party Components
import { Link } from '@tanstack/react-router'
import { Facebook, Twitter, Mail, GitHub } from 'react-feather'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

import json from '../../package.json'
import darkImg from '@/assets/images/pages/login-v9-dark.svg'
import lightImg from '@/assets/images/pages/login-v9.svg'

// ** Styles
import '@/@core/scss/react/pages/page-authentication.scss'

import ThemeToggler from '@/@core/components/theme/theme-toggler'
import { LogoIcon } from '@/@core/components/icons/logo'
import LoginForm from './users/login-form'
import {
  SocialIconButton,
  SocialIconsContainer,
  VersionBadge,
  WelcomeBrand,
  WelcomeDescription,
  WelcomeHeader,
  WelcomeTitle,
} from './login.style'
import { m } from '@/paraglide/messages'

// let renderCount = 0;

const Login = () => {
  const { skin } = useSkin()

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link
          className="brand-logo w-96 flex items-center"
          to="/"
          onClick={(e) => e.preventDefault()}
        >
          <LogoIcon />
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
            <WelcomeHeader>
              <WelcomeTitle>
                {m['text-welcome-to']()}
                <WelcomeBrand>SchoolManager</WelcomeBrand>
                <VersionBadge aria-label={`Version ${json.version}`}>
                  {json.version}
                </VersionBadge>
              </WelcomeTitle>
              <WelcomeDescription>
                {m['text-invite-login']()}
              </WelcomeDescription>
            </WelcomeHeader>

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
                href="https://web.facebook.com/neemadevcm/"
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
