/// <reference lib="deno.ns" />

import { assert } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { Schema } from "../../utils/Schema.ts";
import { FieldFactory, FieldInterface, ResolvedFieldFactory } from "../../../core/utils/Field.ts";
import { ModelFactory, ModelInterface } from "../../../core/utils/Model.ts";
import { GraphRoute } from "../../GraphRouter.ts";
import { QueryState } from "../../middleware/parseQuery.ts";
import { AuthState } from "../../../core/middleware/auth.ts";
import { ValidationError } from "../../../core/utils/ValidationError.ts";

class Int extends Number {
  constructor(value: unknown) {
    super(Math.floor(Number(value)));
  }
}

Deno.test("UTIL: Schema", async (t) => {
  const Email = FieldFactory(String, {
    validator: (x) => ({
      valid: x.includes("@") && x.includes("."),
      message: "Email field must be a valid email with @ and . symbols."
    })
  });

  const Age = FieldFactory(Int, {
    nullable: true,
    validator: (x) => ({
      valid: typeof x === "number" && x > 0,
      message: "Age must be an interger above 0"
    })
  });

  const User = ModelFactory({
    userId: FieldFactory(String),
    email: Email,
    age: Age,
  });

  const mockUser = new User({
    userId: "user123",
    email: "test@test.com",
    age: 20,
  });

  const Content = ModelFactory({
    contentId: FieldFactory(String),
    title: FieldFactory(String),
    content: FieldFactory(String),
  });

  const mockContent = new Content({
    contentId: "content123",
    title: "Hello",
    content: "World",
  });

  // enum PostStatus {
  //   draft = "draft",
  //   published = "published",
  // }

  class Post extends ModelFactory({
    postId: FieldFactory(String),
    authorId: FieldFactory(String),
    contentId: FieldFactory(String),
    // status: FieldFactory(new Enum("PostStatus", PostStatus)),
    likeIds: FieldFactory([String]),
  }) {
    author = ResolvedFieldFactory(User, {
      resolver: () => mockUser
    });

    content = ResolvedFieldFactory(Content, {
      resolver: () => mockContent
    });
  }

  const mockPost = new Post({
    postId: "post123",
    authorId: "user123",
    contentId: "content123",
    likeIds: ["user123"]
  });

  class Comment extends ModelFactory({
    commentId: FieldFactory(String),
    authorId: FieldFactory(String),
    postId: FieldFactory(String),
    text: FieldFactory(String),
    likeIds: FieldFactory([String]),
  }) {
    author = ResolvedFieldFactory(User, {
      resolver: () => mockUser,
    });

    post = ResolvedFieldFactory(Post, {
      resolver: () => mockPost,
    });
  }

  const mockComment = new Comment({
    commentId: "comment123",
    authorId: mockUser.userId,
    postId: mockPost.postId,
    text: "Hello",
    likeIds: ["user123"]
  });

  const RegisterUserArgs = ModelFactory({
    input: FieldFactory(ModelFactory({
      userId: FieldFactory(String),
      age: Age,
      email: Email
    }))
  });

  type TestState = QueryState & AuthState<{ userId: string }>;

  const registerUser = new GraphRoute<TestState, typeof User, typeof RegisterUserArgs, false>({
    method: "MUTATION",
    path: "RegisterUser",
    type: User,
    nullable: false,
    args: RegisterUserArgs,
    resolver: (_ctx, args) => new User({
      userId: args.input.userId,
      age: args.input.age,
      email: args.input.email
    })
  });

  const CreateContentArgs = ModelFactory({
    title: FieldFactory(String),
    content: FieldFactory(String)
  });

  const createContent = new GraphRoute<TestState, typeof Content, typeof CreateContentArgs>({
    method: "MUTATION",
    path: "CreateContent",
    type: Content,
    args: CreateContentArgs,
    resolver: (_ctx, args) => new Content({
      contentId: crypto.randomUUID(),
      title: args.title,
      content: args.content,
      // could get userId from auth state if auth middleware was here
    })
  });

  const PostContentArgs = ModelFactory({
    contentId: FieldFactory(String),
  });

  const postContent = new GraphRoute<TestState, typeof Post, typeof PostContentArgs>({
    method: "MUTATION",
    path: "PostContent",
    type: Post,
    args: PostContentArgs,
    resolver: (ctx, args) => {
      if (ctx.state.auth) { 
        return new Post({
          postId: crypto.randomUUID(),
          contentId: args.contentId,
          authorId: ctx.state.auth.userId,
          likeIds: []
        });
      } else {
        throw new ValidationError("You must be logged in to post content.")
      }
    }
  });

  const commentOnPost = new GraphRoute<TestState, typeof Comment, typeof Comment>({
    method: "MUTATION",
    path: "CommentOnPost",
    type: Comment,
    args: Comment,
    resolver: (ctx, args) => {
      if (ctx.state.auth) { 
        return new Comment({
          postId: crypto.randomUUID(),
          commentId: args.commentId,
          authorId: ctx.state.auth.userId,
          likeIds: [],
          text: args.text
        });
      } else {
        throw new ValidationError("You must be logged in to comment.")
      }
    }
  });

  const getComments = new GraphRoute<
    TestState,
    [typeof Comment], 
    ModelInterface<{
      postId: FieldInterface<StringConstructor, false>
    }>
  >({
    method: "QUERY",
    path: "GetComments",
    type: [Comment],
    args: ModelFactory({
      postId: FieldFactory(String)
    }),
    resolver: (_ctx, _args) => {
      return [mockComment]
    }
  });

  await t.step("creates the correct schema string", () => {
    const schema = new Schema({
      registerUser,
      createContent,
      postContent,
      commentOnPost,
      getComments,
    });

    const schemaString = schema.toString();
    console.log(schemaString);
    assert(schemaString);
  });
});
