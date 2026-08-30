import type { FC, ReactNode } from 'react'
import { useState } from 'react'
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap'
import { Settings } from 'lucide-react'
import styled from 'styled-components'

interface ReportOptionsProps {
  title?: string
  children: ReactNode
  defaultOpen?: boolean
}

const StyledAccordion = styled(Accordion)`
  z-index: 106;
  .accordion-item {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.08) !important;
    }
  }

  .accordion-button {
    font-weight: 600;
    font-size: 1.125rem;
    padding: 1rem 1.5rem;
    color: #2c3e50;
    background: transparent;
    border: none;
    transition: all 0.2s ease;

    &:not(.collapsed) {
      color: #7367f0;
      background: rgba(115, 103, 240, 0.05);
      box-shadow: none;
    }

    &:focus {
      box-shadow: none;
      border-color: transparent;
    }

    .dark-layout & {
      color: #e4e6eb;

      &:not(.collapsed) {
        color: #7367f0;
        background: rgba(115, 103, 240, 0.1);
      }
    }
  }

  .accordion-body {
    padding: 1.5rem;
    background: transparent;
  }
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
`

const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(115, 103, 240, 0.1);

  svg {
    color: #7367f0;
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.2);
  }
`

const ReportOptions: FC<ReportOptionsProps> = ({
  title,
  children,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState<string>(defaultOpen ? '1' : '')

  const toggle = (id: string) => {
    setOpen((prevOpen) => (prevOpen === id ? '' : id))
  }

  return (
    <StyledAccordion
      className="accordion-margin -mt-5"
      open={open}
      toggle={toggle}
    >
      <AccordionItem>
        <AccordionHeader targetId="1">
          <HeaderContent>
            <HeaderIcon>
              <Settings size={18} />
            </HeaderIcon>
            <span>{title || 'Options du rapport'}</span>
          </HeaderContent>
        </AccordionHeader>
        <AccordionBody accordionId="1">{children}</AccordionBody>
      </AccordionItem>
    </StyledAccordion>
  )
}

export default ReportOptions
