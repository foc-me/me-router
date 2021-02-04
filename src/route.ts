import { pick, assign, isFunction } from './tool'

type OptionKeys = 'defaults'
type RouteOptions = {
    defaults: Record<string | number, any>
}

const optionKeys = [
    'defaults'
]

type ActionKeys = // 'beforeMatch' |
    'toMatch' |
    // 'afterMatch' |
    // 'beforeView' |
    'toView' |
    // 'afterView' |
    // 'beforeRemov' |
    'toRemove' // |
    // 'afterRemove'

type RouteActions = Record<ActionKeys, (...i: any) => void | any>

const actionKeys = [
    // 'beforeMatch',
    'toMatch',
    // 'afterMatch',
    // 'beforeView',
    'toView',
    // 'afterView',
    // 'beforeRemov',
    'toRemove' // ,
    // 'afterRemove'
]

export type RouteProps = Partial<RouteOptions & RouteActions>

export interface IRouteItem {
    route: string,
    options: Partial<RouteOptions>,
    actions: Partial<RouteActions>
}

type RouteContext = null | Record<string | number, any>

export enum RouteStatus {
    onInit = 'onInit',
    onReady = 'onReady',
    onMatch = 'onMatch',
    onView = 'onView'
}

export default class Route {

    public status: RouteStatus = RouteStatus.onInit
    public route: string
    public options: Pick<RouteProps, OptionKeys>
    public actions: Pick<RouteProps, ActionKeys>

    private context: RouteContext = null

    constructor(route: string, option: object) {
        this.route = route
        this.options = pick(optionKeys, option)
        this.actions = pick(actionKeys, option)

        this.resetContext()
    }

    private resetContext() {
        this.status = RouteStatus.onReady
        this.context = assign(this.options.defaults || {})
    }

    public onMatch(option?: any) {
        const { toMatch } = this.actions

        if (this.status === RouteStatus.onReady && isFunction(toMatch)) {
            this.context = toMatch(assign(this.context || {}, option)) || {}
        }

        this.status = RouteStatus.onMatch
    }

    public onView(option?: any) {
        const { toView } = this.actions

        if (this.status === RouteStatus.onMatch && isFunction(toView)) {
            this.context = toView(assign(this.context || {}, option)) || {}
        }

        this.status = RouteStatus.onView
    }

    public onRemove(option?: any) {
        const { toRemove } = this.actions

        if (this.status === RouteStatus.onView && isFunction(toRemove)) {
            this.context = toRemove(assign(this.context || {}, option)) || {}
        }

        this.resetContext()
    }
}