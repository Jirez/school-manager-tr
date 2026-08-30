import { useRef, useState, useEffect } from 'react'
import { Search, X, Command, Plus } from 'lucide-react'
import { useDebounceEffect, useKeyPress } from 'ahooks'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface QuickFilterProps {
  globalFilter?: string
  preGlobalFilteredRows?: []
  setGlobalFilter?: (filter: string) => void
  autoFocus?: boolean
  showAddButton?: boolean
  onAddButtonClick?: (search?: string) => void
  onEnter?: () => void
}

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`

const FilterContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  background: rgba(115, 103, 240, 0.05);
  border: 1px solid rgba(115, 103, 240, 0.1);
  border-radius: 10px;
  padding: 0 0.75rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  height: 38px;

  &:focus-within {
    background: white;
    border-color: #7367f0;
    box-shadow: 0 0 0 3px rgba(115, 103, 240, 0.1);
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.1);
    border-color: rgba(115, 103, 240, 0.2);

    &:focus-within {
      background: rgba(115, 103, 240, 0.15);
      border-color: #7367f0;
    }
  }
`

const StyledInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #2c3e50;
  padding: 0.5rem 0.5rem;
  outline: none;
  width: 100%;
  min-width: 0;

  &::placeholder {
    color: #b4b7bd;
    font-weight: 400;
  }

  .dark-layout & {
    color: #e4e6eb;
  }
`

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7367f0;
  opacity: 0.7;
`

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #b4b7bd;
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #ea5455;
    background: rgba(234, 84, 85, 0.1);
  }
`

const ShortcutBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  background: rgba(115, 103, 240, 0.1);
  border-radius: 6px;
  color: #7367f0;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  user-select: none;
  border: 1px solid rgba(115, 103, 240, 0.2);

  @media (max-width: 768px) {
    display: none;
  }
`

const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 38px;
  padding: 0 1rem;
  background: #7367f0;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(115, 103, 240, 0.2);

  &:hover {
    background: #453df5;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(115, 103, 240, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 14px;
    height: 14px;
    stroke-width: 3px;
  }

  @media (max-width: 640px) {
    padding: 0 0.75rem;
    span {
      display: none;
    }
  }
`

const QuickFilter = ({
  globalFilter,
  setGlobalFilter,
  autoFocus = false,
  showAddButton = false,
  onAddButtonClick,
  onEnter,
}: QuickFilterProps) => {
  const [value, setValue] = useState(globalFilter)
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const handleFocus = () => {
    inputRef.current?.focus()
  }

  useKeyPress(['ctrl.q', 'meta.q'], (event) => {
    event.preventDefault()
    handleFocus()
  })

  useDebounceEffect(
    () => {
      setGlobalFilter?.(value || '')
    },
    [value],
    { wait: 300 },
  )

  useEffect(() => {
    if (autoFocus) {
      handleFocus()
    }
  }, [autoFocus])

  return (
    <FilterWrapper>
      <FilterContainer>
        <IconBox>
          <Search size={16} />
        </IconBox>
        <StyledInput
          placeholder={t('label-searchPlaceholder', 'Rechercher...')}
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          id="quickFilter"
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onEnter?.()
            }
          }}
        />

        {value ? (
          <ClearButton
            onClick={() => {
              setValue('')
              setGlobalFilter?.('')
            }}
          >
            <X size={14} />
          </ClearButton>
        ) : (
          <ShortcutBadge>
            <Command size={10} />
            <span>Q</span>
          </ShortcutBadge>
        )}
      </FilterContainer>

      {showAddButton && (
        <AddButton onClick={() => onAddButtonClick?.(value)}>
          <Plus size={16} />
          <span>{t('label-add')}</span>
        </AddButton>
      )}
    </FilterWrapper>
  )
}

export default QuickFilter
