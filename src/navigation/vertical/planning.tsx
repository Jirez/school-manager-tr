// ** Icons Import
import { Circle } from "react-feather";
import { Calendar } from "lucide-react";
import NavIcon from "./NavIcon";

// ** Roles Allowed : ROLE_SUPER_ADMIN, ROLE_AMIN
export default [
  {
    id: "planning",
    title: "sidebar.planning",
    icon: <NavIcon icon={<Calendar size={14} />} color="#00cfe8" />,
    meta: {
      resource: "planning",
    },
    children: [
      {
        id: "distribution",
        title: "sidebar.planning.distribution",
        icon: <Circle size={12} />,
        navLink: "/distribution",
      },
      {
        id: "timeSlots",
        title: "sidebar.planning.timeSlots",
        icon: <Circle size={12} />,
        navLink: "/time-slots",
      },
      {
        id: "dayOfClass",
        title: "sidebar.planning.dayOfClasses",
        icon: <Circle size={12} />,
        navLink: "/day-of-classes",
      },
      {
        id: "timeTable",
        title: "sidebar.planning.timeTables",
        icon: <Circle size={12} />,
        navLink: "/time-tables",
      },
    ],
  },
];
