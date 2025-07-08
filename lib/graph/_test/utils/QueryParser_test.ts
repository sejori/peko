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
      args: {
        id: '"123"',
      },
      fields: {
        name: {},
        email: {},
        posts: {
          fields: {
            title: {},
            comments: {
              fields: {
                text: {},
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
      args: { id: "$id" },
      fields: {
        name: {},
        email: {},
        profile: {
          fields: {
            bio: {},
          },
        },
        createdAt: {},
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
      alias: "user",
      args: {
        id: '"123"',
      },
      directives: ["@include(if:true)"],
      fields: {
        name: {},
        profilePic: {
          alias: "avatar",
          args: {
            size: '"large"',
          },
        },
        email: {},
        posts: {
          fields: {
            title: {},
            body: {},
            comments: {
              fields: {
                id: {},
                text: {},
              },
            },
          },
        },
      },
    },
    stats: {
      fields: {
        totalPosts: {},
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
      args: {
        filter: {
          status: '"active"',
          roles: ['"admin"', '"editor"'],
          metadata: { verified: "true" },
        },
      },
      fields: {
        id: {},
        name: {},
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
      directives: ["@skip"],
      fields: {
        id: {},
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
      fields: {
        id: {},
        name: {}
      }
    }
  });
});

Deno.test("QueryParser - anonymous query with fragments", () => {
  const query = `
    fragment userFields on User {
      email
    }
    {
      user {
        ...userFields
      }
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
      fields: {
        email: {}  // From fragment
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
      directives: ["@include(if:true)"],
      fields: {
        id: {}
      }
    }
  });
});