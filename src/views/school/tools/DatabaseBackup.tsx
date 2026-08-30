import { useState } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import RestDataSource from '@/utils/RestDataSource'
import Button from '@/@core/components/button'
import {
  Input,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Label,
  Row,
  Col,
} from 'reactstrap'
import { TOAST_OPTIONS } from '@/utils/constants'
import { Database, HardDrive } from 'react-feather'

const DatabaseBackup = () => {
  const [path, setPath] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const exportDatabase = () => {
    if (!path) {
      toast.error('Veuillez saisir un chemin de sauvegarde', {
        ...TOAST_OPTIONS,
      })
      return
    }
    const callback = (data: any) => {
      setLoading(false)
      data
        ? toast.success('Sauvegarde effectuée avec succès', {
            ...TOAST_OPTIONS,
          })
        : toast.error('Echec de la sauvegarde', { ...TOAST_OPTIONS })
    }
    const dataSource = new RestDataSource()
    setLoading(true)
    dataSource.get(`database/export?path=${path}`, callback)
  }

  return (
    <div className="app-user-list">
      <Card className="overflow-hidden">
        <CardHeader className="flex-column align-items-start py-2">
          <div className="d-flex align-items-center">
            <div className="avatar bg-light-primary p-50 me-1">
              <div className="avatar-content">
                <Database size={24} />
              </div>
            </div>
            <div>
              <CardTitle tag="h4" className="mb-0">
                {t('sidebar.tools.databaseBackup')}
              </CardTitle>
              <small className="text-muted">
                {t('label-backupDescription')}
              </small>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="12" className="mb-2">
              <div className="alert alert-primary p-2" role="alert">
                <div className="d-flex align-items-center">
                  <HardDrive size={18} className="me-1" />
                  <span>{t('label-backupInstruction')}</span>
                </div>
              </div>
            </Col>
            <Col md="8" sm="12">
              <div className="mb-1">
                <Label className="form-label" for="backup-path">
                  {t('label-backupPath')}
                </Label>
                <Input
                  id="backup-path"
                  placeholder="Ex: D:/Backups/SchoolManager/"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                />
              </div>
            </Col>
            <Col md="4" sm="12" className="d-flex align-items-end">
              <div className="mb-1 w-100">
                <Button
                  onClick={exportDatabase}
                  color="primary"
                  block
                  loading={loading}
                  disabled={!path}
                  className="!flex !flex-row !items-center !justify-center !gap-2"
                >
                  <Database size={14} className="m-0 p-0 " />
                  <span className="align-middle">
                    {t('label-exportDatabase')}
                  </span>
                </Button>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  )
}

export default DatabaseBackup
