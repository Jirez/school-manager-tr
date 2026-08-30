import React, { useState, useEffect, useRef } from 'react'
import type { FC } from 'react'
import { v4 as uuid } from 'uuid'
import { produce } from 'immer'
import { useApolloClient } from '@apollo/client'
import styled from 'styled-components'
import type { DropResult } from 'react-beautiful-dnd'
import { DragDropContext } from 'react-beautiful-dnd'
import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap'
import { toast } from 'react-toastify'
import { GitBranch, Plus, Layers, X } from 'react-feather'

import { useAuthentication } from '@/hooks/useAuthentication'
import { formatError } from '@/utils/ErrorHelper'
import LiveView from '@/utils/LiveView'
import { branchOptions } from '@/utils/select/selectComponents'
import { useSubjectNotInGroup } from './useSubjectNotInGroup'
import { useForm } from 'react-hook-form'
import ControlledSelect from '@/@core/components/ui/forms/controlled-select'
import { useTranslation } from 'react-i18next'
import Column from './Column'
import { preventSubmitting } from '@/utils/helpers'
import ActionButtons from '@/@core/components/ui/forms/action-buttons'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { TOAST_OPTIONS } from '@/utils/constants'
import {
  BranchCreatedDocument,
  SubjectsNotInGroupDocument,
  useBranchesQuery,
} from '@/gql/graphql'
import FormSection from '@/@core/components/ui/forms/form-section'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

const DragDropContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
  overflow-x: auto;
  min-height: 600px;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);

  .dark-layout & {
    background-color: #151e34;
    border-color: rgba(255, 255, 255, 0.08);
  }
`

const AddColumnButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 280px;
  min-height: 200px;
  padding: 24px;
  border-radius: 12px;
  border: 2px dashed rgba(102, 126, 234, 0.3);
  background-color: rgba(102, 126, 234, 0.05);
  color: #667eea;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;

  &:hover {
    border-color: rgba(102, 126, 234, 0.5);
    background-color: rgba(102, 126, 234, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  .dark-layout & {
    border-color: rgba(102, 126, 234, 0.4);
    background-color: rgba(102, 126, 234, 0.08);

    &:hover {
      border-color: rgba(102, 126, 234, 0.6);
      background-color: rgba(102, 126, 234, 0.15);
    }
  }
`

const AddColumnIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  margin-bottom: 12px;
  transition: transform 0.25s ease;

  ${AddColumnButton}:hover & {
    transform: scale(1.1);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

const AddColumnText = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
`

const AddColumnSubtext = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
  margin-top: 4px;

  .dark-layout & {
    color: #6b7280;
  }
`

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 16px;
    border: none;
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.15),
      0 8px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .dark-layout & .modal-content {
    background-color: #1e2840;
  }
`

const StyledModalHeader = styled(ModalHeader)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-bottom: none;
  padding: 20px 24px;

  .modal-title {
    font-weight: 600;
    font-size: 1.1rem;
  }

  .btn-close {
    filter: brightness(0) invert(1);
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
`

const StyledModalFooter = styled(ModalFooter)`
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 16px 24px;
  gap: 12px;

  .dark-layout & {
    border-color: rgba(255, 255, 255, 0.08);
  }
`

const StyledInput = styled(Input)`
  border-radius: 10px !important;
  padding: 12px 16px !important;
  font-size: 0.95rem !important;
  border: 2px solid rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s ease !important;

  &:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15) !important;
  }

  &.is-invalid {
    border-color: #ef4444 !important;
  }

  .dark-layout & {
    background-color: #151e34 !important;
    border-color: rgba(255, 255, 255, 0.1) !important;
    color: #f3f4f6 !important;

    &:focus {
      border-color: #667eea !important;
    }
  }
`

const InputLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;

  .dark-layout & {
    color: #d1d5db;
  }
`

const EmptyStateMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
  text-align: center;
  width: 100%;

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  p {
    font-size: 0.95rem;
    margin: 0;
  }

  .dark-layout & {
    color: #6b7280;
  }
`

const onDragEnd = (result: DropResult, columns: any, setColumns: Function) => {
  if (!result.destination) return
  const { source, destination } = result

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceItems = [...sourceColumn.items]
    const destItems = [...destColumn.items]
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed)
    setColumns((cols: any) => ({
      ...cols,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    }))
  } else {
    const column = columns[source.droppableId]
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    setColumns((cols: any) => ({
      ...cols,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    }))
  }
}

