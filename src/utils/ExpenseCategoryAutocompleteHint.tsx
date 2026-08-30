import React, { useState } from 'react'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import type { HintOption } from './libraries/autocompleteHint/HintOption'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from './LiveView'
import AutocompleteHintInput from './AutocompleteHintInput'
import { useModal } from '@ebay/nice-modal-react'
import { useEventEmitter, useKeyPress } from 'ahooks'
import { useTranslation } from 'react-i18next'
import {
  ExpenseCategoryCreatedDocument,
  useExpenseCategoriesQuery,
} from '@/gql/graphql'
import { RefreshCw, Search } from 'react-feather'
import ExpenseCategoryTableModal from '@/views/expense/category/ExpenseCategoryTableModal'
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

interface ExpenseCategoryAutocompleteHintProps {
  onFill(value: string | HintOption): void
  focus$?: EventEmitter<void>
  onOpenTable?(value: string | HintOption): void
  reload$?: EventEmitter<void>
  canRefetch?: boolean
}

const ExpenseCategoryAutocompleteHint: React.FC<
  ExpenseCategoryAutocompleteHintProps
> = ({ canRefetch = true, ...props }) => {
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()
  const categoryModal = useModal(ExpenseCategoryTableModal)

  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)

  const text$ = useEventEmitter<string>()

  const {
    data: dataCategory,
    loading: loadingCategory,
    subscribeToMore: subscribeToMoreCategory,
    refetch: refetchCategories,
  } = useExpenseCategoriesQuery({
    variables: { id: enterpriseId },
  })

  const refetch = async () => {
    setIsRefetching(true)
    try {
      await refetchCategories()
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
    categoryModal.hide()
    text$.emit('')
  }

  const openModal = () => {
    categoryModal.show({
      categories:
        dataCategory?.expenseCategories?.filter((p: any) => p.active) || [],
      onRowClicked: onRowClicked,
      initialFilter: text,
    })
  }

  useKeyPress('ctrl.enter', () => openModal())
  useKeyPress('ctrl.i', () => openModal())

  const isLoading = loadingCategory || isRefetching

  return (
    <LiveView
      document={ExpenseCategoryCreatedDocument}
      subscribeToMore={subscribeToMoreCategory}
      listVar="expenseCategories"
      singleVar="expenseCategory"
      data={dataCategory}
      loading={loadingCategory}
      enterpriseId={enterpriseId}
    >
      {({ expenseCategories }) => (
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
                  expenseCategories
                    ? expenseCategories.filter((p: any) => p.active)
                    : []
                }
                onFill={props.onFill}
                allowTabFill={true}
                getOptionLabel={() => ['name', 'description']}
                uniqueKey="id"
                placeholder={t('text-categoryPlaceholder')}
                focus$={props.focus$}
                onChange={setText}
                text$={text$}
                onOpenModal={(value) =>
                  categoryModal.show({
                    categories: dataCategory?.expenseCategories
                      ? expenseCategories.filter((p: any) => p.active)
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

export default ExpenseCategoryAutocompleteHint
