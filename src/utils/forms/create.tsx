import React, { cloneElement } from 'react'
import { useMutation } from '@apollo/client'
import type { DocumentNode } from 'graphql'

interface AddItemProps {
  mutation: DocumentNode
  form: React.ReactElement
}

const AddItem: React.FC<AddItemProps> = ({ mutation, form }) => {
  const [addItem, { loading }] = useMutation(mutation)
  return <>{cloneElement(form, { action: addItem, loading: loading })}</>
}

export default AddItem
