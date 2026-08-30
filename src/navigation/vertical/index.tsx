// ** Navigation imports
import dashboard from '@/navigation/vertical/dashboard'
import school from '@/navigation/vertical/school'
import subjects from '@/navigation/vertical/subjects'
import students from '@/navigation/vertical/students'
import personnel from '@/navigation/vertical/personnel'
import planning from '@/navigation/vertical/planning'
// import payment from "@navigation/vertical/payment";
import payrolls from '@/navigation/vertical/payrolls'
import discipline from '@/navigation/vertical/discipline'
import marks from '@/navigation/vertical/marks'
// import messages from "@navigation/vertical/messages";
import accounting from '@/navigation/vertical/accounting'
import reports from '@/navigation/vertical/reports'
import users from '@/navigation/vertical/users'
import tools from '@/navigation/vertical/tools'
import dataExport from '@/navigation/vertical/export'
import primary from './primary'
import bank from './bank'
import sale from './sale'
import expense from './expense'

// ** Merge & Export
export default [
  ...dashboard,
  ...school,
  ...subjects,
  ...students,
  ...personnel,
  ...planning,
  // ...payment,
  ...discipline,
  ...marks,
  ...primary,
  // ...messages,
  ...accounting,
  ...payrolls,
  ...bank,
  ...sale,
  ...expense,
  ...dataExport,
  ...reports,
  ...users,
  ...tools,
]
