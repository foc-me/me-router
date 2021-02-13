import { fixParam, isParam } from './match'
import Route from './route'
import /* Route, */{ RouterContext } from './router'
import { MatchResult } from './store'
import { assign, isNil } from './tool'

function run(fn: () => void) {
    setTimeout(fn)
}

function inMatchStores(target: Route, stores: MatchResult<Route>) {
    if (stores.length < 1) return false
    for (const routes of stores) {
        if (routes.length < 1) continue
        for (const route of routes) {
            if (route && route.route === target.route) return true
        }
    }
    return false
}

function toRemove(current: RouterContext, next: RouterContext) {
    if (!current || current.stores.length < 1) return

    current.stores.forEach(routes => {
        run(() => {
            routes.forEach(route => {
                if (!route) return
                if (next && inMatchStores(route, next.stores)) route.onHide()
                else route.onRemove()
            })
        })
    })
}

function toView(next: RouterContext) {
    if (!next || next.stores.length < 1) return

    const { keys, stores } = next
    stores.forEach(routes => {
        const check = [1, 2].includes(routes.length - keys.length)
        if (routes.length < 1 || !check) return

        run(() => {
            routes.reduce((context, route, i) => {
                if (route) {
                    if (isParam(route.route) && !isNil(keys[i - 1])) {
                        context = assign(context, {
                            [fixParam(route.route)]: keys[i - 1]
                        }, true)
                    }
                    route.onMatch(context)
                    if (i === routes.length - 1) route.onView(context)
                }
                return context
            }, {})
        })
    })
}

function execute(current: RouterContext, next: RouterContext) {
    run(() => { toRemove(current, next) })
    run(() => { toView(next) })
}

export default { execute }