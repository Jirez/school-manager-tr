import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { InitSchoolType } from "./init.school.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { initSchoolValidation } from "./init.school.validation";
import Button from "@/@core/components/button";
import { useInitSchoolMutation } from "@/gql/graphql";
import { toast } from "react-toastify";
import { LOGIN, TOAST_OPTIONS } from "@/utils/constants";
import { useNavigate } from "@tanstack/react-router";
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
} from "lucide-react";
import FormSection from "@/@core/components/ui/forms/form-section";
import { default as FormItem } from "@/@core/components/ui/forms/input";
import StickyActions from "@/@core/components/ui/forms/sticky-actions";
import { useState } from "react";

const InitSchoolForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { handleSubmit, control } = useForm<InitSchoolType>({
    defaultValues: {
      administratorName: "",
      schoolName: "",
      username: "",
      password: "",
      administratorNumber: "",
      confirm: "",
      schoolCategory: "",
    },
    resolver: yupResolver(initSchoolValidation) as any,
  });

  const [save, { loading }] = useInitSchoolMutation();

  const onSubmit = (e: any) => {
    e.preventDefault();

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
          toast.success("Enregistrement effectué", { ...TOAST_OPTIONS });
          navigate({to: LOGIN});
        })
        .catch((error) => {
          toast.error("Une erreur est survenue");
        });
    })(e);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection
        icon={<Building2 className="w-5 h-5" />}
        title={t("label-schoolInformation") || "Informations de l'école"}
        description={
          t("label-initializeSchoolDescription") ||
          "Configuration de base de votre établissement"
        }
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-1">
          <FormItem
            type="select"
            name="schoolCategory"
            control={control}
            label={t("label-schoolCategory")}
            required
            prepend={<List size={16} />}
            className="col-span-2"
          >
            <option value="">{t("label-select")}</option>
            <option value="PRIMARY_SCHOOL">{t("label-primarySchool")}</option>
            <option value="ENGLISH_PRIMARY_SCHOOL">
              {t("label-englishPrimarySchool")}
            </option>
            <option value="BILINGUAL_PRIMARY_SCHOOL">
              {t("label-bilingualPrimarySchool")}
            </option>
            <option value="HIGH_SCHOOL">{t("label-highSchool")}</option>
            <option value="ENGLISH_HIGH_SCHOOL">
              {t("label-englishHighSchool")}
            </option>
            <option value="BILINGUAL_HIGH_SCHOOL">
              {t("label-bilingualHighSchool")}
            </option>
            <option value="CETIC">CETIC</option>
            <option value="TECHNICAL_HIGH_SCHOOL">
              {t("label-technicalHighSchool")}
            </option>
            <option value="COLLEGE">{t("label-college")}</option>
            <option value="UNIVERSITY">{t("label-university")}</option>
          </FormItem>

          <FormItem
            name="schoolName"
            label={t("label-schoolName")}
            control={control}
            required={true}
            prepend={<Building2 size={16} />}
            className="col-span-3"
          />
        </div>
      </FormSection>

      <FormSection
        icon={<UserCircle className="w-5 h-5" />}
        title={
          t("label-administratorInformation") ||
          "Informations de l'administrateur"
        }
        description={
          t("label-administratorInfoDesc") || "Responsable principal du système"
        }
        color="#28c76f"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-1">
          <FormItem
            name="administratorNumber"
            label={t("label-registrationNumber")}
            control={control}
            required={true}
            prepend={<Phone size={16} />}
            className="col-span-2"
          />

          <FormItem
            name="administratorName"
            label={t("label-administratorName")}
            control={control}
            required={true}
            prepend={<User size={16} />}
            className="col-span-3"
          />
        </div>
      </FormSection>

      <FormSection
        icon={<Lock className="w-5 h-5" />}
        title={t("label-accountCredentials") || "Identifiants du compte"}
        description={
          t("label-loginInfoDesc") || "Informations de connexion sécurisée"
        }
        color="#ea5455"
      >
        <div className="space-y-2">
          <FormItem
            name="username"
            label={t("label-username")}
            control={control}
            required={true}
            prepend={<User size={16} />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            <FormItem
              type={showPassword ? "text" : "password"}
              name="password"
              label={t("label-password")}
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
              type={showConfirmPassword ? "text" : "password"}
              name="confirm"
              label={t("label-confirm")}
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
            onClick={() => navigate({to: LOGIN})}
          >
            <X size={15} />
            {t("label-cancel")}
          </Button>

          <Button
            type="submit"
            color="primary"
            loading={loading}
            className="round flex items-center gap-1 px-2 shadow-primary text-sm"
          >
            <Save size={15} />
            {t("label-save")}
          </Button>
        </div>
      </StickyActions>
    </form>
  );
};

export default InitSchoolForm;
