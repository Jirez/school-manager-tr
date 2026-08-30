import React, { cloneElement, Fragment } from 'react'
import { useMutation } from '@apollo/client'
import type { DocumentNode } from 'graphql'
// import {useAuthentication} from "@hooks/useAuthentication";

interface UpdateItemProps {
  mutation: DocumentNode
  query?: DocumentNode
  form: React.ReactElement
  listVar?: string
  singleVar?: string
}

const UpdateItem: React.FC<UpdateItemProps> = ({
  mutation,
  query,
  form,
  listVar,
  singleVar,
  ...props
}) => {
  // const {enterpriseId} = useAuthentication()

  const [updateItem, { loading }] = useMutation(mutation, {
    /* update(cache, {data}){
                const list : {[key: string]: []} | null = cache.readQuery({
                    query: query,
                    variables: {"id": enterpriseId}
                });
                //console.log(data[singleVar])
                cache.writeQuery({
                    query: query,
                    variables: {"id": enterpriseId},
                    data: {[listVar]: list![listVar]}
                });
            }*/
  })

  // const updateItem = () => console.log('updating');

  return (
    <Fragment>
      {cloneElement(form, { action: updateItem, loading: loading, ...props })}
    </Fragment>
  )
}

export default UpdateItem
