import type { FC } from 'react'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import type { OffcanvasProps } from 'reactstrap'
import { motion, AnimatePresence } from 'motion/react'
import styled from 'styled-components'
import { X } from 'lucide-react'

interface DrawerFormProps extends OffcanvasProps {
  modal: NiceModalHandler
  title?: string
  direction?: 'top' | 'bottom' | 'start' | 'end'
  children: React.ReactNode
}

const StyledOffcanvas = styled(Offcanvas)`
  border: none !important;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  background: white;

  .dark-layout & {
    background: #283046;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
  }

  &.offcanvas-end {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }

  &.offcanvas-start {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
  }

  .offcanvas-header {
    padding: 1rem 1.5rem;
    background: linear-gradient(118deg, #7367f0, rgba(115, 103, 240, 0.7));
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    border: none !important;
    color: white;

    // Hide default reactstrap close button
    .btn-close {
      display: none !important;
    }

    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin: 0;
    }
  }

  .offcanvas-body {
    padding: 1.5rem;

    @media (min-width: 576px) {
      padding: 2rem;
    }
  }
`

const DrawerTitle = styled(motion.div)`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.01em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg) scale(1.1);
    color: white;
  }

  &:active {
    transform: scale(0.9);
  }
`

const DrawerForm: FC<DrawerFormProps> = ({
  modal,
  title,
  className = 'w-full md:w-4/12',
  direction = 'end',
  children,
  ...props
}) => {
  return (
    <AnimatePresence>
      <StyledOffcanvas
        direction={direction}
        isOpen={modal.visible}
        toggle={modal.hide}
        className={className}
        zIndex="1054"
        backdrop="static"
        {...props}
      >
        <OffcanvasHeader tag="div">
          <DrawerTitle
            initial={{ opacity: 0, x: direction === 'end' ? 15 : -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
          >
            {title}
          </DrawerTitle>
          <CloseButton
            onClick={() => modal.hide()}
            type="button"
            aria-label="Close"
          >
            <X size={18} strokeWidth={3} />
          </CloseButton>
        </OffcanvasHeader>
        <OffcanvasBody>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </OffcanvasBody>
      </StyledOffcanvas>
    </AnimatePresence>
  )
}

export default DrawerForm
