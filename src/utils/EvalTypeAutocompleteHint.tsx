import React, { useState } from 'react'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import type { HintOption } from '@/utils/libraries/autocompleteHint/HintOption'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import AutocompleteHintInput from '@/utils/AutocompleteHintInput'
import { EvalTypeCreatedDocument, useEvalTypesQuery } from '@/gql/graphql'
import { useModal } from '@ebay/nice-modal-react'
import EvalTypeTableModal from '@/views/primary/eval/EvalTypeTableModal'
import { useEventEmitter, useKeyPress } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { RefreshCw, Search } from 'react-feather'
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

interface EvalTypeAutocompleteHintProps {
  onFill(value: string | HintOption): void
  focus$?: EventEmitter<void>
  reload$?: EventEmitter<void>
  canRefetch?: boolean
}

const EvalTypeAutocompleteHint: React.FC<EvalTypeAutocompleteHintProps> = ({
  canRefetch = true,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const evalTypeModal = useModal(EvalTypeTableModal)

  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  const text$ = useEventEmitter<string>()

  const {
    data: dataEvalType,
    loading: loadingEvalType,
    subscribeToMore: subscribeToMoreEvalType,
    refetch: refetchEvalTypes,
  } = useEvalTypesQuery({
    variables: { id: enterpriseId },
  })

  const refetch = async () => {
    setIsRefetching(true)
    try {
      await refetchEvalTypes()
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
    evalTypeModal.hide()
    text$.emit('')
  }

  const openModal = () => {
    evalTypeModal.show({
      evalTypes: dataEvalType?.evalTypes?.filter((p: any) => p.active) || [],
      onRowClicked: onRowClicked,
      initialFilter: text,
    })
  }

  useKeyPress('ctrl.enter', () => openModal())
  useKeyPress('ctrl.q', () => props.focus$?.emit()) // Matching placeholder shortcut

  const isLoading = loadingEvalType || isRefetching

  return (
    <LiveView
      document={EvalTypeCreatedDocument}
      subscribeToMore={subscribeToMoreEvalType}
      listVar="evalTypes"
      singleVar="evalType"
      data={dataEvalType}
      loading={loadingEvalType}
      enterpriseId={enterpriseId}
    >
      {({ evalTypes }) => (
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
                options={
                  evalTypes ? evalTypes.filter((p: any) => p.active) : []
                }
                onFill={props.onFill}
                allowTabFill={true}
                getOptionLabel={() => ['name']}
                uniqueKey="id"
                placeholder={
                  t('text-evalTypePlaceholder') ||
                  "Entrez le nom d'un type d'évaluation ..."
                }
                focus$={props.focus$}
                onChange={setText}
                text$={text$}
                onOpenModal={(value) =>
                  evalTypeModal.show({
                    evalTypes: dataEvalType?.evalTypes
                      ? evalTypes.filter((p: any) => p.active)
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
              <kbd>Enter</kbd>
            </div>
          </AppendAction>

          <LoadingBar $visible={isLoading} />
        </InputGroup>
      )}
    </LiveView>
  )
}

export default EvalTypeAutocompleteHint
