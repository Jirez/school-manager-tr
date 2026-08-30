import type { FC } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import styled, { css } from 'styled-components'
import SubjectCard from './SubjectCard'

const DraggableWrapper = styled.div<{
  $isDragging: boolean
  $isDragDisabled?: boolean
}>`
  transition: all 0.2s ease;
  border-radius: 12px;
  position: relative;

  ${({ $isDragDisabled }) =>
    $isDragDisabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    `}

  ${({ $isDragging }) =>
    $isDragging &&
    css`
      z-index: 1000;

      & > * {
        box-shadow:
          0 12px 28px rgba(102, 126, 234, 0.25),
          0 8px 16px rgba(0, 0, 0, 0.15);
        transform: rotate(2deg) scale(1.02);
        border-color: rgba(102, 126, 234, 0.5);
        background-color: #ffffff;

        .dark-layout & {
          background-color: #1e2840;
          box-shadow:
            0 12px 28px rgba(102, 126, 234, 0.3),
            0 8px 16px rgba(0, 0, 0, 0.4);
        }
      }
    `}

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid rgba(102, 126, 234, 0.5);
    outline-offset: 2px;
    border-radius: 12px;
  }
`

const DragPlaceholder = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 12px;
  border: 2px dashed rgba(102, 126, 234, 0.3);
  background-color: rgba(102, 126, 234, 0.05);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;

  .dark-layout & {
    border-color: rgba(102, 126, 234, 0.4);
    background-color: rgba(102, 126, 234, 0.08);
  }
`

interface DraggableItemProps {
  item: { [key: string]: any }
  index: number
  isDragDisabled?: boolean
}

const DraggableItem: FC<DraggableItemProps> = ({
  item,
  index,
  isDragDisabled = false,
}) => (
  <Draggable
    key={item.id}
    draggableId={String(item.id)}
    index={index}
    isDragDisabled={isDragDisabled}
  >
    {(provided, snapshot) => (
      <DraggableWrapper
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        $isDragging={snapshot.isDragging}
        $isDragDisabled={isDragDisabled}
      >
        <SubjectCard
          key={`subject-${item.id}`}
          displayName={item.name}
          category={item.code}
          telephone={item.section}
          id={item.id}
        />
        {snapshot.isDragging && <DragPlaceholder />}
      </DraggableWrapper>
    )}
  </Draggable>
)

export default DraggableItem
