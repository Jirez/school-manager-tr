// ** Menu Components Imports
import HorizontalNavMenuLink from './HorizontalNavMenuLink'
import HorizontalNavMenuGroup from './HorizontalNavMenuGroup'
import {
  canViewMenuGroup,
  canViewMenuItem,
  resolveHorizontalNavMenuItemComponent as resolveNavItemComponent,
} from '@/@core/layouts/utils'

const HorizontalNavMenuItems = (props: any) => {
  // ** Components Object
  const Components = {
    HorizontalNavMenuGroup,
    HorizontalNavMenuLink,
  }

  // ** Render Nav Items
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
    // return <TagName item={item} index={index} key={item.id} {...props} />
    return (
      canViewMenuItem(item) && (
        <TagName item={item} index={index} key={item.id} {...props} />
      )
    )
  })

  return RenderNavItems
}

export default HorizontalNavMenuItems
