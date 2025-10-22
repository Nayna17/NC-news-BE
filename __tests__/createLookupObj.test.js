const {createLookupObj} = require("../db/seeds/utils")

describe("createLookupObj", () => {
    test("Returns an empty object when passed an empty array", () => {
        const testArr = []
        createLookupObj(testArr)
        expect(createLookupObj(testArr)).toEqual({})
    })
   test("Returns an object with with the key and value pair", () => {
    const testArr = [{article_id: 1, title: "test title"}]
    expect(createLookupObj(testArr)).toEqual({"test title": 1})
   })
    })

    console.log(createLookupObj)