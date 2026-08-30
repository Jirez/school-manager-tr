import { useRef, useState } from 'react'
import type { FC } from 'react'
import styled from 'styled-components'
import type { Draft } from 'immer'
import { produce } from 'immer'
import { Input } from 'reactstrap'
import { Check, Edit2, X, Move } from 'react-feather'

import DraggableItem from './DraggableItem'
import { StrictModeDroppable } from './strict-mode-droppable'

const Container = styled.div`
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.06);

  &:hover {
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.1),
      0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .dark-layout & {
    background-color: #1e2840;
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.2),
      0 4px 12px rgba(0, 0, 0, 0.15);

    &:hover {
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.25),
        0 8px 24px rgba(0, 0, 0, 0.2);
    }
  }
`

const Header = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 60px;

  .dark-layout & {
    background: linear-gradient(135deg, #4c5fd5 0%, #6b46a1 100%);
  }
`

const TitleText = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  letter-spacing: 0.01em;
`

const TitleInput = styled(Input)`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.95) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  border-radius: 8px !important;
  padding: 8px 12px !important;
  font-size: 0.95rem !important;
  font-weight: 500 !important;
  color: #333 !important;
  transition: all 0.2s ease !important;

  &:focus {
    border-color: rgba(255, 255, 255, 0.8) !important;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2) !important;
    outline: none !important;
  }

  .dark-layout & {
    background-color: rgba(30, 40, 64, 0.95) !important;
    color: #fff !important;
    border-color: rgba(255, 255, 255, 0.2) !important;

    &:focus {
      border-color: rgba(255, 255, 255, 0.5) !important;
    }
  }
`

const IconButton = styled.button<{
  $variant?: 'primary' | 'danger' | 'default'
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => {
    switch (props.$variant) {
      case 'primary':
        return 'rgba(255, 255, 255, 0.25)'
      case 'danger':
        return 'rgba(239, 68, 68, 0.2)'
      default:
        return 'rgba(255, 255, 255, 0.15)'
    }
  }};
  color: ${(props) => {
    switch (props.$variant) {
      case 'danger':
        return '#fecaca'
      default:
        return '#ffffff'
    }
  }};

  &:hover {
    background-color: ${(props) => {
      switch (props.$variant) {
        case 'primary':
          return 'rgba(255, 255, 255, 0.35)'
        case 'danger':
          return 'rgba(239, 68, 68, 0.4)'
        default:
          return 'rgba(255, 255, 255, 0.25)'
      }
    }};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const DroppableArea = styled.div<{ $isDraggingOver: boolean }>`
  padding: 12px;
  min-height: 500px;
  transition: all 0.25s ease;
  background-color: ${(props) =>
    props.$isDraggingOver ? 'rgba(102, 126, 234, 0.08)' : 'transparent'};
  border: 2px dashed
    ${(props) =>
      props.$isDraggingOver ? 'rgba(102, 126, 234, 0.3)' : 'transparent'};
  border-radius: 8px;
  margin: 8px;

  .dark-layout & {
    background-color: ${(props) =>
      props.$isDraggingOver ? 'rgba(102, 126, 234, 0.12)' : 'transparent'};
    border-color: ${(props) =>
      props.$isDraggingOver ? 'rgba(102, 126, 234, 0.4)' : 'transparent'};
  }
`

const ItemCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffffff;
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #9ca3af;
  text-align: center;

  svg {
    width: 40px;
    height: 40px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  p {
    font-size: 0.875rem;
    margin: 0;
  }

  .dark-layout & {
    color: #6b7280;
  }
`

interface ColumnProps {
  columnId: string
  column: any
  columns: any
  setColumns: Function
}

const Column: FC<ColumnProps> = ({ columnId, column, columns, setColumns }) => {
  const [updateTitle, setUpdateTitle] = useState(false)
  const [title, setTitle] = useState(column.name)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleNameChange = () => {
    if (title.trim()) {
      setColumns(
        produce(columns, (draft: Draft<any>) => {
          draft[columnId].name = title
        }),
      )
    }
    setUpdateTitle(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameChange()
    } else if (e.key === 'Escape') {
      setTitle(column.name)
      setUpdateTitle(false)
    }
  }

  const handleEditClick = () => {
    setUpdateTitle(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleCancelEdit = () => {
    setTitle(column.name)
    setUpdateTitle(false)
  }

  return (
    <Container key={columnId}>
      <Header>
        {updateTitle ? (
          <>
            <TitleInput
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              onKeyDown={handleKeyDown}
              innerRef={inputRef}
              placeholder="Enter group name..."
            />
            <ActionButtons>
              <IconButton
                $variant="primary"
                onClick={handleNameChange}
                title="Save"
              >
                <Check />
              </IconButton>
              <IconButton
                $variant="danger"
                onClick={handleCancelEdit}
                title="Cancel"
              >
                <X />
              </IconButton>
            </ActionButtons>
          </>
        ) : (
          <>
            <TitleText title={column.name}>{column.name}</TitleText>
            <ItemCount>{column.items?.length || 0}</ItemCount>
            {columnId !== '0' && (
              <IconButton onClick={handleEditClick} title="Edit name">
                <Edit2 />
              </IconButton>
            )}
          </>
        )}
      </Header>

      <StrictModeDroppable droppableId={columnId} key={columnId}>
        {(provided, snapshot) => (
          <DroppableArea
            {...provided.droppableProps}
            ref={provided.innerRef}
            $isDraggingOver={snapshot.isDraggingOver}
          >
            {column.items && column.items.length > 0 ? (
              column.items.map((item: any, index: number) => (
                <DraggableItem
                  key={item.id || index}
                  item={item}
                  index={index}
                />
              ))
            ) : (
              <EmptyState>
                <Move />
                <p>Glisser les éléments ici</p>
              </EmptyState>
            )}
            {provided.placeholder}
          </DroppableArea>
        )}
      </StrictModeDroppable>
    </Container>
  )
}

export default Column
