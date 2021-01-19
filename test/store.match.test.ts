import Store, { RegisterParam } from '../src/store'

type TestStore = { a: number }
type RegisterType = RegisterParam<number, { a: number }>

const matchStoreConfig: RegisterType[] = [
    {
        key: 1,
        store: { a: 1 },
        children: [
            {
                key: 1,
                children: [
                    { key: 1, store: { a: 3 } }
                ]
            }
        ]
    },
    {
        key: 2,
        children: [
            { key: 2, store: { a: 2 } },
            { key: 3, store: { a: 3 } },
            { key: 4, store: { a: 4 } },
            { key: 5, store: { a: 5 } }
        ]
    },
    {
        key: 3,
        store: { a: 3 },
        children: [
            {
                key: 3,
                store: { a: 3 },
                children: [
                    { key: 3, store: { a: 6 } },
                    { key: 4, store: { a: 7 } },
                ]
            },
            {
                key: 4,
                store: { a: 4 },
                children: [
                    {
                        key: 4,
                        store: { a: 8 },
                        children: [
                            { key: 4, store: { a: 9 } }
                        ]
                    }
                ]
            },
            { key: 5, store: { a: 5 } }
        ]
    }
]

function makeMatchStore(config?: RegisterType[]) {
    const store = new Store(0, { a: 0 })

    if (config) store.registerAll(config)
    else {
        store.register(1, { a: 1 }).register(1).register(1, { a: 3 })
        
        const second = store.register(2)
        second.register(2, { a: 2 })
        second.register(3, { a: 3 })
        second.register(4, { a: 5 })
        second.register(5, { a: 6 })

        const third = store.register(3, { a: 3 })
        const forth = third.register(3, { a: 3 })
        const fifth = third.register(4, { a: 4 })
        third.register(5, { a: 5 })

        forth.register(3, { a: 6 })
        forth.register(4, { a: 7 })

        fifth.register(4, { a: 8 }).register(4, { a: 9 })
    }

    return store
}

function testMatchStore(store: Store<number, TestStore>) {
    test('count next should be 0', () => {
        expect(store.countNext()).toBe(0)
    })
    test('count children should be 3', () => {
        expect(store.countChildren()).toBe(3)
    })

    test('match 1', () => {
        const result = store.match([1])
        expect(result.length).toBe(1)
        expect(result[0].length).toBe(2)
        expect(result[0][0]).toEqual({ a: 0 })
        expect(result[0][1]).toEqual({ a: 1 })
    })
    test('match 2', () => {
        const result = store.match([2])
        expect(result.length).toBe(0)
    })
    test('match 3', () => {
        const result = store.match([3])
        expect(result.length).toBe(1)
        expect(result[0].length).toBe(2)
        expect(result[0][0]).toEqual({ a: 0 })
        expect(result[0][1]).toEqual({ a: 3 })
    })
    test('match [1, 1]', () => {
        const result = store.match([1, 1])
        expect(result.length).toBe(0)
    })
    test('match [1, 1, 1]', () => {
        const result = store.match([1, 1, 1])
        expect(result.length).toBe(1)
        expect(result[0].length).toBe(4)
        expect(result[0][0]).toEqual({ a: 0 })
        expect(result[0][1]).toEqual({ a: 1 })
        expect(result[0][2]).toEqual(null)
        expect(result[0][3]).toEqual({ a: 3 })
    })
}

testMatchStore(makeMatchStore())
testMatchStore(makeMatchStore(matchStoreConfig))