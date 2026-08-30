import { useTranslation } from 'react-i18next'
import { Heart, Calendar, Code } from 'react-feather'
import { useAuthentication } from '@/hooks/useAuthentication'
import config from '../../../../../package.json'
import { useSchoolYearActiveQuery } from '@/gql/graphql'

const Footer = () => {
  const { enterpriseId } = useAuthentication()
  const { t } = useTranslation()
  const { data, loading } = useSchoolYearActiveQuery({
    variables: { schoolId: enterpriseId },
  })

  return (
    <footer className="footer flex flex-wrap0 items-center justify-between gap-0 text-xs md:text-sm text-gray-500 dark:text-gray-400">
      {/* Left Section - Copyright */}
      <div className="flex items-center gap-1">
        <span>© {new Date().getFullYear()}</span>
        <a
          href="https://facebook.com/epstechnologies"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline transition-colors"
        >
          NeemaDev
        </a>
        <span className="d-none d-sm-inline">·</span>
        <span className="d-none d-sm-inline text-gray-400 dark:text-gray-500">
          {t('label-allRightsReserved')}
        </span>
      </div>

      {/* Right Section - Info */}
      <div className="flex items-center gap-3">
        {/* Active School Year */}
        {!loading && data?.schoolYear?.label && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            <Calendar size={12} />
            <span className="font-medium">{data.schoolYear.label}</span>
          </div>
        )}

        {/* Version */}
        <div className="d-none d-sm-inline flex items-center gap-1.5 px-1 md:px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <Code size={12} className="d-none d-sm-inline" />
          <span className="font-medium">v{config.version}</span>
        </div>

        {/* Made with love - hidden on mobile */}
        <div className="d-none d-md-flex items-center gap-1 text-gray-400 dark:text-gray-500">
          <span>Made with</span>
          <Heart size={12} className="text-red-400 fill-red-400" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
