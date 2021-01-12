import Store from '../src/store'

type TestStoreStoreType = { a: number }
type TestStoreType = Store<number, TestStoreStoreType>

function checkStore(_next: TestStoreType, _count: number, last: boolean){
    const _store = _next.store
    test('match store', () => {
        expect(_store).toEqual({ a: _count })
        expect(_next.countNext()).toEqual(0)
        expect(_next.countChildren()).toEqual(last ? 0 : 1)
    })
}

export function testStore(store: TestStoreType, len: number = 10) {
    let next = store
    for (let i = 1; i < len; i++) {
        next = next.register(i, { a: i })
    }
    let count = 1
    next = store

    while (true) {
        if (!next || count >= len) break
        const result = next.match(count)
    
        test('should only have one matched', () => {
            expect(result.length).toBe(1)
        })

        if (result.length > 0) {
            next = result[0]
            checkStore(next, count, count === len - 1)
            count++
        } else break
    }
    
    test('count stores', () => {
        expect(count).toBe(len)
    })
}

testStore(new Store(0, { a: 0 }))