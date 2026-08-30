// ** Icons Import
import { BarChart3 } from "lucide-react";
import NavIcon from "./NavIcon";

export default [
  {
    id: "reports",
    title: "sidebar.reports",
    icon: <NavIcon icon={<BarChart3 size={14} />} color="#00cfe8" />,
    navLink: "/reports",
    meta: {
      resource: "report",
    },
  },
];
