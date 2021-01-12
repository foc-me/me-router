import Store, { RegisterParam } from '../src/store'
import { testStore } from './store.test'

type TestStoreRegisterType = RegisterParam<number, { a: number }>

const len = 10

function makeStoreOption(index: number = len) {
    let start = 1
    let res: TestStoreRegisterType = {
        key: start,
        store: { a: start }
    }
    let next = res

    while (start < index - 1) {
        start++
        next.children = [
            { key: start, store: { a: start } }
        ]
        next = next.children[0]
    }

    return res
}

function optionStore() {
    let storeOptions = makeStoreOption()
    let store = new Store(0, { a: 0 })
    store.registerAll(storeOptions)
    return store
}

testStore(optionStore(), len)