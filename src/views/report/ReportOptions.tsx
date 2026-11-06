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
import { m } from '@/paraglide/messages'

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
    font-size: 1rem;
    padding: 0.625rem 1rem;
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
    padding: 1rem;
    background: transparent;
  }
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
`

const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: rgba(115, 103, 240, 0.1);

  svg {
    color: #7367f0;
    width: 16px;
    height: 16px;
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
      className="accordion-margin -mt-4"
      open={open}
      toggle={toggle}
    >
      <AccordionItem>
        <AccordionHeader targetId="1">
          <HeaderContent>
            <HeaderIcon>
              <Settings size={18} />
            </HeaderIcon>
            <span>{title || m.reportOptions()}</span>
          </HeaderContent>
        </AccordionHeader>
        <AccordionBody accordionId="1">{children}</AccordionBody>
      </AccordionItem>
    </StyledAccordion>
  )
}

export default ReportOptions
