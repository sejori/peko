import { DTO, Field, ResolvedType } from "../../../lib/utils/Schema.ts";
// import { mockPost, post } from "./post.ts";
import { mockUser, user } from "./user.ts";

export const comment = new DTO("Comment", {
  author: new Field(user, {
    resolver: () => [mockUser],
  }),
  // post: new Field(() => post, {
  //   resolver: () => mockPost,
  // }),
  text: new Field(String),
});

export const mockComment: ResolvedType<typeof comment> = {
  author: mockUser,
  text: "Hello",
  // post: mockPost,
};