interface SubjectGroupFormProps extends BaseFormProps {
  groups?: { [key: string]: any }
  modal?: NiceModalHandler
}

const SubjectGroupForm: FC<SubjectGroupFormProps> = (props) => {
  const [branchId, setBranchId] = useState(
    props.groups ? Number(props.groups.branch.id) : null,
  )
  const subjects = useSubjectNotInGroup(
    props.groups ? Number(props.groups.branch.id) : null,
  )
  const { groups } = props
  const { enterpriseId } = useAuthentication()
  const client = useApolloClient()
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, loading, subscribeToMore } = useBranchesQuery({
    variables: { id: enterpriseId },
  })

  const initialData = {
    [0]: {
      id: null,
      name: 'Matières disponibles',
      items: subjects,
    },
    [uuid()]: {
      id: null,
      name: 'Groupe 1',
      items: [],
    },
    [uuid()]: {
      id: null,
      name: 'Groupe 2',
      items: [],
    },
  }

  const [columns, setColumns] = useState(initialData)
  const [title, setTitle] = useState<string>('')
  const [showModal, setShowModal] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<any>({
    mode: 'onBlur',
    defaultValues: {
      branchId: groups ? groups.branch : null,
    },
  })

  useEffect(() => {
    const updateSubject = async () => {
      if (!branchId) return
      const { data } = await client.query({
        query: SubjectsNotInGroupDocument,
        variables: { id: Number(branchId) },
        fetchPolicy: 'no-cache',
      })

      setColumns((cols) => {
        return produce(cols, (draft: any) => {
          draft[0].items = data ? data.subjects : []
        })
      })
    }

    updateSubject().catch((error) => console.log(error))
  }, [branchId, client])

  useEffect(() => {
    if (groups) {
      const { subjectGroups } = groups
      let updateInitialData: any = {
        [0]: {
          id: null,
          name: 'Matières disponibles',
          items: subjects,
        },
      }

      for (let i = 0; i < subjectGroups.length; i++) {
        updateInitialData = {
          ...updateInitialData,
          [uuid()]: {
            id: subjectGroups[i].id,
            name: subjectGroups[i].name,
            items: subjectGroups[i].subjectGroupItemCollection.map(
              (item: any) => ({
                id: item.subject.id,
                name: item.subject.name,
              }),
            ),
          },
        }
      }

      setColumns(updateInitialData)
    }

    // set drawer size
    const root = document.documentElement
    root.style.setProperty('--offcanvas-width', '100%')
  }, [groups, subjects])

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    close?: boolean,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      let columnsToSave = Object.entries(columns)
        .filter(([columnId]) => columnId !== '0')
        .map(([, column]) => column)

      columnsToSave = columnsToSave.filter(({ items }) => items.length > 0)

      if (columnsToSave.length === 0) {
        toast.error('Veuillez spécifier les groupes à enregistrer')
        return
      }

      let numberOrder = 1
      let position = 1

      const subjectGroups = columnsToSave.map((value) => {
        return {
          numberOrder: numberOrder++,
          branchId: Number(values.branchId.id),
          name: value.name,
          id: Number(value.id),
          subjectGroupItemCollection: value.items.map((item: any) => {
            return {
              subjectGroupItemPK: {
                subjectId: Number(item.id),
              },
              position: position++,
            }
          }),
        }
      })

      props
        .action({
          variables: {
            group: {
              subjectGroups: subjectGroups,
              id: Number(values.branchId.id),
            },
          },
        })
        .then(async () => {
          toast.success(`Groupes enregistrés`, { ...TOAST_OPTIONS })

          if (close) {
            props.modal?.hide()
          }
        })
        .catch((error) => {
          toast.error(`Impossible d'ajouter les groupes: ${formatError(error)}`)
        })
    })(event)
  }

  const handleNewColumn = () => {
    if (!title.trim()) return

    setColumns((cols: any) => {
      return {
        ...cols,
        [uuid()]: {
          id: null,
          name: title.trim(),
          items: [],
        },
      }
    })

    setShowModal(false)
    setTitle('')
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setTitle('')
  }

  const columnsCount = Object.keys(columns).length - 1 // Exclude the "available subjects" column

  return (
    <>
      <Form onSubmit={onSubmit} className="space-y-6">
        {/* Branch Selection Section */}
        <FormSection
          icon={<GitBranch className="w-5 h-5" />}
          title="Sélection de la filière"
          description="Choisissez la filière pour organiser les groupes de matières"
          color="#7367f0"
        >
          <div className="space-y-4">
            <LiveView
              document={BranchCreatedDocument}
              singleVar="branch"
              data={data}
              loading={loading}
              listVar="branches"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
            >
              {({ branches }) => (
                <ControlledSelect
                  name="branchId"
                  control={control}
                  label={''}
                  loading={loading}
                  required={true}
                  onChange={(val) => {
                    setValue('branchId', val)
                    if (val) {
                      setBranchId(val.id)
                    } else {
                      setBranchId(null)
                    }
                  }}
                  options={branches || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  components={{ Option: branchOptions }}
                  optionLabel="name"
                  prepend={<GitBranch size={16} />}
                />
              )}
            </LiveView>
          </div>
        </FormSection>

        {/* Drag and Drop Section */}
        <FormSection
          icon={<Layers className="w-5 h-5" />}
          title="Organisation des groupes"
          description={`Glissez-déposez les matières pour les organiser en groupes (${columnsCount} groupe${columnsCount > 1 ? 's' : ''} créé${columnsCount > 1 ? 's' : ''})`}
          color="#28c76f"
        >
          <DragDropContainer>
            {branchId ? (
              <>
                <DragDropContext
                  onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
                >
                  {Object.entries(columns).map(([columnId, column], index) => (
                    <Column
                      key={columnId}
                      columnId={columnId}
                      column={column}
                      setColumns={setColumns}
                      columns={columns}
                    />
                  ))}
                </DragDropContext>

                <AddColumnButton
                  type="button"
                  onClick={() => setShowModal(true)}
                >
                  <AddColumnIcon>
                    <Plus />
                  </AddColumnIcon>
                  <AddColumnText>Nouveau groupe</AddColumnText>
                  <AddColumnSubtext>
                    Cliquez pour ajouter un groupe
                  </AddColumnSubtext>
                </AddColumnButton>
              </>
            ) : (
              <EmptyStateMessage>
                <GitBranch />
                <p>
                  Sélectionnez une filière pour commencer à organiser les
                  groupes de matières
                </p>
              </EmptyStateMessage>
            )}
          </DragDropContainer>
        </FormSection>

        {/* Action Buttons */}
        <StickyActions>
          <ActionButtons
            cancelAction={props.modal?.hide}
            isSubmitting={props.loading}
            popover={props.popover}
            dirty={isDirty}
            onSubmit={onSubmit}
          />
        </StickyActions>
      </Form>

      {/* Add New Group Modal */}
      <StyledModal
        isOpen={showModal}
        toggle={handleCloseModal}
        unmountOnClose
        className="modal-dialog-centered"
        zIndex={1065}
        onOpened={() => inputRef?.current?.focus()}
      >
        <StyledModalHeader toggle={handleCloseModal}>
          Créer un nouveau groupe
        </StyledModalHeader>
        <StyledModalBody>
          <InputLabel htmlFor="groupName">Nom du groupe</InputLabel>
          <StyledInput
            id="groupName"
            placeholder="Ex: Groupe Scientifique, Groupe Littéraire..."
            autoFocus
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            onKeyPress={(e: React.KeyboardEvent) => {
              preventSubmitting(e, () => {
                handleNewColumn()
              })
            }}
            invalid={showModal && !title.trim()}
            innerRef={inputRef}
          />
        </StyledModalBody>
        <StyledModalFooter>
          <Button
            color="secondary"
            outline
            onClick={handleCloseModal}
            className="d-flex align-items-center gap-2"
          >
            <X size={16} />
            {t('label-cancel')}
          </Button>
          <Button
            color="primary"
            onClick={handleNewColumn}
            disabled={!title.trim()}
            className="d-flex align-items-center gap-2"
          >
            <Plus size={16} />
            Créer le groupe
          </Button>
        </StyledModalFooter>
      </StyledModal>
    </>
  )
}

export default SubjectGroupForm
