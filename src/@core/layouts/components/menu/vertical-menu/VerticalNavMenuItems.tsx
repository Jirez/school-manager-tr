// ** Vertical Menu Components
import VerticalNavMenuLink from './VerticalNavMenuLink'
import VerticalNavMenuGroup from './VerticalNavMenuGroup'
import VerticalNavMenuSectionHeader from './VerticalNavMenuSectionHeader'

// ** Utils
import {
  canViewMenuItem,
  canViewMenuGroup,
  resolveVerticalNavMenuItemComponent as resolveNavItemComponent,
} from '@/@core/layouts/utils'

const VerticalMenuNavItems = (props: any) => {
  // ** Components Object
  const Components = {
    VerticalNavMenuLink,
    VerticalNavMenuGroup,
    VerticalNavMenuSectionHeader,
  }

  // ** Render Nav Menu Items
  const RenderNavItems = props.items.map((item: any, index: number) => {
    const TagName = Components[resolveNavItemComponent(item)]
    if (item.children) {
      // return <TagName item={item} index={index} key={item.id} {...props} />
      return (
        canViewMenuGroup(item) && (
          <TagName item={item} index={index} key={item.id} {...props} />
        )
      )
    }
    // return <TagName key={item.id || item.header} item={item} {...props} />
    return (
      canViewMenuItem(item) && (
        <TagName key={item.id || item.header} item={item} {...props} />
      )
    )
  })

  return RenderNavItems
}

export default VerticalMenuNavItems
