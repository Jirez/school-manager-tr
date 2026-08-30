// ** Icons Import
import { Circle } from "react-feather";
import { Landmark } from "lucide-react";
import NavIcon from "./NavIcon";

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN
export default [
  {
    id: "bank",
    title: "sidebar.bank",
    icon: <NavIcon icon={<Landmark size={14} />} color="#7367f0" />,
    meta: {
      resource: "config",
    },
    children: [
      {
        id: "accounts",
        title: "sidebar.bank.accounts",
        icon: <Circle size={12} />,
        navLink: "/bank-accounts",
      },
      {
        id: "transactions",
        title: "sidebar.bank.transactions",
        icon: <Circle size={12} />,
        navLink: "/bank-transactions",
      },
    ],
  },
];
