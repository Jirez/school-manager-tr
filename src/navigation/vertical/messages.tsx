// ** Icons Import
import { MdMessage } from "react-icons/md"

// ** Roles allowed ROLE_SUPER_ADMIN

export default [
    {
        id: 'global-sms',
        title: 'sidebar.school.globalSms',
        icon: <MdMessage size={20} />,
        navLink: '/global-sms',
        meta: {
            resource: 'config'
        },
    },
]
