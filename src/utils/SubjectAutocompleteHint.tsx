import React, { useState } from 'react'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import type { HintOption } from '@/utils/libraries/autocompleteHint/HintOption'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import AutocompleteHintInput from '@/utils/AutocompleteHintInput'
import { SubjectCreatedDocument, useSubjectsQuery } from '@/gql/graphql'
import { useModal } from '@ebay/nice-modal-react'
import SubjectTableModal from '@/views/school/subjects/SubjectTableModal'
import { useEventEmitter, useKeyPress } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { RefreshCw, Search } from 'react-feather'
import SubjectFormModal from '@/views/school/subjects/SubjectFormModal'
import {
  AppendAction,
  ContentArea,
  InputContainer,
  InputGroup,
  LoadingBar,
  PrependAction,
  SearchIconBox,
} from './autocomplete.style'
import { FolderOpen, Loader2 } from 'lucide-react'

interface SubjectAutocompleteHintProps {
  onFill(value: string | HintOption): void
  focus$?: EventEmitter<void>
  onOpenTable?(value: string | HintOption): void
  reload$?: EventEmitter<void>
  canRefetch?: boolean
}

const SubjectAutocompleteHint: React.FC<SubjectAutocompleteHintProps> = ({
  canRefetch = true,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const subjectModal = useModal(SubjectTableModal)
  const subjectAddModal = useModal(SubjectFormModal)

  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  const text$ = useEventEmitter<string>()

  const {
    data: dataSubject,
    loading: loadingSubject,
    subscribeToMore: subscribeToMoreSubject,
    refetch: refetchSubjects,
  } = useSubjectsQuery({
    variables: { id: enterpriseId },
  })

  const refetch = async () => {
    setIsRefetching(true)
    try {
      await refetchSubjects()
    } finally {
      setTimeout(() => setIsRefetching(false), 500)
    }
  }

  props.reload$?.useSubscription(() => refetch())

  const onRowClicked = (selectedRow: any) => {
    const item = {
      id: selectedRow.id,
      name: selectedRow.name,
    }

    setText('')
    props.onFill(item)
    subjectModal.hide()
    text$.emit('')
  }

  const openModal = () => {
    subjectModal.show({
      subjects: dataSubject?.subjects?.filter((p: any) => p.active) || [],
      onRowClicked: onRowClicked,
      initialFilter: text,
    })
  }

  useKeyPress('ctrl.enter', () => openModal())
  useKeyPress('ctrl.i', () => openModal())

  const isLoading = loadingSubject || isRefetching

  return (
    <LiveView
      document={SubjectCreatedDocument}
      subscribeToMore={subscribeToMoreSubject}
      listVar="subjects"
      singleVar="subject"
      data={dataSubject}
      loading={loadingSubject}
      enterpriseId={enterpriseId}
    >
      {({ subjects }) => (
        <InputGroup
          $isFocused={isFocused}
          $isLoading={isLoading}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {canRefetch && (
            <PrependAction
              onClick={refetch}
              $isLoading={isRefetching}
              title={t('label-refresh')}
              type="button"
            >
              {isRefetching ? <Loader2 size={16} /> : <RefreshCw size={16} />}
            </PrependAction>
          )}

          <ContentArea>
            <SearchIconBox $active={isFocused || !!text}>
              <Search size={16} strokeWidth={2} />
            </SearchIconBox>

            <InputContainer>
              <AutocompleteHintInput
                options={subjects ? subjects.filter((p: any) => p.active) : []}
                onFill={props.onFill}
                allowTabFill={true}
                getOptionLabel={() => ['name']}
                uniqueKey="id"
                placeholder={t('text-subjectPlaceholder')}
                focus$={props.focus$}
                onChange={setText}
                text$={text$}
                onOpenModal={(value) =>
                  subjectModal.show({
                    subjects: dataSubject?.subjects
                      ? subjects.filter((p: any) => p.active)
                      : [],
                    onRowClicked: onRowClicked,
                    initialFilter: value,
                  })
                }
              />
            </InputContainer>
          </ContentArea>

          <AppendAction onClick={openModal} type="button">
            <FolderOpen size={15} />
            <div className="shortcut-text">
              <kbd>Ctrl</kbd>
              <span>+</span>
              <kbd>I</kbd>
            </div>
          </AppendAction>

          <LoadingBar $visible={isLoading} />
        </InputGroup>
      )}
    </LiveView>
  )
}

export default SubjectAutocompleteHint
