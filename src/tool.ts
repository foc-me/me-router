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

export function pick<T extends object>(keys: string[], target: Record<string | number, any> = {}): T {
    const result: Record<string | number, any> = {}

    for (const key of Object.keys(target)) {
        if (key && keys.includes(key)) {
            if (typeof target[key] === 'object') {
                result[key] = assign(target[key])
            } else result[key] = target[key]
        }
    }

    return result as T
}

export function assign<T extends object>(target: T, value?: object, extend: boolean = false): T {
    if (!extend) {
        if (isArray(target)) return Object.assign([], target, value)
        if (typeof target === 'object') return Object.assign({}, target, value)
    }
    return Object.assign(target, value)
}

export enum EnvStatus {
    test = 'test'
}

export function modifyEnv(status: string) {
    const nev = process.env.NODE_ENV
    process.env.NODE_ENV = status
    return () => {
        process.env.NODE_ENV = nev
    }
}

// export function makeHash(str: string): number {
//     let hash = 0
//     for (let i = 0; i < str.length; i++) {
//       let chr   = str.charCodeAt(i);
//       hash  = ((hash << 5) - hash) + chr;
//       hash |= 0;
//     }
//     return hash;
// }