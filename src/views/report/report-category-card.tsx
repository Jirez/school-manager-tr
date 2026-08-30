import type { FC } from 'react'
import { useState } from 'react'
import styled from 'styled-components'
import { ChevronDown, FolderOpen, Folder } from 'lucide-react'
import ReportList from '@/views/report/report-list'

const CardContainer = styled.div`
  margin-bottom: 1rem;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid rgba(115, 103, 240, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(115, 103, 240, 0.12);
    border-color: rgba(115, 103, 240, 0.2);
  }

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    &:hover {
      box-shadow: 0 4px 16px rgba(115, 103, 240, 0.2);
      border-color: rgba(115, 103, 240, 0.4);
    }
  }
`

const Header = styled.button<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1.25rem 1.5rem;
  border: none;
  background: ${({ $isOpen }) =>
    $isOpen
      ? 'linear-gradient(135deg, rgba(115, 103, 240, 0.08) 0%, rgba(115, 103, 240, 0.03) 100%)'
      : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 1rem;

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.1) 0%,
      rgba(115, 103, 240, 0.05) 100%
    );
  }

  &:focus {
    outline: none;
  }

  .dark-layout & {
    background: ${({ $isOpen }) =>
      $isOpen ? 'rgba(115, 103, 240, 0.15)' : 'transparent'};

    &:hover {
      background: rgba(115, 103, 240, 0.2);
    }
  }
`

const IconWrapper = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${({ $isOpen }) =>
    $isOpen
      ? 'linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)'
      : 'rgba(115, 103, 240, 0.1)'};
  transition: all 0.3s ease;
  flex-shrink: 0;

  svg {
    color: ${({ $isOpen }) => ($isOpen ? '#ffffff' : '#7367f0')};
    transition: all 0.3s ease;
  }

  .dark-layout & {
    background: ${({ $isOpen }) =>
      $isOpen
        ? 'linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)'
        : 'rgba(115, 103, 240, 0.2)'};
  }
`

const TitleSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  min-width: 0;
`

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const Subtitle = styled.span`
  font-size: 0.8rem;
  color: #6c757d;

  .dark-layout & {
    color: #9ca3af;
  }
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
`

const CountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 0.5rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #7367f0 0%, #9e95f5 100%);
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(115, 103, 240, 0.3);
`

const ChevronWrapper = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(115, 103, 240, 0.08);
  transition: all 0.3s ease;

  svg {
    color: #7367f0;
    transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
    transition: transform 0.3s ease;
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.15);
  }
`

const ContentWrapper = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? '2000px' : '0')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  overflow: hidden;
  transition: all 0.4s ease-in-out;
`

const Content = styled.div`
  padding: 0 1.5rem 1.5rem;
  border-top: 1px solid rgba(115, 103, 240, 0.1);

  .dark-layout & {
    border-top-color: rgba(115, 103, 240, 0.2);
  }
`

const ContentInner = styled.div`
  padding-top: 1rem;
`

interface ReportCategoryCardProps {
  name: string
  items: any[]
  action: Function
  defaultOpen?: boolean
}

const ReportCategoryCard: FC<ReportCategoryCardProps> = ({
  name,
  items,
  action,
  defaultOpen = true,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen)

  const toggle = () => {
    setIsOpen((prev) => !prev)
  }

  const itemCount = items?.length || 0

  return (
    <CardContainer>
      <Header $isOpen={isOpen} onClick={toggle} aria-expanded={isOpen}>
        <IconWrapper $isOpen={isOpen}>
          {isOpen ? (
            <FolderOpen size={22} strokeWidth={2} />
          ) : (
            <Folder size={22} strokeWidth={2} />
          )}
        </IconWrapper>

        <TitleSection>
          <Title title={name}>{name}</Title>
          <Subtitle>
            {itemCount} report{itemCount !== 1 ? 's' : ''} available
          </Subtitle>
        </TitleSection>

        <RightSection>
          <CountBadge>{itemCount}</CountBadge>
          <ChevronWrapper $isOpen={isOpen}>
            <ChevronDown size={18} strokeWidth={2.5} />
          </ChevronWrapper>
        </RightSection>
      </Header>

      <ContentWrapper $isOpen={isOpen}>
        <Content>
          <ContentInner>
            <ReportList items={items} action={action} showCount={false} />
          </ContentInner>
        </Content>
      </ContentWrapper>
    </CardContainer>
  )
}

export default ReportCategoryCard
