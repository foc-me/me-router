import { assign, isFunction } from './tool'
import Store, { RegisterParam, matchStep } from './store'

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

export class Router {
    private option: RouterOption
    private store: Store

    constructor(options?: RouterOption) {
        this.store = new Store('main')
        this.option = assign(defaultRouterOption, options)
        if (this.option.matchMethod && this.option.matchMethod.length > 0) {
            Store.applyMathSteps(this.option.matchMethod)
        }
    }

    public registerAll(options: RegisterParam<string, any> | RegisterParam<string, any>[]) {
        return this.store.registerAll(options)
    }

    public register(path: string, actions?: object, option?: object) {
        return this.store.register(path, actions, option)
    }

    public match(path: string[]) {
        const { beforeMatch, afterMatch, finishMatch } = this.option
        if (falseFunction(beforeMatch)) return
        const results = Store.match(path, this.store)
        const matchKeys = results.map(res => res.key)
        if (falseFunction(afterMatch, matchKeys)) return
        // results.forEach(res => { })
        if (isFunction(finishMatch)) finishMatch()
    }
}