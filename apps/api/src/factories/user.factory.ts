import { faker } from "@faker-js/faker/locale/fr"
import { Factory } from "@mikro-orm/seeder"
import { User } from "@src/entities/user.entity.js"

export class UserFactory extends Factory<User> {
  model = User

  definition(): Partial<User> {
    return {
      name: "test",
      email: faker.internet.email(),
      password: "password",
    }
  }
}
