import type { FC } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import type { ModalProps } from 'reactstrap'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import { useSize } from 'ahooks'
import cs from 'classnames'
import { motion } from 'motion/react'
import styled from 'styled-components'
import { X } from 'lucide-react'

interface ModalFormProps extends ModalProps {
  modal: NiceModalHandler
  title?: string
  className?: string
  children: any
}

const StyledModal = styled(Modal)`
  .modal-content {
    border: none;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    background: white;

    .dark-layout & {
      background: #283046;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
  }

  .modal-header {
    padding: 1rem 1.5rem;
    background: linear-gradient(118deg, #7367f0, rgba(115, 103, 240, 0.7));
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    border: none !important;

    & > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin: 0;
    }

    .btn-close {
      display: none !important;
    }
  }

  .modal-body {
    padding: 1.5rem;

    @media (min-width: 576px) {
      padding: 2rem;
    }
  }

  &.modal-fullscreen .modal-content {
    border-radius: 0;
  }
`

const ModalTitle = styled(motion.div)`
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
  }

  &:active {
    transform: scale(0.9);
  }
`

const ModalForm: FC<ModalFormProps> = ({
  modal,
  title = '',
  className = 'modal-dialog-centered modal-md',
  children,
  ...props
}) => {
  const size = useSize(document.querySelector('body'))

  return (
    <StyledModal
      isOpen={modal.visible}
      onClosed={() => {
        modal.hide()
      }}
      toggle={modal.hide}
      className={cs(
        { 'modal-lg': className === undefined },
        { [className]: className !== undefined },
        { 'modal-fullscreen': size && size.width <= 400 },
      )}
      zIndex={1055}
      keyboard={true}
      backdrop="static"
      {...props}
    >
      <ModalHeader tag="div">
        <ModalTitle
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
        >
          {title}
        </ModalTitle>
        <CloseButton
          onClick={() => modal.hide()}
          type="button"
          aria-label="Close"
        >
          <X size={18} strokeWidth={3} />
        </CloseButton>
      </ModalHeader>
      <ModalBody>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </ModalBody>
    </StyledModal>
  )
}

export default ModalForm
