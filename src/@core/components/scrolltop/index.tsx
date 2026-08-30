// ** React Imports
import { useSafeState } from 'ahooks'
import { useEffect } from 'react'

interface ScrollTopProps {
  showOffset?: number
  children: any
  scrollBehaviour?: ScrollBehavior
}

const ScrollTop = ({
  showOffset = 0,
  scrollBehaviour = 'smooth',
  children,
  ...rest
}: ScrollTopProps) => {
  // ** Props
  // const { showOffset, scrollBehaviour, children, ...rest } = props

  // ** State
  const [visible, setVisible] = useSafeState(false)

  useEffect(() => {
    if (window) {
      window.addEventListener('scroll', () => {
        if (window.pageYOffset >= showOffset) {
          setVisible(true)
        } else {
          setVisible(false)
        }
      })
    }
  }, [])

  const handleScrollToTop = () => {
    window.scroll({ top: 0, behavior: scrollBehaviour })
  }

  return (
    visible && (
      <div className="scroll-to-top" onClick={handleScrollToTop} {...rest}>
        {children}
      </div>
    )
  )
}

export default ScrollTop
