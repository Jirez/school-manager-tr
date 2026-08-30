import type { FC } from 'react'
import styled from 'styled-components'
import { Package, Hash, FileText, Tag } from 'lucide-react'

interface DetailedComboboxItemProps {
  name: string
  sku?: string
  description?: string
  category?: string
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  overflow: hidden;
`

const ContentRow = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
`

const LeftColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`

const RightColumn = styled.div`
  flex: 0 0 auto;
  max-width: 40%;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  align-items: flex-end;
  text-align: right;

  @media (max-width: 768px) {
    max-width: 100%;
    align-items: flex-start;
    text-align: left;
  }
`

const Name = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  //color: #2c3e50;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const SKU = styled.div`
  font-size: 0.85rem;
  //color: #6c757d;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .dark-layout & {
    color: #9ca3af;
  }
`

const Description = styled.div`
  font-size: 0.85rem;
  //color: #6c757d;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

  .dark-layout & {
    color: #9ca3af;
  }
`

const Category = styled.div`
  font-size: 0.8rem;
  //color: #7367f0;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0.25rem 0.5rem;
  background: rgba(115, 103, 240, 0.1);
  border-radius: 6px;
  max-width: 100%;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.2);
    color: #9e95f5;
  }
`

const IconWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: #7367f0;

  svg {
    width: 14px;
    height: 14px;
  }
`

const DetailedComboboxItem: FC<DetailedComboboxItemProps> = ({
  name,
  sku,
  description,
  category,
}) => {
  return (
    <Container>
      <ContentRow>
        <LeftColumn>
          <Name>
            <IconWrapper>
              <Package size={14} />
            </IconWrapper>
            {name}
          </Name>
          {sku && (
            <SKU>
              <IconWrapper>
                <Hash size={14} />
              </IconWrapper>
              {sku}
            </SKU>
          )}
        </LeftColumn>
        <RightColumn>
          {description && (
            <Description>
              <IconWrapper>
                <FileText size={14} />
              </IconWrapper>
              {description}
            </Description>
          )}
          {category && (
            <Category>
              <IconWrapper>
                <Tag size={14} />
              </IconWrapper>
              {category}
            </Category>
          )}
        </RightColumn>
      </ContentRow>
    </Container>
  )
}

export default DetailedComboboxItem
