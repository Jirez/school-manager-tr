import type { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'reactstrap'
import QuickFilter from '@/@core/components/base-table/quick-filter'
import GridCount from '@/@core/components/base-table/grid-count'
import { Plus, RefreshCw, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { ReactTable } from '@tanstack/react-table'
import { useAbility } from '@/context/Can'
import type { Subjects } from '@/configs/acl/ability'
import styled, { css, keyframes } from 'styled-components'

interface ToolbarProps {
  title: ReactNode | string
  globalFilter: string | undefined | any
  setGlobalFilter?: (filter: string) => void
  setDefaultGlobalFilter?: (filter: string) => void
  actionLabel?: string
  onClick?: () => void
  extraButton?: React.ReactNode
  totalCount?: number
  refetch?: () => void
  table?: ReactTable<any, any>
  abilitySubject?: Subjects
  isRefetching?: boolean
}

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

const ToolbarContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(115, 103, 240, 0.1);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;

  .dark-layout & {
    background: rgba(40, 48, 70, 0.8);
    border-color: rgba(115, 103, 240, 0.2);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem 1rem;
    margin-bottom: 0.75rem;
  }
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  //justify-content: space-between;
  gap: 0.75rem;
  width: 100%;

  @media (min-width: 640px) {
    width: auto;
    justify-content: flex-start;
  }
`

const RefreshButton = styled.button<{ $isAnimating?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(115, 103, 240, 0.08);
  color: #7367f0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    background: rgba(115, 103, 240, 0.15);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
    animation: ${(props) =>
      props.$isAnimating
        ? css`
            ${rotate} 1s linear infinite
          `
        : 'none'};
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.15);
    color: #9e95f5;
  }
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  overflow: hidden;
`

const Title = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  white-space: nowrap;
  letter-spacing: -0.01em;

  .dark-layout & {
    color: #e4e6eb;
  }

  @media (max-width: 640px) {
    font-size: 1rem;
  }
`

const CenterSection = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 640px) {
    width: auto;
    max-width: 400px;
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 640px) {
    display: none;
  }
`

const ActionButton = styled(Button)`
  display: flex !important;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  border: none !important;
  background: linear-gradient(135deg, #7367f0 0%, #453df5 100%) !important;
  box-shadow: 0 4px 12px rgba(115, 103, 240, 0.3) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(115, 103, 240, 0.4) !important;
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 14px;
    height: 14px;
    stroke-width: 2.5px;
  }
`

const FloatingActionButton = styled(motion.button)`
  position: fixed;
  bottom: 3.8rem;
  right: 1rem;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7367f0 0%, #453df5 100%);
  color: white;
  border: none;
  box-shadow: 0 8px 24px rgba(115, 103, 240, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50000000 !important;

  @media (min-width: 768px) {
    display: none;
  }

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

const Toolbar: FC<ToolbarProps> = ({
  title,
  globalFilter,
  setGlobalFilter,
  actionLabel,
  onClick,
  extraButton,
  totalCount,
  refetch,
  table,
  abilitySubject,
  isRefetching,
}) => {
  const { t } = useTranslation()
  const ability = useAbility()
  const rowCount =
    totalCount ?? table?.getPrePaginatedRowModel()?.rows.length ?? 0

  const canWrite = !!abilitySubject
    ? ability.can('write', abilitySubject)
    : true

  return (
    <>
      <ToolbarContainer
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <LeftSection>
          {refetch && (
            <RefreshButton
              onClick={() => refetch()}
              disabled={isRefetching}
              title={t('action.refresh')}
              $isAnimating={isRefetching}
            >
              {isRefetching ? <Loader2 /> : <RefreshCw />}
            </RefreshButton>
          )}
          <TitleWrapper>
            <Title>{title}</Title>
            <GridCount totalCount={rowCount} variant="default" />
          </TitleWrapper>
        </LeftSection>

        <CenterSection>
          <QuickFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </CenterSection>

        <RightSection>
          {extraButton && (
            <div className="d-none d-md-block">{extraButton}</div>
          )}
          {actionLabel && !extraButton && canWrite && (
            <ActionButton
              onClick={onClick}
              color="primary"
              className="d-none d-md-flex"
            >
              <Plus />
              <span>{t(actionLabel)}</span>
            </ActionButton>
          )}
        </RightSection>
      </ToolbarContainer>

      {/* Mobile Add Button - Professional Float */}
      {/* Mobile Add Button - Professional Float */}
      <AnimatePresence>
        {actionLabel && canWrite && (
          <FloatingActionButton
            onClick={onClick}
            title={t(actionLabel)}
            className="d-md-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus />
          </FloatingActionButton>
        )}
      </AnimatePresence>
    </>
  )
}

export default Toolbar
