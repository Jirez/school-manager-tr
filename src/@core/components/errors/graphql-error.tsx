import React from 'react'
import type { ApolloError } from '@apollo/client'
import { useTranslation } from 'react-i18next'
import ErrorMessage from './error-message'

interface Props {
  error: ApolloError
}

const GraphQLError: React.FC<Props> = ({ error }) => {
  const { t } = useTranslation()

  if (error.networkError) {
    return <ErrorMessage message={t('label-network-error')} />
  }

  return <ErrorMessage message={error.message} />
}

export default GraphQLError
