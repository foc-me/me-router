enum PushType {
    go = 'go',
    forward = 'forward',
    back = 'back',
    pushState = 'pushState',
    replaceState = 'replaceState'
}

type StateOption = {
    url: string
    title?: string
    state?: any
}

export function checkLocation(): boolean | string {
    if (process.env.NODE_ENV === 'test') return true

    if (!window) return 'can\'t find window object'
    if (!window.location) return 'can\'t find window.location'

    return true
}

export function getLocation(): Partial<Location> {
    if (process.env.NODE_ENV === 'test') return {}

    const error = checkHistory()
    if (typeof error === 'string') throw new Error(error)

    return window.location
}

export function checkHistory(): true | string {
    if (process.env.NODE_ENV === 'test') return true

    if (!window) return 'can\'t find window object'
    if (!window.history) return 'can\'t find window.history'
    if (!window.history.pushState || !window.history.replaceState) {
        return 'browser don\'t support html5 history api'
    }

    return true
}

function goTo(fn: PushType | number, option?: StateOption): void {
    if (process.env.NODE_ENV === 'test') return

    const error = checkHistory()
    if (typeof error === 'string') throw new Error(error)

    if (typeof fn === 'number') window.history.go(fn)
    else {
        const { url, title = '', state } = option || {}
        switch (fn) {
            case PushType.pushState:
                window.history.pushState(state, title, url)
                break
            case PushType.replaceState:
                window.history.replaceState(state, title, url)
                break
            default: break
        }
        if (title && document) document.title = title
    }
}

export function go(url: string | number, state?: any, title?: string): void {
    if (typeof url === 'number') return goTo(url)
    else return push(url, state, title)
}

export function forward(): void {
    return go(1)
}

export function back(): void {
    return go(-1)
}

export function push(url: string, state?: any, title?: string): void {
    return goTo(PushType.pushState, { url, title, state })
}

export function replace(url: string, state?: any, title?: string): void {
    return goTo(PushType.replaceState, { url, title, state })
}