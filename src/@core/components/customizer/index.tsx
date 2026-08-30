// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import Select from 'react-select'
import classnames from 'classnames'
import { selectThemeColors } from '@/utils/Utils'
import { Settings, X } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Reactstrap Imports
import { Input, Label } from 'reactstrap'

// ** Styles
import '@/@core/scss/react/libs/react-select/_react-select.scss'
import { useTranslation } from 'react-i18next'

const Customizer = (props: any) => {
  // ** Props
  const {
    skin,
    layout,
    setSkin,
    isHidden,
    setLayout,
    navbarType,
    footerType,
    transition,
    navbarColor,
    setIsHidden,
    contentWidth,
    menuCollapsed,
    setLastLayout,
    setTransition,
    setNavbarType,
    setFooterType,
    setNavbarColor,
    setContentWidth,
    setMenuCollapsed,
  } = props

  // ** State
  const [openCustomizer, setOpenCustomizer] = useState(false)
  const { t } = useTranslation()

  // ** Toggles Customizer
  const handleToggle = (e: any) => {
    e.preventDefault()
    setOpenCustomizer(!openCustomizer)
  }

  // ** Render Layout Skin Options
  const renderSkinsRadio = () => {
    const skinsArr = [
      {
        name: 'light',
        label: t('label-light'),
        checked: skin === 'light',
      },
      {
        name: 'bordered',
        label: t('label-bordered'),
        checked: skin === 'bordered',
      },
      {
        name: 'dark',
        label: t('label-dark'),
        checked: skin === 'dark',
      },
      {
        name: 'semi-dark',
        label: t('label-semiDark'),
        checked: skin === 'semi-dark',
      },
    ]

    return skinsArr.map((radio, index) => {
      const marginCondition = index !== skinsArr.length - 1

      if (layout === 'HorizontalLayout' && radio.name === 'semi-dark') {
        return null
      }

      return (
        <div
          key={index}
          className={classnames('form-check', { 'mb-2 me-1': marginCondition })}
        >
          <Input
            type="radio"
            id={radio.name}
            checked={radio.checked}
            onChange={() => setSkin(radio.name)}
          />
          <Label className="form-check-label" for={radio.name}>
            {radio.label}
          </Label>
        </div>
      )
    })
  }

  // ** Render Navbar Colors Options
  const renderNavbarColors = () => {
    const colorsArr = [
      'white',
      'primary',
      'secondary',
      'success',
      'danger',
      'info',
      'warning',
      'dark',
    ]

    return colorsArr.map((color) => (
      <li
        key={color}
        className={classnames(`color-box bg-${color}`, {
          selected: navbarColor === color,
          border: color === 'white',
        })}
        onClick={() => setNavbarColor(color)}
      />
    ))
  }

  // ** Render Navbar Type Options
  const renderNavbarTypeRadio = () => {
    const navbarTypeArr = [
      {
        name: 'floating',
        label: t('label-floating'),
        checked: navbarType === 'floating',
      },
      {
        name: 'sticky',
        label: t('label-sticky'),
        checked: navbarType === 'sticky',
      },
      {
        name: 'static',
        label: t('label-static'),
        checked: navbarType === 'static',
      },
      {
        name: 'hidden',
        label: t('label-hidden'),
        checked: navbarType === 'hidden',
      },
    ]

    return navbarTypeArr.map((radio, index) => {
      const marginCondition = index !== navbarTypeArr.length - 1

      if (layout === 'HorizontalLayout' && radio.name === 'hidden') {
        return null
      }

      return (
        <div
          key={index}
          className={classnames('form-check', { 'mb-2 me-1': marginCondition })}
        >
          <Input
            type="radio"
            id={radio.name}
            checked={radio.checked}
            onChange={() => setNavbarType(radio.name)}
          />
          <Label className="form-check-label" for={radio.name}>
            {radio.label}
          </Label>
        </div>
      )
    })
  }

  // ** Render Footer Type Options
  const renderFooterTypeRadio = () => {
    const footerTypeArr = [
      {
        name: 'sticky',
        label: t('label-sticky'),
        checked: footerType === 'sticky',
      },
      {
        name: 'static',
        label: t('label-static'),
        checked: footerType === 'static',
      },
      {
        name: 'hidden',
        label: t('label-hidden'),
        checked: footerType === 'hidden',
      },
    ]

    return footerTypeArr.map((radio, index) => {
      const marginCondition = index !== footerTypeArr.length - 1

      return (
        <div
          key={index}
          className={classnames('form-check', { 'mb-2 me-1': marginCondition })}
        >
          <Input
            type="radio"
            checked={radio.checked}
            id={`footer-${radio.name}`}
            onChange={() => setFooterType(radio.name)}
          />
          <Label className="form-check-label" for={`footer-${radio.name}`}>
            {radio.label}
          </Label>
        </div>
      )
    })
  }

  // **  Router Transition Options
  const transitionOptions = [
    { value: 'fadeIn', label: 'Fade' },
    { value: 'fadeInLeft', label: 'Fade In Left' },
    { value: 'zoomIn', label: 'Zoom In' },
    { value: 'none', label: 'None' },
  ]

  // ** Get Current Transition
  const transitionValue = transitionOptions.find((i) => i.value === transition)

  return (
    <div
      className={classnames('customizer d-none d-md-block', {
        open: openCustomizer,
      })}
    >
      <a
        href="/"
        className="customizer-toggle d-flex align-items-center justify-content-center"
        onClick={handleToggle}
      >
        <Settings size={14} className="spinner" />
      </a>
      <PerfectScrollbar
        className="customizer-content"
        options={{ wheelPropagation: false }}
      >
        <div className="customizer-header px-2 pt-1 pb-1 position-relative">
          <h4 className="mb-0 font-semibold text-xl">
            {t('label-themeCustomizer')}
          </h4>
          <p className="m-0">{t('label-themeCustomizerDesc')}</p>
          <a href="/" className="customizer-close" onClick={handleToggle}>
            <X />
          </a>
        </div>

        <div className="border-1 border-gray-100"></div>

        <div className="px-2 pt-1">
          <div className="mb-2">
            <p className="fw-bold mb-0.5 text-lg">{t('label-skin')}</p>
            <div className="d-flex">{renderSkinsRadio()}</div>
          </div>

          <div className="mb-2">
            <p className="fw-bold mb-0.5 text-lg">{t('label-contentWith')}</p>
            <div className="d-flex">
              <div className="form-check me-1">
                <Input
                  type="radio"
                  id="full-width"
                  checked={contentWidth === 'full'}
                  onChange={() => setContentWidth('full')}
                />
                <Label className="form-check-label" for="full-width">
                  {t('label-fullWidth')}
                </Label>
              </div>
              <div className="form-check">
                <Input
                  id="boxed"
                  type="radio"
                  checked={contentWidth === 'boxed'}
                  onChange={() => setContentWidth('boxed')}
                />
                <Label className="form-check-label" for="boxed">
                  {t('label-boxed')}
                </Label>
              </div>
            </div>
          </div>

          {/* <div className='form-switch mb-2 ps-0'>
                        <div className='d-flex'>
                            <p className='fw-bold me-auto mb-0'>RTL</p>
                            <Input type='switch' id='rtl' name='RTL' checked={isRtl} onChange={() => setIsRtl(!isRtl)} />
                        </div>
                    </div> */}

          <div className="mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <p className="fw-bold mb-0">{t('label-routerTransition')}</p>
              <Select
                theme={selectThemeColors}
                className="react-select"
                classNamePrefix="select"
                defaultValue={transitionOptions[0]}
                value={transitionValue}
                options={transitionOptions}
                isClearable={false}
                onChange={({ value }: any) => setTransition(value)}
              />
            </div>
          </div>
        </div>

        <div className="border-1 border-gray-100" />

        <div className="px-2 pt-1">
          <p className="fw-bold mb-0.5 text-lg">{t('label-menuLayout')}</p>
          <div className="mb-2">
            <div className="d-flex align-items-center">
              <div className="form-check me-1">
                <Input
                  type="radio"
                  id="vertical-layout"
                  checked={layout === 'VerticalLayout'}
                  onChange={() => {
                    setLayout('vertical')
                    setLastLayout('vertical')
                  }}
                />
                <Label className="form-check-label" for="vertical-layout">
                  Vertical
                </Label>
              </div>
              <div className="form-check">
                <Input
                  type="radio"
                  id="horizontal-layout"
                  checked={layout === 'HorizontalLayout'}
                  onChange={() => {
                    setLayout('horizontal')
                    setLastLayout('horizontal')
                  }}
                />
                <Label className="form-check-label" for="horizontal-layout">
                  Horizontal
                </Label>
              </div>
            </div>
          </div>
          {layout !== 'HorizontalLayout' ? (
            <div className="form-switch mb-2 ps-0">
              <div className="d-flex align-items-center">
                <p className="fw-bold me-auto mb-0">
                  {t('label-menuCollapsed')}
                </p>
                <Input
                  type="switch"
                  id="menu-collapsed"
                  name="menu-collapsed"
                  checked={menuCollapsed}
                  onChange={() => setMenuCollapsed(!menuCollapsed)}
                />
              </div>
            </div>
          ) : null}

          <div className="form-switch mb-2 ps-0">
            <div className="d-flex align-items-center">
              <p className="fw-bold me-auto mb-0">{t('label-menuHidden')}</p>
              <Input
                type="switch"
                id="menu-hidden"
                name="menu-hidden"
                checked={isHidden}
                onChange={() => setIsHidden(!isHidden)}
              />
            </div>
          </div>
        </div>

        <div className="border-1 border-gray-100" />

        <div className="px-2 pt-1">
          {layout !== 'HorizontalLayout' ? (
            <div className="mb-2">
              <p className="fw-bold mb-0.5 text-lg">{t('label-navbarColor')}</p>
              <ul className="list-inline unstyled-list">
                {renderNavbarColors()}
              </ul>
            </div>
          ) : null}

          <div className="mb-2">
            <p className="fw-bold mb-0.5 text-lg">
              {layout === 'HorizontalLayout' ? 'Menu' : 'Navbar'} Type
            </p>
            <div className="d-flex">{renderNavbarTypeRadio()}</div>
          </div>
        </div>

        <div className="border-1 border-gray-100" />

        <div className="px-2 pt-1">
          <div className="mb-2">
            <p className="fw-bold mb-0.5 text-lg">{t('label-footerType')}</p>
            <div className="d-flex">{renderFooterTypeRadio()}</div>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
  )
}

export default Customizer
