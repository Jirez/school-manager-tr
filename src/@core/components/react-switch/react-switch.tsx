import { Component } from 'react'
import type { JSX } from 'react'
import { Check, X } from 'react-feather'

import getBackgroundColor from './getBackgroundColor'

type SwitchSize = 'sm' | 'md' | 'lg'

interface ReactSwitchProps {
  checked: boolean
  onChange: (
    checked: boolean,
    event: React.SyntheticEvent<MouseEvent | KeyboardEvent> | MouseEvent,
    id: string,
  ) => void
  disabled?: boolean
  offColor?: string
  onColor?: string
  offHandleColor?: string
  onHandleColor?: string
  handleDiameter?: number
  uncheckedHandleIcon?: JSX.Element
  checkedHandleIcon?: JSX.Element
  uncheckedIcon?: JSX.Element | boolean
  checkedIcon?: JSX.Element | boolean
  boxShadow?: string
  activeBoxShadow?: string
  height?: number
  width?: number
  borderRadius?: number
  className?: string
  id?: string
  /** Size preset - overrides height/width */
  size?: SwitchSize
  /** Show label text next to switch */
  label?: string
  /** Label position */
  labelPosition?: 'left' | 'right'
}

type htmlInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>
type excludedHTMLInputProps =
  'onFocus' | 'onBlur' | 'onKeyUp' | 'onChange' | 'ref' | keyof ReactSwitchProps

type allowedHTMLinputProps = Omit<htmlInputProps, excludedHTMLInputProps>

// Size presets
const sizePresets: Record<SwitchSize, { height: number; width: number }> = {
  sm: { height: 20, width: 36 },
  md: { height: 26, width: 50 },
  lg: { height: 32, width: 60 },
}

class ReactSwitch extends Component<
  ReactSwitchProps & allowedHTMLinputProps,
  any
