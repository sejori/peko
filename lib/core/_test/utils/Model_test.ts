/// <reference lib="deno.ns" />

import { assertEquals } from "jsr:@std/assert";
import { FieldFactory, ResolvedFieldFactory } from "../../utils/Field.ts";
import { ModelFactory } from "../../utils/Model.ts";
import { RequestContext } from "../../context.ts";

class PublicUser extends ModelFactory({
  id: FieldFactory(String),
  username: FieldFactory(String, {
    validator: (value) => ({
      valid: value.length > 3,
      message: "Username must be longer than 3 characters"
    })
  }),
  followsIds: FieldFactory([String]),
}) {
  follows = ResolvedFieldFactory([PublicUser], {
    nullable: true,
    description: "List of users this user follows",
    resolve: (_ctx) => {
      return new Promise(res => res(this.followsIds.map(id => new PublicUser({ 
        id, 
        username: `User${id}`, 
        followsIds: [this.id]
      }))));
    }
  });
}

class Menu extends ModelFactory({
  title: FieldFactory(String),

  content: FieldFactory(String, { 
    nullable: true, 
    validator: (value) => ({ 
      valid: value.length > 10,
      message: "Content must be longer than 10 characters" 
    })
  }),

  portions: FieldFactory(Number, { 
    validator: (value) => ({
      valid: value.valueOf() > 0,
      message: "Portions must be greater than 0"
    })
  }),

  user: FieldFactory(PublicUser),
}) {
  summary = ResolvedFieldFactory(String, {
    description: "Summary of recipe content",
    resolve: (_ctx) => {
      return `${this.title} (${this.portions} portions)`;
    }
  });
}

Deno.test({
  name: "Models can be created with fields, validation and resolvers",
  fn: () => {
    const menu = new Menu({
      title: "Dinner Menu",
      content: "This is longer than 10 characters.",
      portions: 2,
      user: new PublicUser({
        id: "test0",
        username: "test_man",
        followsIds: ["test1", "test2", "test3"]
      })
    });
    assertEquals(menu.summary.resolve(new RequestContext(new Request("/"))), "Dinner Menu (2 portions)");

    const ctx = new RequestContext(new Request("http://localhost:7777"));
    const followers = menu.user.follows.resolve(ctx);
    
    assertEquals(followers, Promise.resolve([
      new PublicUser({ id: "test1", username: "Usertest1", followsIds: ["test0"] }),
      new PublicUser({ id: "test2", username: "Usertest2", followsIds: ["test0"] }),
      new PublicUser({ id: "test3", username: "Usertest3", followsIds: ["test0"] }),
    ]));
  },
});
