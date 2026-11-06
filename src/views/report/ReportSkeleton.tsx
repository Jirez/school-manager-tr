import styled, { keyframes } from 'styled-components'

const reportShimmer = keyframes`
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
`

const SkeletonBlock = styled.div<{
  $width?: string
  $height?: string
  $radius?: string
}>`
  width: ${({ $width = '100%' }) => $width};
  height: ${({ $height = '1rem' }) => $height};
  flex-shrink: 0;
  border-radius: ${({ $radius = '6px' }) => $radius};
  background: linear-gradient(
    90deg,
    rgba(115, 103, 240, 0.08) 25%,
    rgba(115, 103, 240, 0.18) 50%,
    rgba(115, 103, 240, 0.08) 75%
  );
  background-size: 200% 100%;
  animation: ${reportShimmer} 1.5s ease-in-out infinite;

  .dark-layout & {
    background: linear-gradient(
      90deg,
      rgba(167, 139, 250, 0.12) 25%,
      rgba(167, 139, 250, 0.25) 50%,
      rgba(167, 139, 250, 0.12) 75%
    );
    background-size: 200% 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  padding-bottom: 2rem;
`

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 56px;
  margin-bottom: 0.15rem;
  padding: 0 0.75rem;
  background: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  .dark-layout & {
    background: #283046;
    border-color: #374151;
  }

  @media (max-width: 576px) {
    margin-bottom: 0.5rem;
  }
`

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 576px) {
    gap: 0.5rem;
  }
`

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #ffffff;
  border: 1px solid rgba(115, 103, 240, 0.1);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.2);
  }
`

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const SearchSection = styled.div`
  margin-bottom: 2rem;
`

const SearchCard = styled.div`
  position: relative;
  padding: 1.5rem;
  background: #ffffff;
  border: 2px solid rgba(115, 103, 240, 0.15);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(115, 103, 240, 0.1);

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.2);
  }
`

const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

const Section = styled.div`
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

const Category = styled.div`
  margin-bottom: 1rem;
  overflow: hidden;
  border: 1px solid rgba(115, 103, 240, 0.1);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.2);
  }
`

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
`

const CategoryTitle = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
`

const CategoryBody = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid rgba(115, 103, 240, 0.1);

  .dark-layout & {
    border-top-color: rgba(115, 103, 240, 0.2);
  }
`

const ReportRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const ReportSkeleton = () => (
  <PageContainer aria-busy="true" aria-label="Loading reports" role="status">
    <PageHeader aria-hidden="true">
      <SkeletonBlock $width="2.25rem" $height="2.25rem" />
      <SkeletonBlock $width="12rem" $height="1.5rem" />
    </PageHeader>

    <Stats>
      {Array.from({ length: 4 }, (_, index) => (
        <StatCard key={index} aria-hidden="true">
          <SkeletonBlock $width="3rem" $height="3rem" $radius="12px" />
          <StatContent>
            <SkeletonBlock $width="3.5rem" $height="1.5rem" />
            <SkeletonBlock $width="6rem" $height="0.85rem" />
          </StatContent>
        </StatCard>
      ))}
    </Stats>

    <SearchSection>
      <SearchCard aria-hidden="true">
        <SearchHeader>
          <SkeletonBlock $width="2.5rem" $height="2.5rem" $radius="10px" />
          <div className="flex flex-col gap-2">
            <SkeletonBlock $width="9rem" $height="1.1rem" />
            <SkeletonBlock $width="14rem" $height="0.85rem" />
          </div>
        </SearchHeader>
        <SkeletonBlock $height="2.5rem" />
      </SearchCard>
    </SearchSection>

    <Section>
      <SectionHeader aria-hidden="true">
        <SkeletonBlock $width="2.25rem" $height="2.25rem" $radius="8px" />
        <SkeletonBlock $width="10rem" $height="1.25rem" />
        <SkeletonBlock $width="1.5rem" $height="1.5rem" $radius="6px" />
      </SectionHeader>
      <Category aria-hidden="true">
        <CategoryHeader>
          <SkeletonBlock $width="2.75rem" $height="2.75rem" $radius="10px" />
          <CategoryTitle>
            <SkeletonBlock $width="11rem" $height="1.1rem" />
            <SkeletonBlock $width="5rem" $height="0.8rem" />
          </CategoryTitle>
          <SkeletonBlock $width="1.75rem" $height="1.75rem" $radius="8px" />
          <SkeletonBlock $width="2rem" $height="2rem" $radius="8px" />
        </CategoryHeader>
        <CategoryBody>
          {[0, 1].map((row) => (
            <ReportRow key={row}>
              <SkeletonBlock $width="1.25rem" $height="1.25rem" />
              <SkeletonBlock $width={`${45 + row * 15}%`} $height="1rem" />
            </ReportRow>
          ))}
        </CategoryBody>
      </Category>
    </Section>

    <Section>
      <SectionHeader aria-hidden="true">
        <SkeletonBlock $width="2.25rem" $height="2.25rem" $radius="8px" />
        <SkeletonBlock $width="12rem" $height="1.25rem" />
        <SkeletonBlock $width="1.5rem" $height="1.5rem" $radius="6px" />
      </SectionHeader>
      <div aria-hidden="true">
        {[0, 1, 2].map((category) => (
          <Category key={category}>
            <CategoryHeader>
              <SkeletonBlock
                $width="2.75rem"
                $height="2.75rem"
                $radius="10px"
              />
              <CategoryTitle>
                <SkeletonBlock
                  $width={`${40 + category * 12}%`}
                  $height="1.1rem"
                />
                <SkeletonBlock $width="5rem" $height="0.8rem" />
              </CategoryTitle>
              <SkeletonBlock
                $width="1.75rem"
                $height="1.75rem"
                $radius="8px"
              />
              <SkeletonBlock $width="2rem" $height="2rem" $radius="8px" />
            </CategoryHeader>
          </Category>
        ))}
      </div>
    </Section>
  </PageContainer>
)

export default ReportSkeleton
