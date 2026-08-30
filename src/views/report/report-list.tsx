import type { FC } from 'react'
import styled from 'styled-components'
import { FileText, SearchX } from 'lucide-react'
import ReportItem from '@/views/report/report-item'

const Container = styled.div`
  width: 100%;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem 1.5rem;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem 2rem;
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.05) 0%,
    rgba(115, 103, 240, 0.02) 100%
  );
  border: 2px dashed rgba(115, 103, 240, 0.2);

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.1) 0%,
      rgba(115, 103, 240, 0.05) 100%
    );
    border-color: rgba(115, 103, 240, 0.3);
  }
`

const EmptyIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(115, 103, 240, 0.1);
  margin-bottom: 1.5rem;

  svg {
    color: #7367f0;
    opacity: 0.7;
  }

  .dark-layout & {
    background: rgba(115, 103, 240, 0.2);
  }
`

const EmptyTitle = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
  max-width: 300px;

  .dark-layout & {
    color: #9ca3af;
  }
`

const ResultCount = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem 0;
  font-size: 0.85rem;
  color: #6c757d;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  svg {
    color: #7367f0;
  }

  span {
    font-weight: 600;
    color: #7367f0;
  }

  .dark-layout & {
    color: #9ca3af;
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }
`

interface ReportListProps {
  items: any[]
  action: Function
  showCount?: boolean
}

const ReportList: FC<ReportListProps> = ({
  items,
  action,
  showCount = true,
}) => {
  if (!items || items.length === 0) {
    return (
      <Container>
        <EmptyState>
          <EmptyIconWrapper>
            <SearchX size={36} strokeWidth={1.5} />
          </EmptyIconWrapper>
          <EmptyTitle>No reports found</EmptyTitle>
          <EmptyDescription>
            There are no reports available in this category. Try selecting a
            different category.
          </EmptyDescription>
        </EmptyState>
      </Container>
    )
  }

  return (
    <Container>
      {showCount && (
        <ResultCount>
          <FileText size={16} />
          <span>{items.length}</span> report{items.length !== 1 ? 's' : ''}{' '}
          available
        </ResultCount>
      )}
      <Grid>
        {items.map((item) => (
          <ReportItem key={item.id} {...item} action={action} />
        ))}
      </Grid>
    </Container>
  )
}

export default ReportList
