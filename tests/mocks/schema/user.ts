import { DTO, Field, Int, ResolvedType } from "../../../lib/utils/Schema.ts";

export const emailField = new Field(String, {
  validator: (x) => x.includes("@") && x.includes("."),
});

export const ageField = new Field(Int, {
  nullable: true,
  validator: (x) => typeof x === "number" && x > 0,
});

export const user = new DTO("User", {
  email: emailField,
  age: ageField,
});

export const mockUser: ResolvedType<typeof user> = {
  email: "test@test.com",
  age: 20,
};
