// ** React Imports
import { useEffect, useState, Fragment, forwardRef } from 'react'

// ** Third Party Components
import Stepper from 'bs-stepper'
import classnames from 'classnames'
import { ChevronRight } from 'react-feather'

// ** Styles
import 'bs-stepper/dist/css/bs-stepper.min.css'
import '../../../@core/scss/base/plugins/forms/form-wizard.scss'

interface WizardProps {
  type?: 'horizontal' | 'modern-horizontal' | 'vertical' | 'modern-vertical'
  instance?: any
  options?: object
  className?: string
  separator?: any // element,
  headerClassName?: string
  contentClassName?: string
  contentWrapperClassName?: string
  steps: StepType[]
}

type StepType = {
  id: string
  title: string
  subtitle?: string
  icon?: any
  content: any
}

const Wizard = forwardRef<any, WizardProps>((props, ref) => {
  // ** Props
  const {
    type,
    steps,
    options,
    instance,
    separator,
    className,
    headerClassName,
    contentClassName,
    contentWrapperClassName,
  } = props

  // ** State
  const [activeIndex, setActiveIndex] = useState(0)

  // ** Vars
  let stepper = null

  // ** Step change listener on mount
  useEffect(() => {
    // @ts-ignore desc
    stepper = new Stepper(ref.current, options)

    // @ts-ignore desc
    ref.current.addEventListener('shown.bs-stepper', function (event: any) {
      setActiveIndex(event.detail.indexStep)
    })

    if (instance) {
      instance(stepper)
    }
  }, [])

  // ** Renders Wizard Header
  const renderHeader = () => {
    return steps.map((step, index) => {
      return (
        <Fragment key={step.id}>
          {index !== 0 && index !== steps.length ? (
            <div className="line">{separator}</div>
          ) : null}
          <div
            className={classnames('step', {
              crossed: activeIndex > index,
              active: index === activeIndex,
            })}
            data-target={`#${step.id}`}
          >
            <button type="button" className="step-trigger">
              <span className="bs-stepper-box">
                {step.icon ? step.icon : index + 1}
              </span>
              <span className="bs-stepper-label">
                <span className="bs-stepper-title !text-sm">{step.title}</span>
                {step.subtitle ? (
                  <span className="bs-stepper-subtitle !text-xs">
                    {step.subtitle}
                  </span>
                ) : null}
              </span>
            </button>
          </div>
        </Fragment>
      )
    })
  }

  // ** Renders Wizard Content
  const renderContent = () => {
    return steps.map((step, index) => {
      return (
        <div
          className={classnames('content', {
            // @ts-ignore desc
            [contentClassName]: contentClassName,
            'active dstepper-block': activeIndex === index,
          })}
          id={step.id}
          key={step.id}
        >
          {step.content}
        </div>
      )
    })
  }

  return (
    <div
      ref={ref}
      className={classnames('bs-stepper', {
        // @ts-ignore desc
        [className]: className,
        vertical: type === 'vertical',
        'vertical wizard-modern': type === 'modern-vertical',
        'wizard-modern': type === 'modern-horizontal',
      })}
    >
      {/* @ts-ignore desc */}
      <div
        className={classnames('bs-stepper-header', {
          [headerClassName]: headerClassName,
        })}
      >
        {renderHeader()}
      </div>
      {/* @ts-ignore desc */}
      <div
        className={classnames('bs-stepper-content', {
          [contentWrapperClassName]: contentWrapperClassName,
        })}
      >
        {renderContent()}
      </div>
    </div>
  )
})

export default Wizard

// ** Default Props
Wizard.defaultProps = {
  options: {},
  type: 'horizontal',
  separator: <ChevronRight size={17} />,
}
