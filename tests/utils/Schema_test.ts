import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import {
  Type,
  Field,
  Int,
  Input,
  Schema,
  Mutation,
  Query,
} from "../../lib/utils/Schema.ts";

Deno.test("UTIL: Profiler", async (t) => {
  const email = new Field(String, {
    validator: (x) => x.includes("@") && x.includes("."),
  });

  const age = new Field(Int, {
    validator: (x) => typeof x === "number" && x > 0,
  });

  const userInput = new Input("CreateUser", {
    fields: {
      email,
      age,
    },
  });

  const user = new Type("User", {
    fields: {
      email,
      age,
    },
    resolver: async (ctx) => [
      {
        email: "test@test.com",
        age: 20,
      },
    ],
  });

  const registerUser = new Mutation("RegisterUser", {
    input: userInput,
    output: user,
    resolver: async (ctx) => [
      {
        email: "test@test.com",
        age: 20,
      },
    ],
  });

  const content = new Type("Content", {
    fields: {
      title: new Field(String),
      content: new Field(String),
    },
    resolver: async (ctx) => [
      {
        title: "Hello",
        content: "World",
      },
    ],
  });

  const createContent = new Mutation("CreateContent", {
    input: new Input("CreateContent", {
      fields: content.config.fields,
    }),
    output: content,
    resolver: async (ctx) => [
      {
        title: "Hello",
        content: "World",
      },
    ],
  });

  const post = new Type("Post", {
    fields: {
      author: new Field(user, {
        resolver: async (posts) => [
          {
            email: "test@test.com",
            age: 20,
          },
        ],
      }),
      content: new Field(content, {
        resolver: async (posts) => [
          {
            title: "Hello",
            content: "World",
          },
        ],
      }),
      status: new Field(String, {
        validator: (item) => ["draft", "published"].includes(item.toString()),
      }),
    },
    resolver: async (ids) => [
      {
        author: {
          email: "test@test.com",
          age: 20,
        },
        content: {
          title: "Hello",
          content: "World",
        },
        status: "published",
      },
    ],
  });

  const postContent = new Mutation("PostContent", {
    input: new Input("PostContent", {
      fields: post.config.fields,
    }),
    output: post,
    resolver: async (ctx) => [
      {
        author: {
          email: "test@test.com",
          age: 20,
        },
        content: {
          title: "Hello",
          content: "World",
        },
        status: "published",
      },
    ],
  });

  const comment = new Type("Comment", {
    fields: {
      author: new Field(user, {
        resolver: async (comments) => [
          {
            email: "test@test.com",
            age: 20,
          },
        ],
      }),
      post: new Field(post, {
        resolver: async (comments) => [
          {
            author: {
              email: "test@test.com",
              age: 20,
            },
            content: {
              title: "Hello",
              content: "World",
            },
            status: "published",
          },
        ],
      }),
      text: new Field(String),
    },
    resolver: async (ids) => [
      {
        author: {
          email: "",
          age: 20,
        },
        post: {
          author: {
            email: "test@test.com",
            age: 20,
          },
          content: {
            title: "Hello",
            content: "World",
          },
          status: "published",
        },
        text: "Hello",
      },
    ],
  });

  const commentOnPost = new Mutation("CommentOnPost", {
    input: new Input("CommentOnPost", {
      fields: comment.config.fields,
    }),
    output: comment,
    resolver: async (ctx) => [
      {
        author: {
          email: "",
          age: 20,
        },
        post: {
          author: {
            email: "test@test.com",
            age: 20,
          },
          content: {
            title: "Hello",
            content: "World",
          },
          status: "published",
        },
        text: "Hello",
      },
    ],
  });

  const getComments = new Query("GetComments", {
    input: new Input("GetComments", {
      fields: {
        post: new Field(post),
      },
    }),
    output: comment,
    resolver: async (ctx) => [
      {
        author: {
          email: "",
          age: 20,
        },
        post: {
          author: {
            email: "test@test.com",
            age: 20,
          },
          content: {
            title: "Hello",
            content: "World",
          },
          status: "published",
        },
        text: "Hello",
      },
    ],
  });

  await t.step("creates a correct schema", async () => {
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
