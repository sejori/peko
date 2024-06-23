import { Type, DTO, Int } from "../../lib/utils/Schema.ts";

const createUser = new DTO("userCreate", {
  username: String,
  age: {
    type: Int,
    validator: (x) => typeof x === "number" && x > 18,
    resolver: async () => [19],
  },
});

// type UserInput = ResolvedFields<typeof createUser.fields>;
// const userInput: UserInput = {
//   username: "geoff",
//   age: 5,
// };

const user = new Type("User", {
  id: String,
  username: String,
  // email: String,
  age: {
    type: Int,
    validator: (x) => typeof x === "number" && x > 18,
    resolver: async (ctx) => [19],
  },
});

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
