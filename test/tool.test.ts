import { isString, isArray } from '../src/tool'

const arr = [null, undefined, 0, 1, true, {}, [], '', '1']

arr.forEach((va, i) => {
    switch (i) {
        case 0:
            test(`${va} is not string`, () => {
                expect(isString(va)).toBe(false)
            })
            test(`${va} is not array`, () => {
                expect(isArray(va)).toBe(false)
            })
            break
        case 1:
            test(`${va} is not string`, () => {
                expect(isString(va)).toBe(false)
            })
            test(`${va} is not array`, () => {
                expect(isArray(va)).toBe(false)
            })
            break
        case 2:
            test(`${va} is not string`, () => {
                expect(isString(va)).toBe(false)
            })
            test(`${va} is not array`, () => {
                expect(isArray(va)).toBe(false)
            })
            break
        case 3:
            test(`${va} is not string`, () => {
                expect(isString(va)).toBe(false)
            })
            test(`${va} is not array`, () => {
                expect(isArray(va)).toBe(false)
            })
            break
        case 4:
            test(`${va} is not string`, () => {
                expect(isString(va)).toBe(false)
            })
            test(`${va} is not array`, () => {
                expect(isArray(va)).toBe(false)
            })
            break
        case 5:
            test(`${va} is not string`, () => {
                expect(isString(va)).toBe(false)
            })
            test(`${va} is not array`, () => {
                expect(isArray(va)).toBe(false)
            })
            break
        case 6:
            test(`${va} is not string`, () => {
                expect(isString(va)).toBe(false)
            })
            test(`${va} is array`, () => {
                expect(isArray(va)).toBe(true)
            })
            break
        case 7:
            test(`${va} is string`, () => {
                expect(isString(va)).toBe(true)
            })
            test(`${va} is not array`, () => {
                expect(isArray(va)).toBe(false)
            })
            break
        case 8:
            test(`${va} is string`, () => {
                expect(isString(va)).toBe(true)
            })
            test(`${va} is not array`, () => {
                expect(isArray(va)).toBe(false)
            })
            break
        default: break
    }
})