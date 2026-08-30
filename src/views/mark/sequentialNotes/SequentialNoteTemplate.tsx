import { keyframes } from 'styled-components'
import styled from 'styled-components'
import { FileText, BookOpen } from 'react-feather'
import PageHeader from '@/@core/components/ui/page-header'
import { useAuthentication } from '@/hooks/useAuthentication'
import LiveView from '@/utils/LiveView'
import { useTranslation } from 'react-i18next'
import ErrorComponent from '@/@core/components/ui/error-component'
import { ClassCreatedDocument, useClassesForNoteQuery } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import ComponentSpinner from '@/@core/components/spinner/component-loader'

const config = await fetch('/configuration.json').then((res) => res.json())

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ContentCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(115, 103, 240, 0.1);
  margin-top: 1.5rem;

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.2);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const TemplateCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1rem;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.05) 0%,
    rgba(115, 103, 240, 0.02) 100%
  );
  border: 2px solid rgba(115, 103, 240, 0.15);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.4s ease-out backwards;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(115, 103, 240, 0.1),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(115, 103, 240, 0.4);
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.1) 0%,
      rgba(115, 103, 240, 0.05) 100%
    );
    box-shadow: 0 8px 24px rgba(115, 103, 240, 0.15);

    &::before {
      left: 100%;
    }

    .template-icon {
      transform: scale(1.1) rotate(5deg);
      color: #7367f0;
    }

    .template-name {
      color: #7367f0;
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.1) 0%,
      rgba(115, 103, 240, 0.05) 100%
    );
    border-color: rgba(115, 103, 240, 0.25);

    &:hover {
      background: linear-gradient(
        135deg,
        rgba(115, 103, 240, 0.15) 0%,
        rgba(115, 103, 240, 0.08) 100%
      );
      border-color: rgba(115, 103, 240, 0.4);
      box-shadow: 0 8px 24px rgba(115, 103, 240, 0.25);
    }
  }
`

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.15) 0%,
    rgba(115, 103, 240, 0.08) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.25) 0%,
      rgba(115, 103, 240, 0.15) 100%
    );
  }
`

const TemplateIcon = styled(FileText)`
  width: 32px;
  height: 32px;
  color: #7367f0;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  .dark-layout & {
    color: #a78bfa;
  }
`

const TemplateName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  .dark-layout & {
    color: #e4e6eb;
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
  margin-top: 1.5rem;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 1rem;
    opacity: 0.5;
    color: #7367f0;
  }

  p {
    font-size: 0.95rem;
    margin: 0;
    color: #9ca3af;
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.1) 0%,
      rgba(115, 103, 240, 0.05) 100%
    );
    border-color: rgba(115, 103, 240, 0.3);

    p {
      color: #6b7280;
    }
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 2rem;
  margin-top: 1.5rem;
`

const SequentialNoteTemplate = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.template'))
  const { enterpriseId } = useAuthentication()

  const { data, loading, error, subscribeToMore } = useClassesForNoteQuery({
    variables: { id: enterpriseId },
  })

  if (error) {
    return (
      <div className="flex flex-row items-center">
        <ErrorComponent message={error.message} title="Error" />
      </div>
    )
  }

  return (
    <Container>
      <div className="w-full">
        <PageHeader title={t('sidebar.marks.template')} />
      </div>

      <ContentCard>
        {loading ? (
          <LoadingContainer>
            <ComponentSpinner />
          </LoadingContainer>
        ) : (
          <LiveView
            document={ClassCreatedDocument}
            singleVar="clazz"
            data={data}
            listVar="clazzes"
            subscribeToMore={subscribeToMore}
            sortField="name"
            triggerUpdate={true}
            enterpriseId={enterpriseId}
          >
            {({ clazzes }) => {
              if (!clazzes || clazzes.length === 0) {
                return (
                  <EmptyState>
                    <BookOpen />
                    <p>
                      {t('label-noClasses') ||
                        'Aucune classe disponible pour le moment'}
                    </p>
                  </EmptyState>
                )
              }

              return (
                <TemplateGrid>
                  {clazzes.map(({ id, name }: any, index: number) => (
                    <TemplateCard
                      key={id}
                      href={`${config?.httpProtocol}://${config?.serverAddress}:${config?.serverPort}/api/reports/notes-csv-template-${id}.csv`}
                      download
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <IconWrapper className="template-icon">
                        <TemplateIcon className="template-icon" />
                      </IconWrapper>
                      <TemplateName className="template-name">
                        {name}
                      </TemplateName>
                    </TemplateCard>
                  ))}
                </TemplateGrid>
              )
            }}
          </LiveView>
        )}
      </ContentCard>
    </Container>
  )
}

export default SequentialNoteTemplate
