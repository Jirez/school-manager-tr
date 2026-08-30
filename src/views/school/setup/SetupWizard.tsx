import { useRef, useState, useMemo, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import Wizard from '@/@core/components/wizard'
import SchoolUpdateForm from './SchoolUpdateForm'
import GraphQLError from '@/@core/components/errors/graphql-error'
import Loader from '@/@core/components/spinner/loader'
import ErrorComponent from '@/@core/components/ui/error-component'
import { useAuthentication } from '@/hooks/useAuthentication'
import SchoolYearSetupForm from './SchoolYearSetupForm'
import CycleSetupForm from './CycleSetupForm'
import LevelSetupForm from './LevelSetupForm'
import { useGuidedSetupQuery } from '@/gql/graphql'

const SetupWizard = () => {
  // ** Ref
  const ref = useRef(null)
  const { t } = useTranslation()
  const { enterpriseId } = useAuthentication()

  // ** State
  const [stepper, setStepper] = useState(null)

  const steps = useMemo(
    () => [
      {
        id: 'SCHOOL',
        title: t('label-school'),
        subtitle: t('label-schoolDetails'),
        icon: <CheckCircle size={18} />,
        content: <SchoolUpdateForm stepper={stepper} />,
      },
      {
        id: 'SCHOOL_YEAR',
        title: t('label-schoolYear'),
        subtitle: t('label-schoolYearDetails'),
        icon: <CheckCircle size={18} />,
        content: <SchoolYearSetupForm stepper={stepper} />,
      },
      {
        id: 'CYCLES',
        title: t('label-cycles'),
        subtitle: 'Add cycles',
        icon: <CheckCircle size={18} />,
        content: <CycleSetupForm stepper={stepper} />,
      },
      {
        id: 'LEVELS',
        title: t('label-levels'),
        subtitle: 'Add levels',
        icon: <CheckCircle size={18} />,
        content: <LevelSetupForm stepper={stepper} />,
      },
      {
        id: 'BRANCHES',
        title: t('label-branches'),
        subtitle: 'Add branches',
        icon: <CheckCircle size={18} />,
        content: <CycleSetupForm stepper={stepper} />,
      },
      {
        id: 'CLASSES',
        title: t('label-classes'),
        subtitle: 'Add classes',
        icon: <CheckCircle size={18} />,
        content: <CycleSetupForm stepper={stepper} />,
      },
    ],
    [stepper],
  )

  const { data, loading, error } = useGuidedSetupQuery({
    variables: { schoolId: enterpriseId },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    const step: string = data?.guidedSetup?.step!
    //console.log(step)

    if (step !== null) {
      let level: number = 1

      switch (step) {
        case 'SCHOOL_YEAR':
          level = 2
          break

        case 'CYCLES':
          level = 3
          break
        case 'LEVELS':
          level = 4
          break
        case 'BRANCHES':
          level = 5
          break
        case 'CLASSES':
          level = 6
          break

        default:
          break
      }

      //@ts-ignore
      stepper?.to(level)
    }
  }, [stepper, data?.guidedSetup])

  if (error) {
    return <GraphQLError error={error} />
  }

  if (loading) {
    return <Loader />
  }

  if (data && (data.guidedSetup === null || data?.guidedSetup?.completed)) {
    return <ErrorComponent message={'Not available'} />
  }

  return (
    <div className="modern-vertical-wizard">
      <Wizard
        type="vertical"
        ref={ref}
        steps={steps}
        options={{
          linear: true,
          //animation: true,
        }}
        instance={(el: any) => setStepper(el)}
      />
    </div>
  )
}

export default SetupWizard
