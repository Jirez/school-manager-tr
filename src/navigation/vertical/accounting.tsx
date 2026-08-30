// ** Icons Import
import { Circle } from "react-feather";
import { Calculator } from "lucide-react";
import NavIcon from "./NavIcon";

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN
export default [
  {
    id: "accounting",
    title: "sidebar.accounting",
    icon: <NavIcon icon={<Calculator size={14} />} color="#28c76f" />,
    meta: {
      resource: "config",
    },
    children: [
      {
        id: "models",
        title: "sidebar.accounting.models",
        icon: <Circle size={12} />,
        navLink: "/models",
      },
      {
        id: "logCodes",
        title: "sidebar.accounting.codes",
        icon: <Circle size={12} />,
        navLink: "/log-codes",
      },
      {
        id: "accounts",
        title: "sidebar.accounting.chartOfAccount",
        icon: <Circle size={12} />,
        navLink: "/accounts",
      },
      {
        id: "journal",
        title: "sidebar.accounting.journal",
        icon: <Circle size={12} />,
        navLink: "/journal",
      },
      {
        id: "special-accounts",
        title: "sidebar.settings",
        icon: <Circle size={12} />,
        navLink: "/special-accounts",
      },
    ],
  },
];
