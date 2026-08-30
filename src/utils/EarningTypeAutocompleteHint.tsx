import React, { useState } from 'react'
import { useEventEmitter, useKeyPress } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import type { HintOption } from './libraries/autocompleteHint/HintOption'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from './LiveView'
import AutocompleteHintInput from './AutocompleteHintInput'
import { useModal } from '@ebay/nice-modal-react'
import { EarningCreatedDocument, useEarningsQuery } from '@/gql/graphql'
import EarningTableModal from '@/views/payroll/earning/EarningTableModal'
import { useTranslation } from 'react-i18next'
import { RefreshCw, Search } from 'react-feather'
import { FolderOpen, Loader2 } from 'lucide-react'
import {
  AppendAction,
  ContentArea,
  InputContainer,
  InputGroup,
  LoadingBar,
  PrependAction,
  SearchIconBox,
} from './autocomplete.style'

interface AutocompleteHintProps {
  onFill(value: string | HintOption): void
  focus$?: EventEmitter<void>
  reload$?: EventEmitter<void>
  canRefetch?: boolean
}

const EarningTypeAutocompleteHint: React.FC<AutocompleteHintProps> = ({
  canRefetch = true,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  const categoryModal = useModal(EarningTableModal)
  const text$ = useEventEmitter<string>()

  const {
    data: data,
    loading: loading,
    subscribeToMore: subscribeToMore,
    refetch: refetchEarnings,
  } = useEarningsQuery({
    variables: { id: enterpriseId },
  })

  const refetch = async () => {
    setIsRefetching(true)
    try {
      await refetchEarnings()
    } finally {
      setTimeout(() => setIsRefetching(false), 500)
    }
  }

  props.reload$?.useSubscription(() => refetch())

  const onRowClicked = (selectedRow: any) => {
    const item = {
      id: selectedRow.id,
      name: selectedRow.name,
      calculationType: selectedRow.calculationType,
      isTaxable: selectedRow.isTaxable,
    }

    setText('')
    props.onFill(item)
    categoryModal.hide()
    text$.emit('')
  }

  const openModal = () => {
    categoryModal.show({
      earnings: data ? data?.earnings?.filter((p: any) => p.active) : [],
      onRowClicked: onRowClicked,
      initialFilter: text,
    })
  }

  useKeyPress('ctrl.enter', () => openModal())
  useKeyPress('ctrl.i', () => openModal())

  const isLoading = loading || isRefetching

  return (
    <LiveView
      document={EarningCreatedDocument}
      subscribeToMore={subscribeToMore}
      listVar="earnings"
      singleVar="earning"
      data={data}
      loading={loading}
      enterpriseId={enterpriseId}
    >
      {({ earnings }) => (
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
                options={earnings ? earnings.filter((p: any) => p.active) : []}
                onFill={props.onFill}
                allowTabFill={true}
                getOptionLabel={() => ['name', 'description']}
                uniqueKey="id"
                placeholder={
                  t('text-earningPlaceholder') || 'Rechercher un gain...'
                }
                focus$={props.focus$}
                onChange={setText}
                text$={text$}
                onOpenModal={(value) =>
                  categoryModal.show({
                    earnings: data?.earnings
                      ? earnings.filter((p: any) => p.active)
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

export default EarningTypeAutocompleteHint
