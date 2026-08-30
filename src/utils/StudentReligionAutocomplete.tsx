import React, { useState } from 'react'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import type { HintOption } from '@/utils/libraries/autocompleteHint/HintOption'
import { useAuthentication } from '@/hooks/useAuthentication'
import AutocompleteHintInput from '@/utils/AutocompleteHintInput'
import { useStudentReligionsQuery } from '@/gql/graphql'
import { useEventEmitter } from 'ahooks'
import Required from '@/@core/components/ui/forms/required'
import { Heart } from 'lucide-react'
import {
  InputContainer,
  InputWrapper,
  PrependWrapper,
  StyledFormFeedback,
  StyledLabel,
} from './autocompletes.style'

interface AutocompleteHintProps {
  onFill(value: string | HintOption): void
  focus$?: EventEmitter<void>

  onOpenTable?(value: string | HintOption): void // open list inside a table

  reload$?: EventEmitter<void>
  canRefetch?: boolean
  label?: string
  required?: boolean
  id?: string
  className?: string
  labelClassName?: string
  error?: string
  value?: string
}

const StudentReligionAutocomplete: React.FC<AutocompleteHintProps> = ({
  canRefetch = true,
  label,
  required,
  id,
  className,
  labelClassName,
  value,
  ...props
}) => {
  const { enterpriseId } = useAuthentication()
  const [text, setText] = useState(value)
  const text$ = useEventEmitter<string>()

  const { data, loading, refetch } = useStudentReligionsQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'cache-and-network',
    //pollInterval: 15000,
  })

  props.reload$?.useSubscription(() => refetch())

  return (
    <InputContainer className={className}>
      {label && (
        <StyledLabel for={id} className={labelClassName}>
          {label}
          {required ? <Required /> : ''}
        </StyledLabel>
      )}
      <InputWrapper>
        <PrependWrapper>
          <Heart size={16} />
        </PrependWrapper>
        <AutocompleteHintInput
          options={data && data.studentReligions ? data.studentReligions : []}
          onFill={(value: string) => {
            props.onFill(value)
            setText(value)
          }}
          allowTabFill={false}
          uniqueKey="id"
          onChange={(value: string) => {
            setText(value)
            props.onFill(value)
          }}
          text$={text$}
          initialText={value}
          autoFocus={false}
        />
      </InputWrapper>
      {props.error && <StyledFormFeedback>{props.error}</StyledFormFeedback>}
    </InputContainer>
  )
}

export default StudentReligionAutocomplete
