import { pick, assign, isFunction } from './tool'

type OptionKeys = 'defaults'
type RouteOptions = {
    defaults: Record<string | number, any>
}

const optionKeys = ['defaults']

type ActionKeys = 'beforeView' | 'toView' | 'afterView' | 'beforeRemov' | 'toRemove' | 'afterRemove'
type RouteActions = Record<ActionKeys, (...i: any) => void>

const actionKeys = ['beforeView', 'toView', 'afterView', 'beforeRemov', 'toRemove', 'afterRemove']

export type RouteProps = Partial<RouteOptions & RouteActions>

export interface IRouteItem {
    route: string,
    options: Partial<RouteOptions>,
    actions: Partial<RouteActions>
}

function isParam(path: string): boolean {
    return path.indexOf(':') === 0
}
function fixParam(path: string): string {
    return path.indexOf(':') === 0 ? path.substr(1) : path
}

function isAllMatch(path: string) {
    return path === '*' || path === '**'
}

export const matchMethod = [
    (target: string, key: string) => target === key,
    (target: string, key: string) => isParam(key),
    (target: string, key: string) => isAllMatch(key)
]

export function action(paths: string[], matchs: (Route | null)[][]) {
    if (matchs.length > 0) {
        matchs.forEach(routes => {
            const deviation = routes.length - paths.length
            if (deviation < 0 || deviation > 1) return

            let params: any = {}
            let result: any

            routes.forEach((route, i) => {
                if (!route) return

                const path = i < 1 ? route.route : paths[i - deviation]
                const { defaults } = route.options
                const {
                    beforeView,
                    toView,
                    afterView,
                    beforeRemov,
                    toRemove,
                    afterRemove
                } = route.actions

                if (isParam(route.route)) {
                    params[fixParam(route.route)] = path
                }

                if (isFunction(beforeView)) {
                    params = beforeView(assign(params, defaults))
                } else {
                    params = assign(params, defaults)
                }
                if (isFunction(toView)) toView(params)
                if (isFunction(afterView)) afterView(params)
                if (isFunction(beforeRemov)) result = beforeRemov(params)
                if (isFunction(toRemove)) toRemove(result)
                if (isFunction(afterRemove)) afterRemove(result)
            })
        })
    }
}

export default class Route {

    public static action = action

    public route: string
    public options: Pick<RouteProps, OptionKeys>
    public actions: Pick<RouteProps, ActionKeys>
    constructor(route: string, option: RouteProps) {
        this.route = route
        this.options = pick(optionKeys, option)
        this.actions = pick(actionKeys, option)
    }
}