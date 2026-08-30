import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TabPane } from 'reactstrap'

import PageHeader from '@/@core/components/ui/page-header'
import { useAuthentication } from '@/hooks/useAuthentication'
import { TabNav } from '@/@core/components/tabs'
import LiveView from '@/utils/LiveView'
import DocumentHeader from './DocumentHeader'
import DocumentHeaderForm from './DocumentHeaderForm'
import DisciplineForm from './DisciplineForm'
import Discipline from './Discipline'
import LicenseWrapper from './LicenseWrapper'
import License from './License'
import ReportForm from './ReportForm'
import Report from './Report'
import SecurityForm from './SecurityForm'
import Security from './Security'
import RegistrationNumberForm from './RegistrationNumberForm'
import RegistrationNumber from './RegistrationNumber'
import StudentInvoice from './StudentInvoice'
import StudentInvoiceForm from './StudentInvoiceForm'
import StudentPaymentConfig from './StudentPaymentConfig'
import StudentPaymentConfigForm from './StudentPaymentConfigForm'
import {
  ConfigurationCreatedDocument,
  useConfigurationQuery,
} from '@/gql/graphql'
import PictureForm from './PictureForm'
import Picture from './Picture'
import PersonnelCodeForm from './PersonnelCodeForm'
import PersonnelCode from './PersonnelCode'
import { useTitle } from 'ahooks'
import DuplicatedStudentForm from './DuplicatedStudentForm'
import DuplicatedStudent from './DuplicatedStudent'
import ReportHeaderForm from './ReportHeaderForm'
import ReportHeader from './ReportHeader'
import ExpenseConfigForm from './ExpenseConfigForm'
import ExpenseConfig from './ExpenseConfig'
import {
  PageContainer,
  HeaderSection,
  TabContainer,
  GridRow,
} from './configuration.style'
import {
  Hash,
  UserCog,
  Image,
  Gavel,
  ClipboardCheck,
  FileText,
  CreditCard,
  Receipt,
  Shield,
  Key,
} from 'lucide-react'
import ConfigSection from './config-section'

