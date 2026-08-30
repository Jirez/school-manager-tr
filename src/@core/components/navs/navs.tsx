import type { FC, ReactNode } from 'react'
import { useLocation, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { motion } from 'motion/react'

export interface LinkProps {
  id: string
  navLink: string
  title: string
  icon?: ReactNode
}

interface NavsProps {
  links: LinkProps[]
}

const NavWrapper = styled.div`
  padding: 0;
  display: none;
  margin-bottom: 1.25rem;

  @media (min-width: 768px) {
    display: block;
  }
`

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  border: 1px solid rgba(115, 103, 240, 0.12);
  width: fit-content;
  box-shadow: 0 4px 20px rgba(115, 103, 240, 0.06);

  .dark-layout & {
    background: rgba(40, 48, 70, 0.7);
    border-color: rgba(115, 103, 240, 0.2);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
  }
`

const NavItem = styled(Link)<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.85rem;
  border-radius: 10px;
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${(props) => (props.$active ? '#7367f0' : '#6e6b7b')};
  font-weight: ${(props) => (props.$active ? '600' : '500')};
  font-size: 0.775rem;
  white-space: nowrap;

  &:hover {
    color: #7367f0;
    background: rgba(115, 103, 240, 0.05);
  }

  .dark-layout & {
    color: ${(props) => (props.$active ? '#7367f0' : '#b4b7bd')};

    &:hover {
      background: rgba(115, 103, 240, 0.08);
      color: #7367f0;
    }
  }

  svg {
    width: 16px;
    height: 16px;
    transition: all 0.25s ease;
    opacity: ${(props) => (props.$active ? '1' : '0.7')};
  }

  &:hover svg {
    transform: scale(1.1);
    opacity: 1;
  }
`

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.12) 0%,
    rgba(115, 103, 240, 0.03) 100%
  );
  border: 1px solid rgba(115, 103, 240, 0.25);
  border-radius: 10px;
  z-index: -1;

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.18) 0%,
      rgba(115, 103, 240, 0.05) 100%
    );
    border-color: rgba(115, 103, 240, 0.35);
  }
`

const Navs: FC<NavsProps> = ({ links }) => {
  const location = useLocation().pathname
  const { t } = useTranslation()

  return (
    <NavWrapper className="w-full">
      <NavContainer className="!text-xs">
        {links.map((item) => {
          const isActive = location === item.navLink
          return (
            <NavItem
              key={item.id}
              to={item.navLink}
              $active={isActive}
              title={t(item.title)}
            >
              {isActive && (
                <ActiveIndicator
                  layoutId="active-pill"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              {item.icon}
              <span>{t(item.title)}</span>
            </NavItem>
          )
        })}
      </NavContainer>
    </NavWrapper>
  )
}

export default Navs
