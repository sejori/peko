/**
 * Store class with serialization methods for persistent storage.
 */

export class Store {
  code = crypto.randomUUID()
  constructors: Map<string, () => Model> = new Map()
  items: Map<string, string> = new Map()

  constructor() {
    this.constructors.set("Array", () => [] as unknown as Model)
    this.constructors.set("Function", () => function () {} as unknown as Model)
  }

  save(node: Model) {
    // DFS - assign unique id to nodes for breadcrumbs
    // then replace refs with linked node id and stringify to items
    const storeNode = (node: Model) => {
      const proto = Object.getPrototypeOf(node)
      node[this.code] = `${proto.constructor.name}+${crypto.randomUUID()}`

      for (const key in node) {
        if (key !== "_storage" && node[key] === Object(node[key])) { // non-primitive
          if (!node[key][this.code]) storeNode(node[key])
          node[key] = node[key][this.code]
        }
      }

      const serialized = typeof node !== "function"
        ? JSON.stringify(node)
        : (node as Function).toString()

      this.items.set(node[this.code], serialized)
      return node[this.code]
    }

    return storeNode(node)
  }

  load<T>(rootId: string, _type: T): T {
    const parsed: Map<string, Model> = new Map()

    const parseNode = (nodeId: string) => {
      const objType = nodeId.slice(0, nodeId.indexOf("+"))
      const constructor = this.constructors.get(objType)
      if (!constructor) throw new Error(`No constructor found for ${objType} in id ${nodeId}`)
      
      const nodeString = this.items.get(nodeId)
      if (!constructor) throw new Error(`No node string found for item with id ${nodeId}`)

      const deserialized = objType === "Function"
        ? new Function()
        : JSON.parse((nodeString as string))

      const baseObj = constructor()
      const nodeObj = { ...baseObj, ...deserialized }

      parsed.set(nodeObj[this.code], nodeObj)
      delete nodeObj[this.code]

      for (const key in nodeObj) {
        if (parsed.has(nodeObj[key])) {
          nodeObj[key] = parsed.get(nodeObj[key])
        } else if (this.items.has(nodeObj[key])) {
          nodeObj[key] = parseNode(nodeObj[key])
        }
      }

      return nodeObj
    }

    return parseNode(rootId) as T
  }
}

export class Model {
  [index: string | number]: any;
  _storage: Store
  _constructor: () => this

  constructor(store: Store, constructArgs: IArguments) {
    const This = Object.getPrototypeOf(this).constructor

    this._storage = store
    this._constructor = () => new This(...constructArgs)
    this._storage.constructors.set(This.name, this._constructor)
  }

  save() {
    return this._storage.save(this)
  }
}