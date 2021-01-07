type RouteOptions = {
    defaults: Record<string, any>
}

type actionKeys = 'beforeView' | 'toView' | 'afterView' | 'beforeRemov' | 'toRemove' | 'afterRemove'
type RouteActions = Record<actionKeys, () => void>

type RouteProps = Partial<RouteOptions & RouteActions>

interface IRouteItem {
    route: string,
    options: Partial<RouteOptions>,
    actions: Partial<RouteActions>
}

export default class Router {}