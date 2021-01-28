import { assign, isFunction, isNil, pick } from './tool'
import Store, { StoreOption } from './store'
import Route, { RouteProps, matchMethod } from './route'
import { push, replace, go, getLocation, checkHistory } from './history'

const routerOptionKeys = ['urlCheck', 'beforeMatch', 'afterMatch', 'finishMatch']

export type RouterOption = Partial<{
    urlCheck: RegExp | ((...i: any) => boolean)
    beforeMatch: () => void
    afterMatch: () => void
    finishMatch: () => void
} & RouteProps & StoreOption>

const defaultRouterOption: RouterOption = {}

function checkUrl(methods: RegExp | ((url: string) => boolean), url: string): boolean {
    if (!url) url = getLocation().href || ''
    if (typeof methods === 'function') return methods(url)
    else return methods.test(url)
}

function splitUrl(url: string = ''): string[] {
    if (!url || typeof url !== 'string') return []

    url = url.trim()
    return url.indexOf('/') === 0 ? url.split('/').slice(1) : url.split('/')
}

export class Router {
    private option: RouterOption
    private store: Store<string, Route>

    constructor(options?: RouterOption) {
        this.store = new Store<string, Route>('main', null, { matchMethod })
        this.option = assign(defaultRouterOption, pick(routerOptionKeys, options))
    }

    private match(path?: string) {
        const {
            urlCheck,
            beforeMatch,
            afterMatch,
            finishMatch
        } = this.option

        const { href = '', pathname = '' } = getLocation()
        if (urlCheck && !checkUrl(urlCheck, path || href)) return

        path = path || pathname
        const parts = splitUrl(path)
        if (isFunction(beforeMatch)) beforeMatch()
        const result = this.store.match(parts)
        if (isFunction(afterMatch)) afterMatch()

        if (result.length > 0) {
            Route.action(parts, result)
        }
        if (isFunction(finishMatch)) finishMatch()
    }

    public pushState(path: string, state?: any, title?: string) {
        if (checkHistory()) push(path, state, title)
        this.match(path)
    }
    public replaceState(path: string, state?: any, title?: string) {
        if (checkHistory()) replace(path, state, title)
        this.match(path)
    }
    public goTo(path?: string | number, state?: any, title?: string) {
        if (typeof path === 'number') go(path)
        else this.pushState(path || '', state, title)
    }

    public register(path: string, options?: RouteProps) {
        const parts = splitUrl(path)
        const last = parts.pop()
        let store = this.store

        for (const key of parts) {
            if (!isNil(key)) store = store.register(key)
        }

        if (typeof last === 'string') {
            const item = options ? new Route(last, options) : undefined
            store.register(last, item)
        }
    }
}