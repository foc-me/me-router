import Store, { RegisterParam } from '../src/store'

type TestStore = { a: number }
type RegisterType = RegisterParam<number, { a: number }>

const countStoreConfig: RegisterType[] = [
    { key: 1, store: { a: 2 } },
    {
        key: 2,
        store: { a: 3 },
        children: [
            { key: 3, store: { a: 3 } }
        ]
    }
]
function makeCountStore(config?: RegisterType[]) {
    const store = new Store(0, { a: 0 })

    if (config) store.registerAll(config)
    else {
        store.register(1, { a: 1 })
        store.register(1, { a: 2 })
        store.register(2, { a: 1 })
        store.register(2, { a: 2 }).register(3, { a: 3 })
        store.register(2, { a: 3 })
    }

    return store
}
function countTestStore(store: Store<number, TestStore>) {
    test('count next should be 0', () => {
        expect(store.countNext()).toBe(0)
    })
    test('count children should be 2', () => {
        expect(store.countChildren()).toBe(2)
    })
    test('length of matched should be 1', () => {
        const match = store.match([2, 3])
        expect(match.length).toBe(1)
        expect(match[0].length).toBe(3)
        expect(match[0][0]).toEqual({ a: 0 })
        expect(match[0][1]).toEqual({ a: 3 })
        expect(match[0][2]).toEqual({ a: 3 })
    })
}

countTestStore(makeCountStore())
countTestStore(makeCountStore(countStoreConfig))