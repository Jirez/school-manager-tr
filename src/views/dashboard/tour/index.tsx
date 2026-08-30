import { useMemo } from 'react'
import Shepherd from 'shepherd.js'

// ** Styles
import './shepherd.css'
import '@/@core/scss/react/libs/shepherd-tour/shepherd-tour.scss'
import { useTranslation } from 'react-i18next'
import CardCongratulations from '@/@core/components/widgets/card/card-congratulation'
import { useMenuCollapsed } from '@/hooks/useMenuCollapsed'

const backBtnClass = 'btn btn-sm btn-outline-primary',
  nextBtnClass = 'btn btn-sm btn-primary btn-next'

const tourOptions = {
  defaultStepOptions: {
    cancelIcon: {
      enabled: true,
    },
  },
  useModalOverlay: true,
}

export const Content = () => {
  const { t } = useTranslation()
  const { menuCollapsed, setMenuCollapsed } = useMenuCollapsed()

  const tour = useMemo(() => {
    const tourInstance = new Shepherd.Tour({
      ...tourOptions,
    })

    const commonButtons = [
      {
        classes: backBtnClass,
        text: t('label-cancel'),
        type: 'cancel',
        action() {
          return this.cancel()
        },
      },
      {
        text: t('label-back'),
        classes: backBtnClass,
        type: 'back',
        action() {
          return this.back()
        },
      },
      {
        text: t('label-next'),
        classes: nextBtnClass,
        type: 'next',
        action() {
          return this.next()
        },
      },
    ]

    const steps: any[] = [
      {
        id: 'navbar',
        title: 'Navbar',
        text: t('step-navbar'),
        attachTo: { element: '.navbar', on: 'bottom' },
        cancelIcon: {
          enabled: true,
        },
        buttons: [
          {
            classes: backBtnClass,
            text: t('label-cancel'),
            type: 'cancel',
            action() {
              return this.cancel()
            },
          },
          {
            text: t('label-next'),
            classes: nextBtnClass,
            action() {
              return this.next()
            },
          },
        ],
      },
      {
        id: 'intlComp',
        title: t('label-language'),
        text: t('step-language'),
        attachTo: { element: '.dropdown-language', on: 'right' },
        cancelIcon: {
          enabled: true,
        },
        buttons: [...commonButtons],
      },
      {
        id: 'theme',
        title: 'Theme',
        text: t('step-theme'),
        attachTo: { element: '.theme', on: 'bottom' },
        cancelIcon: {
          enabled: true,
        },
        buttons: [...commonButtons],
      },
      {
        id: 'main-menu',
        title: 'Menu',
        text: t('step-menu'),
        attachTo: { element: '.main-menu', on: 'right' },
        cancelIcon: {
          enabled: true,
        },
        buttons: [...commonButtons],
      },
      {
        id: 'menu-toggler',
        title: 'Menu',
        text: t('step-toggler'),
        attachTo: { element: '.toggle-icon', on: 'right' },
        beforeShowPromise: function () {
          return new Promise(function (resolve) {
            if (menuCollapsed) {
              setMenuCollapsed(false)
            }
            setTimeout(function () {
              // @ts-ignore desc
              resolve()
            }, 500)
          })
        },
        when: {
          hide: () => {
            setMenuCollapsed(true)
          },
        },
        buttons: [...commonButtons],
      },
      {
        id: 'footer',
        title: 'Footer',
        text: t('step-footer'),
        attachTo: { element: '.footer', on: 'top' },
        buttons: [
          {
            text: t('label-back'),
            classes: backBtnClass,
            type: 'back',
            action() {
              return this.back()
            },
          },
          {
            text: t('label-finish'),
            classes: nextBtnClass,
            type: 'cancel',
            action() {
              return this.complete()
            },
          },
        ],
      },
    ]

    tourInstance.addSteps(steps)
    return tourInstance
  }, [t, menuCollapsed, setMenuCollapsed])

  return <CardCongratulations onClick={() => tour?.start()} />
}

/* const TourComponent = () => {
  return (
    <Fragment>
      <ExtensionsHeader
        title='React Shepherd'
        subTitle='Tourist Guide into your React Components With React Shepherd'
        link='https://github.com/shipshapecode/react-shepherd'
      />
      <Row id='basic-tour'>
        <Col xs={12}>
          <Card>
            <CardHeader>
              <CardTitle tag='h4'>Tour</CardTitle>
            </CardHeader>
            <CardBody>
              <ShepherdTour
                steps={steps}
                tourOptions={{
                  useModalOverlay: true
                }}
              >
                <Content />
              </ShepherdTour>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
} */

// export default TourComponent
