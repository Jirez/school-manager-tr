import { useEffect, useState } from 'react'
import { useModal } from '@ebay/nice-modal-react'
import { Form } from 'reactstrap'
import styled from 'styled-components'
import { Calendar, Filter, Settings, Users, Hash, List } from 'lucide-react'
import { z } from 'zod'

import { useAuthentication } from '@/hooks/useAuthentication'
import { messageService } from '@/utils/message.service'
import PageHeader from '@/@core/components/ui/page-header'
import ReportOptions from '@/views/report/ReportOptions'
import LiveView from '@/utils/LiveView'
import {
  branchOptions,
  classOptions,
  decisionOptions,
  schoolYearOptions,
} from '@/utils/select/selectComponents'
import BulkAnnualResultAdd from './BulkAnnualResultAdd'
import LoadingSpinner from '@/@core/components/spinner/Loading-spinner'
import Button from '@/@core/components/button'
import AnnualResultSummaryTableModal from './AnnualResultSummaryTableModal'
import {
  useAnnualReportRankingLazyQuery,
  useBranchesBySchoolYearQuery,
  useClassesBySchoolYearQuery,
  useCouncilDecisionsQuery,
  useLevelsBySchoolYearQuery,
  useSchoolYearsQuery,
} from '@/gql/graphql'
import { useAnnualResultSummaryQuery } from '@/gql/graphql'
import { SchoolYearCreatedDocument } from '@/gql/graphql'
import { useTitle } from 'ahooks'
import GraphQLError from '@/@core/components/errors/graphql-error'
import FormSection from '@/@core/components/ui/forms/form-section'
import { defaultMeta, useAppForm } from '#/hooks/form/form'
import { useSelector } from '@tanstack/react-form'
import { m } from '@/paraglide/messages'

const SearchContainer = styled.div`
  width: 100%;

  .form-group {
    margin-bottom: 0.5rem !important;
  }

  label {
    font-size: 0.8rem !important;
    margin-bottom: 0.25rem !important;
    font-weight: 500;
  }

  .form-control,
  input,
  select {
    padding: 0.375rem 0.75rem !important;
    font-size: 0.85rem !important;
    height: 32px !important;
    min-height: 32px !important;
  }

  .react-select-container {
    font-size: 0.85rem !important;

    .react-select__control {
      min-height: 32px !important;
      padding: 0 !important;
    }

    .react-select__value-container {
      padding: 0 0.5rem !important;
    }

    .react-select__input-container {
      margin: 0 !important;
      padding: 0 !important;
    }

    .react-select__indicators {
      height: 32px !important;
    }
  }
`

