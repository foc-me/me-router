export function isIgnoreParam(path: string): boolean {
    return path.indexOf('?:') === 0
}

export function fixIgnoreParam(path: string): string {
    return isIgnoreParam(path) ? path.substr(1) : path
}

export function isParam(path: string): boolean {
    return path.indexOf(':') === 0
}

export function fixParam(path: string): string {
    return isParam(path) ? path.substr(1) : path
}

export function isAllMatch(path: string) {
    return path === '*' || path === '**'
}

function matchKey(target: string, key: string) {
    return target === key
}

function matchParam(target: string, key: string) {
    return isParam(key)
}

function matchAll(target: string, key: string) {
    return isAllMatch(key)
}

export default [
    matchKey,
    matchParam,
    matchAll
]