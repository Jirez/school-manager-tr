import { useNavigate } from '@tanstack/react-router'
import _ from 'lodash'
import type { Draft } from 'immer'
import { produce } from 'immer'
import styled from 'styled-components'
import { Search, Star, FolderOpen, FileText, TrendingUp } from 'lucide-react'

import ReportCategoryCard from './report-category-card'
import AlgoliaSearch from './AlgoliaSearch'
import { useReport } from './useReport'
import { useAuthentication } from '@/hooks/useAuthentication'
import PageHeader from '@/@core/components/ui/page-header'
import { useTranslation } from 'react-i18next'
import Loader from '@/@core/components/spinner/loader'
import ErrorComponent from '@/@core/components/ui/error-component'
import { useTitle } from 'ahooks'
import { useReportSaveMutation } from '@/gql/graphql'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  padding-bottom: 2rem;
`

const HeaderSection = styled.div`
  margin-bottom: 1.5rem;
`

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(115, 103, 240, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(115, 103, 240, 0.15);
    border-color: rgba(115, 103, 240, 0.2);
  }

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.2);
  }
`

const StatIconWrapper = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $color }) => $color}15;
  flex-shrink: 0;

  svg {
    color: ${({ $color }) => $color};
  }
`

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.2;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const StatLabel = styled.span`
  font-size: 0.85rem;
  color: #6c757d;

  .dark-layout & {
    color: #9ca3af;
  }
`

const SearchSection = styled.div`
  margin-bottom: 2rem;
`

const SearchContainer = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(115, 103, 240, 0.1);
  border: 2px solid rgba(115, 103, 240, 0.15);
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: rgba(115, 103, 240, 0.4);
    box-shadow: 0 4px 20px rgba(115, 103, 240, 0.2);
  }

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.2);

    &:focus-within {
      border-color: rgba(115, 103, 240, 0.5);
    }
  }
`

const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7367f0 0%, #9e95f5 100%);

  svg {
    color: #ffffff;
  }
`

const SearchTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const SearchSubtitle = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: #6c757d;

  .dark-layout & {
    color: #9ca3af;
  }
`

const SectionContainer = styled.div`
  margin-bottom: 2rem;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(115, 103, 240, 0.1);

  .dark-layout & {
    border-bottom-color: rgba(115, 103, 240, 0.2);
  }
`

const SectionIconWrapper = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ $color }) => $color}15;

  svg {
    color: ${({ $color }) => $color};
  }
`

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  flex: 1;

  .dark-layout & {
    color: #e4e6eb;
  }
`

const SectionBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  border-radius: 6px;
  background: rgba(115, 103, 240, 0.1);
  color: #7367f0;
  font-size: 0.8rem;
  font-weight: 600;

  .dark-layout & {
    background: rgba(115, 103, 240, 0.2);
  }
`

const CategoriesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const EmptyFavorites = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(255, 193, 7, 0.08) 0%,
    rgba(255, 193, 7, 0.03) 100%
  );
  border: 2px dashed rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  text-align: center;

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(255, 193, 7, 0.12) 0%,
      rgba(255, 193, 7, 0.05) 100%
    );
    border-color: rgba(255, 193, 7, 0.4);
  }
`

const EmptyFavoritesIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 193, 7, 0.15);
  margin-bottom: 1rem;

  svg {
    color: #ffc107;
  }
`

const EmptyFavoritesText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;

  .dark-layout & {
    color: #9ca3af;
  }
`

