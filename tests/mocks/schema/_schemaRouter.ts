import { SchemaRouter } from "../../../lib/routers/schemaRouter.ts";
import { DTO, Field } from "../../../lib/utils/Schema.ts";
import { comment, mockComment } from "./comment.ts";
import { content, mockContent } from "./content.ts";
import { mockPost, post } from "./post.ts";
import { ageField, emailField, mockUser, user } from "./user.ts";

export const mockSchemaRouter = () => {
  const schemaRouter = new SchemaRouter();

  schemaRouter.mutation("RegisterUser", {
    args: {
      email: emailField,
      age: ageField,
    },
    data: user,
    resolver: () => mockUser,
  });

  schemaRouter.mutation("CreateContent", {
    args: {
      content: new Field(
        new DTO("CreateContentInput", {
          ...content.fields,
        })
      ),
    },
    data: content,
    resolver: () => mockContent,
  });

  schemaRouter.mutation("PostContent", {
    args: {
      contentId: new Field(String),
    },
    data: post,
    resolver: () => mockPost,
  });

  schemaRouter.mutation("CommentOnPostInput", {
    args: {
      comment: new Field(
        new DTO("CommentInput", {
          postId: new Field(String),
          text: new Field(String),
        })
      ),
    },
    data: comment,
    resolver: () => mockComment,
  });

  schemaRouter.query("GetComments", {
    args: {
      postId: new Field(String),
    },
    data: [comment],
    resolver: () => [mockComment],
  });

  return schemaRouter;
};
