import { Type, Schema, Int } from "../../lib/utils/Schema.ts";

const user = new Type(
  "User",
  {
    id: String,
    userName: String,
    // email: String,
    age: {
      type: Int,
      validator: (value) => value > 18,
      res: "",
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
