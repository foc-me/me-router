export function isString(str: any): str is string {
    return typeof str === 'string'
}

export function isArray(arr: any): arr is any[] {
    return Array.isArray(arr)
}

export function isFunction(func: any): func is (...i: any) => void | any {
    return func && typeof func === 'function'
}

export function assign<T extends object>(target?: T, value?: object, extend: boolean = true): T {
    if (extend) return Object.assign(target, value) as T
    else return Object.assign({}, target, value) as T
}