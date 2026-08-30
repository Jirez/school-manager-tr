import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { useModal } from '@ebay/nice-modal-react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { Form } from 'reactstrap'
import { yupResolver } from '@hookform/resolvers/yup'
import styled from 'styled-components'
import { Calendar, Filter, Settings, Users, Hash, List } from 'lucide-react'

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
import ControlledReactSelect from '@/@core/components/ui/forms/controlled-react-select'
import { default as FormItem } from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
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

interface FormValues {
  gender?: string
  currentSchoolYear: any
  minAverage: any
  maxAverage: any
  clazz: any
  level: any
  branch: any
  decision: any
  name?: string //newBranch
  limit: any
  nextSchoolYear: any
  shuffle: boolean
  newClassIsNull: boolean
  sortByMerit: boolean
}

const BulkAnnualResults = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.marks.bulkAnnualResult'))
  const { enterpriseId } = useAuthentication()
  const [search, setSearch] = useState<string>('')
  const [hasNewResult, setHasNewResult] = useState(false)
  const tableModal = useModal(AnnualResultSummaryTableModal)

  const { control, handleSubmit, watch, reset, setValue } = useForm<FormValues>(
    {
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
      },
      resolver: yupResolver(
        yup.object({
          minAverage: yup
            .number()
            .nullable()
            .min(0)
            .max(20)
            .transform((v) => (v === '' || Number.isNaN(v) ? null : v)),
          maxAverage: yup
            .number()
            .nullable()
            .positive()
            .max(20)
            .transform((v) => (v === '' || Number.isNaN(v) ? null : v)),
          nextSchoolYear: yup
            .object()
            .required()
            .typeError('Value is required'),
          currentSchoolYear: yup
            .object()
            .required()
            .typeError('Value is required'),
        }),
      ) as any,
      mode: 'onChange',
    },
  )

  const values = watch()

  const {
    data: dataSchoolYear,
    //loading: loadingSchoolYear,
    subscribeToMore: subscribeToMoreSchoolYear,
  } = useSchoolYearsQuery({
    variables: { id: enterpriseId },
  })

  /* const { data: dataClasses } = useClassesQuery({
    variables: { id: enterpriseId },
  });

  const { data: dataBranches } = useBranchesQuery({
    variables: { id: enterpriseId },
  }); */

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

  //const { data: dataAnnualRanking, loading: loadingAnnualRanking } =
  const [
    fetchResult,
    { data: dataAnnualRanking, loading: loadingAnnualRanking, error },
  ] = useAnnualReportRankingLazyQuery({
    /* variables: {
      search: search,
      newClassIsNull: values.newClassIsNull,
      shuffle: values.shuffle,
      limit: values.limit !== "" ? Number(values.limit) : null,
      sortByMerit: values.sortByMerit || false,
    }, */
    //skip: !search && /* !load && */ !values.newClassIsNull && !values.shuffle,
    fetchPolicy: 'no-cache',
  })

  const { data: dataAnnualResultSummary, loading: loadingAnnualResultSummary } =
    useAnnualResultSummaryQuery({
      variables: { schoolYearId: Number(values.currentSchoolYear?.id) },
      skip: !values.currentSchoolYear,
      fetchPolicy: 'no-cache',
    })

  const onSearch: SubmitHandler<FormValues> = (values) => {
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
          //reset({currentSchoolYear: null, nextSchoolYear: null, decision:null, clazz: null, branch: null, level: null, newClassIsNull: false, name: '', shuffle: false});
          //form.resetFields();
          //reset();
          //reobserve();
          //navigate("/bulk-annual-result");
          /* client.refetchQueries({
            updateCache(cache) {
              cache.evict({ fieldName: "findAnnualReportSummary" });
            },
          }); */
          setHasNewResult(false)
        }
      }
    })
  }, [messageService])

  return (
    <div className="flex flex-col w-full px-1 md:!px-0">
      <div className="w-full mb-0">
        <div id="displayStudentName"> </div>
        <PageHeader title={t('sidebar.marks.bulkAnnualResult')} />
      </div>

      <ReportOptions title="Paramètres de recherche">
        <SearchContainer>
          <Form onSubmit={handleSubmit(onSearch)} className="space-y-4">
            <FormSection
              icon={<Calendar className="w-5 h-5" />}
              title={t('label-schoolYear') || 'Années scolaires'}
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
                    <ControlledReactSelect
                      name="currentSchoolYear"
                      control={control}
                      onChange={(val) => setValue('currentSchoolYear', val)}
                      options={schoolYears || undefined}
                      getOptionLabel={(option: any) => option.label}
                      getOptionValue={(option: any) => option.id}
                      components={{
                        Option: schoolYearOptions,
                      }}
                      placeholder="Année scolaire en cours"
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
                    <ControlledReactSelect
                      name="nextSchoolYear"
                      control={control}
                      onChange={(val) => setValue('nextSchoolYear', val)}
                      options={schoolYears || undefined}
                      getOptionLabel={(option: any) => option.label}
                      getOptionValue={(option: any) => option.id}
                      components={{
                        Option: schoolYearOptions,
                      }}
                      placeholder="Année scolaire prochaine"
                    />
                  )}
                </LiveView>
              </CompactGrid>
            </FormSection>

            <FormSection
              icon={<Filter className="w-5 h-5" />}
              title={t('label-filters') || 'Filtres'}
              description="Critères de recherche des élèves"
              color="#28c76f"
            >
              <CompactGrid>
                <FormItem
                  name="minAverage"
                  control={control}
                  label={t('label-minAverage')}
                  //prepend={<Hash size={16} />}
                  placeholder="0"
                />

                <FormItem
                  name="maxAverage"
                  control={control}
                  label={t('label-maxAverage')}
                  //prepend={<Hash size={16} />}
                  placeholder="20"
                />

                <ControlledReactSelect
                  name="clazz"
                  control={control}
                  label={t('label-oldClass')}
                  onChange={(val: any) => setValue('clazz', val)}
                  options={dataClasses?.clazzes || undefined}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                  components={{ Option: classOptions }}
                  placeholder={t('label-selectClass')}
                />

                <ControlledReactSelect
                  name="branch"
                  control={control}
                  label={t('label-oldBranch')}
                  onChange={(val: any) => setValue('branch', val)}
                  options={dataBranches?.branches || undefined}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                  components={{ Option: branchOptions }}
                  placeholder={t('label-selectBranch')}
                />

                <ControlledReactSelect
                  name="level"
                  control={control}
                  label={t('label-oldLevel')}
                  onChange={(val: any) => setValue('level', val)}
                  options={dataLevels?.levels || undefined}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                  placeholder={t('label-selectLevel')}
                />

                <ControlledReactSelect
                  name="decision"
                  control={control}
                  label={t('label-currentDecision')}
                  onChange={(val) => setValue('decision', val)}
                  options={data?.councilDecisions || undefined}
                  getOptionLabel={(option: any) => option.name}
                  getOptionValue={(option: any) => option.id}
                  components={{ Option: decisionOptions }}
                  placeholder={t('label-select')}
                />
              </CompactGrid>
            </FormSection>

            <FormSection
              icon={<Settings className="w-5 h-5" />}
              title={t('label-options') || 'Options'}
              description="Options de traitement et d'affichage"
              color="#ea5455"
            >
              <CompactGrid>
                <FormItem
                  name="name"
                  control={control}
                  label={t('label-newBranch')}
                  prepend={<List size={16} />}
                />

                <FormItem
                  name="limit"
                  control={control}
                  label={t('label-limitResultTo')}
                  prepend={<Hash size={16} />}
                />

                <FormItem
                  name="gender"
                  control={control}
                  label={t('label-gender')}
                  type="select"
                  prepend={<Users size={16} />}
                >
                  <option value="">{t('label-select')}</option>
                  <option value="MALE">{t('MALE')}</option>
                  <option value="FEMALE">{t('FEMALE')}</option>
                </FormItem>

                <div className="flex flex-wrap gap-4 mt-2">
                  <Switch
                    name="newClassIsNull"
                    control={control}
                    label={t('label-newClassIsNull')}
                    className="form-switch"
                    defaultChecked={values.newClassIsNull}
                  />

                  <Switch
                    name="shuffle"
                    control={control}
                    label={t('label-randomList')}
                    className="form-switch"
                    defaultChecked={values.shuffle}
                  />

                  <Switch
                    name="sortByMerit"
                    control={control}
                    label={t('label-sortByMerit')}
                    className="form-switch"
                    defaultChecked={values.sortByMerit}
                  />
                </div>
              </CompactGrid>
            </FormSection>

            <ButtonGroup>
              <Button
                className="round"
                color="primary"
                type="button"
                onClick={() => handleSubmit(onSearch)()}
                loading={loadingAnnualRanking}
              >
                {t('label-execute')}
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
