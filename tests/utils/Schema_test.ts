import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import {
  Type,
  Enum,
  Field,
  Int,
  Input,
  Schema,
  Mutation,
  Query,
  ResolvedType,
} from "../../lib/utils/Schema.ts";

Deno.test("UTIL: Profiler", async (t) => {
  const emailField = new Field(String, {
    validator: (x) => x.includes("@") && x.includes("."),
  });

  const ageField = new Field(Int, {
    nullable: true,
    validator: (x) => typeof x === "number" && x > 0,
  });

  const user = new Type("User", {
    fields: {
      email: emailField,
      age: ageField,
    },
  });

  const mockUser: ResolvedType<typeof user> = {
    email: "test@test.com",
    age: 20,
  };

  const content = new Type("Content", {
    fields: {
      title: new Field(String),
      content: new Field(String),
    },
  });

  const mockContent: ResolvedType<typeof content> = {
    title: "Hello",
    content: "World",
  };

  enum PostStatus {
    draft = "draft",
    published = "published",
  }

  const post = new Type("Post", {
    fields: {
      author: new Field(user, {
        resolver: async (ctx) => [mockUser],
      }),
      content: new Field(content, {
        resolver: async (ctx) => [mockContent],
      }),
      status: new Field(new Enum("PostStatus", PostStatus)),
      likes: new Field([user], {
        resolver: async (ctx) => [[mockUser]],
      }),
    },
  });

  const mockPost: ResolvedType<typeof post> = {
    author: mockUser,
    content: mockContent,
    status: PostStatus.published,
    likes: [mockUser],
  };

  const comment = new Type("Comment", {
    fields: {
      author: new Field(user, {
        resolver: async (ctx) => [mockUser],
      }),
      post: new Field(post, {
        resolver: async (ctx) => [mockPost],
      }),
      text: new Field(String),
    },
  });

  const mockComment: ResolvedType<typeof comment> = {
    author: mockUser,
    post: mockPost,
    text: "Hello",
  };

  const registerUser = new Mutation("RegisterUser", {
    args: {
      email: emailField,
      age: ageField,
    },
    data: user,
    resolver: async (ctx) => mockUser,
  });

  const createContent = new Mutation("CreateContent", {
    args: {
      content: new Field(
        new Input("CreateContentInput", {
          fields: content.config.fields,
        })
      ),
    },
    data: content,
    resolver: async (ctx) => mockContent,
  });

  const postContent = new Mutation("PostContent", {
    args: {
      content: new Field(
        new Input("PostContentInput", {
          fields: post.config.fields,
        })
      ),
    },
    data: post,
    resolver: async (ctx) => mockPost,
  });

  const commentOnPost = new Mutation("CommentOnPostInput", {
    args: {
      comment: new Field(
        new Input("CommentOnPost", {
          fields: comment.config.fields,
        })
      ),
    },
    data: comment,
    resolver: async (ctx) => mockComment,
  });

  const getComments = new Query("GetComments", {
    args: {
      post: new Field(post),
    },
    data: [comment],
    resolver: async (ctx) => [mockComment],
  });

  await t.step("creates the correct schema string", async () => {
    const schema = new Schema([
      registerUser,
      createContent,
      postContent,
      commentOnPost,
      getComments,
    ]);

    const schemaString = schema.toString();
    console.log(schemaString);
    assert(schemaString);
  });
});
