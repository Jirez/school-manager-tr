import { useSkin } from '@/hooks/useSkin'
import { Moon, Sun } from 'react-feather'

const ThemeToggler = () => {
  // ** Hooks
  const { skin, setSkin } = useSkin()

  if (skin === 'dark') {
    return <Sun className="ficon" onClick={() => setSkin('light')} />
  } else {
    return <Moon className="ficon" onClick={() => setSkin('dark')} />
  }
}

export default ThemeToggler
