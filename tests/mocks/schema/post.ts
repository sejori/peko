import { DTO, Enum, Field, ResolvedType } from "../../../lib/utils/Schema.ts";
import { comment, mockComment } from "./comment.ts";
import { content, mockContent } from "./content.ts";
import { mockUser, user } from "./user.ts";

enum PostStatus {
  draft = "draft",
  published = "published",
}

export const post = new DTO("Post", {
  author: new Field(user, {
    resolver: () => [mockUser],
  }),
  content: new Field(content, {
    resolver: () => [mockContent],
  }),
  status: new Field(new Enum("PostStatus", PostStatus)),
  comments: new Field([comment], {
    resolver: () => [[mockComment]],
  }),
});

export const mockPost: ResolvedType<typeof post> = {
  author: mockUser,
  content: mockContent,
  status: PostStatus.published,
  comments: [mockComment],
};