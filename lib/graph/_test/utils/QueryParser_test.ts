import { assertEquals } from "https://deno.land/std@0.218.0/assert/mod.ts";
import { QueryParser } from "../../utils/QueryParser.ts";

Deno.test("UTIL: QueryParser - basic nested query with args", () => {
  const queryRaw = `
    query getUser {
      user(id: "123") {
        name
        email
        posts {
          title
          comments {
            text
          }
        }
      }
    }
  `;

  const query = new QueryParser(queryRaw);

  assertEquals(query.operation, {
    type: "query",
    name: "getUser",
    variables: {}
  });

  assertEquals(query.ast, {
    user: {
      ref: "user",
      args: {
        id: '"123"',
      },
      fields: {
        name: { ref: "name" },
        email: { ref: "email" },
        posts: {
          ref: "posts",
          fields: {
            title: { ref: "title" },
            comments: {
              ref: "comments",
              fields: {
                text: { ref: "text" },
              },
            },
          },
        },
      },
    },
  });
});

Deno.test("QueryParser with fragments and variables", () => {
  const query = `
    query getUser($id: ID!) {
      user(id: $id) {
        ...userFields
        profile {
          bio
        }
        ... on User {
          createdAt
        }
      }
    }

    fragment userFields on User {
      name
      email
    }
  `;

  const parsed = new QueryParser(query);

  assertEquals(parsed.operation, {
    type: "query",
    name: "getUser",
    variables: {
      id: "ID!",
    },
  });

  assertEquals(parsed.ast, {
    user: {
      ref: "user",
      args: { id: "$id" },
      fields: {
        name: { ref: "name" },
        email: { ref: "email" },
        profile: {
          ref: "profile",
          fields: {
            bio: { ref: "bio" },
          },
        },
        createdAt: { ref: "createdAt" },
      },
    },
  });
});


Deno.test("UTIL: QueryParser - full GraphQL syntax support", () => {
  const queryRaw = `
    query getUserData {
      me: user(id: "123") @include(if: true) {
        name
        profilePic: avatar(size: "large")
        email
        posts {
          title
          body
          comments {
            id
            text
          }
        }
      }
      stats {
        totalPosts
      }
    }
  `;

  const query = new QueryParser(queryRaw);

  assertEquals(query.operation, {
    type: "query",
    name: "getUserData",
    variables: {}
  });

  assertEquals(query.ast, {
    me: {
      ref: "user",
      args: {
        id: '"123"',
      },
      directives: ["@include(if:true)"],
      fields: {
        name: { ref: "name" },
        profilePic: {
          ref: "avatar",
          args: {
            size: '"large"',
          },
        },
        email: { ref: "email" },
        posts: {
          ref: "posts",
          fields: {
            title: { ref: "title" },
            body: { ref: "body" },
            comments: {
              ref: "comments",
              fields: {
                id: { ref: "id" },
                text: { ref: "text" },
              },
            },
          },
        },
      },
    },
    stats: {
      ref: "stats",
      fields: {
        totalPosts: {
          ref: "totalPosts",
        },
      },
    },
  });
});

Deno.test("UTIL: QueryParser - multiline input objects and arrays", () => {
  const queryRaw = `
    query fetchUser {
      user(filter: {
        status: "active",
        roles: ["admin", "editor"],
        metadata: {
          verified: true
        }
      }) {
        id
        name
      }
    }
  `;
  const query = new QueryParser(queryRaw);

  assertEquals(query.ast, {
    user: {
      ref: "user",
      args: {
        filter: {
          status: '"active"',
          roles: ['"admin"', '"editor"'],
          metadata: { verified: "true" },
        },
      },
      fields: {
        id: { ref: "id" },
        name: { ref: "name" },
      },
    },
  });
});

Deno.test("UTIL: QueryParser - directive without arguments", () => {
  const queryRaw = `
    query {
      viewer @skip {
        id
      }
    }
  `;
  const query = new QueryParser(queryRaw);

  assertEquals(query.ast, {
    viewer: {
      ref: "viewer",
      directives: ["@skip"],
      fields: {
        id: { ref: "id" },
      },
    },
  });
});

Deno.test("QueryParser - anonymous query", () => {
  const query = `{
    user {
      id
      name
    }
  }`;
  
  const parser = new QueryParser(query);
  
  assertEquals(parser.operation, {
    type: "query",
    name: "",
    variables: {}
  });
  
  assertEquals(parser.ast, {
    user: {
      ref: "user",
      fields: {
        id: { ref: "id" },
        name: { ref: "name" }
      }
    }
  });
});

Deno.test("QueryParser - anonymous query with fragments", () => {
  const query = `
    {
      user {
        ...userFields
      }
    }
    fragment userFields on User {
      email
    }
  `;
  
  const parser = new QueryParser(query);
  
  assertEquals(parser.operation, {
    type: "query",
    name: "",
    variables: {}
  });
  
  assertEquals(parser.ast, {
    user: {
      ref: "user",
      fields: {
        email: { ref: "email" }
      }
    }
  });
});

Deno.test("QueryParser - anonymous query with directives", () => {
  const query = `{
    user @include(if: true) {
      id
    }
  }`;
  
  const parser = new QueryParser(query);
  
  assertEquals(parser.operation, {
    type: "query",
    name: "",
    variables: {}
  });
  
  assertEquals(parser.ast, {
    user: {
      ref: "user",
      directives: ["@include(if:true)"],
      fields: {
        id: { ref: "id" }
      }
    }
  });
});