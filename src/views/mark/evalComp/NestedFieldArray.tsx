import { useEffect, useRef } from 'react'
import SimpleTextarea from '@/@core/components/ui/simple-textarea'
import { CheckBox } from '@/@core/components/ui/simple-checkbox'
import { useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Sparkles, ChevronsRight } from 'lucide-react'
import { styled, keyframes } from 'styled-components'

interface NestedFieldArrayProps {
  nestIndex: number
  control: any
  register: any
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`

const TableContainer = styled.div`
  border: 1px solid rgba(115, 103, 240, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.98) 100%
  );
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(115, 103, 240, 0.05);
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
  backdrop-filter: blur(10px);
  position: relative;
  min-width: 600px;
  width: 100%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(115, 103, 240, 0.4) 50%,
      transparent 100%
    );
    animation: ${shimmer} 3s infinite;
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(40, 48, 70, 0.95) 0%,
      rgba(40, 48, 70, 0.98) 100%
    );
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.3),
      0 2px 4px -1px rgba(0, 0, 0, 0.2),
      0 0 0 1px rgba(115, 103, 240, 0.1);
  }
`

const StyledTable = styled.table`
  margin-bottom: 0;
  font-size: 0.875rem;
  background: #f9fafb;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;

  .dark-layout & {
    background: #1f2937;
  }

  thead {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.12) 0%,
      rgba(115, 103, 240, 0.08) 50%,
      rgba(115, 103, 240, 0.12) 100%
    );
    border-bottom: 2px solid rgba(115, 103, 240, 0.25);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(115, 103, 240, 0.5) 50%,
        transparent 100%
      );
    }

    th {
      padding: 1rem 0.75rem;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1f2937;
      border: 1px solid rgba(115, 103, 240, 0.2);
      border-top: none;
      white-space: nowrap;
      vertical-align: middle;
      position: relative;
      text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
      background: linear-gradient(
        135deg,
        rgba(115, 103, 240, 0.12) 0%,
        rgba(115, 103, 240, 0.08) 50%,
        rgba(115, 103, 240, 0.12) 100%
      );

      &:first-child {
        text-align: center;
        width: 70px;
        border-top-left-radius: 12px;
        border-left: none;
      }

      &:last-child {
        text-align: center;
        width: 60px;
        border-top-right-radius: 12px;
        border-right: none;
      }

      &:not(:last-child) {
        border-right: 1px solid rgba(115, 103, 240, 0.2);
      }
    }

    .dark-layout & {
      background: linear-gradient(
        135deg,
        rgba(115, 103, 240, 0.2) 0%,
        rgba(115, 103, 240, 0.15) 50%,
        rgba(115, 103, 240, 0.2) 100%
      );
      border-bottom-color: rgba(115, 103, 240, 0.4);

      th {
        color: #f3f4f6;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        border-color: rgba(115, 103, 240, 0.3);
        background: linear-gradient(
          135deg,
          rgba(115, 103, 240, 0.2) 0%,
          rgba(115, 103, 240, 0.15) 50%,
          rgba(115, 103, 240, 0.2) 100%
        );

        &:not(:last-child) {
          border-right-color: rgba(115, 103, 240, 0.3);
        }
      }
    }
  }

  tbody {
    background: #ffffff;

    .dark-layout & {
      background: #283046;
    }

    tr {
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      animation: ${slideIn} 0.3s ease-out;
      animation-fill-mode: both;
      position: relative;

      &:nth-child(even) {
        background: rgba(249, 250, 251, 0.8);
      }

      .dark-layout & {
        &:nth-child(even) {
          background: rgba(31, 41, 55, 0.5);
        }
      }

      &:hover {
        background: linear-gradient(
          90deg,
          rgba(115, 103, 240, 0.08) 0%,
          rgba(115, 103, 240, 0.06) 100%
        ) !important;
        transform: translateX(2px);
        box-shadow: -2px 0 8px rgba(115, 103, 240, 0.15);
      }

      td {
        padding: 0.875rem 0.75rem;
        border: 1px solid rgba(115, 103, 240, 0.15);
        border-top: none;
        vertical-align: middle;
        transition: all 0.2s ease;
        background: inherit;

        &:first-child {
          text-align: center;
          font-weight: 700;
          color: #7367f0;
          background: linear-gradient(
            135deg,
            rgba(115, 103, 240, 0.08) 0%,
            rgba(115, 103, 240, 0.05) 100%
          );
          border-left: none;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(
              180deg,
              rgba(115, 103, 240, 0.6) 0%,
              rgba(115, 103, 240, 0.3) 100%
            );
          }
        }

        &:last-child {
          text-align: center;
          border-right: none;
        }

        &:not(:last-child) {
          border-right: 1px solid rgba(115, 103, 240, 0.15);
        }
      }

      &:last-child td {
        border-bottom: none;
      }
    }

    .dark-layout & {
      tr {
        &:hover {
          background: linear-gradient(
            90deg,
            rgba(115, 103, 240, 0.12) 0%,
            rgba(115, 103, 240, 0.08) 100%
          ) !important;
          box-shadow: -2px 0 8px rgba(115, 103, 240, 0.25);
        }

        td {
          border-color: rgba(115, 103, 240, 0.2);
          background: inherit;

          &:first-child {
            color: #a78bfa;
            background: linear-gradient(
              135deg,
              rgba(115, 103, 240, 0.15) 0%,
              rgba(115, 103, 240, 0.1) 100%
            );
          }

          &:not(:last-child) {
            border-right-color: rgba(115, 103, 240, 0.2);
          }
        }
      }
    }
  }