const Configuration = () => {
  const { t } = useTranslation()
  useTitle(t('sidebar.tools.configuration'))
  const [header, setHeader] = useState(false)
  const [reportHeader, setReportHeader] = useState(false)
  const [discipline, setDiscipline] = useState(false)
  const [report, setReport] = useState(false)
  const [license, setLicense] = useState(false)
  const [security, setSecurity] = useState(false)
  const [values, setValues] = useState({
    registrationNumber: false,
    studentInvoice: false,
    studentPayment: false,
    picture: false,
    personnelCode: false,
    duplicatedStudent: false,
    expense: false,
  })
  // const [picture, setPicture] = useState(false)
  const { enterpriseId } = useAuthentication()

  const { data, loading, subscribeToMore } = useConfigurationQuery({
    variables: { id: enterpriseId },
  })

  const findConfigByKey = (config: any[], key: string) => {
    if (!config) return null
    const data = config.filter(
      ({ configurationPK }) => configurationPK.key === key,
    )
    return data && data[0] ? data[0].configData : null
  }

  const getDocumentHeader = (configs: any[]) => {
    try {
      return JSON.parse(findConfigByKey(configs, 'DocumentHeader'))
    } catch (e) {
      return null
    }
  }

  const getReportHeader = (configs: any[]) => {
    try {
      return JSON.parse(findConfigByKey(configs, 'ReportHeader'))
    } catch (e) {
      return null
    }
  }

  const parseConfig = (configs: any[], key: string) => {
    try {
      return JSON.parse(findConfigByKey(configs, key))
    } catch (e) {
      return null
    }
  }

  return (
    <PageContainer>
      <HeaderSection>
        <PageHeader title={t('sidebar.tools.configuration')} />
      </HeaderSection>

      <TabContainer className="vertical-tabs">
        <LiveView
          document={ConfigurationCreatedDocument}
          singleVar="config"
          data={data}
          loading={loading}
          listVar="configs"
          subscribeToMore={subscribeToMore}
          //sortField="name"
          triggerUpdate={true}
          enterpriseId={enterpriseId}
        >
          {({ configs }) => (
            <div className="mb-6">
              <TabNav
                items={[
                  { id: '1', label: 'label-school' },
                  { id: '2', label: 'label-disciplineAndNotes' },
                  { id: '5', label: 'label-studentPayment' },
                  { id: '6', label: 'label-salesAndExpenses' },
                  { id: '3', label: 'label-security' },
                  { id: '4', label: 'label-license' },
                ]}
              >
                <TabPane tabId="1">
                  <GridRow>
                    <ConfigSection
                      title="Entête des documents"
                      description="Personnalisez les entêtes de vos rapports et documents"
                      icon={<FileText size={24} />}
                      iconColor="#6366f1"
                      isEditing={header}
                      onEdit={() => setHeader(true)}
                      onCancel={() => setHeader(false)}
                      editForm={
                        <DocumentHeaderForm
                          onCancel={() => setHeader(false)}
                          documentHeader={getDocumentHeader(configs)}
                        />
                      }
                      displayContent={
                        <DocumentHeader
                          data={findConfigByKey(configs, 'DocumentHeader')}
                        />
                      }
                    />

                    <ConfigSection
                      title="Entête des bulletins de notes"
                      description="Personnalisez les entêtes de vos bulletins de notes"
                      icon={<ClipboardCheck size={24} />}
                      iconColor="#8b5cf6"
                      isEditing={reportHeader}
                      onEdit={() => setReportHeader(true)}
                      onCancel={() => setReportHeader(false)}
                      editForm={
                        <ReportHeaderForm
                          onCancel={() => setReportHeader(false)}
                          reportHeader={getReportHeader(configs)}
                        />
                      }
                      displayContent={
                        <ReportHeader
                          data={findConfigByKey(configs, 'ReportHeader')}
                        />
                      }
                    />

                    <ConfigSection
                      title={t('label-duplicatedStudent')}
                      description={t('label-duplicatedStudentDescription')}
                      icon={<Hash size={24} />}
                      iconColor="#ec4899"
                      isEditing={values.duplicatedStudent}
                      onEdit={() =>
                        setValues((val) => ({
                          ...val,
                          duplicatedStudent: true,
                        }))
                      }
                      onCancel={() =>
                        setValues((val) => ({
                          ...val,
                          duplicatedStudent: false,
                        }))
                      }
                      editForm={
                        <DuplicatedStudentForm
                          onCancel={() =>
                            setValues((val) => ({
                              ...val,
                              duplicatedStudent: false,
                            }))
                          }
                          duplicatedStudent={JSON.parse(
                            findConfigByKey(configs, 'DuplicatedStudent'),
                          )}
                        />
                      }
                      displayContent={
                        <DuplicatedStudent
                          data={findConfigByKey(configs, 'DuplicatedStudent')}
                        />
                      }
                    />

                    <ConfigSection
                      title={t('label-studentNumber')}
                      description={t('label-studentNumberDescription')}
                      icon={<Hash size={24} />}
                      iconColor="#3b82f6"
                      isEditing={values.registrationNumber}
                      onEdit={() =>
                        setValues((val) => ({
                          ...val,
                          registrationNumber: true,
                        }))
                      }
                      onCancel={() =>
                        setValues((val) => ({
                          ...val,
                          registrationNumber: false,
                        }))
                      }
                      editForm={
                        <RegistrationNumberForm
                          onCancel={() =>
                            setValues((val) => ({
                              ...val,
                              registrationNumber: false,
                            }))
                          }
                          registrationNumber={parseConfig(
                            configs,
                            'RegistrationNumber',
                          )}
                        />
                      }
                      displayContent={
                        <RegistrationNumber
                          data={findConfigByKey(configs, 'RegistrationNumber')}
                        />
                      }
                    />

                    <ConfigSection
                      title={t('label-personnelCode')}
                      description={t('label-personnelCodeDescription')}
                      icon={<UserCog size={24} />}
                      iconColor="#8b5cf6"
                      isEditing={values.personnelCode}
                      onEdit={() =>
                        setValues((val) => ({
                          ...val,
                          personnelCode: true,
                        }))
                      }
                      onCancel={() =>
                        setValues((val) => ({
                          ...val,
                          personnelCode: false,
                        }))
                      }
                      editForm={
                        <PersonnelCodeForm
                          onCancel={() =>
                            setValues((val) => ({
                              ...val,
                              personnelCode: false,
                            }))
                          }
                          registrationNumber={parseConfig(
                            configs,
                            'PersonnelCode',
                          )}
                        />
                      }
                      displayContent={
                        <PersonnelCode
                          data={findConfigByKey(configs, 'PersonnelCode')}
                        />
                      }
                    />

                    <ConfigSection
                      title={t('label-picturePath')}
                      description={t('label-pictureDescription')}
                      icon={<Image size={24} />}
                      iconColor="#14b8a6"
                      isEditing={values.picture}
                      onEdit={() =>
                        setValues((val) => ({
                          ...val,
                          picture: true,
                        }))
                      }
                      onCancel={() =>
                        setValues((val) => ({ ...val, picture: false }))
                      }
                      editForm={
                        <PictureForm
                          onCancel={() =>
                            setValues((val) => ({ ...val, picture: false }))
                          }
                          picture={parseConfig(configs, 'Picture')}
                        />
                      }
                      displayContent={
                        <Picture data={findConfigByKey(configs, 'Picture')} />
                      }
                    />
                  </GridRow>
                </TabPane>

                <TabPane tabId="2">
                  <GridRow>
                    <ConfigSection
                      title="Discipline"
                      description="Configurer les sanctions acquises quand les abscences non justifiées sont"
                      icon={<Gavel size={24} />}
                      iconColor="#ef4444"
                      isEditing={discipline}
                      onEdit={() => setDiscipline(true)}
                      onCancel={() => setDiscipline(false)}
                      editForm={
                        <DisciplineForm
                          onCancel={() => setDiscipline(false)}
                          discipline={parseConfig(configs, 'Discipline')}
                        />
                      }
                      displayContent={
                        <Discipline
                          data={findConfigByKey(configs, 'Discipline')}
                        />
                      }
                    />

                    <ConfigSection
                      title="Notes et bulletins"
                      description="Configurer les stratégies de calcul des moyennes"
                      icon={<ClipboardCheck size={24} />}
                      iconColor="#7367f0"
                      isEditing={report}
                      onEdit={() => setReport(true)}
                      onCancel={() => setReport(false)}
                      editForm={
                        <ReportForm
                          onCancel={() => setReport(false)}
                          report={parseConfig(configs, 'Report')}
                        />
                      }
                      displayContent={
                        <Report data={findConfigByKey(configs, 'Report')} />
                      }
                    />
                  </GridRow>
                </TabPane>

                <TabPane tabId="5">
                  <GridRow>
                    <ConfigSection
                      title={t('label-studentInvoice')}
                      description={t('label-studentInvoiceDescription')}
                      icon={<FileText size={24} />}
                      iconColor="#10b981"
                      isEditing={values.studentInvoice}
                      onEdit={() =>
                        setValues((val) => ({
                          ...val,
                          studentInvoice: true,
                        }))
                      }
                      onCancel={() =>
                        setValues((val) => ({
                          ...val,
                          studentInvoice: false,
                        }))
                      }
                      editForm={
                        <StudentInvoiceForm
                          onCancel={() =>
                            setValues((val) => ({
                              ...val,
                              studentInvoice: false,
                            }))
                          }
                          studentInvoice={parseConfig(
                            configs,
                            'StudentInvoice',
                          )}
                        />
                      }
                      displayContent={
                        <StudentInvoice
                          data={findConfigByKey(configs, 'StudentInvoice')}
                        />
                      }
                    />

                    <ConfigSection
                      title={t('label-studentPayment')}
                      description={t('label-studentPaymentDescription')}
                      icon={<CreditCard size={24} />}
                      iconColor="#3b82f6"
                      isEditing={values.studentPayment}
                      onEdit={() =>
                        setValues((val) => ({
                          ...val,
                          studentPayment: true,
                        }))
                      }
                      onCancel={() =>
                        setValues((val) => ({
                          ...val,
                          studentPayment: false,
                        }))
                      }
                      editForm={
                        <StudentPaymentConfigForm
                          onCancel={() =>
                            setValues((val) => ({
                              ...val,
                              studentPayment: false,
                            }))
                          }
                          studentPayment={parseConfig(
                            configs,
                            'StudentPayment',
                          )}
                        />
                      }
                      displayContent={
                        <StudentPaymentConfig
                          data={findConfigByKey(configs, 'StudentPayment')}
                        />
                      }
                    />
                  </GridRow>
                </TabPane>

                <TabPane tabId="6">
                  <GridRow>
                    <ConfigSection
                      title={t('label-expenses')}
                      description={t('label-expenseDescription')}
                      icon={<Receipt size={24} />}
                      iconColor="#f59e0b"
                      isEditing={values.expense}
                      onEdit={() =>
                        setValues((val) => ({
                          ...val,
                          expense: true,
                        }))
                      }
                      onCancel={() =>
                        setValues((val) => ({
                          ...val,
                          expense: false,
                        }))
                      }
                      editForm={
                        <ExpenseConfigForm
                          onCancel={() =>
                            setValues((val) => ({
                              ...val,
                              expense: false,
                            }))
                          }
                          expense={parseConfig(configs, 'Expense')}
                        />
                      }
                      displayContent={
                        <ExpenseConfig
                          data={findConfigByKey(configs, 'Expense')}
                        />
                      }
                    />
                  </GridRow>
                </TabPane>

                <TabPane tabId="3">
                  <GridRow>
                    <ConfigSection
                      title="Sécurité"
                      description="Protégez vos données contre l'identification automatisée"
                      icon={<Shield size={24} />}
                      iconColor="#ef4444"
                      isEditing={security}
                      onEdit={() => setSecurity(true)}
                      onCancel={() => setSecurity(false)}
                      editForm={
                        <SecurityForm
                          onCancel={() => setSecurity(false)}
                          security={parseConfig(configs, 'Security')}
                        />
                      }
                      displayContent={
                        <Security data={findConfigByKey(configs, 'Security')} />
                      }
                    />
                  </GridRow>
                </TabPane>

                <TabPane tabId="4">
                  <GridRow>
                    <ConfigSection
                      title="Abonnement et facturation"
                      description="Achetez une licence pour accéder aux fonctionnalités de SchoolManager"
                      icon={<Key size={24} />}
                      iconColor="#f59e0b"
                      isEditing={license}
                      onEdit={() => setLicense(true)}
                      onCancel={() => setLicense(false)}
                      editForm={
                        <LicenseWrapper
                          onCancel={() => setLicense(false)}
                          discipline={parseConfig(configs, 'License')}
                        />
                      }
                      displayContent={
                        <License data={findConfigByKey(configs, 'License')} />
                      }
                    />
                  </GridRow>
                </TabPane>
              </TabNav>
            </div>
          )}
        </LiveView>
      </TabContainer>
    </PageContainer>
  )
}

export default Configuration
