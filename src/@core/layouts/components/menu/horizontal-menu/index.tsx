// ** Horizontal Menu Components
import HorizontalNavMenuItems from './HorizontalNavMenuItems'

const HorizontalMenu = ({ menuData }: any) => {
    return (
        <div className='navbar-container main-menu-content'>
            <ul className='nav navbar-nav' id='main-menu-navigation'>
                <HorizontalNavMenuItems submenu={false} items={menuData} />
            </ul>
        </div>
    )
}

export default HorizontalMenu
