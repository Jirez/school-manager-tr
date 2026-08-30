import type { FC } from 'react'
import styled from 'styled-components'
import { Move } from 'react-feather'

import AvatarLetter from '@/@core/components/ui/avatar-letter'

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  margin-bottom: 8px;
  background-color: #ffffff;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
  cursor: grab;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow:
      0 4px 12px rgba(102, 126, 234, 0.1),
      0 2px 6px rgba(0, 0, 0, 0.04);
    transform: translateY(-1px);

    .drag-handle {
      opacity: 1;
    }
  }

  &:active {
    cursor: grabbing;
    box-shadow:
      0 8px 20px rgba(102, 126, 234, 0.15),
      0 4px 10px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px) scale(1.01);
  }

  .dark-layout & {
    background-color: #1e2840;
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.1);

    &:hover {
      border-color: rgba(102, 126, 234, 0.4);
      box-shadow:
        0 4px 12px rgba(102, 126, 234, 0.15),
        0 2px 6px rgba(0, 0, 0, 0.2);
    }
  }
`

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
  transition: opacity 0.2s ease;
  color: #9ca3af;
  margin-right: 4px;

  svg {
    width: 16px;
    height: 16px;
  }

  .dark-layout & {
    color: #6b7280;
  }
`

const AvatarWrapper = styled.div`
  flex-shrink: 0;
`

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const DisplayName = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 0.01em;

  .dark-layout & {
    color: #f3f4f6;
  }
`

const SubInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Category = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  background-color: rgba(102, 126, 234, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;

  .dark-layout & {
    color: #9ca3af;
    background-color: rgba(102, 126, 234, 0.15);
  }
`

const Telephone = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;

  .dark-layout & {
    color: #6b7280;
  }
`

const AccentBar = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.2s ease;

  ${CardContainer}:hover & {
    opacity: 1;
  }
`

interface SubjectCardProps {
  displayName: string
  category?: string
  telephone?: string
  id?: any
}

const SubjectCard: FC<SubjectCardProps> = ({
  displayName,
  category,
  telephone,
}) => (
  <CardContainer className="w-full">
    <AccentBar />
    <DragHandle className="drag-handle">
      <Move />
    </DragHandle>
    <AvatarWrapper>
      <AvatarLetter letter={displayName.charAt(0)} showRing size="sm" />
    </AvatarWrapper>
    <ContentWrapper>
      <DisplayName title={displayName}>{displayName}</DisplayName>
      {(category || telephone) && (
        <SubInfo>
          {category && <Category>{category}</Category>}
          {telephone && <Telephone>{telephone}</Telephone>}
        </SubInfo>
      )}
    </ContentWrapper>
  </CardContainer>
)

export default SubjectCard
