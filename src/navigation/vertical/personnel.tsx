// ** Icons Import
import { UserCog } from "lucide-react";
import NavIcon from "./NavIcon";

// ** Roles allowed "ROLE_ADMIN", "ROLE_SUPER_ADMIN"

export default [
  {
    id: "personnel",
    title: "sidebar.personnel",
    icon: <NavIcon icon={<UserCog size={14} />} color="#ea5455" />,
    navLink: "/personnel",
    badgeText: 2,
    badgeColor: "orange",
    meta: {
      resource: "teacher",
    },
  },
];
