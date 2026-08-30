import React, { useState } from 'react'
import { useEventEmitter } from 'ahooks'
import type { EventEmitter } from 'ahooks/lib/useEventEmitter'
import type { HintOption } from './libraries/autocompleteHint/HintOption'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from './LiveView'
import AutocompleteHintInput from './AutocompleteHintInput'
import AccountAdd from '@/views/accounting/accounts/AccountAdd'
import { AccountCreatedDocument, useAccountsQuery } from '@/gql/graphql'
import { useTranslation } from 'react-i18next'
import { RefreshCw, Search } from 'react-feather'
import {
  ContentArea,
  InputContainer,
  InputGroup,
  LoadingBar,
  PrependAction,
  SearchIconBox,
} from './autocomplete.style'
import { Loader2 } from 'lucide-react'

interface AccountAutocompleteHintProps {
  onFill(value: string | HintOption): void
  focus$?: EventEmitter<void>
  reload$?: EventEmitter<void>
  canRefetch?: boolean
}

const AccountAutocompleteHint: React.FC<AccountAutocompleteHintProps> = ({
  canRefetch = true,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()
  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isRefetching, setIsRefetching] = useState(false)
  const { t } = useTranslation()
  const text$ = useEventEmitter<string>()

  const {
    data,
    loading,
    subscribeToMore,
    refetch: refetchAccounts,
  } = useAccountsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'network-only',
  })

  const refetch = async () => {
    setIsRefetching(true)
    try {
      await refetchAccounts()
    } finally {
      setTimeout(() => setIsRefetching(false), 500)
    }
  }

  props.reload$?.useSubscription(() => refetch())

  const isLoading = loading || isRefetching

  return (
    <LiveView
      document={AccountCreatedDocument}
      subscribeToMore={subscribeToMore}
      listVar="accounts"
      singleVar="account"
      data={data}
      loading={loading}
      enterpriseId={enterpriseId}
      showLoader
    >
      {({ accounts }) => (
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
                options={accounts ? accounts.filter((p: any) => p.active) : []}
                onFill={props.onFill}
                allowTabFill={true}
                getOptionLabel={() => ['name', 'number']}
                uniqueKey="id"
                placeholder={
                  t('text-accountPlaceholder') ||
                  'Entrez un compte ... (ctrl + q pour revenir sur ce champ)'
                }
                form={<AccountAdd account={{ name: '', active: true }} />}
                formId="account"
                focus$={props.focus$}
                onChange={setText}
                text$={text$}
              />
            </InputContainer>
          </ContentArea>

          <LoadingBar $visible={isLoading} />
        </InputGroup>
      )}
    </LiveView>
  )
}

export default AccountAutocompleteHint
