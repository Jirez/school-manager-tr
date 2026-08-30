import React from 'react'
import { EventEmitter } from 'ahooks/lib/useEventEmitter'
import type { HintOption } from '@/utils/libraries/autocompleteHint/HintOption'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import AutocompleteHintInput from '@/utils/AutocompleteHintInput'
import { SchoolFeeCreatedDocument, useSchoolFeesQuery } from '@/gql/graphql'
import SchoolFeeAdd from '#/views/payment/schoolFees/SchoolFeeAdd'

interface Props {
  onFill(value: string | HintOption): void
  focus$?: EventEmitter<void>
}

const SchoolFeeAutocompleteHint: React.FC<Props> = (props) => {
  const { enterpriseId } = useAuthentication()

  const {
    data,
    loading,
    subscribeToMore: subscribeToMore,
  } = useSchoolFeesQuery({
    variables: { id: enterpriseId },
  })

  return (
    <LiveView
      document={SchoolFeeCreatedDocument}
      subscribeToMore={subscribeToMore}
      listVar="schoolFees"
      singleVar="schoolFee"
      data={data}
      loading={loading}
      enterpriseId={enterpriseId}
    >
      {({ schoolFees }) => (
        <AutocompleteHintInput
          options={schoolFees ? schoolFees.filter((p: any) => p.active) : []}
          onFill={props.onFill}
          allowTabFill={true}
          getOptionLabel={() => ['name']}
          uniqueKey="id"
          placeholder="Entrez le nom d'un droit exigible ... (ctrl + q pour revenir sur ce champ)"
          form={<SchoolFeeAdd />}
          formId="schoolFeeForm"
          focus$={props.focus$}
          // clearOnFill
        />
      )}
    </LiveView>
  )
}

export default SchoolFeeAutocompleteHint
