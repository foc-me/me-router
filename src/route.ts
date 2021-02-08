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
    'toRemove' |
    // 'afterRemove' |
    // 'beforeHide |
    'toHide' // |
    // 'afterHide', |

type RouteActions = Record<ActionKeys, (context: any) => any>

const actionKeys = [
    // 'beforeMatch',
    'toMatch',
    // 'afterMatch',
    // 'beforeView',
    'toView',
    // 'afterView',
    // 'beforeRemov',
    'toRemove',
    // 'afterRemove',
    // 'beforeHide',
    'toHide' // ,
    // 'afterHide'
]

export type RouteProps = Partial<RouteOptions & RouteActions>

export interface IRouteItem {
    route: string,
    options: Partial<RouteOptions>,
    actions: Partial<RouteActions>
}

type RouteContext = Partial<{
    params: {}
}>

export enum RouteStatus {
    onInit = 'onInit',
    onReady = 'onReady',
    onMatch = 'onMatch',
    onView = 'onView',
    onHide = 'onHide'
}

export default class Route {

    public status: RouteStatus = RouteStatus.onInit
    public route: string
    public options: Pick<RouteProps, OptionKeys>
    public actions: Pick<RouteProps, ActionKeys>

    private context: RouteContext = {}

    constructor(route: string, option: object) {
        this.route = route
        this.options = pick(optionKeys, option)
        this.actions = pick(actionKeys, option)

        this.resetContext()
    }

    private resetContext() {
        this.context = { params: this.options.defaults || {} }
        this.setStatus(RouteStatus.onReady)
    }

    private setStatus(status: RouteStatus) {
        this.status = status
    }

    private toAction(status: RouteStatus | boolean, action: any, option?: any) {
        if (!status) return
        if ((this.status || this.status === status) && isFunction(action)) {
            const params = assign(this.context.params || {}, option)
            const context = assign(this.context, { params })
            this.context = assign(this.context, action(context))
        }
    }

    public onMatch(option?: any) {
        this.toAction(RouteStatus.onReady, this.actions.toMatch, option)
        this.setStatus(RouteStatus.onMatch)
    }

    public onView(option?: any) {
        this.toAction(RouteStatus.onMatch, this.actions.toView, option)
        this.setStatus(RouteStatus.onView)
    }

    public onHide() {
        this.toAction(RouteStatus.onView, this.actions.toHide)
        this.setStatus(RouteStatus.onMatch)
    }

    public onRemove() {
        const { toHide, toRemove } = this.actions
        this.onHide()
        this.toAction(RouteStatus.onMatch, toHide)
        if (isFunction(toRemove)) {
            this.context = assign(this.context, toRemove(assign(this.context)))
        }

        this.resetContext()
    }
}