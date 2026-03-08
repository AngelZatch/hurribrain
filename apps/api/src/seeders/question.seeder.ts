import { EntityManager } from "@mikro-orm/postgresql"
import { Seeder } from "@mikro-orm/seeder"
import { TagFactory } from "./../factories/tag.factory.js"

export class QuestionSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Seed questions here
    const tags = [
      "Jeux vidéos",
      "Pokémon",
      "Final Fantasy",
      "Super Mario Bros.",
      "The Legend of Zelda",
      "Nintendo",
      "Anime",
      "JoJo's Bizarre Adventure",
      // "Années 80",
      // "Années 90",
      // "Années 2000",
      // "Années 2010",
      // "Science",
      // "Culture Générale",
      // "Cinéma",
      // "Musique",
      // "Télévision",
      // "Informatique",
      // "Mathématiques",
      // "Langues",
      // "Politique",
      // "Art",
      // "Religion",
      // "Histoire",
      // "Sports",
      // "Littérature",
      // "Géographie",
      // "Technologie",
    ]

    const createdTags = []

    for (const tag of tags) {
      const newTag = await new TagFactory(em).createOne({ name: tag })
      createdTags.push(newTag)
    }
  }
}
