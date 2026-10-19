import { useForm } from 'react-hook-form'
import type { InitSchoolType } from './init.school.type'
import { yupResolver } from '@hookform/resolvers/yup'
import { initSchoolValidation } from './init.school.validation'
import Button from '@/@core/components/button'
import { useInitSchoolMutation } from '@/gql/graphql'
import { toast } from 'react-toastify'
import { LOGIN, TOAST_OPTIONS } from '@/utils/constants'
import { useNavigate } from '@tanstack/react-router'
import {
  Building2,
  User,
  Lock,
  Save,
  List,
  Phone,
  UserCircle,
  X,
  EyeOff,
  Eye,
} from 'lucide-react'
import FormSection from '@/@core/components/ui/forms/form-section'
import { default as FormItem } from '@/@core/components/ui/forms/input'
import StickyActions from '@/@core/components/ui/forms/sticky-actions'
import { useState } from 'react'
import { m } from '@/paraglide/messages'

const InitSchoolForm = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { handleSubmit, control } = useForm<InitSchoolType>({
    defaultValues: {
      administratorName: '',
      schoolName: '',
      username: '',
      password: '',
      administratorNumber: '',
      confirm: '',
      schoolCategory: '',
    },
    resolver: yupResolver(initSchoolValidation) as any,
  })

  const [save, { loading }] = useInitSchoolMutation()

  const onSubmit = (e: any) => {
    e.preventDefault()

    return handleSubmit(async (values) => {
      save({
        variables: {
          input: {
            administratorNumber: values.administratorNumber,
            administratorName: values.administratorName,
            schoolName: values.schoolName,
            password: values.password,
            username: values.username,
            schoolCategory: values.schoolCategory,
          },
        },
      })
        .then(() => {
          toast.success('Enregistrement effectué', { ...TOAST_OPTIONS })
          navigate({ to: LOGIN })
        })
        .catch((error) => {
          toast.error('Une erreur est survenue')
        })
    })(e)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection
        icon={<Building2 className="w-5 h-5" />}
        title={m.label_schoolInformation()}
        description={
          m.label_initializeSchoolDescription() ||
          'Configuration de base de votre établissement'
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-1">
          <FormItem
            type="select"
            name="schoolCategory"
            control={control}
            label={m.label_category()}
            required
            prepend={<List size={16} />}
            className="col-span-2"
          >
            <option value="">{m.label_select()}</option>
            <option value="PRIMARY_SCHOOL">{m.label_primarySchool()}</option>
            <option value="ENGLISH_PRIMARY_SCHOOL">
              {m.label_englishPrimarySchool()}
            </option>
            <option value="BILINGUAL_PRIMARY_SCHOOL">
              {m.label_bilingualPrimarySchool()}
            </option>
            <option value="HIGH_SCHOOL">{m.label_highSchool()}</option>
            <option value="ENGLISH_HIGH_SCHOOL">
              {m.label_englishHighSchool()}
            </option>
            <option value="BILINGUAL_HIGH_SCHOOL">
              {m.label_bilingualHighSchool()}
            </option>
            <option value="CETIC">CETIC</option>
            <option value="TECHNICAL_HIGH_SCHOOL">
              {m.label_technicalHighSchool()}
            </option>
            <option value="COLLEGE">{m.label_college()}</option>
            <option value="ENIEG">{m.label_enieg()}</option>
            <option value="UNIVERSITY">{m.label_university()}</option>
          </FormItem>

          <FormItem
            name="schoolName"
            label={m.label_schoolName()}
            control={control}
            required={true}
            prepend={<Building2 size={16} />}
            className="col-span-3"
          />
        </div>
      </FormSection>

      <FormSection
        icon={<UserCircle className="w-5 h-5" />}
        title={m.label_administratorInformation()}
        description={m.label_administratorInfoDesc()}
        color="#28c76f"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-1">
          <FormItem
            name="administratorNumber"
            label={m.label_registrationNumber()}
            control={control}
            required={true}
            prepend={<Phone size={16} />}
            className="col-span-2"
          />

          <FormItem
            name="administratorName"
            label={m.label_administratorName()}
            control={control}
            required={true}
            prepend={<User size={16} />}
            className="col-span-3"
          />
        </div>
      </FormSection>

      <FormSection
        icon={<Lock className="w-5 h-5" />}
        title={m.label_accountCredentials()}
        description={m.label_loginInfoDesc()}
        color="#ea5455"
      >
        <div className="space-y-2">
          <FormItem
            name="username"
            label={m.label_username()}
            control={control}
            required={true}
            prepend={<User size={16} />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <FormItem
              type={showPassword ? 'text' : 'password'}
              name="password"
              label={m.label_password()}
              control={control}
              required={true}
              prepend={<Lock size={16} />}
              append={
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </span>
              }
            />

            <FormItem
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirm"
              label={m.label_confirm()}
              control={control}
              required={true}
              prepend={<Lock size={16} />}
              append={
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </span>
              }
            />
          </div>
        </div>
      </FormSection>

      <StickyActions>
        <div className="flex justify-between items-center py-1">
          <Button
            type="button"
            color="secondary"
            outline
            loading={loading}
            className="round flex items-center gap-1 px-2 text-sm"
            onClick={() => navigate({ to: '/login' })}
          >
            <X size={15} />
            {m.label_cancel()}
          </Button>

          <Button
            type="submit"
            color="primary"
            loading={loading}
            className="round flex items-center gap-1 px-2 shadow-primary text-sm"
          >
            <Save size={15} />
            {m.label_save()}
          </Button>
        </div>
      </StickyActions>
    </form>
  )
}

export default InitSchoolForm
