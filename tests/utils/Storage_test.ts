import { assert } from "https://deno.land/std@0.150.0/testing/asserts.ts"
import { Store, Model } from "../../utils/Storage.ts"

Deno.test("UTIL: Storage", async (t) => {
  const store = new Store()

  class Person extends Model {
    name: string
    friends: Person[] = []
    hobbies: Hobby[] = []

    constructor(name: string) {
      super(store, arguments)
      this.name = name
    }

    addHobby(hobby: Hobby) {
      this.hobbies.push(hobby)
    }

    addFriend(friend: Person) {
      this.friends.push(friend)
      friend.friends.push(this)
    }
  }

  class Hobby extends Model {
    #title: string
    
    constructor(title: string) {
      super(store, arguments)
      this.#title = title
    }

    getTitle () { return this.#title }
  }

  const fencing = new Hobby("fencing")
  const bob = new Person("Bob")
  const jim = new Person("Jim")
  bob.addFriend(jim)

  await t.step("circular ref object retains methods after serializing and deserializing", () => {
    assert(bob.name === "Bob" && bob.friends.includes(jim))

    const jimId = jim.save()
    const freshJim = store.load(jimId) as Person
    freshJim.addHobby(fencing)

    assert(jim !== freshJim)
    assert(freshJim.hobbies[0].getTitle() === "fencing")
    assert(freshJim.friends[0].name === "Bob")
  }) 
})