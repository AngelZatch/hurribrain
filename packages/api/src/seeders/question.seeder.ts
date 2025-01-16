import { EntityManager } from "@mikro-orm/mysql"
import { Seeder } from "@mikro-orm/seeder"
import { TagFactory } from "./../factories/tag.factory.js"
import { QuestionFactory } from "./../factories/question.factory.js"

export class QuestionSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Seed questions here
    const tags = [
      "Jeux vidéos",
      "Années 80",
      "Années 90",
      "Années 2000",
      "Années 2010",
      "Science",
      "Culture Générale",
      "Cinéma",
      "Musique",
      "Télévision",
      "Informatique",
      "Mathématiques",
      "Langues",
      "Politique",
      "Art",
      "Religion",
      "Histoire",
      "Sports",
      "Littérature",
      "Géographie",
      "Technologie",
    ]

    const createdTags = []

    for (const tag of tags) {
      const newTag = await new TagFactory(em).createOne({ name: tag })
      createdTags.push(newTag)
    }

    const questions: Array<{
      title: string
      choices: Array<{ value: string; isCorrect: boolean }>
      tags: Array<{ uuid: string; name: string }>
      correctAnswers: number
      incorrectAnswers: number
    }> = [
      {
        title: "Lequel de ces jeux n'est pas sorti sur Nintendo Wii ?",
        choices: [
          {
            value: "Super Mario Galaxy",
            isCorrect: false,
          },
          {
            value: "The Legend of Zelda: Twilight Princess",
            isCorrect: false,
          },
          {
            value: "Super Mario Sunshine",
            isCorrect: true,
          },
          {
            value: "Super Smash Bros. Brawl",
            isCorrect: false,
          },
        ],
        tags: [createdTags[0]],
        correctAnswers: 12,
        incorrectAnswers: 76,
      },
      {
        title:
          "Quel est le nom de la princesse dans le jeu vidéo The Legend of Zelda ?",
        choices: [
          {
            value: "Zelda",
            isCorrect: true,
          },
          {
            value: "Peach",
            isCorrect: false,
          },
          {
            value: "Daisy",
            isCorrect: false,
          },
          {
            value: "Link",
            isCorrect: false,
          },
        ],
        tags: [createdTags[0]],
        correctAnswers: 78,
        incorrectAnswers: 1,
      },
      {
        title: "En quelle année est sorti Super Mario Sunshine ?",
        choices: [
          { value: "2001", isCorrect: false },
          { value: "2002", isCorrect: true },
          { value: "2003", isCorrect: false },
          { value: "2004", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 42,
        incorrectAnswers: 56,
      },
      {
        title: "Trouvez l'intrus",
        choices: [
          { value: "Super Mario Sunshine 2", isCorrect: true },
          { value: "Super Mario Galaxy 2", isCorrect: false },
          { value: "New Super Luigi U", isCorrect: false },
          { value: "Super Mario Maker 2", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 87,
        incorrectAnswers: 11,
      },
      {
        title:
          "Quel est le nom du personnage principal dans le jeu vidéo The Legend of Zelda ?",
        choices: [
          { value: "Zelda", isCorrect: false },
          { value: "Peach", isCorrect: false },
          { value: "Daisy", isCorrect: false },
          { value: "Link", isCorrect: true },
        ],
        tags: [createdTags[0]],
        correctAnswers: 98,
        incorrectAnswers: 0,
      },
      {
        title:
          "En quelle année est sorti The Legend of Zelda: Twilight Princess ?",
        choices: [
          { value: "2005", isCorrect: false },
          { value: "2006", isCorrect: true },
          { value: "2007", isCorrect: false },
          { value: "2008", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 47,
        incorrectAnswers: 19,
      },
      {
        title: "Comment s'appelle le frère de Mario ?",
        choices: [
          { value: "Luigi", isCorrect: true },
          { value: "Wario", isCorrect: false },
          { value: "Waluigi", isCorrect: false },
          { value: "Yoshi", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 94,
        incorrectAnswers: 4,
      },
      {
        title: "Comment s'appelle le frère de Luigi ?",
        choices: [
          { value: "Mario", isCorrect: true },
          { value: "Wario", isCorrect: false },
          { value: "Waluigi", isCorrect: false },
          { value: "Yoshi", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 66,
        incorrectAnswers: 0,
      },
      {
        title: "Qui veut toujours enlever la Princess Peach ?",
        choices: [
          { value: "Bowser", isCorrect: true },
          { value: "Wario", isCorrect: false },
          { value: "Waluigi", isCorrect: false },
          { value: "Yoshi", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 69,
        incorrectAnswers: 29,
      },
      {
        title:
          "Quel est le nom du Monde accessible seulement par un glitch dans Super Mario Bros. ?",
        choices: [
          { value: "0", isCorrect: false },
          { value: "-1", isCorrect: true },
          { value: "X", isCorrect: false },
          { value: "SECRET", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 14,
        incorrectAnswers: 9101,
      },
      {
        title: "En quelle année est sorti le premier Final Fantasy ?",
        choices: [
          { value: "1985", isCorrect: false },
          { value: "1986", isCorrect: false },
          { value: "1987", isCorrect: true },
          { value: "1988", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 38,
        incorrectAnswers: 291,
      },
      {
        title: "Qui est le compositeur phare de la série des Final Fantasy ?",
        choices: [
          { value: "Nobuo Uematsu", isCorrect: true },
          { value: "Yoko Shimomura", isCorrect: false },
          { value: "Koji Kondo", isCorrect: false },
          { value: "Daiki Ishikawa", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 84,
        incorrectAnswers: 14,
      },
      {
        title:
          "Dans quel jeu sont apparus les Chocobos pour la première fois ?",
        choices: [
          { value: "Final Fantasy", isCorrect: false },
          { value: "Final Fantasy II", isCorrect: true },
          { value: "Final Fantasy III", isCorrect: false },
          { value: "Final Fantasy IV", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 119,
        incorrectAnswers: 34,
      },
      {
        title: "Dans quel jeu sont apparus les Mogs pour la première fois ?",
        choices: [
          { value: "Final Fantasy IV", isCorrect: false },
          { value: "Final Fantasy II", isCorrect: false },
          { value: "Final Fantasy V", isCorrect: false },
          { value: "Final Fantasy III", isCorrect: true },
        ],
        tags: [createdTags[0]],
        correctAnswers: 1,
        incorrectAnswers: 118,
      },
      {
        title:
          "De quel Final Fantasy le Nuage des Ténèbres est-il le boss de fin ?",
        choices: [
          { value: "Final Fantasy I", isCorrect: false },
          { value: "Final Fantasy II", isCorrect: false },
          { value: "Final Fantasy III", isCorrect: true },
          { value: "Final Fantasy IV", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 43,
        incorrectAnswers: 223,
      },
      {
        title: "De quel Final Fantasy Kefka est-il le boss de fin ?",
        choices: [
          { value: "Final Fantasy VI", isCorrect: true },
          { value: "Final Fantasy VII", isCorrect: false },
          { value: "Final Fantasy VIII", isCorrect: false },
          { value: "Final Fantasy IX", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 98,
        incorrectAnswers: 1,
      },
      {
        title: "Quel est le nom du boss de fin de Final Fantasy XIII ?",
        choices: [
          { value: "Orphan", isCorrect: true },
          { value: "Bartandelus", isCorrect: false },
          { value: "Cid Raines", isCorrect: false },
          { value: "Orphanus", isCorrect: false },
        ],
        tags: [createdTags[0]],
        correctAnswers: 0,
        incorrectAnswers: 0,
      },
    ]

    for (const question of questions) {
      await new QuestionFactory(em).createOne({
        title: question.title,
        choices: question.choices,
        tags: question.tags,
        correctAnswers: question.correctAnswers,
        incorrectAnswers: question.incorrectAnswers,
      })
    }
  }
}
