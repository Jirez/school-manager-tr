export type FooterType = "static" | "sticky" | "hidden"
export type SkinType = "light" | "dark" | "bordered" | "semi-dark"
export type RouterTransitionType = "fadeIn" | "fadeInLeft" | "zoomIn"
export type LayoutType = "vertical" | "horizontal"
export type ContentWidthType = "boxed" | "full"
export type NavbarType = "static" | "sticky" | "floating" | "hidden"

export interface ThemeConfigType {
    app: {
        appName: string
        appLogoImage: string
    }
    layout: {
        isRTL: boolean
        skin: SkinType
        routerTransition: RouterTransitionType
        type: LayoutType
        contentWidth: ContentWidthType
        menu: {
            isHidden: boolean
            isCollapsed: boolean
        }
        navbar: {
            type: NavbarType
            backgroundColor: string
        }
        footer: {
            type: FooterType
        }
        customizer: boolean
        scrollTop: boolean
    }
}

export type TConfiguration = {
    serverAddress: string
    serverPort: number
    pictureServer: string
    httpProtocol: string
    wsProtocol: string
    apachePort: string
    picturePath: string
    uploadDir: string
    timeout: number
    schoolCategory: "HIGH" | "PRIMARY"
}