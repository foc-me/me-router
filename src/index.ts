import { assign, isFunction } from './tool'
import Store, { registerParam, matchStep } from './store'

const store = new Store('main')

function falseFunction(func: any, params?: any): boolean {
    return isFunction(func) && func(params) === false
}

export type RouterOption = Partial<{
    mode: string
    matchMethod: matchStep<string>[]
    beforeMatch: () => void
    afterMatch: () => void
    finishMatch: () => void
}>

const defaultRouterOption: RouterOption = {
    mode: 'nomal'
}

export default class Router {
    static register(): Store {
        return store
    }
    // static goTo(path: string): void {}

    option: RouterOption

    constructor(options?: RouterOption) {
        this.option = assign(defaultRouterOption, options)
        if (this.option.matchMethod && this.option.matchMethod.length > 0) {
            Store.applyMathSteps(this.option.matchMethod)
        }
    }

    public registerAll(options: registerParam<string, any> | registerParam<string, any>[]) {
        return store.registerAll(options)
    }

    public register(path: string, actions?: object, option?: object) {
        return store.register(path, actions, option)
    }

    public match(path: string[]) {
        const { beforeMatch, afterMatch, finishMatch } = this.option
        if (falseFunction(beforeMatch)) return
        const results = Store.match(path, store)
        const matchKeys = results.map(res => res.key)
        if (falseFunction(afterMatch, matchKeys)) return
        // results.forEach(res => { })
        if (isFunction(finishMatch)) finishMatch()
    }
}