import { assign, isArray, isNil } from './tool'

export interface IStoreItem<K = string, T = any> {
    key: K
    store: T
    register(key: K, store?: T): IStoreItem<K, T>
    match(key: K | K[]): IStoreItem<K, T>[]
}

function defaultStep<T = any>(target: T, key: T): boolean {
    return target === key
}

export enum MatchMode {
    first = 'first',
    all = 'all'
}
export enum MatchMethodMode {
    current = 'current',
    all = 'all'
}

export type StoreOption = Partial<{
    matchMode: MatchMode
    matchMethod: ((...index: any) => boolean)[]
    matchMethodMode: MatchMethodMode
}>

const defaultStoreOption: StoreOption = {
    matchMode: MatchMode.all,
    matchMethod: assign([defaultStep]),
    matchMethodMode: MatchMethodMode.all
}

export type RegisterParam<K = string, T = any> = {
    key: K
    store?: T
    option?: object
    children?: RegisterParam<K, T>[]
}

export default class Store<K = string, T = any> {

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

    private matchStore(paths: K | K[]): Store<K, T>[][] {
        if (!this.child) return []
        if (!isArray(paths)) return this.matchStore([paths])

        const path = paths.shift()
        if (!path) return []

        const result: Store<K, T>[][] = []
        const { matchMode, matchMethod = [defaultStep] } = this.option

        let child = this.child
        while (child) {
            let match = matchMethod.reduce((res, next) => {
                return res ? res : next(path, child.key)
            }, false)
            if (match) {
                if (paths.length > 0) {
                    const res = child.matchStore(assign(paths))
                    if (res.length < 1) match = false
                    else {
                        if (matchMode === MatchMode.first) {
                            result.push([this, ...res[0]])
                        } else {
                            result.push(...res.map(r => [this, ...r]))
                        }
                    }
                }
                else {
                    if (isNil(child.store)) match = false
                    else result.push([this, child])
                }

                if (matchMode === MatchMode.first && match) break
            }

            if (child.next) child = child.next
            else break
        }

        return result
    }

    public match(paths: K | K[]): (T | null)[][] {
        if (!isArray(paths)) return this.match([paths])
        const result = this.matchStore(paths)
        return result.map(res => res.map(store => store.store))
    }

    public override(store?: any, option?: StoreOption) {
        this.store = store
        this.option = assign(defaultStoreOption, option)
    }

    public registerAll(options: RegisterParam<K, T> | RegisterParam<K, T>[]) {
        if (isArray(options)) {
            options.forEach(option => {
                this.registerAll(option)
            })
        } else {
            const { key, store, option, children } = options
            const next = this.register(key, store, option)
            if (next && children && children.length > 0) {
                next.registerAll(children)
            }
        }
        return this
    }

    public register(key: K, store?: any, option?: StoreOption) {
        if (isNil(key)) throw new TypeError('key can not be null or undefined')

        const { matchMethod, matchMethodMode } = this.option
        if (matchMethodMode === MatchMethodMode.all && matchMethod && matchMethod.length > 0) {
            if (option) {
                if (!option.matchMethod || option.matchMethod.length < 1) {
                    option.matchMethod = assign(matchMethod)
                }
            } else {
                option = { matchMethod: assign(matchMethod) }
            }
        }

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

    public append(store: Store<K, T>) {
        if (!this.lastChild) {
            this.child = store
            this.lastChild = store
        } else {
            let child = this.child
            while (child) {
                if (child.key === store.key) {
                    child.override(store.store, store.option)
                    break
                }

                if (child.next) child = child
                else {
                    this.lastChild.next = store
                    this.lastChild = this.lastChild.next
                    break
                }
            }
        }
    }

    public countNext(): number {
        if (!this.next) return 0
        return this.next.countNext() + 1
    }

    public countChildren(): number {
        if (!this.child) return 0
        return this.child.countNext() + 1
    }
}