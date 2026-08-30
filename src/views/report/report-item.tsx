import type { FC } from 'react'
import styled from 'styled-components'
import { Link } from '@tanstack/react-router'
import { Star, FileText } from 'lucide-react'
import { useAuthentication } from '@/hooks/useAuthentication'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin: 0.25rem 0;
  border-radius: 10px;
  background: transparent;
  transition: all 0.2s ease;
  gap: 1rem;

  &:hover {
    background: rgba(115, 103, 240, 0.08);

    .dark-layout & {
      background: rgba(115, 103, 240, 0.15);
    }
  }
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7367f0 0%, #9e95f5 100%);
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(115, 103, 240, 0.3);
  transition: all 0.2s ease;

  ${Wrapper}:hover & {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(115, 103, 240, 0.4);
  }
`

const ContentContainer = styled(Link)`
  flex: 1;
  text-decoration: none;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const Title = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  transition: color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${Wrapper}:hover & {
    color: #7367f0;
  }

  .dark-layout & {
    color: #e4e6eb;

    ${Wrapper}:hover & {
      color: #7367f0;
    }
  }
`

const Description = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;

  .dark-layout & {
    color: #9ca3af;
  }
`

const FavoriteButton = styled.button<{ $isFavorite: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: ${({ $isFavorite }) =>
    $isFavorite ? 'rgba(40, 199, 111, 0.12)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ $isFavorite }) =>
      $isFavorite ? 'rgba(40, 199, 111, 0.2)' : 'rgba(115, 103, 240, 0.1)'};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    transition: all 0.2s ease;
    color: ${({ $isFavorite }) => ($isFavorite ? '#28c76f' : '#adb5bd')};
    fill: ${({ $isFavorite }) => ($isFavorite ? '#28c76f' : 'transparent')};
  }

  &:hover svg {
    color: ${({ $isFavorite }) => ($isFavorite ? '#28c76f' : '#7367f0')};
  }

  .dark-layout & {
    background: ${({ $isFavorite }) =>
      $isFavorite ? 'rgba(40, 199, 111, 0.2)' : 'transparent'};

    &:hover {
      background: ${({ $isFavorite }) =>
        $isFavorite ? 'rgba(40, 199, 111, 0.3)' : 'rgba(115, 103, 240, 0.2)'};
    }

    svg {
      color: ${({ $isFavorite }) => ($isFavorite ? '#28c76f' : '#6c757d')};
    }
  }
`

interface ReportItemProps {
  title: string
  link?: string
  help?: string
  id: number
  favorite?: boolean
  action: Function
}

const ReportItem: FC<ReportItemProps> = ({
  title,
  link,
  help,
  id,
  favorite = false,
  action,
}) => {
  const { enterpriseId } = useAuthentication()

  const handleFavoriteToggle = () => {
    action({
      variables: {
        item: id,
        enterprise: enterpriseId,
        favorite: !favorite,
      },
    })
  }

  return (
    <Wrapper>
      <IconContainer>
        <FileText size={22} strokeWidth={2} />
      </IconContainer>

      <ContentContainer to={`/${link}`}>
        <Title title={title}>{title}</Title>
        {help && <Description title={help}>{help}</Description>}
      </ContentContainer>

      <FavoriteButton
        $isFavorite={favorite}
        onClick={handleFavoriteToggle}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
        title={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Star size={20} strokeWidth={2} />
      </FavoriteButton>
    </Wrapper>
  )
}

export default ReportItem
