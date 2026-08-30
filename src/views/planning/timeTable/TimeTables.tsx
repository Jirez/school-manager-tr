import { useTranslation } from 'react-i18next'
import { useSafeState as useState, useTitle } from 'ahooks'
import { useAuthentication } from '@/hooks/useAuthentication'
import { useEffect } from 'react'
import { messageService } from '@/utils/message.service'
import LiveView from '@/utils/LiveView'
import Select from '@/@core/components/select'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import PageHeader from '@/@core/components/ui/page-header'
import { classOptions } from '@/utils/select/selectComponents'
import { selectThemeColors } from '@/utils/Utils'
import ErrorComponent from '@/@core/components/ui/error-component'
import {
  ClassCreatedDocument,
  useClassesQuery,
  useGenerateTimeTableMutation,
  useTimeTablesQuery,
} from '@/gql/graphql'
import TimeTableAdd from './TimeTableAdd'
import Button from '@/@core/components/button'
import { toast } from 'react-toastify'
import { TOAST_OPTIONS } from '@/utils/constants'
import { Calendar, Sparkles } from 'lucide-react'
import { styled } from 'styled-components'

const SelectionCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(115, 103, 240, 0.08) 0%,
    rgba(139, 92, 246, 0.05) 100%
  );
  border: 2px solid rgba(115, 103, 240, 0.2);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(115, 103, 240, 0.1);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow: 0 4px 12px rgba(115, 103, 240, 0.15);
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(115, 103, 240, 0.15) 0%,
      rgba(139, 92, 246, 0.1) 100%
    );
    border-color: rgba(115, 103, 240, 0.3);
    box-shadow: 0 2px 8px rgba(115, 103, 240, 0.2);
  }
`

const ContentCard = styled.div`
  background: #ffffff;
  border: 2px solid rgba(115, 103, 240, 0.15);
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 8px rgba(115, 103, 240, 0.08);
  overflow: hidden;
  margin-top: 1rem;

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.25);
    box-shadow: 0 2px 8px rgba(115, 103, 240, 0.15);
  }
`

const LoadingCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05) 0%,
    rgba(147, 51, 234, 0.05) 100%
  );
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.1) 0%,
      rgba(147, 51, 234, 0.1) 100%
    );
    border-color: rgba(59, 130, 246, 0.3);
  }
`

const ErrorCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(239, 68, 68, 0.08) 0%,
    rgba(220, 38, 38, 0.05) 100%
  );
  border: 2px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(239, 68, 68, 0.12) 0%,
      rgba(220, 38, 38, 0.08) 100%
    );
    border-color: rgba(239, 68, 68, 0.35);
  }
`

const EmptyStateCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.06) 0%,
    rgba(139, 92, 246, 0.04) 100%
  );
  border: 2px dashed rgba(168, 85, 247, 0.3);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(168, 85, 247, 0.4);
    background: linear-gradient(
      135deg,
      rgba(168, 85, 247, 0.08) 0%,
      rgba(139, 92, 246, 0.06) 100%
    );
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(168, 85, 247, 0.1) 0%,
      rgba(139, 92, 246, 0.08) 100%
    );
    border-color: rgba(168, 85, 247, 0.4);
  }
`

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  svg {
    color: #7367f0;
    filter: drop-shadow(0 2px 4px rgba(115, 103, 240, 0.3));
  }

  .dark-layout & {
    svg {
      color: #9e95f5;
      filter: drop-shadow(0 2px 4px rgba(158, 149, 245, 0.4));
    }
  }

  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 0.03em;

    .dark-layout & {
      color: #e4e6eb;
    }
  }
`

const TimeTables = () => {
  const [clazz, setClazz] = useState<{ [key: string]: any }>()

  const { t } = useTranslation()
  useTitle(t('sidebar.planning.timeTables'))
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useClassesQuery({
    variables: { id: enterpriseId },
    fetchPolicy: 'no-cache',
  })

  const {
    data: dataTimeTable,
    loading: loadingNote,
    error,
  } = useTimeTablesQuery({
    variables: {
      classId: clazz ? (Number(clazz.id) as any) : null,
      schoolId: enterpriseId,
    },
    skip: !clazz,
    fetchPolicy: 'no-cache',
  })

  const [generateTimeTable, { loading: loadingGenerateTimeTable }] =
    useGenerateTimeTableMutation()

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'pSequentialNote') {
          //setSubCompetence(null);
        }
      }
    })
  })

  /* if (error) {
        return <ErrorComponent message={error.message} />
    } */

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div className="w-full">
        <div id="displayStudentName" className="hidden" />
        <PageHeader title={t('sidebar.planning.timeTables')} />
      </div>

      {/* Selection and Actions Card */}
      <SelectionCard>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1 w-full md:w-auto min-w-0">
            <LabelWrapper>
              <Calendar size={18} />
              <label>{t('label-selectClass')}</label>
            </LabelWrapper>
            <LiveView
              document={ClassCreatedDocument}
              singleVar="clazz"
              data={data}
              listVar="clazzes"
              subscribeToMore={subscribeToMore}
              sortField="name"
              triggerUpdate={true}
              enterpriseId={enterpriseId}
              showLoader={false}
            >
              {({ clazzes }) => (
                <Select
                  onChange={(val: any) => {
                    setClazz(val)
                  }}
                  options={clazzes || undefined}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  value={clazz}
                  components={{ Option: classOptions }}
                  placeholder={t('label-selectClass')}
                  className="react-select"
                  classNamePrefix="select"
                  theme={selectThemeColors}
                  isLoading={loading}
                />
              )}
            </LiveView>
          </div>

          <div className="flex-shrink-0">
            <Button
              color="primary"
              onClick={() =>
                generateTimeTable({ variables: { schoolId: enterpriseId } })
                  .then(() => {
                    toast.success('Génération terminée', {
                      ...TOAST_OPTIONS,
                    })
                  })
                  .catch((error) => {
                    toast.error('Erreur. Veuillez recommencer')
                  })
              }
              disabled={loadingGenerateTimeTable}
              loading={loadingGenerateTimeTable}
              className="round flex items-center gap-2"
            >
              <Sparkles size={16} />
              {t('label-generate')}
            </Button>
          </div>
        </div>
      </SelectionCard>

      {/* Time Table Content */}
      {!error ? (
        clazz && (
          <div className="w-full">
            {loadingNote ? (
              <LoadingCard>
                <LoadingSpinner />
              </LoadingCard>
            ) : (
              <ContentCard>
                <TimeTableAdd
                  classId={clazz.id}
                  timeTables={dataTimeTable?.timeTables || []}
                />
              </ContentCard>
            )}
          </div>
        )
      ) : (
        <ErrorCard>
          <ErrorComponent
            message={
              "Vous n'êtes pas autorisé à éditer les emplois du temps. Veuillez contacter votre fournisseur afin de renouveler votre licence."
            }
            title={t('label-invalidLicense')}
          />
        </ErrorCard>
      )}

      {/* Empty State */}
      {!error && !clazz && (
        <EmptyStateCard>
          <Calendar
            size={48}
            className="mx-auto mb-4"
            style={{
              color: '#a855f7',
              filter: 'drop-shadow(0 4px 6px rgba(168, 85, 247, 0.3))',
            }}
          />
          <p
            style={{
              color: '#6b7280',
              fontSize: '0.9375rem',
              fontWeight: 500,
            }}
            className="dark:text-gray-400"
          >
            {t('label-selectClassToViewTimeTable') ||
              "Sélectionnez une classe pour afficher l'emploi du temps"}
          </p>
        </EmptyStateCard>
      )}
    </div>
  )
}

export default TimeTables