`

const EmptyStateContainer = styled.div`
  border: 2px dashed rgba(115, 103, 240, 0.3);
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.05) 0%,
    rgba(115, 103, 240, 0.02) 100%
  );
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 1rem;
  animation: ${fadeIn} 0.4s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(115, 103, 240, 0.1) 0%,
      transparent 70%
    );
    animation: ${shimmer} 4s infinite;
  }

  .dark-layout & {
    border-color: rgba(115, 103, 240, 0.4);
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.1) 0%,
      rgba(115, 103, 240, 0.05) 100%
    );
  }
`

const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.2) 0%,
    rgba(115, 103, 240, 0.1) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7367f0;
  box-shadow:
    0 4px 6px -1px rgba(115, 103, 240, 0.2),
    0 2px 4px -1px rgba(115, 103, 240, 0.1);
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.5s ease-out 0.1s both;

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.3) 0%,
      rgba(115, 103, 240, 0.2) 100%
    );
    color: #a78bfa;
    box-shadow:
      0 4px 6px -1px rgba(115, 103, 240, 0.3),
      0 2px 4px -1px rgba(115, 103, 240, 0.2);
  }
`

const EmptyStateTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.5s ease-out 0.2s both;

  .dark-layout & {
    color: #e5e7eb;
  }
`

const EmptyStateDescription = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.5s ease-out 0.3s both;

  .dark-layout & {
    color: #9ca3af;
  }
`

const AddButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #7367f0;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.1) 0%,
    rgba(115, 103, 240, 0.05) 100%
  );
  border: 2px dashed rgba(115, 103, 240, 0.4);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }

  &:hover {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.15) 0%,
      rgba(115, 103, 240, 0.1) 100%
    );
    border-color: rgba(115, 103, 240, 0.6);
    transform: translateY(-2px);
    box-shadow:
      0 10px 15px -3px rgba(115, 103, 240, 0.2),
      0 4px 6px -2px rgba(115, 103, 240, 0.1);

    &::before {
      left: 100%;
    }

    svg {
      transform: rotate(90deg) scale(1.1);
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow:
      0 4px 6px -1px rgba(115, 103, 240, 0.2),
      0 2px 4px -1px rgba(115, 103, 240, 0.1);
  }

  svg {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .dark-layout & {
    color: #a78bfa;
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.15) 0%,
      rgba(115, 103, 240, 0.1) 100%
    );
    border-color: rgba(115, 103, 240, 0.5);

    &:hover {
      background: linear-gradient(
        135deg,
        rgba(115, 103, 240, 0.2) 0%,
        rgba(115, 103, 240, 0.15) 100%
      );
      border-color: rgba(115, 103, 240, 0.7);
      box-shadow:
        0 10px 15px -3px rgba(115, 103, 240, 0.3),
        0 4px 6px -2px rgba(115, 103, 240, 0.2);
    }
  }