> {
  static defaultProps = {
    disabled: false,
    offColor: '#d1d5db', // gray-300
    onColor: '#10b981', // emerald-500
    offHandleColor: '#ffffff',
    onHandleColor: '#ffffff',
    uncheckedIcon: <X className="w-3 h-3 text-gray-400" strokeWidth={2.5} />,
    checkedIcon: <Check className="w-3 h-3 text-white" strokeWidth={2.5} />,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    activeBoxShadow: '0 0 0 3px rgba(16, 185, 129, 0.25)',
    height: 26,
    width: 50,
    size: 'md' as SwitchSize,
  }

  $handleDiameter: number
  $checkedPos: number
  $uncheckedPos: number
  $lastDragAt: number
  $lastKeyUpAt: number
  $isMounted: boolean = false
  $inputRef: HTMLInputElement | null = null
  $checkedStateFromDragging: null = null

  constructor(props: ReactSwitchProps) {
    super(props)

    const dimensions = this.getDimensions()
    const { height, width } = dimensions
    const { checked } = props
    const handleDiameter = props.handleDiameter || height - 4

    this.$handleDiameter = handleDiameter
    this.$checkedPos = Math.max(
      width - height,
      width - (height + this.$handleDiameter) / 2,
    )
    this.$uncheckedPos = Math.max(0, (height - this.$handleDiameter) / 2)

    this.state = {
      $pos: checked ? this.$checkedPos : this.$uncheckedPos,
      $isDragging: false,
      $hasOutline: false,
    }

    this.$lastDragAt = 0
    this.$lastKeyUpAt = 0

    this.$onMouseDown = this.$onMouseDown.bind(this)
    this.$onMouseMove = this.$onMouseMove.bind(this)
    this.$onMouseUp = this.$onMouseUp.bind(this)
    this.$onTouchStart = this.$onTouchStart.bind(this)
    this.$onTouchMove = this.$onTouchMove.bind(this)
    this.$onTouchEnd = this.$onTouchEnd.bind(this)
    this.$onClick = this.$onClick.bind(this)
    this.$onInputChange = this.$onInputChange.bind(this)
    this.$onKeyUp = this.$onKeyUp.bind(this)
    this.$setHasOutline = this.$setHasOutline.bind(this)
    this.$unsetHasOutline = this.$unsetHasOutline.bind(this)
    this.$getInputRef = this.$getInputRef.bind(this)
  }

  getDimensions() {
    const { size, height, width } = this.props
    if (size && sizePresets[size]) {
      return sizePresets[size]
    }
    return {
      height: height || 26,
      width: width || 50,
    }
  }

  componentDidMount() {
    this.$isMounted = true
  }

  componentDidUpdate(prevProps: ReactSwitchProps) {
    if (prevProps.checked === this.props.checked) {
      return
    }
    const $pos = this.props.checked ? this.$checkedPos : this.$uncheckedPos
    this.setState({ $pos })
  }

  componentWillUnmount() {
    this.$isMounted = false
  }

  $onDragStart(clientX: number) {
    this.$inputRef?.focus()
    this.setState({
      $startX: clientX,
      $hasOutline: true,
      $dragStartingTime: Date.now(),
    })
  }

  $onDrag(clientX: number) {
    const { $startX, $isDragging, $pos } = this.state
    const { checked } = this.props
    const startPos = checked ? this.$checkedPos : this.$uncheckedPos
    const mousePos = startPos + clientX - $startX

    if (!$isDragging && clientX !== $startX) {
      this.setState({ $isDragging: true })
    }

    const newPos = Math.min(
      this.$checkedPos,
      Math.max(this.$uncheckedPos, mousePos),
    )

    if (newPos !== $pos) {
      this.setState({ $pos: newPos })
    }
  }

  $onDragStop(event: any) {
    const { $pos, $isDragging, $dragStartingTime } = this.state
    const { checked } = this.props
    const halfwayCheckpoint = (this.$checkedPos + this.$uncheckedPos) / 2

    const prevPos = this.props.checked ? this.$checkedPos : this.$uncheckedPos
    this.setState({ $pos: prevPos })

    const timeSinceStart = Date.now() - $dragStartingTime
    const isSimulatedClick = !$isDragging || timeSinceStart < 250

    const isDraggedHalfway =
      (checked && $pos <= halfwayCheckpoint) ||
      (!checked && $pos >= halfwayCheckpoint)

    if (isSimulatedClick || isDraggedHalfway) {
      this.$onChange(event)
    }

    if (this.$isMounted) {
      this.setState({ $isDragging: false, $hasOutline: false })
    }
    this.$lastDragAt = Date.now()
  }

  $onMouseDown(event: React.MouseEvent) {
    event.preventDefault()
    if (typeof event.button === 'number' && event.button !== 0) {
      return
    }

    this.$onDragStart(event.clientX)
    window.addEventListener('mousemove', this.$onMouseMove)
    window.addEventListener('mouseup', this.$onMouseUp)
  }

  $onMouseMove(event: MouseEvent) {
    event.preventDefault()
    this.$onDrag(event.clientX)
  }

  $onMouseUp(event: MouseEvent) {
    this.$onDragStop(event)
    window.removeEventListener('mousemove', this.$onMouseMove)
    window.removeEventListener('mouseup', this.$onMouseUp)
  }

  $onTouchStart(event: React.TouchEvent) {
    this.$checkedStateFromDragging = null
    this.$onDragStart(event.touches[0].clientX)
  }

  $onTouchMove(event: React.TouchEvent) {
    this.$onDrag(event.touches[0].clientX)
  }

  $onTouchEnd(event: React.TouchEvent) {
    event.preventDefault()
    this.$onDragStop(event)
  }

  $onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (Date.now() - this.$lastDragAt > 50) {
      this.$onChange(event)
      if (Date.now() - this.$lastKeyUpAt > 50) {
        if (this.$isMounted) {
          this.setState({ $hasOutline: false })
        }
      }
    }
  }

  $onKeyUp() {
    this.$lastKeyUpAt = Date.now()
  }

  $setHasOutline() {
    this.setState({ $hasOutline: true })
  }

  $unsetHasOutline() {
    this.setState({ $hasOutline: false })
  }

  $getInputRef(el: HTMLInputElement | null) {
    this.$inputRef = el
  }

  $onClick(event: React.MouseEvent) {
    event.preventDefault()
    this.$inputRef?.focus()
    this.$onChange(event)
    if (this.$isMounted) {
      this.setState({ $hasOutline: false })
    }
  }

  $onChange(event: any) {
    const { checked, onChange, id } = this.props
    onChange(!checked, event, id!)
  }

  render() {
    const {
      checked,
      disabled,
      className,
      offColor,
      onColor,
      offHandleColor,
      onHandleColor,
      checkedIcon,
      uncheckedIcon,
      checkedHandleIcon,
      uncheckedHandleIcon,
      boxShadow,
      activeBoxShadow,
      borderRadius,
      handleDiameter: _handleDiameter,
      size: _size,
      label,
      labelPosition = 'right',
      height: _height,
      width: _width,
      ...rest
    } = this.props

    const { $pos, $isDragging, $hasOutline } = this.state
    const dimensions = this.getDimensions()
    const { height, width } = dimensions

    const rootStyle: React.CSSProperties = {
      position: 'relative',
      display: 'inline-block',
      textAlign: 'left',
      opacity: disabled ? 0.5 : 1,
      direction: 'ltr',
      borderRadius: height / 2,
      WebkitTransition: 'opacity 0.25s',
      transition: 'opacity 0.25s',
      touchAction: 'none',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      WebkitUserSelect: 'none',
      userSelect: 'none',
      verticalAlign: 'middle',
    }

    const backgroundStyle: React.CSSProperties = {
      height,
      width,
      margin: Math.max(0, (this.$handleDiameter - height) / 2),
      position: 'relative',
      background: getBackgroundColor(
        $pos,
        this.$checkedPos,
        this.$uncheckedPos,
        offColor,
        onColor,
      ),
      borderRadius:
        typeof borderRadius === 'number' ? borderRadius : height / 2,
      cursor: disabled ? 'default' : 'pointer',
      WebkitTransition: $isDragging
        ? undefined
        : 'background 0.25s ease-in-out',
      transition: $isDragging ? undefined : 'background 0.25s ease-in-out',
      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
    }

    const checkedIconStyle: React.CSSProperties = {
      height,
      width: Math.min(
        height * 1.5,
        width - (this.$handleDiameter + height) / 2 + 1,
      ),
      position: 'relative',
      opacity:
        ($pos - this.$uncheckedPos) / (this.$checkedPos - this.$uncheckedPos),
      pointerEvents: 'none',
      WebkitTransition: $isDragging ? undefined : 'opacity 0.25s',
      transition: $isDragging ? undefined : 'opacity 0.25s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 4,
    }

    const uncheckedIconStyle: React.CSSProperties = {
      height,
      width: Math.min(
        height * 1.5,
        width - (this.$handleDiameter + height) / 2 + 1,
      ),
      position: 'absolute',
      opacity:
        1 -
        ($pos - this.$uncheckedPos) / (this.$checkedPos - this.$uncheckedPos),
      right: 0,
      top: 0,
      pointerEvents: 'none',
      WebkitTransition: $isDragging ? undefined : 'opacity 0.25s',
      transition: $isDragging ? undefined : 'opacity 0.25s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingRight: 4,
    }

    const handleStyle: React.CSSProperties = {
      height: this.$handleDiameter,
      width: this.$handleDiameter,
      background: getBackgroundColor(
        $pos,
        this.$checkedPos,
        this.$uncheckedPos,
        offHandleColor,
        onHandleColor,
      ),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'default' : 'pointer',
      borderRadius: typeof borderRadius === 'number' ? borderRadius - 1 : '50%',
      position: 'absolute',
      transform: `translateX(${$pos}px)`,
      top: Math.max(0, (height - this.$handleDiameter) / 2),
      outline: 0,
      boxShadow: $hasOutline
        ? activeBoxShadow
        : boxShadow || '0 2px 4px rgba(0, 0, 0, 0.2)',
      border: 0,
      WebkitTransition: $isDragging
        ? undefined
        : 'background-color 0.25s, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s',
      transition: $isDragging
        ? undefined
        : 'background-color 0.25s, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s',
    }

    const uncheckedHandleIconStyle: React.CSSProperties = {
      height: this.$handleDiameter,
      width: this.$handleDiameter,
      opacity: Math.max(
        (1 -
          ($pos - this.$uncheckedPos) /
            (this.$checkedPos - this.$uncheckedPos) -
          0.5) *
          2,
        0,
      ),
      position: 'absolute',
      left: 0,
      top: 0,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      WebkitTransition: $isDragging ? undefined : 'opacity 0.25s',
      transition: $isDragging ? undefined : 'opacity 0.25s',
    }

    const checkedHandleIconStyle: React.CSSProperties = {
      height: this.$handleDiameter,
      width: this.$handleDiameter,
      opacity: Math.max(
        (($pos - this.$uncheckedPos) / (this.$checkedPos - this.$uncheckedPos) -
          0.5) *
          2,
        0,
      ),
      position: 'absolute',
      left: 0,
      top: 0,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      WebkitTransition: $isDragging ? undefined : 'opacity 0.25s',
      transition: $isDragging ? undefined : 'opacity 0.25s',
    }

    const switchElement = (
      <div className={className} style={rootStyle}>
        <div
          className="react-switch-bg"
          style={backgroundStyle}
          onClick={disabled ? undefined : this.$onClick}
          onMouseDown={(e) => e.preventDefault()}
        >
          {checkedIcon && <div style={checkedIconStyle}>{checkedIcon}</div>}
          {uncheckedIcon && (
            <div style={uncheckedIconStyle}>{uncheckedIcon}</div>
          )}
        </div>
        <div
          className="react-switch-handle"
          style={handleStyle}
          onClick={(e) => e.preventDefault()}
          onMouseDown={disabled ? undefined : this.$onMouseDown}
          onTouchStart={disabled ? undefined : this.$onTouchStart}
          onTouchMove={disabled ? undefined : this.$onTouchMove}
          onTouchEnd={disabled ? undefined : this.$onTouchEnd}
          onTouchCancel={disabled ? undefined : this.$unsetHasOutline}
        >
          {uncheckedHandleIcon && (
            <div style={uncheckedHandleIconStyle}>{uncheckedHandleIcon}</div>
          )}
          {checkedHandleIcon && (
            <div style={checkedHandleIconStyle}>{checkedHandleIcon}</div>
          )}
        </div>
        <input
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          disabled={disabled}
          className="sr-only"
          {...rest}
          ref={this.$getInputRef}
          onFocus={this.$setHasOutline}
          onBlur={this.$unsetHasOutline}
          onKeyUp={this.$onKeyUp}
          onChange={this.$onInputChange}
        />
      </div>
    )

    // If label is provided, wrap in a label element
    if (label) {
      return (
        <label
          className={`
            inline-flex items-center gap-3
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            ${labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row'}
          `}
        >
          {switchElement}
          <span
            className={`
              text-sm font-medium select-none
              text-gray-700 dark:text-gray-300
            `}
          >
            {label}
          </span>
        </label>
      )
    }

    return switchElement
  }
}

