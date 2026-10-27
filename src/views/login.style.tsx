import { styled } from 'styled-components'

export const WelcomeHeader = styled.header`
  margin-bottom: 1.75rem;
`

export const WelcomeTitle = styled.h1`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.35rem 0.45rem;
  margin: 0 0 0.75rem;
  color: #283046;
  font-size: clamp(1.625rem, 2.4vw, 1.9rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.2;

  .dark-layout & {
    color: #f3f4f6;
  }
`

export const WelcomeBrand = styled.span`
  color: var(--bs-primary);
  background: linear-gradient(
    135deg,
    var(--bs-primary) 0%,
    color-mix(in srgb, var(--bs-primary) 70%, white) 100%
  );
  background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const VersionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.55rem;
  border: 1px solid color-mix(in srgb, var(--bs-primary) 18%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--bs-primary) 8%, transparent);
  color: var(--bs-primary);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1;
  white-space: nowrap;
`

export const WelcomeDescription = styled.p`
  max-width: 30rem;
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
  line-height: 1.65;

  .dark-layout & {
    color: #b4bad1;
  }
`

export const SocialIconsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 1.5rem;
`

export const SocialIconButton = styled.a<{
  $brand: 'facebook' | 'twitter' | 'google' | 'github'
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid
    ${({ $brand }) => {
      switch ($brand) {
        case 'facebook':
          return 'rgba(59, 89, 152, 0.2)'
        case 'twitter':
          return 'rgba(29, 161, 242, 0.2)'
        case 'google':
          return 'rgba(219, 68, 55, 0.2)'
        case 'github':
          return 'rgba(36, 41, 46, 0.2)'
      }
    }};
  background-color: #ffffff;
  color: ${({ $brand }) => {
    switch ($brand) {
      case 'facebook':
        return '#3b5998'
      case 'twitter':
        return '#1da1f2'
      case 'google':
        return '#db4437'
      case 'github':
        return '#24292e'
    }
  }};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  text-decoration: none;

  &:hover {
    transform: translateY(-4px) scale(1.05);
    border-color: transparent;
    box-shadow: 0 10px 15px -3px
      ${({ $brand }) => {
        switch ($brand) {
          case 'facebook':
            return 'rgba(59, 89, 152, 0.3)'
          case 'twitter':
            return 'rgba(29, 161, 242, 0.3)'
          case 'google':
            return 'rgba(219, 68, 55, 0.3)'
          case 'github':
            return 'rgba(36, 41, 46, 0.3)'
        }
      }};
    background-color: ${({ $brand }) => {
      switch ($brand) {
        case 'facebook':
          return '#3b5998'
        case 'twitter':
          return '#1da1f2'
        case 'google':
          return '#db4437'
        case 'github':
          return '#24292e'
      }
    }};
    color: #ffffff;
  }

  .dark-layout & {
    background-color: #283046;
    border-color: rgba(255, 255, 255, 0.1);
    color: ${({ $brand }) => {
      switch ($brand) {
        case 'facebook':
          return '#5a7fc2'
        case 'twitter':
          return '#4db5f5'
        case 'google':
          return '#e67c73'
        case 'github':
          return '#e4e6eb'
      }
    }};

    &:hover {
      background-color: ${({ $brand }) => {
        switch ($brand) {
          case 'facebook':
            return '#3b5998'
          case 'twitter':
            return '#1da1f2'
          case 'google':
            return '#db4437'
          case 'github':
            return '#6e7681'
        }
      }};
      color: #ffffff;
      border-color: transparent;
    }
  }

  svg {
    width: 20px;
    height: 20px;
  }
`

export const DividerContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e9ecef;
  }

  .dark-layout & {
    &::before,
    &::after {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`

export const DividerText = styled.span`
  padding: 0 1rem;
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #adb5bd;
  font-weight: 600;
`
