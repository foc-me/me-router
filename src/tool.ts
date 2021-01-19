export function isNil(t: any): t is null | undefined {
    return t === null || t === undefined
}

export function isString(str: any): str is string {
    return typeof str === 'string'
}

export function isArray(arr: any): arr is any[] {
    return Array.isArray(arr)
}

export function isFunction(func: any): func is (...i: any) => void | any {
    return func && typeof func === 'function'
}

export function assign<T extends object>(target: T, value?: object, extend: boolean = false): T {
    if (extend) return Object.assign(target, value)
    else {
        if (isArray(target)) return Object.assign([], target, value)
        if (typeof target === 'object') return Object.assign({}, target, value)
        return Object.assign(target, value)
    }
}