import React, { useState } from 'react'
import { useEventEmitter, useKeyPress } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import type { HintOption } from './libraries/autocompleteHint/HintOption'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from './LiveView'
import AutocompleteHintInput from './AutocompleteHintInput'
import { useModal } from '@ebay/nice-modal-react'
import { DeductionCreatedDocument, useDeductionsQuery } from '@/gql/graphql'
import DeductionTableModal from '@/views/payroll/deduction/DeductionTableModal'
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

const DeductionTypeAutocompleteHint: React.FC<AutocompleteHintProps> = ({
  canRefetch = true,
  ...props
}) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  const categoryModal = useModal(DeductionTableModal)
  const text$ = useEventEmitter<string>()

  const {
    data: data,
    loading: loading,
    subscribeToMore: subscribeToMore,
    refetch: refetchDeductions,
  } = useDeductionsQuery({
    variables: { id: enterpriseId },
  })

  const refetch = async () => {
    setIsRefetching(true)
    try {
      await refetchDeductions()
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
    }

    setText('')
    props.onFill(item)
    categoryModal.hide()
    text$.emit('')
  }

  const openModal = () => {
    categoryModal.show({
      deductions: data ? data?.deductions?.filter((p: any) => p.active) : [],
      onRowClicked: onRowClicked,
      initialFilter: text,
    })
  }

  useKeyPress('ctrl.enter', () => openModal())
  useKeyPress('ctrl.i', () => openModal())

  const isLoading = loading || isRefetching

  return (
    <LiveView
      document={DeductionCreatedDocument}
      subscribeToMore={subscribeToMore}
      listVar="deductions"
      singleVar="deduction"
      data={data}
      loading={loading}
      enterpriseId={enterpriseId}
    >
      {({ deductions }) => (
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
                  deductions ? deductions.filter((p: any) => p.active) : []
                }
                onFill={props.onFill}
                allowTabFill={true}
                getOptionLabel={() => ['name', 'description']}
                uniqueKey="id"
                placeholder={
                  t('text-deductionPlaceholder') ||
                  'Rechercher une déduction...'
                }
                focus$={props.focus$}
                onChange={setText}
                text$={text$}
                onOpenModal={(value) =>
                  categoryModal.show({
                    deductions: data?.deductions
                      ? deductions.filter((p: any) => p.active)
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

export default DeductionTypeAutocompleteHint
