import { assign, isArray } from './tool'

export interface IStoreItem<K = string, T = any> {
    key: K
    store: T
    register(key: K, store?: T): IStoreItem<K, T>
    match(key: K | K[]): IStoreItem<K, T>[]
}

export type StoreOption = Partial<{
    switch: boolean,
    matchMethod: (() => void)[]
}>

const defaultStoreOption: StoreOption = {
    switch: false
}

export type matchStep<T = any> = (key: T, target: T) => boolean

const defaultStep: matchStep = (key, target) => key === target

export type registerParam<K = string, T = any> = {
    key: K
    store?: T
    option?: object
    children?: registerParam<K, T>[]
}

export default class Store<K = string, T = any> {

    static matchSteps: matchStep[] = [defaultStep]

    static applyMathSteps<T = string>(steps: matchStep<T>[]): void {
        Store.matchSteps = steps
    }

    static register<K = string, T = any>(target: Store<K, T>, options: registerParam<K, T> | registerParam<K, T>[]): Store<K, T> {
        if (isArray(options)) {
            options.forEach(option => {
                Store.register(target, option)
            })
        } else {
            const { key, store, option, children } = options
            const next = target.register(key, store, option)
            if (children && children.length > 0) {
                Store.register(next, children)
            }
        }
        return target
    }

    static match<K = string, T = any>(paths: K[], target: Store<K, T>, steps: matchStep<K>[] = Store.matchSteps): Store<K, T>[] {
        if (paths.length < 1) return []

        const matchs = [target]
        let key = paths.shift()
        while (matchs.length > 0 && key) {

            key = paths.shift()
        }
        return matchs
    }

    public key: K
    public store: T | null
    private option: StoreOption
    private next: Store<K, T> | null
    private child: Store<K, T> | null
    private lastChild: Store<K, T> | null

    constructor(key: K, store?: T, option?: StoreOption) {
        this.store = store || null
        this.option = assign(defaultStoreOption, option)

        this.key = key
        this.next =  null
        this.child = null
        this.lastChild = null
    }

    private mathWithSteps(key: K, method: matchStep<K> = defaultStep): Store<K, T>[] {
        const result: Store<K, T>[] = []
        let child = this.child
        while (child) {
            if (method(key, child.key)) result.push(child)
            child = child.next
        }
        return result
    }

    public override(store?: any, option?: StoreOption) {
        this.store = store
        this.option = assign(defaultStoreOption, option)
    }

    public registerAll(options: registerParam<K, T> | registerParam<K, T>[]) {
        return Store.register<K, T>(this, options)
    }

    public register(key: K, store?: any, option?: StoreOption) {
        let child = this.child
        while (child) {
            if (defaultStep(key, child.key)) break
            child = child.next
        }

        if (child) {
            child.override(store, option)
        } else {
            child = new Store<K, T>(key, store, option)
            if (this.lastChild) {
                this.lastChild.next = child
                this.lastChild = child
            }
            else {
                this.child = child
                this.lastChild = child
            }
        }
        return child
    }

    public matchAll(path: K, steps = [defaultStep]): (Store<K, T>[])[] {
        const result = []
        for (const step of steps) {
            result.push(this.mathWithSteps(path, step))
        }
        return result
    }

    public match(path: K, steps = [defaultStep]): Store<K, T>[] {
        for (const step of steps) {
            const result = this.mathWithSteps(path, step)
            if (result.length > 0) return result
        }
        return []
    }
}