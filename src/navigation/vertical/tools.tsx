// ** Icons Import
import { Circle } from "react-feather";
import { Wrench } from "lucide-react";
import NavIcon from "./NavIcon";

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN
export default [
  {
    id: "tools",
    title: "sidebar.tools",
    icon: <NavIcon icon={<Wrench size={14} />} color="#82868b" />,
    meta: {
      resource: "config",
    },
    children: [
      {
        id: "databaseBackup",
        title: "sidebar.tools.databaseBackup",
        icon: <Circle size={12} />,
        navLink: "/database-backup",
      },
      {
        id: "configuration",
        title: "sidebar.tools.configuration",
        icon: <Circle size={12} />,
        navLink: "/configuration",
      },
    ],
  },
];
