import BranchForm from '@/views/school/branches/BranchForm'
import UpdateItem from '@/utils/forms/edit'
import { BranchUpdateDocument, useSubjectBranchesQuery } from '@/gql/graphql'
import { toSubjectBranch } from './Branch.type'
import type { SubjectBranch } from './Branch.type'
import {
  FormSkeleton,
  SkeletonBlock,
} from '@/@core/components/ui/forms/form.style'

const BranchUpdate = (props: any) => {
  const { data, loading } = useSubjectBranchesQuery({
    variables: { branchId: Number(props.branch.id) },
    fetchPolicy: 'network-only',
  })

  if (loading) {
    return (
      <FormSkeleton aria-busy="true" aria-label="Loading branch form">
        <SkeletonBlock $width="35%" $height="1.25rem" />
        <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
        <SkeletonBlock $width="45%" $height="1.25rem" />
        <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock />
          <SkeletonBlock />
        </div>
        <SkeletonBlock $height="10rem" />
      </FormSkeleton>
    )
  }

  const items =
    data?.subjectBranches?.map((item) =>
      toSubjectBranch(item as SubjectBranch),
    ) || []
  const branch = props.branch
  // console.log('BranchUpdate', branch, items)

  return (
    <UpdateItem
      mutation={BranchUpdateDocument}
      form={<BranchForm {...props} branch={{ ...branch, items: items }} />}
    />
  )
}

export default BranchUpdate
