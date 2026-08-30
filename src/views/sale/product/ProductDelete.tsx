import { useAbility } from '@/context/Can'
import ArticleDelete from '../article/ArticleDelete'
import ServiceDelete from '../service/ServiceDelete'
import TuitionDelete from '../tuition/TuitionDelete'

const ProductDelete = (props: any) => {
  const ability = useAbility()

  if (props.type === 'ARTICLE' && ability.can('delete', 'config')) {
    return <ArticleDelete {...props} />
  } else if (props.type === 'SERVICE' && ability.can('delete', 'config')) {
    return <ServiceDelete {...props} />
  } else if (props.type === 'TUITION' && ability.can('delete', 'config')) {
    return <TuitionDelete {...props} />
  }

  return <span />
}

export default ProductDelete
