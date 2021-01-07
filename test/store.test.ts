import Store from '../src/store'

function arrayStore() {
    let store = new Store(0, { a: 0 })
    let next = store
    for (let i = 1; i < 10; i++) {
        next = next.register(i, { a: i })
    }
    let count = 1
    next = store

    while (true) {
        if (!next || count >= 10) break
        const result = next.match(count)
    
        test('should only have one child', () => {
            expect(result.length).toBe(1)
        })

        next = result[0]
        if (next) {
            (function(_nextStore, _count){
                test('match store', () => {
                    expect(_nextStore).toEqual({ a: _count })
                })
            })(next.store, count)

            count++
        } else break
    }
    
    test('count stores', () => {
        expect(count).toBe(10)
    })
}

function treeStore() {
    
}

arrayStore()
treeStore()