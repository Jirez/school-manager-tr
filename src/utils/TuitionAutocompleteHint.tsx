import React, { useState } from 'react'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import type { HintOption } from '@/utils/libraries/autocompleteHint/HintOption'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import AutocompleteHintInput from '@/utils/AutocompleteHintInput'
import { NewProductCreatedDocument, useTuitionsQuery } from '@/gql/graphql'
import { useModal } from '@ebay/nice-modal-react'
import TuitionTableModal from '@/views/sale/tuition/TuitionTableModal'
import { useEventEmitter, useKeyPress } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { RefreshCw, Search } from 'react-feather'
import ProductModal from '@/views/sale/product/ProductModal'
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

interface Props {
  onFill(value: string | HintOption): void
  focus$?: EventEmitter<void>

  onOpenTable?(value: string | HintOption): void // open list inside a table

  reload$?: EventEmitter<void>
  canRefetch?: boolean
}

const TuitionAutocompleteHint: React.FC<Props> = ({
  canRefetch = true,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()
  const tuitionModal = useModal(TuitionTableModal)
  const tuitionAddModal = useModal(ProductModal)
  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)
  const { t } = useTranslation()
  const text$ = useEventEmitter<string>()

  const {
    data,
    loading,
    subscribeToMore: subscribeToMore,
    refetch: refetchTuitions,
  } = useTuitionsQuery({
    variables: { id: enterpriseId },
  })

  const refetch = async () => {
    setIsRefetching(true)
    try {
      await refetchTuitions()
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
    tuitionModal.hide()
    //props.focus$?.emit();
    //props.onSelect?.()
    text$.emit('')
  }

  const openModal = () => {
    tuitionModal
      .show({
        tuitions: data ? data?.tuitions?.filter((p: any) => p.active) : [],
        onRowClicked: onRowClicked,
        initialFilter: text,
      })
      .then(() => {
        //alert("modal")
        //document.getElementById("quickFilter")?.focus()
      })
  }

  useKeyPress('ctrl.enter', () => openModal())

  useKeyPress('ctrl.i', () => openModal())

  const isLoading = loading || isRefetching

  return (
    <LiveView
      document={NewProductCreatedDocument}
      subscribeToMore={subscribeToMore}
      listVar="tuitions"
      singleVar="tuition"
      data={data}
      loading={loading}
      enterpriseId={enterpriseId}
      showLoader
    >
      {({ tuitions }) => (
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
                options={tuitions ? tuitions.filter((p: any) => p.active) : []}
                onFill={props.onFill}
                allowTabFill={true}
                getOptionLabel={() => ['name']}
                uniqueKey="id"
                placeholder={t('text-tuitionPlaceholder')}
                focus$={props.focus$}
                onChange={setText}
                text$={text$}
                onOpenModal={(value) =>
                  tuitionModal.show({
                    tuitions: data?.tuitions
                      ? tuitions.filter((p: any) => p.active)
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

export default TuitionAutocompleteHint
