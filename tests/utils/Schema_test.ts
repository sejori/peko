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

  const userInput = new Input("CreateUser", {
    fields: {
      email: emailField,
      age: ageField,
    },
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
        resolver: async (posts) => [mockUser],
      }),
      content: new Field(content, {
        resolver: async (posts) => [mockContent],
      }),
      status: new Field(new Enum("PostStatus", PostStatus)),
      likes: new Field([user], {
        resolver: async (posts) => [[mockUser]],
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
        resolver: async (comments) => [mockUser],
      }),
      post: new Field(post, {
        resolver: async (comments) => [mockPost],
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
    input: userInput,
    output: user,
    resolver: async (ctx) => mockUser,
  });

  const createContent = new Mutation("CreateContent", {
    input: new Input("CreateContent", {
      fields: content.config.fields,
    }),
    output: content,
    resolver: async (ctx) => mockContent,
  });

  const postContent = new Mutation("PostContent", {
    input: new Input("PostContent", {
      fields: post.config.fields,
    }),
    output: post,
    resolver: async (ctx) => mockPost,
  });

  const commentOnPost = new Mutation("CommentOnPost", {
    input: new Input("CommentOnPost", {
      fields: comment.config.fields,
    }),
    output: comment,
    resolver: async (ctx) => mockComment,
  });

  const getComments = new Query("GetComments", {
    input: new Input("GetComments", {
      fields: {
        post: new Field(post),
      },
    }),
    output: [comment],
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
