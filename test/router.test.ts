import { Router } from '../src/router'
import { modifyEnv, EnvStatus } from '../src/tool'

const end = modifyEnv(EnvStatus.test)

test('match \'\'', () => {
    const router = new Router()
    const matchedStore: Promise<string>[] = []

    router.register('', {
        defaults: { a: 'a' },
        toView: option => {
            expect(option).toEqual({ a: 'a' })
            matchedStore.push(Promise.resolve('/ toView'))
        }
    })

    router.goTo('')
    Promise.all<string>(matchedStore).then(res => {
        expect(res.length).toBe(0)
        expect(res[0]).toBe(undefined)
    }).catch(error => { console.log(error) })
})

test('match \'/\'', () => {
    const router = new Router()
    const matchedStore: Promise<string>[] = []

    router.register('/', {
        defaults: { a: 'a' },
        toView: option => {
            expect(option).toEqual({ a: 'a' })
            matchedStore.push(Promise.resolve('/ toView'))
        }
    })

    router.goTo('/')
    Promise.all<string>(matchedStore).then(res => {
        expect(res.length).toBe(1)
        expect(res[0]).toBe('/ toView')
    }).catch(error => { console.log(error) })
})

test('match \'/a\'', () => {
    const router = new Router()
    let matchedStore: Promise<string>[] = []

    router.register('/', {
        toView: option => {
            expect(option).toEqual({})
            matchedStore.push(Promise.resolve('/ toView'))
        }
    })
    router.register('/a', {
        defaults: { a: 'a' },
        toView: option => {
            expect(option).toEqual({ a: 'a' })
            matchedStore.push(Promise.resolve('/a toView'))
        }
    })

    router.goTo('/a')
    Promise.all<string>(matchedStore).then(res => {
        expect(res.length).toBe(1)
        expect(res[0]).toBe('/a toView')
    }).catch(error => { console.log(error) })
})

test('match \'/:a\'', () => {
    const router = new Router()
    const matchedStore: Promise<string>[] = []

    router.register('/', {
        toView: option => {
            expect(option).toEqual({})
            matchedStore.push(Promise.resolve('/ toView'))
        }
    })
    router.register('/a', {
        defaults: { a: 'a' },
        toView: option => {
            expect(option).toEqual({ a: 'a' })
            matchedStore.push(Promise.resolve('/a toView'))
        }
    })
    router.register('/:a', {
        toView: option => {
            expect(option).toEqual({ a: '1' })
            matchedStore.push(Promise.resolve('/:a -> 1 toView'))
        }
    })

    router.goTo('/1')
    Promise.all<string>(matchedStore).then(res => {
        expect(res.length).toBe(1)
        expect(res[0]).toBe('/:a -> 1 toView')
    }).catch(error => { console.log(error) })
})

test('match \'/a/b\'', () => {
    const router = new Router()
    const matchedStore: Promise<string>[] = []

    router.register('/a', {
        defaults: { a: 'a' },
        toView: option => {
            expect(option).toEqual({ a: 'a' })
            matchedStore.push(Promise.resolve('/a toView'))
        }
    })
    router.register('/a/b', {
        defaults: { b: 'b' },
        toView: option => {
            expect(option).toEqual({ a: 'a', b: 'b' })
            matchedStore.push(Promise.resolve('/a/b toView'))
        }
    })

    router.goTo('/a/b')
    Promise.all<string>(matchedStore).then(res => {
        expect(res.length).toBe(2)
        expect(res[0]).toBe('/a toView')
        expect(res[1]).toBe('/a/b toView')
    }).catch(error => { console.log(error) })
})

test('match \'/a/:b/:c\'', () => {
    const router = new Router()
    const matchedStore: Promise<string>[] = []

    router.register('/a', {
        defaults: { a: 'a' },
        toView: option => {
            expect(option).toEqual({ a: 'a' })
            matchedStore.push(Promise.resolve('/a toView'))
        }
    })
    router.register('/a/:b', {
        toView: option => {
            expect(option).toEqual({ a: 'a', b: '1' })
            matchedStore.push(Promise.resolve('/a/:b -> 1 toView'))
        }
    })
    router.register('/a/:b/:c', {
        toView: option => {
            expect(option).toEqual({ a: 'a', b: '1', c: '2' })
            matchedStore.push(Promise.resolve('/a/:b -> 1/:c -> 2 toView'))
        }
    })

    router.goTo('/a/1/2')
    Promise.all<string>(matchedStore).then(res => {
        expect(res.length).toBe(3)
        expect(res[0]).toBe('/a toView')
        expect(res[1]).toBe('/a/:b -> 1 toView')
        expect(res[2]).toBe('/a/:b -> 1/:c -> 2 toView')
    }).catch(error => { console.log(error) })
})

end()