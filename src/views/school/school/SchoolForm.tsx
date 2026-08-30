import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "reactstrap";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import type {SubmitHandler} from "react-hook-form"
import dayjs from "dayjs";
import {
  School,
  FileSignature,
  MapPin,
  Phone,
  Briefcase,
  Languages,
  CheckCircle,
  Hash,
  Globe,
  Mail,
  Building2,
  Navigation,
  CreditCard,
  Building,
  Image as ImageIcon,
  Check,
  Flag,
} from "lucide-react";

import type { SchoolType } from "@/views/school/school/School.type";
import { default as FormItem } from "@/@core/components/ui/forms/input";
import DatePicker from "@/@core/components/ui/forms/date-picker";
import Switch from "@/@core/components/ui/forms/swith";
import Button from "@/@core/components/button";
import { formatError } from "@/utils/ErrorHelper";
import { schoolValidationSchema } from "@/views/school/school/school.validation";
import PhoneInput from "@/@core/components/ui/forms/phone-input";
import { INPUT_DATE_FORMAT, TOAST_OPTIONS } from "@/utils/constants";
import FormSection from "@/@core/components/ui/forms/form-section";
import ToggleOption from "@/@core/components/ui/forms/toggle-option";
import StickyActions from "@/@core/components/ui/forms/sticky-actions";

interface SchoolFormProps extends BaseFormProps {
  school: SchoolType;
}

