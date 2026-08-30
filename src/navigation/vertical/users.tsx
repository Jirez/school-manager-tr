// ** Icons Import
import { UserCog } from "lucide-react";
import NavIcon from "./NavIcon";

export default [
  {
    id: "users",
    title: "sidebar.users",
    icon: <NavIcon icon={<UserCog size={14} />} color="#7367f0" />,
    navLink: "/users",
    meta: {
      resource: "user",
    },
  },
];
