import Store, { RegisterParam, MatchMethodMode } from '../src/store'

type MatchStore = { a: number }
type RegisterType = RegisterParam<number, MatchStore>

const matchStoreConfig: RegisterType[] = [
    {
        key: 1,
        store: { a: 1 },
        children: [
            { key: 3, store: { a: 3 } }
        ]
    },
    {
        key: 3,
        store: { a: 3 },
        children: [
            { key: 3, store: { a: 3 } },
            { key: 6, store: { a: 6 } },
            { key: 9, store: { a: 9 } }
        ]
    },
    {
        key: 6,
        store: { a: 6 },
        children: [
            { key: 3, store: { a: 3 } },
            { key: 6, store: { a: 6 } },
            { key: 9, store: { a: 9 } }
        ]
    }
]

const matchMethod = [
    (target: number, key: number) => target > key
]

const reduceCallback = (res: number, next: MatchStore | null) => {
    return next ? res + next.a : res
}

function testMatch() {
    const store = new Store<number, MatchStore>(0, { a: 0 }, { matchMethod })
    store.registerAll(matchStoreConfig)

    test('[1, 3] will be not matched', () => {
        expect(store.match([1, 3]).length).toBe(0)
    })
    test('[2, 3] will be not matched', () => {
        expect(store.match([2, 3]).length).toBe(0)
    })
    test('[2, 4] will match 1', () => {
        const result = store.match([2, 4])
        expect(result.length).toBe(1)
        expect(result[0].length).toBe(3)
        const reduce = result[0].reduce(reduceCallback, 0)
        expect(reduce).toBe(4)
    })


    test('[4, 3] will be not matched', () => {
        expect(store.match([4, 3]).length).toBe(0)
    })
    test('[4, 4] will match 2', () => {
        const result = store.match([4, 4])
        expect(result.length).toBe(2)
        expect(result[0].length).toBe(3)
        expect(result[1].length).toBe(3)
        expect(result[0].reduce(reduceCallback, 0)).toBe(4)
        expect(result[1].reduce(reduceCallback, 0)).toBe(6)
    })


    test('[6, 3] will be not matched', () => {
        expect(store.match([6, 3]).length).toBe(0)
    })
    test('[6, 7] will match 5', () => {
        const result = store.match([6, 7])
        expect(result.length).toBe(3)
        expect(result[0].length).toBe(3)
        expect(result[1].length).toBe(3)
        expect(result[2].length).toBe(3)
        expect(result[0].reduce(reduceCallback, 0)).toBe(4)
        expect(result[1].reduce(reduceCallback, 0)).toBe(6)
        expect(result[2].reduce(reduceCallback, 0)).toBe(9)
    })

    test('[9, 7] will match 5', () => {
        const result = store.match([9, 7])
        expect(result.length).toBe(5)
        expect(result[0].length).toBe(3)
        expect(result[1].length).toBe(3)
        expect(result[2].length).toBe(3)
        expect(result[3].length).toBe(3)
        expect(result[4].length).toBe(3)
        expect(result[0].reduce(reduceCallback, 0)).toBe(4)
        expect(result[1].reduce(reduceCallback, 0)).toBe(6)
        expect(result[2].reduce(reduceCallback, 0)).toBe(9)
        expect(result[3].reduce(reduceCallback, 0)).toBe(9)
        expect(result[4].reduce(reduceCallback, 0)).toBe(12)
    })
    test('[9, 10] will match all', () => {
        const result = store.match([9, 10])
        expect(result.length).toBe(7)
        expect(result[0].length).toBe(3)
        expect(result[1].length).toBe(3)
        expect(result[2].length).toBe(3)
        expect(result[3].length).toBe(3)
        expect(result[4].length).toBe(3)
        expect(result[5].length).toBe(3)
        expect(result[6].length).toBe(3)
        expect(result[0].reduce(reduceCallback, 0)).toBe(4)
        expect(result[1].reduce(reduceCallback, 0)).toBe(6)
        expect(result[2].reduce(reduceCallback, 0)).toBe(9)
        expect(result[3].reduce(reduceCallback, 0)).toBe(12)
        expect(result[4].reduce(reduceCallback, 0)).toBe(9)
        expect(result[5].reduce(reduceCallback, 0)).toBe(12)
        expect(result[6].reduce(reduceCallback, 0)).toBe(15)
    })
}

testMatch()