const SchoolForm: FC<SchoolFormProps> = ({ school, action, ...props }) => {
  const { t } = useTranslation();

  const { control, handleSubmit, getValues, watch } = useForm<SchoolType>({
    mode: "onBlur",
    defaultValues: {
      name: school.name,
      name2: school.name2 || "",
      motto: school.motto || "",
      motto2: school.motto2 || "",
      schoolCode: school.schoolCode,
      schoolType: school.schoolType,
      schoolCategory: school.schoolCategory,
      shortName: school.shortName || "",
      active: school.active ?? true,
      note: school.note || "",
      logo: school.logo,
      creationDate: school.creationDate
        ? dayjs(school.creationDate).toDate()
        : null,
      studentType: school.studentType,
      registrationNumber: school.registrationNumber || "",
      webSite: school.webSite || "",
      address: {
        zipCode: school.address?.zipCode || "",
        country: school.address?.country || "",
        town: school.address?.town || "",
        state: school.address?.state || "",
        street: school.address?.street || "",
      },
      contactInfo: {
        fax: school.contactInfo?.fax || "",
        email: school.contactInfo?.email || "",
        mobile: school.contactInfo?.mobile || "",
        telephone: school.contactInfo?.telephone || "",
        postOfficeBox: school.contactInfo?.postOfficeBox || "",
      },
      legalInfo: {
        legalForm: school.legalInfo?.legalForm || "",
        shareCapital: school.legalInfo?.shareCapital || "",
        taxpayerNumber: school.legalInfo?.taxpayerNumber || "",
        tradeRegister: school.legalInfo?.tradeRegister || "",
      },
      authNumber: school.authNumber || "",
      nsifNumber: school.nsifNumber || "",
      venue: school.venue || "",
      signingAddress: school.signingAddress || "",
      bilingualName: school.bilingualName || "",
      identifier: school.identifier || "",
    },
    resolver: yupResolver(schoolValidationSchema),
  });

  const isActive = watch("active");

  const onSubmit: SubmitHandler<SchoolType> = (values) => {
    const id = Number(school.id);

    const { identifier, ...rest } = values;

    action({
      variables: {
        school: {
          ...rest,
          id,
          creationDate: values.creationDate
            ? dayjs(values.creationDate).format(INPUT_DATE_FORMAT)
            : null,
          legalInfo: {
            shareCapital:
              values.legalInfo?.shareCapital !== ""
                ? Number(values.legalInfo?.shareCapital)
                : null,
            taxpayerNumber: values.legalInfo?.taxpayerNumber,
            legalForm: values.legalInfo?.legalForm,
            tradeRegister: values.legalInfo?.tradeRegister,
          },
          authNumber: values.authNumber || null,
          nsifNumber: values.nsifNumber || null,
          venue: values.venue || null,
          signingAddress: values.signingAddress || null,
          bilingualName: values.bilingualName || null,
          logo: values.logo || null,
        },
      },
    })
      .then(async ({ data }) => {
        toast.success(`Etablissement ${data.school.name} modifié`, {
          ...TOAST_OPTIONS,
        });
      })
      .catch((error) => {
        toast.error(
          `Impossible d'enregistrer l'établissement: ${formatError(error)}`
        );
        console.log(error.message);
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
      {/* Identity & Classification Section */}
      <FormSection
        title={t("label-schoolIdentity")}
        description={t("label-schoolIdentityDesc")}
        icon={<School size={20} />}
        color="#7367f0"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
          <div className="md:col-span-4">
            <FormItem
              name="schoolCode"
              label={t("label-schoolCode")}
              placeholder={t("label-schoolCodePlaceholder")}
              control={control}
              prepend={<Hash size={14} />}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="shortName"
              label={t("label-shortName")}
              placeholder={t("label-shortNamePlaceholder")}
              control={control}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="registrationNumber"
              label={t("label-registrationNumber")}
              control={control}
            />
          </div>

          <div className="md:col-span-6">
            <FormItem
              name="name"
              label={t("label-name")}
              control={control}
              required
              prepend={<Building2 size={14} />}
            />
          </div>
          <div className="md:col-span-6">
            <FormItem name="name2" label={t("label-name2")} control={control} />
          </div>

          <div className="md:col-span-4">
            <FormItem
              name="identifier"
              label={t("label-identifier")}
              control={control}
              readOnly
            />
          </div>
          <div className="md:col-span-8">
            <FormItem
              name="bilingualName"
              label={t("label-bilingualName")}
              placeholder={t("label-bilingualNamePlaceholder")}
              control={control}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 border-t border-dashed border-gray-100 dark:border-gray-800">
          <div>
            <FormItem
              name="schoolType"
              control={control}
              type="select"
              className="mb-0"
              label={t("label-schoolType")}
              required
            >
              <option value="">{t("label-select")}</option>
              <option value="PUBLIC">{t("label-public")}</option>
              <option value="PRIVATE">{t("label-private")}</option>
            </FormItem>
          </div>

          <div>
            <FormItem
              name="schoolCategory"
              control={control}
              type="select"
              className="mb-0"
              label={t("label-schoolCategory")}
              required
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
          </div>

          <div>
            <FormItem
              name="studentType"
              control={control}
              type="select"
              className="mb-0"
              label={t("label-studentType")}
              required
            >
              <option value="">{t("label-select")}</option>
              <option value="PUPIL">{t("label-pupil") || "Ecoliers"}</option>
              <option value="STUDENT">{t("label-student") || "Elèves"}</option>
              <option value="UNIVERSITY_STUDENT">
                {t("label-universityStudent") || "Etudiants"}
              </option>
            </FormItem>
          </div>
        </div>
      </FormSection>

      {/* Mottos & Vision */}
      <FormSection
        title={t("label-schoolMottoInfo")}
        description={t("label-schoolMottoInfoDesc")}
        icon={<Languages size={20} />}
        color="#ff9f43"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormItem
            name="motto"
            label={t("label-motto")}
            control={control}
            required
            prepend={<Flag size={14} />}
          />
          <FormItem
            name="motto2"
            label={t("label-motto2")}
            control={control}
            required
            prepend={<Flag size={14} />}
          />
        </div>
      </FormSection>

      {/* Communications & Contacts */}
      <FormSection
        title={t("label-schoolContactInfo")}
        description={t("label-schoolContactInfoDesc")}
        icon={<Phone size={20} />}
        color="#28c76f"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5">
          <div className="md:col-span-8">
            <FormItem
              name="webSite"
              label={t("label-webSite")}
              placeholder={t("label-webSitePlaceholder")}
              control={control}
              prepend={<Globe size={14} />}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="contactInfo.email"
              label={t("label-email")}
              control={control}
              prepend={<Mail size={14} />}
            />
          </div>

          <div className="md:col-span-4">
            <PhoneInput
              name="contactInfo.telephone"
              label={t("label-telephone")}
              control={control}
            />
          </div>
          <div className="md:col-span-4">
            <PhoneInput
              name="contactInfo.mobile"
              label={t("label-mobileTelephone")}
              control={control}
            />
          </div>
          <div className="md:col-span-2">
            <FormItem
              name="contactInfo.fax"
              label={t("label-fax")}
              control={control}
            />
          </div>
          <div className="md:col-span-2">
            <FormItem
              name="contactInfo.postOfficeBox"
              label={t("label-postOfficeBox")}
              control={control}
            />
          </div>
        </div>
      </FormSection>

      {/* Location Section */}
      <FormSection
        title={t("label-schoolAddressInfo")}
        description={t("label-schoolAddressInfoDesc")}
        icon={<MapPin size={20} />}
        color="#00cfe8"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5">
          <div className="md:col-span-2">
            <FormItem
              name="address.zipCode"
              label={t("label-zipCode")}
              control={control}
            />
          </div>
          <div className="md:col-span-5">
            <FormItem
              name="address.country"
              label={t("label-country")}
              control={control}
            />
          </div>
          <div className="md:col-span-5">
            <FormItem
              name="address.state"
              label={t("label-state")}
              control={control}
            />
          </div>

          <div className="md:col-span-6">
            <FormItem
              name="address.town"
              label={t("label-town")}
              control={control}
              required
              prepend={<Building size={14} />}
            />
          </div>
          <div className="md:col-span-6">
            <FormItem
              name="venue"
              label={t("label-venue")}
              control={control}
              prepend={<MapPin size={14} />}
            />
          </div>

          <div className="md:col-span-12">
            <FormItem
              name="address.street"
              label={t("label-address")}
              control={control}
              prepend={<Navigation size={14} />}
            />
          </div>
          <div className="md:col-span-12">
            <FormItem
              name="signingAddress"
              label={t("label-signingAddress")}
              control={control}
            />
          </div>
        </div>
      </FormSection>

      {/* Administrative & Legal */}
      <FormSection
        title={t("label-schoolLegalInfo")}
        description={t("label-schoolLegalInfoDesc")}
        icon={<Briefcase size={20} />}
        color="#ea5455"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5">
          <div className="md:col-span-4">
            <FormItem
              name="legalInfo.legalForm"
              label={t("label-legalForm")}
              control={control}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="legalInfo.taxpayerNumber"
              label={t("label-taxPayerNumber")}
              control={control}
              prepend={<CreditCard size={14} />}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="legalInfo.tradeRegister"
              label={t("label-tradeRegister")}
              control={control}
            />
          </div>

          <div className="md:col-span-4">
            <FormItem
              name="legalInfo.shareCapital"
              label={t("label-shareCapital")}
              control={control}
              type="number"
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="authNumber"
              label={t("label-authNumber")}
              control={control}
              prepend={<FileSignature size={14} />}
            />
          </div>
          <div className="md:col-span-4">
            <FormItem
              name="nsifNumber"
              label={t("label-nsifNumber")}
              control={control}
            />
          </div>

          <div className="md:col-span-6">
            <DatePicker
              name="creationDate"
              label={t("label-creationDate")}
              control={control}
              showIcon
            />
          </div>
          <div className="md:col-span-6">
            <FormItem
              name="logo"
              label={t("label-logo")}
              control={control}
              prepend={<ImageIcon size={14} />}
            />
          </div>
        </div>
      </FormSection>

      {/* Status */}
      <FormSection>
        <ToggleOption
          icon={<CheckCircle size={20} />}
          title={t("label-active")}
          description={t("label-schoolActiveDesc")}
          isActive={isActive}
        >
          <Switch
            name="active"
            control={control}
            defaultChecked={getValues("active")}
            label=""
          />
        </ToggleOption>
      </FormSection>

      <StickyActions>
        <div className="flex justify-end">
          <Button
            loading={props.loading}
            color="primary"
            className="round text-sm flex gap-1 items-center px-2 py-1"
          >
            <Check size={16} />
            {t("label-save")}
          </Button>
        </div>
      </StickyActions>
    </Form>
  );
};

export default SchoolForm;
