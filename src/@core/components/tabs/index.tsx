import type { FC, ReactNode } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TabContent } from 'reactstrap'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'motion/react'

interface NavLinkProps {
  label: string
  id: string
  icon?: ReactNode
  onClick?: () => void
}

interface TabNavProps {
  items: NavLinkProps[]
  children: any
  className?: string
  activeTab?: string
  onTabChange?: (id: string) => void
}

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(115, 103, 240, 0.1);
  width: fit-content;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);

  .dark-layout & {
    background: rgba(40, 48, 70, 0.6);
    border-color: rgba(115, 103, 240, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`

const TabItem = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  border-radius: 9px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${(props) => (props.$active ? '#7367f0' : '#64748b')};
  font-weight: ${(props) => (props.$active ? '600' : '500')};
  font-size: 0.775rem;
  white-space: nowrap;
  outline: none !important;

  &:hover {
    color: #7367f0;
  }

  .dark-layout & {
    color: ${(props) => (props.$active ? '#7367f0' : '#94a3b8')};

    &:hover {
      color: #7367f0;
    }
  }

  svg {
    width: 14px;
    height: 14px;
    opacity: ${(props) => (props.$active ? '1' : '0.7')};
  }
`

const ActivePill = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  border-radius: 9px;
  box-shadow: 0 2px 8px rgba(115, 103, 240, 0.12);
  z-index: -1;
  border: 1px solid rgba(115, 103, 240, 0.15);

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
`

export const TabNav: FC<TabNavProps> = ({
  items,
  children,
  className,
  activeTab,
  onTabChange,
}) => {
  const [active, setActive] = useState(activeTab || items[0]?.id || '1')
  const { t } = useTranslation()

  const toggle = (tab: string) => {
    if (active !== tab) {
      setActive(tab)
      onTabChange?.(tab)
    }
  }

  return (
    <div className={className}>
      <TabsContainer>
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <TabItem
              key={item.id}
              $active={isActive}
              onClick={(e) => {
                e.preventDefault()
                toggle(item.id)
                item.onClick?.()
              }}
            >
              {isActive && (
                <ActivePill
                  layoutId="active-tab-pill"
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              {item.icon}
              <span>{t(item.label)}</span>
            </TabItem>
          )
        })}
      </TabsContainer>

      <div className="tab-content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2 }}
          >
            <TabContent activeTab={active}>{children}</TabContent>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
