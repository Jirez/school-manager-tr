import { Card, CardBody } from "reactstrap";
import InitSchoolForm from "./init-school-form";
import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

const InitSchool = () => {
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-2"
      style={{
        background:
          "linear-gradient(135deg, rgba(115, 103, 240, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)",
      }}
    >
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-2"
            style={{
              background: "linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)",
              boxShadow: "0 8px 24px rgba(115, 103, 240, 0.3)",
            }}
          >
            <Building2 size={32} className="text-white" />
          </motion.div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {t("label-initializeSchool") || "Initialisation de l'école"}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("label-initializeSchoolDescription") ||
              "Configurez les informations de base de votre établissement"}
          </p>
        </div>

        {/* Form Card */}
        <Card
          className="border-0 shadow-lg"
          style={{
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <CardBody className="p-2 md:p-6 bg-white dark:bg-gray-800">
            <InitSchoolForm />
          </CardBody>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("label-setupNote") ||
              "Assurez-vous de remplir tous les champs requis"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InitSchool;