export default ReactSwitch

// ============================================
// Simple Switch Component (No Drag)
// ============================================

interface SimpleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: SwitchSize
  label?: string
  labelPosition?: 'left' | 'right'
  className?: string
  id?: string
}

/**
 * A simpler, lightweight switch component without drag functionality.
 * Use this when you don't need the drag feature.
 */
export const SimpleSwitch: React.FC<SimpleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  labelPosition = 'right',
  className = '',
  id,
}) => {
  const sizeClasses = {
    sm: {
      track: 'w-9 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-4',
      icon: 'w-2.5 h-2.5',
    },
    md: {
      track: 'w-12 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-6',
      icon: 'w-3 h-3',
    },
    lg: {
      track: 'w-14 h-8',
      thumb: 'w-7 h-7',
      translate: 'translate-x-6',
      icon: 'w-4 h-4',
    },
  }

  const sizes = sizeClasses[size]

  const handleChange = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  const switchElement = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      onClick={handleChange}
      className={`
        relative inline-flex flex-shrink-0
        ${sizes.track}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        rounded-full
        border-2 border-transparent
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2
        ${checked ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}
        ${className}
      `}
    >
      <span className="sr-only">{label || 'Toggle'}</span>

      {/* Handle/Thumb */}
      <span
        className={`
          ${sizes.thumb}
          pointer-events-none
          inline-flex items-center justify-center
          rounded-full
          bg-white
          shadow-md
          transform transition-transform duration-200 ease-in-out
          ${checked ? sizes.translate : 'translate-x-0'}
        `}
      >
        {/* Icons inside thumb */}
        <Check
          className={`
            ${sizes.icon}
            text-emerald-500
            transition-opacity duration-200
            ${checked ? 'opacity-100' : 'opacity-0'}
          `}
          strokeWidth={3}
        />
        <X
          className={`
            ${sizes.icon}
            text-gray-400
            absolute
            transition-opacity duration-200
            ${checked ? 'opacity-0' : 'opacity-100'}
          `}
          strokeWidth={3}
        />
      </span>

      {/* Track icons */}
      <span
        className={`
          absolute inset-0 flex items-center justify-start pl-1.5
          transition-opacity duration-200
          ${checked ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <Check className={`${sizes.icon} text-white`} strokeWidth={2.5} />
      </span>
      <span
        className={`
          absolute inset-0 flex items-center justify-end pr-1.5
          transition-opacity duration-200
          ${checked ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <X className={`${sizes.icon} text-gray-400`} strokeWidth={2.5} />
      </span>
    </button>
  )

  if (label) {
    return (
      <label
        className={`
          inline-flex items-center gap-3
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${labelPosition === 'left' ? 'flex-row-reverse' : 'flex-row'}
        `}
      >
        {switchElement}
        <span
          className={`
            text-sm font-medium select-none
            ${disabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}
          `}
        >
          {label}
        </span>
      </label>
    )
  }

  return switchElement
}