const Reports = () => {
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()
  const navigate = useNavigate()
  useTitle(t('label-reports'))

  const { items, setItems, loading, error } = useReport(enterpriseId)

  const updateItem = (list: any, itemId: any, favorite: boolean) => {
    const updatedItems = produce<any>(list, (draft: Draft<any>) => {
      let index = -1
      let rootIndex = -1
      for (let i = 0; i < draft.length; i++) {
        index = draft[i].items.findIndex((item: any) => item.id == itemId)
        if (index !== -1) {
          rootIndex = i
          break
        }
      }
      if (rootIndex !== -1 && index !== -1) {
        draft[rootIndex].items[index].favorite = favorite
      }
    })
    setItems(updatedItems)
  }

  const [saveAction] = useReportSaveMutation({
    update(cache, { data }) {
      updateItem(
        items,
        data?.enterpriseReport?.enterpriseReportPK?.reportItemId,
        data?.enterpriseReport?.favorite || false,
      )
    },
  })

  if (error) {
    return (
      <div className="mx-auto">
        <ErrorComponent
          title="Une erreur a été rencontrée pendant le rendu de la page"
          message={error.message.split(':')[1]}
        />
      </div>
    )
  }

  if (loading) {
    return <Loader />
  }

  const reportCategories = items

  const allReports = reportCategories
    ? reportCategories.flatMap(({ items }) => items)
    : []

  const favoriteReports = _.uniqBy(
    allReports.filter(({ favorite }) => favorite),
    'id',
  )

  const totalReports = allReports.length
  const totalCategories = reportCategories?.length || 0
  const totalFavorites = favoriteReports.length

  return (
    <PageContainer className="px-1 md:!px-0">
      <HeaderSection>
        <PageHeader title={t('sidebar.reports')} />
      </HeaderSection>

      <StatsContainer>
        <StatCard>
          <StatIconWrapper $color="#7367f0">
            <FileText size={24} strokeWidth={2} />
          </StatIconWrapper>
          <StatContent>
            <StatValue>{totalReports}</StatValue>
            <StatLabel>{t('label-totalReports')}</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIconWrapper $color="#28c76f">
            <FolderOpen size={24} strokeWidth={2} />
          </StatIconWrapper>
          <StatContent>
            <StatValue>{totalCategories}</StatValue>
            <StatLabel>{t('label-categories')}</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIconWrapper $color="#ff9f43">
            <Star size={24} strokeWidth={2} />
          </StatIconWrapper>
          <StatContent>
            <StatValue>{totalFavorites}</StatValue>
            <StatLabel>{t('label-favorites')}</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIconWrapper $color="#00cfe8">
            <TrendingUp size={24} strokeWidth={2} />
          </StatIconWrapper>
          <StatContent>
            <StatValue>
              {totalReports > 0
                ? Math.round((totalFavorites / totalReports) * 100)
                : 0}
              %
            </StatValue>
            <StatLabel>{t('label-favorited')}</StatLabel>
          </StatContent>
        </StatCard>
      </StatsContainer>

      <SearchSection>
        <SearchContainer>
          <SearchHeader>
            <SearchIcon>
              <Search size={20} strokeWidth={2} />
            </SearchIcon>
            <div>
              <SearchTitle>{t('label-quickSearch')}</SearchTitle>
              <SearchSubtitle>
                {t('label-quickSearchPlaceholder')}
              </SearchSubtitle>
            </div>
          </SearchHeader>
          <AlgoliaSearch
            options={allReports}
            placeholder={t('label-reportSearchPlaceholder')}
            onSelect={(option) => {
              if (option && option.link) {
                navigate({ to: `/${option.link}` })
              }
            }}
            getOptionLabel={(option) => option.title}
          />
        </SearchContainer>
      </SearchSection>

      <SectionContainer>
        <SectionHeader>
          <SectionIconWrapper $color="#ff9f43">
            <Star size={20} strokeWidth={2} />
          </SectionIconWrapper>
          <SectionTitle>{t('label-myFavorites')}</SectionTitle>
          <SectionBadge>{totalFavorites}</SectionBadge>
        </SectionHeader>

        {favoriteReports.length > 0 ? (
          <ReportCategoryCard
            name="Favorite Reports"
            items={favoriteReports}
            action={saveAction}
            defaultOpen={true}
          />
        ) : (
          <EmptyFavorites>
            <EmptyFavoritesIcon>
              <Star size={28} strokeWidth={1.5} />
            </EmptyFavoritesIcon>
            <EmptyFavoritesText>
              No favorite reports yet. Click the star icon on any report to add
              it to your favorites.
            </EmptyFavoritesText>
          </EmptyFavorites>
        )}
      </SectionContainer>

      <SectionContainer>
        <SectionHeader>
          <SectionIconWrapper $color="#7367f0">
            <FolderOpen size={20} strokeWidth={2} />
          </SectionIconWrapper>
          <SectionTitle>{t('label-allCategories')}</SectionTitle>
          <SectionBadge>{totalCategories}</SectionBadge>
        </SectionHeader>

        <CategoriesGrid>
          {reportCategories.map(({ id, name, items }) => (
            <ReportCategoryCard
              key={`rc-${id}`}
              name={name}
              items={items}
              action={saveAction}
              defaultOpen={false}
            />
          ))}
        </CategoriesGrid>
      </SectionContainer>
    </PageContainer>
  )
}

export default Reports
