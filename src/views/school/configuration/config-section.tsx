import type { FC, ReactNode } from 'react'
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ConfigCard,
  EditButton,
  HeaderLeft,
  IconWrapper,
  TitleSection,
} from './configuration.style'
import { Pencil, X } from 'lucide-react'
import ConfigurationUpdate from './ConfigurationUpdate'

// Configuration Section Component
interface ConfigSectionProps {
  title: string
  description: string
  icon: ReactNode
  iconColor?: string
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  editForm: ReactNode
  displayContent: ReactNode
}

const ConfigSection: FC<ConfigSectionProps> = ({
  title,
  description,
  icon,
  iconColor,
  isEditing,
  onEdit,
  onCancel,
  editForm,
  displayContent,
}) => {
  return (
    <ConfigCard>
      <CardHeader $isEditing={isEditing}>
        <HeaderLeft>
          <IconWrapper $color={iconColor}>{icon}</IconWrapper>
          <TitleSection>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </TitleSection>
        </HeaderLeft>
        <EditButton
          $isEditing={isEditing}
          onClick={isEditing ? onCancel : onEdit}
        >
          {isEditing ? (
            <>
              <X size={16} />
              Annuler
            </>
          ) : (
            <>
              <Pencil size={16} />
              Modifier
            </>
          )}
        </EditButton>
      </CardHeader>
      <CardContent>
        {isEditing ? <ConfigurationUpdate form={editForm} /> : displayContent}
      </CardContent>
    </ConfigCard>
  )
}

export default ConfigSection
