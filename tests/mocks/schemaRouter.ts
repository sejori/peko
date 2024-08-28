import { SchemaRouter } from "../../lib/routers/schemaRouter.ts";
import { DTO, Enum, Field, Int, ResolvedType } from "../../lib/utils/Schema.ts";

export const mockSchemaRouter = () => {
  const schemaRouter = new SchemaRouter();

  // User stuff
  const emailField = new Field(String, {
    validator: (x) => x.includes("@") && x.includes("."),
  });
  const ageField = new Field(Int, {
    nullable: true,
    validator: (x) => typeof x === "number" && x > 0,
  });
  const user = new DTO("User", {
    email: emailField,
    age: ageField,
  });
  const mockUser: ResolvedType<typeof user> = {
    email: "test@test.com",
    age: 20,
  };

  schemaRouter.mutation("RegisterUser", {
    args: {
      email: emailField,
      age: ageField,
    },
    data: user,
    resolver: () => mockUser,
  });

  // Content stuff
  const content = new DTO("Content", {
    title: new Field(String),
    content: new Field(String),
  });
  const mockContent: ResolvedType<typeof content> = {
    title: "Hello",
    content: "World",
  };

  enum PostStatus {
    draft = "draft",
    published = "published",
  }

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

  // Post stuff
  const post = new DTO("Post", {
    author: new Field(user, {
      resolver: () => [mockUser],
    }),
    content: new Field(content, {
      resolver: () => [mockContent],
    }),
    status: new Field(new Enum("PostStatus", PostStatus)),
    likes: new Field([user], {
      resolver: () => [[mockUser]],
    }),
  });
  const mockPost: ResolvedType<typeof post> = {
    author: mockUser,
    content: mockContent,
    status: PostStatus.published,
    likes: [mockUser],
  };

  schemaRouter.mutation("PostContent", {
    args: {
      content: new Field(
        new DTO("PostContentInput", {
          ...post.fields,
        })
      ),
    },
    data: post,
    resolver: () => mockPost,
  });

  // Comment stuff
  const comment = new DTO("Comment", {
    author: new Field(user, {
      resolver: () => [mockUser],
    }),
    post: new Field(post, {
      resolver: () => [mockPost],
    }),
    text: new Field(String),
  });
  const mockComment: ResolvedType<typeof comment> = {
    author: mockUser,
    post: mockPost,
    text: "Hello",
  };

  schemaRouter.mutation("CommentOnPostInput", {
    args: {
      comment: new Field(
        new DTO("CommentOnPost", {
          ...comment.fields,
        })
      ),
    },
    data: comment,
    resolver: () => mockComment,
  });

  schemaRouter.query("GetComments", {
    args: {
      post: new Field(post),
    },
    data: [comment],
    resolver: () => [mockComment],
  });

  return schemaRouter;
};
