import {
  PayrollUpdateDocument,
  useEmployeeDeductionsQuery,
  useEmployeeEarningsQuery,
  useEmployerDeductionsQuery,
  usePayrollByIdQuery,
} from '@/gql/graphql'
import UpdateItem from '@/utils/forms/edit'
import PayrollForm from './PayrollForm'
import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'

const PayrollUpdate = (props: any) => {
  const { data, error, loading } = usePayrollByIdQuery({
    variables: { id: props.payroll.id },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataEarning,
    error: errorEarning,
    loading: loadingEarning,
  } = useEmployeeEarningsQuery({
    variables: { payrollId: props.payroll.id },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataDeduction,
    error: errorDeduction,
    loading: loadingDeduction,
  } = useEmployeeDeductionsQuery({
    variables: { payrollId: props.payroll.id },
    fetchPolicy: 'network-only',
  })

  const {
    data: dataEmployerDeduction,
    error: errorEmployerDeduction,
    loading: loadingEmployerDeduction,
  } = useEmployerDeductionsQuery({
    variables: { payrollId: props.payroll.id },
    fetchPolicy: 'network-only',
  })

  if (error) {
    return <GraphQLError error={error} />
  }

  if (errorEarning) {
    return <GraphQLError error={errorEarning} />
  }

  if (errorDeduction) {
    return <GraphQLError error={errorDeduction} />
  }

  if (errorEmployerDeduction) {
    return <GraphQLError error={errorEmployerDeduction} />
  }

  if (
    loading ||
    loadingEarning ||
    loadingDeduction ||
    loadingEmployerDeduction
  ) {
    return <Loader />
  }

  const payroll = data?.payroll
  const earnings = dataEarning?.earnings
  const deductions = dataDeduction?.deductions
  const employerDeductions = dataEmployerDeduction?.deductions

  return (
    <UpdateItem
      mutation={PayrollUpdateDocument}
      form={
        <PayrollForm
          {...props}
          payroll={{ ...payroll, earnings, deductions, employerDeductions }}
        />
      }
    />
  )
}

export default PayrollUpdate