`

const AddButtonIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.2) 0%,
    rgba(115, 103, 240, 0.15) 100%
  );
  transition: all 0.3s ease;
`

const MobileScrollHint = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  margin: 0.75rem 0;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.08) 0%,
    rgba(115, 103, 240, 0.05) 100%
  );
  border: 1px dashed rgba(115, 103, 240, 0.3);
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #7367f0;
  animation: ${fadeIn} 0.4s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: ${shimmer} 2s infinite;
  }

  svg {
    flex-shrink: 0;
    animation: slideRight 1.5s ease-in-out infinite;
  }

  @keyframes slideRight {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(4px);
    }
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.12) 0%,
      rgba(115, 103, 240, 0.08) 100%
    );
    border-color: rgba(115, 103, 240, 0.4);
    color: #a78bfa;
  }

  @media (min-width: 768px) {
    display: none;
  }
`

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 8px;
  border: 1px solid transparent;
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.2);
    transform: translate(-50%, -50%);
    transition:
      width 0.3s,
      height 0.3s;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.3);
    color: #dc2626;
    transform: scale(1.1);

    &::before {
      width: 100%;
      height: 100%;
    }

    svg {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    position: relative;
    z-index: 1;
    transition: transform 0.2s ease;
  }

  .dark-layout & {
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;

    &:hover {
      background: rgba(239, 68, 68, 0.25);
      border-color: rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }
  }
`

// Component to sync heights between numberOrder and competence fields
const SyncedFieldRow = ({
  nestIndex,
  index,
  register,
  fieldId,
}: {
  nestIndex: number
  index: number
  register: any
  fieldId: string
}) => {
  const { t } = useTranslation()
  const competenceRef = useRef<HTMLTextAreaElement>(null)
  const numberOrderRef = useRef<HTMLTextAreaElement>(null)

  // Get register props for both fields
  const numberOrderRegister = register(
    `items.${nestIndex}.items.${index}.numberOrder`,
  )
  const competenceRegister = register(
    `items.${nestIndex}.items.${index}.competence`,
  )

  useEffect(() => {
    const syncHeights = () => {
      if (competenceRef.current && numberOrderRef.current) {
        const competenceHeight = competenceRef.current.offsetHeight
        numberOrderRef.current.style.height = `${competenceHeight}px`
      }
    }

    // Initial sync with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(syncHeights, 0)

    // Sync on input, paste, and resize
    const competenceTextarea = competenceRef.current
    if (competenceTextarea) {
      competenceTextarea.addEventListener('input', syncHeights)
      competenceTextarea.addEventListener('paste', syncHeights)
      window.addEventListener('resize', syncHeights)

      // Use ResizeObserver for more accurate height tracking
      const resizeObserver = new ResizeObserver(() => {
        syncHeights()
      })
      resizeObserver.observe(competenceTextarea)

      return () => {
        clearTimeout(timeoutId)
        competenceTextarea.removeEventListener('input', syncHeights)
        competenceTextarea.removeEventListener('paste', syncHeights)
        window.removeEventListener('resize', syncHeights)
        resizeObserver.disconnect()
      }
    }

    return () => {
      clearTimeout(timeoutId)
    }
  }, [fieldId])

  // Merge refs with register refs
  const numberOrderRefCallback = (node: HTMLTextAreaElement | null) => {
    //@ts-ignore
    numberOrderRef.current = node
    if (numberOrderRegister.ref) {
      if (typeof numberOrderRegister.ref === 'function') {
        numberOrderRegister.ref(node)
      } else {
        ;(
          numberOrderRegister.ref as React.MutableRefObject<HTMLTextAreaElement | null>
        ).current = node
      }
    }
  }

  const competenceRefCallback = (node: HTMLTextAreaElement | null) => {
    //@ts-ignore
    competenceRef.current = node
    if (competenceRegister.ref) {
      if (typeof competenceRegister.ref === 'function') {
        competenceRegister.ref(node)
      } else {
        ;(
          competenceRegister.ref as React.MutableRefObject<HTMLTextAreaElement | null>
        ).current = node
      }
    }
  }

  return (
    <>
      <td>
        <SimpleTextarea
          {...numberOrderRegister}
          ref={numberOrderRefCallback}
          className="
            !text-sm !text-center
            !py-1 !px-2
            !rounded-md
            !border-gray-200 dark:!border-gray-600
            !w-full
            focus:!border-primary focus:!ring-1 focus:!ring-primary/20
          "
          placeholder="#"
          autoGrow={false}
          rows={1}
        />
      </td>
      <td>
        <SimpleTextarea
          {...competenceRegister}
          ref={competenceRefCallback}
          className="
            !text-sm
            !py-1.5 !px-2
            !rounded-md
            !border-gray-200 dark:!border-gray-600
            !resize-none
            !w-full
            focus:!border-primary focus:!ring-1 focus:!ring-primary/20
          "
          placeholder={t('label-enterCompetence') || 'Saisir la compétence...'}
        />
      </td>
    </>
  )
}

