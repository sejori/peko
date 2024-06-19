import {
  Type,
  Field,
  Schema,
  Int,
  FieldRecord,
  FieldMap,
} from "../../lib/utils/Schema.ts";

function createFields<T extends FieldRecord>(fields: FieldMap<T>) {
  return fields;
}

const fields = createFields({
  age: {
    type: Number,
    resolver: async (ctx) => [5],
  },
  name: {
    type: String,
    resolver: async (ctx) => ["steve"],
  },
});

const field: Field<NumberConstructor> = {
  type: Number,
  resolver: async (ctx) => [5],
};

const user = new Type(
  "User",
  {
    id: String,
    userName: String,
    // email: String,
    age: {
      type: Int,
      validator: (value) => value > 18,
      resolver: async (ctx) => 5,
    },
  },
  async () => [
    {
      id: "1",
      userName: "peko",
      email: "seb@test.com",
    },
  ]
);

// const content = new Type(
//   "Content",
//   {
//     title: String,
//     content: String,
//   },
//   (ids) => [
//     {
//       title: "Hello",
//       content: "World",
//     },
//   ]
// );

// const post = new Type(
//   "Post",
//   {
//     author: {
//       type: user,
//       resolver: (posts) => [user],
//     },
//     content: {
//       type: user,
//       resolver: (posts) => [user],
//     },
//     status: {
//       type: String,
//       validator: (item: string) => ["draft", "published"].includes(item),
//     },
//   },
//   (ids) => [{}]
// );

// const comment = new Type(
//   "Comment",
//   {
//     author: {
//       type: user,
//       resolver: (comments) => [user],
//     },
//     text: String,
//   },
//   (ids) => [{}]
// );

// const schema = new Schema([]);