const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 0.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const ResultContainer = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(115, 103, 240, 0.1);

  .dark-layout & {
    background: #283046;
    border-color: rgba(115, 103, 240, 0.2);
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`

const bulkAnnualResultsSchema = z.object({
  gender: z.string().optional(),
  currentSchoolYear: z.any().nullable(),
  minAverage: z.coerce.number().min(0).max(20).optional().nullable(),
  maxAverage: z.coerce.number().min(0).max(20).optional().nullable(),
  clazz: z.any().nullable(),
  level: z.any().nullable(),
  branch: z.any().nullable(),
  decision: z.any().nullable(),
  name: z.string().optional(),
  limit: z.any().optional(),
  nextSchoolYear: z.any().nullable(),
  shuffle: z.boolean(),
  newClassIsNull: z.boolean(),
  sortByMerit: z.boolean(),
})

type BulkAnnualResultsSchemaType = z.infer<typeof bulkAnnualResultsSchema>

const BulkAnnualResults = () => {
  useTitle(m.sidebar_marks_bulkAnnualResult())
  const { enterpriseId } = useAuthentication()
  const [search, setSearch] = useState<string>('')
  const [hasNewResult, setHasNewResult] = useState(false)
  const tableModal = useModal(AnnualResultSummaryTableModal)

  const {
    handleSubmit,
    AppField,
    reset,
    store,
    AppForm,
    SubmitButton,
    setFieldValue,
  } = useAppForm({
    defaultValues: {
      newClassIsNull: false,
      shuffle: false,
      gender: '',
      decision: null,
      branch: null,
      limit: '',
      nextSchoolYear: null,
      minAverage: '',
      maxAverage: '',
      currentSchoolYear: null,
      clazz: null,
      level: null,
      name: '',
      sortByMerit: true,
    } as any,
    validators: {
      onChange: bulkAnnualResultsSchema,
    },
    onSubmitMeta: defaultMeta,
    onSubmit({ value, meta }) {
      onSearch(value, meta)
    },
  })

  const values = useSelector(store, (state) => state.values)

  const { data: dataSchoolYear, subscribeToMore: subscribeToMoreSchoolYear } =
    useSchoolYearsQuery({
      variables: { id: enterpriseId },
    })

  const { data: dataClasses } = useClassesBySchoolYearQuery({
    variables: { id: Number(values.currentSchoolYear?.id) },
    skip: !values.currentSchoolYear,
  })

  const { data: dataBranches } = useBranchesBySchoolYearQuery({
    variables: { id: Number(values.currentSchoolYear?.id) },
    skip: !values.currentSchoolYear,
  })

  const { data: dataLevels } = useLevelsBySchoolYearQuery({
    variables: { id: Number(values.currentSchoolYear?.id) },
    skip: !values.currentSchoolYear,
  })

  const { data } = useCouncilDecisionsQuery({
    variables: { id: enterpriseId },
  })

  const [
    fetchResult,
    { data: dataAnnualRanking, loading: loadingAnnualRanking, error },
  ] = useAnnualReportRankingLazyQuery({
    fetchPolicy: 'no-cache',
  })

  const { data: dataAnnualResultSummary } = useAnnualResultSummaryQuery({
    variables: { schoolYearId: Number(values.currentSchoolYear?.id) },
    skip: !values.currentSchoolYear,
    fetchPolicy: 'no-cache',
  })

  const onSearch = (values: BulkAnnualResultsSchemaType, meta?: any) => {
    let str = `search=${
      values.currentSchoolYear
        ? `schoolYear:${values.currentSchoolYear.id}`
        : ''
    }`

    if (values.minAverage) {
      str += `${values.minAverage ? `,minAverage:${values.minAverage}` : ''}`
    }

    if (values.maxAverage) {
      str += `${values.maxAverage ? `,maxAverage:${values.maxAverage}` : ''}`
    }

    if (values.clazz) {
      str += `${values.clazz ? `,clazz:${values.clazz.id}` : ''}`
    }

    if (values.level) {
      str += `${values.level ? `,level:${values.level.id}` : ''}`
    }

    if (values.branch) {
      str += `${values.branch ? `,branch:${values.branch.id}` : ''}`
    }

    if (values.decision) {
      str += `${values.decision ? `,decision:${values.decision.id}` : ''}`
    }

    if (values.name) {
      str += `${values.name ? `,name:${values.name}` : ''}`
    }

    if (values.gender) {
      str += `${values.gender ? `,gender:${values.gender}` : ''}`
    }

    setSearch(str)
    fetchResult({
      variables: {
        search: str,
        newClassIsNull: values.newClassIsNull,
        shuffle: values.shuffle,
        limit: values.limit !== '' ? Number(values.limit) : null,
        sortByMerit: values.sortByMerit || false,
      },
    }).then(() => {
      setHasNewResult(true)
    })
  }

  useEffect(() => {
    messageService.getMessage().subscribe((message) => {
      if (message) {
        if (message.name === 'annualResults') {
          setHasNewResult(false)
        }
      }
    })
  }, [messageService])

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div className="w-full mb-0">
        <div id="displayStudentName"> </div>
        <PageHeader title={m.sidebar_marks_bulkAnnualResult()} />
      </div>

      <ReportOptions title="Paramètres de recherche">
        <SearchContainer>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleSubmit()
            }}
            className="space-y-4"
          >
            <FormSection
              icon={<Calendar className="w-5 h-5" />}
              title={m.label_schoolYear()}
              description="Sélectionnez les années scolaires"
              color="#7367f0"
            >
              <CompactGrid>
                <LiveView
                  document={SchoolYearCreatedDocument}
                  singleVar="schoolYear"
                  data={dataSchoolYear}
                  listVar="schoolYears"
                  subscribeToMore={subscribeToMoreSchoolYear}
                  sortField="label"
                  triggerUpdate={true}
                  enterpriseId={enterpriseId}
                >
                  {({ schoolYears }) => (
                    <AppField
                      name="currentSchoolYear"
                      children={(field) => (
                        <field.ControlledSelect
                          label={m.label_schoolYear()}
                          options={schoolYears || []}
                          getOptionLabel={(option: any) => option.label}
                          getOptionValue={(option: any) => option.id}
                          components={{
                            Option: schoolYearOptions,
                          }}
                          placeholder="Année scolaire en cours"
                        />
                      )}
                    />
                  )}
                </LiveView>

                <LiveView
                  document={SchoolYearCreatedDocument}
                  singleVar="schoolYear"
                  data={dataSchoolYear}
                  listVar="schoolYears"
                  subscribeToMore={subscribeToMoreSchoolYear}
                  sortField="label"
                  triggerUpdate={true}
                  enterpriseId={enterpriseId}
                >
                  {({ schoolYears }) => (
                    <AppField
                      name="nextSchoolYear"
                      children={(field) => (
                        <field.ControlledSelect
                          label={m.label_schoolYear()}
                          options={schoolYears || []}
                          getOptionLabel={(option: any) => option.label}
                          getOptionValue={(option: any) => option.id}
                          components={{
                            Option: schoolYearOptions,
                          }}
                          placeholder="Année scolaire prochaine"
                        />
                      )}
                    />
                  )}
                </LiveView>
              </CompactGrid>
            </FormSection>

            <FormSection
              icon={<Filter className="w-5 h-5" />}
              title={m.label_filters()}
              description="Critères de recherche des élèves"
              color="#28c76f"
            >
              <CompactGrid>
                <AppField
                  name="minAverage"
                  children={(field) => (
                    <field.Input
                      label={m.label_minAverage()}
                      type="number"
                      placeholder="0"
                    />
                  )}
                />

                <AppField
                  name="maxAverage"
                  children={(field) => (
                    <field.Input
                      label={m.label_maxAverage()}
                      type="number"
                      placeholder="20"
                    />
                  )}
                />

                <AppField
                  name="clazz"
                  children={(field) => (
                    <field.ControlledSelect
                      label={m.label_oldClass()}
                      options={dataClasses?.clazzes || []}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      components={{ Option: classOptions }}
                      placeholder={m.label_selectClass()}
                      onChange={(val) => setFieldValue('clazz', val)}
                    />
                  )}
                />

                <AppField
                  name="branch"
                  children={(field) => (
                    <field.ControlledSelect
                      label={m.label_oldBranch()}
                      options={dataBranches?.branches || []}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      components={{ Option: branchOptions }}
                      placeholder={m.label_selectBranch()}
                      onChange={(val) => setFieldValue('branch', val)}
                    />
                  )}
                />

                <AppField
                  name="level"
                  children={(field) => (
                    <field.ControlledSelect
                      label={m.label_oldLevel()}
                      options={dataLevels?.levels || []}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      placeholder={m.label_selectLevel()}
                    />
                  )}
                />

                <AppField
                  name="decision"
                  children={(field) => (
                    <field.ControlledSelect
                      label={m.label_currentDecision()}
                      options={data?.councilDecisions || []}
                      getOptionLabel={(option: any) => option.name}
                      getOptionValue={(option: any) => option.id}
                      components={{ Option: decisionOptions }}
                      placeholder={m.label_select()}
                    />
                  )}
                />
              </CompactGrid>
            </FormSection>

            <FormSection
              icon={<Settings className="w-5 h-5" />}
              title={m.label_options()}
              description="Options de traitement et d'affichage"
              color="#ea5455"
            >
              <CompactGrid>
                <AppField
                  name="name"
                  children={(field) => (
                    <field.Input
                      label={m.label_newBranch()}
                      prepend={<List size={16} />}
                    />
                  )}
                />

                <AppField
                  name="limit"
                  children={(field) => (
                    <field.Input
                      label={m.label_limitResultTo()}
                      prepend={<Hash size={16} />}
                    />
                  )}
                />

                <AppField
                  name="gender"
                  children={(field) => (
                    <field.Input
                      label={m.label_gender()}
                      type="select"
                      prepend={<Users size={16} />}
                    >
                      <option value="">{m.label_select()}</option>
                      <option value="MALE">{m.label_male()}</option>
                      <option value="FEMALE">{m.label_female()}</option>
                    </field.Input>
                  )}
                />

                <div className="flex flex-wrap gap-4 mt-2">
                  <AppField
                    name="newClassIsNull"
                    children={(field) => (
                      <field.Switch
                        label={m.label_newClassIsNull()}
                        className="form-switch"
                      />
                    )}
                  />

                  <AppField
                    name="shuffle"
                    children={(field) => (
                      <field.Switch
                        label={m.label_randomList()}
                        className="form-switch"
                      />
                    )}
                  />

                  <AppField
                    name="sortByMerit"
                    children={(field) => (
                      <field.Switch
                        label={m.label_sortByMerit()}
                        className="form-switch"
                      />
                    )}
                  />
                </div>
              </CompactGrid>
            </FormSection>

            <ButtonGroup>
              <Button
                className="round"
                color="primary"
                type="button"
                onClick={() => handleSubmit()}
                loading={loadingAnnualRanking}
              >
                {m.label_execute()}
              </Button>
              <Button
                className="round"
                color="secondary"
                onClick={() => {
                  if (!values.currentSchoolYear) {
                    alert("Veuillez sélectionner l'année scolaire en cours")
                  } else {
                    tableModal.show({
                      dataSource: dataAnnualResultSummary
                        ? dataAnnualResultSummary.findAnnualResultSummary
                        : [],
                    })
                  }
                }}
              >
                Voir répartition des classes
              </Button>
            </ButtonGroup>
          </Form>
        </SearchContainer>
      </ReportOptions>

      {error && (
        <div style={{ marginTop: '0.75rem' }}>
          <GraphQLError error={error} />
        </div>
      )}

      {values.currentSchoolYear &&
        values.nextSchoolYear &&
        !error &&
        hasNewResult && (
          <ResultContainer>
            {loadingAnnualRanking || !dataAnnualRanking ? (
              <LoadingSpinner />
            ) : (
              <BulkAnnualResultAdd
                annualResults={dataAnnualRanking.annualReportSummary}
                currentSchoolYearId={values.currentSchoolYear.id}
                nextSchoolYearId={values.nextSchoolYear.id}
              />
            )}
          </ResultContainer>
        )}
    </div>
  )
}

export default BulkAnnualResults
