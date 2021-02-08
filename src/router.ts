import { assign, isFunction, isNil, pick } from './tool'
import Store, { StoreOption, MatchResult } from './store'
import matchMethod from './match'
import Route, { RouteProps } from './route'
import Controller from './controller'
import { push, replace, go, getLocation, checkHistory } from './history'

export type RouterContext = {
    keys: string[],
    stores: MatchResult<Route>
} | null

export type RouterOption = Partial<{
    baseUrl: string
    urlCheck: RegExp | ((...i: any) => boolean)
    beforeMatch: () => void
    afterMatch: () => void
    finishMatch: () => void
} & RouteProps & StoreOption>

const routerOptionKeys = ['baseUrl', 'urlCheck', 'beforeMatch', 'afterMatch', 'finishMatch']

const defaultRouterOption = {}

function checkUrl(methods: RegExp | ((url: string) => boolean), url: string): boolean {
    if (!url) url = getLocation().href || ''
    if (typeof methods === 'function') return methods(url)
    else return methods.test(url)
}

function checkBaseUrl(baseUrl: string) {
    if (!baseUrl || typeof baseUrl !== 'string') return ''

    const chars = baseUrl.trim().split('')
    if (chars[0] !== '/') chars.unshift('/')
    if (chars[chars.length - 1] === '/') chars.pop()
    return chars.join('')
}

function splitUrl(url: string = '', baseUrl: string = ''): string[] {
    if (!url || typeof url !== 'string') return []

    url = url.trim()
    return url.indexOf('/') === 0 ? url.split('/').slice(1) : url.split('/')
}

export default class Router {

    private option: RouterOption
    private store: Store<string, Route>
    private context: RouterContext = null

    constructor(options?: RouterOption) {
        if (options && options.baseUrl) {
            options.baseUrl = checkBaseUrl(options.baseUrl)
        }
        this.option = assign(defaultRouterOption, pick(routerOptionKeys, options))

        const baseUrl = this.option.baseUrl || ''
        const baseRoute = new Route(baseUrl, options || {})
        this.store = new Store<string, Route>(baseUrl, baseRoute, { matchMethod })

        if (!this.context && window) {
            window.addEventListener('popstate', () => {
                this.match()
            })
            window.addEventListener('load', () => {
                this.match()
            })
        }
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
        if (parts.length < 1) return

        if (isFunction(beforeMatch)) beforeMatch()
        const result = this.store.match(parts)
        if (isFunction(afterMatch)) afterMatch()

        const next = { keys: parts, stores: result }
        Controller.execute(this.context, next)
        this.context = next

        if (isFunction(finishMatch)) finishMatch()
    }

    public pushState(path: string, state?: any, title?: string) {
        if (checkHistory()) {
            const { baseUrl = '' } = this.option
            push(baseUrl + path, state, title)
        }
        this.match(path)
    }
    public replaceState(path: string, state?: any, title?: string) {
        if (checkHistory()) {
            const { baseUrl = '' } = this.option
            replace(baseUrl + path, state, title)
        }
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