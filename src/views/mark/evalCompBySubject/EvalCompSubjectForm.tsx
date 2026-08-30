import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { SubmitHandler } from 'react-hook-form'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import Button from '@/@core/components/button'
import { messageService } from '@/utils/message.service'
import { formatError } from '@/utils/ErrorHelper'
import { TOAST_OPTIONS } from '@/utils/constants'
import NestedFieldArray from '../evalComp/NestedFieldArray'
import type { EvalCompType } from '../evalComp/eval.comp.type'
import { BookOpen, Save, ClipboardList } from 'lucide-react'
import {
  FormContainer,
  Section,
} from '@/views/school/configuration/config-form-helper'
import { styled } from 'styled-components'

interface FormValues {
  items: EvalCompType[]
}

interface CompetenceFormProps extends BaseFormProps {
  competences: EvalCompType[]
  classId: number
  period: number
}

const SubjectCard = styled.div<{ $color: string }>`
  background: #ffffff;
  border: 2px solid ${({ $color }) => `${$color}30`};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    border-color: ${({ $color }) => `${$color}50`};
    box-shadow: 0 4px 12px ${({ $color }) => `${$color}20`};
    transform: translateY(-2px);
  }

  .dark-layout & {
    background: #283046;
    border-color: ${({ $color }) => `${$color}40`};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    &:hover {
      border-color: ${({ $color }) => `${$color}60`};
      box-shadow: 0 4px 12px ${({ $color }) => `${$color}30`};
    }
  }
`

const SubjectHeader = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(
    135deg,
    ${({ $color }) => `${$color}15`} 0%,
    ${({ $color }) => `${$color}08`} 100%
  );
  border-bottom: 2px solid ${({ $color }) => `${$color}20`};

  .dark-layout & {
    background: linear-gradient(
      135deg,
      ${({ $color }) => `${$color}20`} 0%,
      ${({ $color }) => `${$color}12`} 100%
    );
    border-bottom-color: ${({ $color }) => `${$color}30`};
  }
`

const SubjectIcon = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(
    135deg,
    ${({ $color }) => `${$color}25`} 0%,
    ${({ $color }) => `${$color}15`} 100%
  );
  box-shadow: 0 2px 6px ${({ $color }) => `${$color}30`};

  svg {
    color: ${({ $color }) => $color};
    filter: drop-shadow(0 2px 4px ${({ $color }) => `${$color}40`});
  }

  .dark-layout & {
    background: linear-gradient(
      135deg,
      ${({ $color }) => `${$color}30`} 0%,
      ${({ $color }) => `${$color}20`} 100%
    );
  }
`

const SubjectName = styled.span<{ $color: string }>`
  font-size: 0.9375rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
  flex: 1;
  text-shadow: 0 1px 2px ${({ $color }) => `${$color}20`};
`

const SubjectNumber = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #9ca3af;
  background: rgba(115, 103, 240, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;

  .dark-layout & {
    color: #6b7280;
    background: rgba(115, 103, 240, 0.15);
  }
`

const SubjectContent = styled.div`
  padding: 1rem 1.25rem;
`

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(168, 85, 247, 0.06) 0%,
    rgba(139, 92, 246, 0.04) 100%
  );
  border: 2px dashed rgba(168, 85, 247, 0.3);
  border-radius: 12px;
  margin: 1.5rem 0;

  .dark-layout & {
    background: linear-gradient(
      135deg,
      rgba(168, 85, 247, 0.1) 0%,
      rgba(139, 92, 246, 0.08) 100%
    );
    border-color: rgba(168, 85, 247, 0.4);
  }

  svg {
    color: #a855f7;
    filter: drop-shadow(0 4px 6px rgba(168, 85, 247, 0.3));
    margin-bottom: 1rem;
  }

  p {
    color: #6b7280;
    font-size: 0.9375rem;
    font-weight: 500;
    margin: 0;

    .dark-layout & {
      color: #9ca3af;
    }
  }
`

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  //gap: 0.75rem;
  //padding: 1.25rem 0 0 0;
  margin-top: 1.5rem;
  border-top: 2px solid rgba(115, 103, 240, 0.1);

  .dark-layout & {
    border-top-color: rgba(115, 103, 240, 0.2);
  }
`

const EvalCompSubjectForm: FC<CompetenceFormProps> = ({
  competences,
  action,
  ...props
}) => {
  const { t } = useTranslation()

  const { control, handleSubmit, register } = useForm<FormValues>({
    defaultValues: {
      items: competences,
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    const items = values.items
      .filter((item: any) => itemValid(item))
      .map((item: any) => {
        return {
          subjectId: Number(item.subjectId),
          classId: Number(item.classId),
          periodId: Number(item.periodId),
          subjectName: item.subjectName,
          items: item.items
            .filter((competence: any) => competence)
            .map((i: any) => ({
              numberOrder: Number(i.numberOrder),
              competence: i.competence,
              active: i.active,
              id: i.id,
            })),
        }
      })

    if (items.length === 0) {
      toast.error('Données invalides, rien à enregistrer')
      return
    }

    action({
      variables: {
        competences: items,
      },
    })
      .then(async ({ data }) => {
        toast.success(`Compétences enregistrées`, { ...TOAST_OPTIONS })
        document.getElementById('displayStudentName')!.innerText = ''
        messageService.sendMessage('expectedCompetence', true)
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer les compétences : ${formatError(error)}`,
        )
      })
  }

  const itemValid = (item: EvalCompType) => {
    const { items } = item
    return items.filter((competence: any) => competence).length > 0
  }

  const { fields } = useFieldArray({ control, name: 'items' })

  // Color palette for subject badges
  const subjectColors = [
    { bg: '#7367f0', light: '#7367f022' },
    { bg: '#28c76f', light: '#28c76f22' },
    { bg: '#ff9f43', light: '#ff9f4322' },
    { bg: '#00cfe8', light: '#00cfe822' },
    { bg: '#ea5455', light: '#ea545522' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContainer>
        <Section>
          {/* Subject Competences List */}
          {fields.length > 0 ? (
            <div>
              {fields.map((field, index) => {
                const colorIndex = index % subjectColors.length
                const color = subjectColors[colorIndex]

                return (
                  <SubjectCard key={field.id} $color={color.bg}>
                    <SubjectHeader $color={color.bg}>
                      <SubjectIcon $color={color.bg}>
                        <BookOpen size={18} />
                      </SubjectIcon>
                      <SubjectName $color={color.bg}>
                        {field.subjectName}
                      </SubjectName>
                      <SubjectNumber>#{index + 1}</SubjectNumber>
                    </SubjectHeader>

                    <SubjectContent>
                      <NestedFieldArray
                        nestIndex={index}
                        control={control}
                        register={register}
                      />
                    </SubjectContent>
                  </SubjectCard>
                )
              })}
            </div>
          ) : (
            <EmptyStateContainer>
              <ClipboardList size={48} />
              <p>{t('label-noSubjects') || 'Aucune matière disponible'}</p>
            </EmptyStateContainer>
          )}
        </Section>
      </FormContainer>

      {/* Submit Button */}
      <ActionBar className="py-1 !pr-5">
        <Button
          loading={props.loading}
          color="primary"
          className="round flex items-center gap-2"
        >
          <Save size={16} />
          {t('label-save')}
        </Button>
      </ActionBar>
    </form>
  )
}

export default EvalCompSubjectForm
