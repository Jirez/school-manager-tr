import type { Dispatch, SetStateAction } from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'reactstrap'
import dayjs from 'dayjs'
import type { NiceModalHandler } from '@ebay/nice-modal-react'
import {
  FileText,
  Layout,
  FileType,
  Layers,
  ListOrdered,
  Play,
  Type,
} from 'lucide-react'

import Button from '@/@core/components/button'
import DatePicker from '@/@core/components/ui/forms/date-picker'
import Input from '@/@core/components/ui/forms/input'
import Switch from '@/@core/components/ui/forms/swith'
import FormSection from '@/@core/components/ui/forms/form-section'
import ToggleOption from '@/@core/components/ui/forms/toggle-option'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'

export interface OptionFormValues {
  title: string
  date?: any
  columnBorder?: boolean
  rowNumber?: boolean
  tableOfContents?: boolean
  orientation?: 'PORTRAIT' | 'LANDSCAPE'
  pageType?: 'A4' | 'A5' | 'A3' | 'A2' | 'A1'
}

interface CustomReportProps {
  options: OptionFormValues
  setValues: Dispatch<SetStateAction<{ [key: string]: any }>>
  modal: NiceModalHandler
}

const CustomReport: React.FC<CustomReportProps> = ({
  options,
  setValues,
  modal,
}) => {
  const { t } = useTranslation()

  const {
    control,
    getValues,
    handleSubmit,
    watch,
    formState: { touchedFields },
  } = useForm<OptionFormValues>({
    defaultValues: {
      date: options.date ? dayjs(options.date).toDate() : dayjs().toDate(),
      title: options.title,
      columnBorder: options.columnBorder ?? false,
      orientation: options.orientation || 'PORTRAIT',
      rowNumber: options.rowNumber ?? false,
      pageType: options.pageType ?? 'A4',
      tableOfContents: options.tableOfContents ?? false,
    },
  })

  const columnBorder = watch('columnBorder')
  const rowNumber = watch('rowNumber')
  const tableOfContents = watch('tableOfContents')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return handleSubmit(async (values) => {
      setValues((val) => ({ ...val, ...values, loading: true }))
      modal.hide()
    })(event)
  }

  useEffect(() => {
    setValues((val) => ({ ...val, loading: false }))
  }, [touchedFields])

  return (
    <Form className="p-0" onSubmit={onSubmit}>
      <div className="flex flex-col gap-1">
        {/* Basic Information Section */}
        <FormSection
          icon={<FileText className="w-4 h-4" />}
          title={t('label-generalInfo')}
          description={t('text-reportBasicDetails')}
          color="#7367f0"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <Input
              name="title"
              control={control}
              label={t('label-reportTitle')}
              prepend={<Type size={16} />}
              required
            />
            <DatePicker
              name="date"
              control={control}
              label={t('label-reportDate')}
              required
            />
          </div>
        </FormSection>

        {/* Display Options Section */}
        <FormSection
          icon={<Layout className="w-4 h-4" />}
          title={t('label-displayOptions')}
          description={t('text-reportVisualSettings')}
          color="#ff9f43"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <ToggleOption
              icon={<Layers className="w-4 h-4" />}
              title={t('label-showBorders')}
              description={t('text-tableBorders')}
              isActive={!!columnBorder}
            >
              <Switch name="columnBorder" control={control} label="" />
            </ToggleOption>

            <ToggleOption
              icon={<ListOrdered className="w-4 h-4" />}
              title={t('label-showRowNumber')}
              description={t('text-sequentialNumbers')}
              isActive={!!rowNumber}
            >
              <Switch name="rowNumber" control={control} label="" />
            </ToggleOption>

            <ToggleOption
              icon={<FileText className="w-4 h-4" />}
              title={t('label-showTableOfContents')}
              description={t('text-indexPage')}
              isActive={!!tableOfContents}
            >
              <Switch name="tableOfContents" control={control} label="" />
            </ToggleOption>
          </div>
        </FormSection>

        {/* Format Options Section */}
        <FormSection
          icon={<FileType className="w-4 h-4" />}
          title={t('label-formatOptions')}
          description={t('text-pageLayoutSettings')}
          color="#00cfe8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <Input
              name="orientation"
              control={control}
              label={t('label-orientation')}
              //prepend={<Maximize2 size={16} />}
              required
              type="select"
            >
              <option value="PORTRAIT">{t('label-portrait')}</option>
              <option value="LANDSCAPE">{t('label-landscape')}</option>
            </Input>
            <Input
              name="pageType"
              control={control}
              label={t('label-pageType')}
              //prepend={<Layers size={16} />}
              required
              type="select"
            >
              <option value="A5">A5</option>
              <option value="A4">A4</option>
              <option value="A3">A3</option>
            </Input>
          </div>
        </FormSection>
      </div>

      <StickyActions>
        <div className="flex justify-end p-1">
          <Button
            type="submit"
            color="primary"
            className="flex h-[36px] shadow-lg shadow-primary/30 rounded-full px-6"
          >
            <Play size={14} className="me-2" />
            {t('label-executeReport')}
          </Button>
        </div>
      </StickyActions>
    </Form>
  )
}

export default CustomReport