const NestedFieldArray = ({
  nestIndex,
  control,
  register,
}: NestedFieldArrayProps) => {
  const { t } = useTranslation()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${nestIndex}.items`,
  })

  return (
    <div>
      {/* Table Container */}
      {fields.length > 0 ? (
        <div className="overflow-x-auto -mx-1 px-0">
          <TableContainer>
            <StyledTable className="table table-bordered table-hover0 responsive">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('label-competence') || 'Compétence'}</th>
                  <th>{t('label-active') || 'Actif'}</th>
                  <th>#</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <SyncedFieldRow
                      nestIndex={nestIndex}
                      index={index}
                      register={register}
                      fieldId={field.id}
                    />
                    <td>
                      <div className="flex items-center justify-center">
                        <CheckBox
                          {...register(
                            `items.${nestIndex}.items.${index}.active`,
                          )}
                          className="!w-4 !h-4"
                        />
                      </div>
                    </td>
                    <td>
                      <DeleteButton
                        type="button"
                        onClick={() => remove(index)}
                        title={t('label-remove') || 'Supprimer'}
                      >
                        <Trash2 size={14} />
                      </DeleteButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </TableContainer>
        </div>
      ) : (
        <EmptyStateContainer>
          <EmptyStateIcon>
            <Sparkles size={24} />
          </EmptyStateIcon>
          <EmptyStateTitle>
            {t('label-noCompetences') || 'Aucune compétence définie'}
          </EmptyStateTitle>
          <EmptyStateDescription>
            {t('label-addCompetenceHint') ||
              'Cliquez sur le bouton ci-dessous pour ajouter votre première compétence'}
          </EmptyStateDescription>
        </EmptyStateContainer>
      )}

      {/* Mobile Scroll Hint */}
      {fields.length > 0 && (
        <MobileScrollHint>
          <ChevronsRight size={16} />
          <span>{t('label-scrollRight') || 'Scroll to right to see all'}</span>
        </MobileScrollHint>
      )}

      {/* Add Button */}
      <AddButton
        type="button"
        onClick={() =>
          append({
            numberOrder: fields.length + 1,
            competence: '',
            active: true,
          })
        }
      >
        <AddButtonIcon>
          <Plus size={18} />
        </AddButtonIcon>
        <span>{t('label-addCompetence') || 'Ajouter une compétence'}</span>
      </AddButton>

      {/* Compact Table Styles */}
      <style>{`
        .table-compact th,
        .table-compact td {
          padding: 0.5rem !important;
          font-size: 0.875rem !important;
          vertical-align: middle !important;
        }
        .table-compact thead th {
          padding: 0.75rem 0.5rem !important;
          font-size: 0.8125rem !important;
          font-weight: 600 !important;
        }
        .table-compact .form-control,
        .table-compact input,
        .table-compact textarea {
          padding: 0.375rem 0.5rem !important;
          font-size: 0.875rem !important;
          height: auto !important;
          min-height: 32px !important;
        }
        .table-compact tbody tr:hover {
          background-color: rgba(115, 103, 240, 0.03) !important;
        }
        .dark-layout .table-compact tbody tr:hover {
          background-color: rgba(115, 103, 240, 0.08) !important;
        }
      `}</style>
    </div>
  )
}

export default NestedFieldArray
