import { DTO, Field, ResolvedType } from "../../../lib/utils/Schema.ts";
import { mockUser, user } from "./user.ts";

export const content = new DTO("Content", {
  title: new Field(String),
  content: new Field(String),
  creator: new Field(user, {
    resolver: () => [mockUser],
  }),
});

export const mockContent: ResolvedType<typeof content> = {
  title: "Hello",
  content: "World",
  creator: mockUser,
};
