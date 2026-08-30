import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import UpdateItem from '@/utils/forms/edit'
import ExpenseForm from './ExpenseForm'
import {
  ExpenseUpdateDocument,
  useExpenseByIdQuery,
  useExpenseItemsQuery,
} from '@/gql/graphql'

const ExpenseUpdate = (props: any) => {
  const { data, error, loading } = useExpenseByIdQuery({
    variables: { id: props.expense.id },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataI,
    error: errorI,
    loading: loadingI,
  } = useExpenseItemsQuery({
    variables: { id: props.expense.id },
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (errorI) {
    return <GraphQLError error={errorI} />
  }

  if (loading || loadingI) {
    return <Loader />
  }

  const expense = data?.expense
  const expenseItems = dataI?.items

  return (
    <UpdateItem
      mutation={ExpenseUpdateDocument}
      form={
        <ExpenseForm {...props} expense={{ ...expense, items: expenseItems }} />
      }
    />
  )
}

export default ExpenseUpdate
