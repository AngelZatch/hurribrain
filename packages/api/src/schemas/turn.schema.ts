import { Choice } from "@src/entities/choice.entity.js"
import { Game } from "@src/entities/game.entity.js"
import { Question } from "@src/entities/question.entity.js"
import { Turn } from "@src/entities/turn.entity.js"

export type PlayableTurn = {
  uuid: Turn["uuid"]
  position: Turn["position"]
  game: {
    uuid: Game["uuid"]
  }
  startedAt: Turn["startedAt"]
  finishedAt: Turn["finishedAt"]
  question: {
    title: Question["title"]
    successRate: Question["successRate"]
    difficulty: Question["difficulty"]
    choices: Array<Pick<Choice, "uuid" | "value">>
  }
}

export type PlayedTurn = {
  uuid: Turn["uuid"]
  position: Turn["position"]
  game: {
    uuid: Game["uuid"]
  }
  startedAt: Turn["startedAt"]
  finishedAt: Turn["finishedAt"]
  speedRanking?: Turn["speedRanking"]
  question: {
    title: Question["title"]
    successRate: Question["successRate"]
    difficulty: Question["difficulty"]
    choices: Array<Pick<Choice, "uuid" | "value" | "isCorrect">>
  }
}

export type PrePlayableTurn = {
  uuid: Turn["uuid"]
  position: Turn["position"]
  game: {
    uuid: Game["uuid"]
  }
  startedAt: Turn["startedAt"]
  finishedAt: Turn["finishedAt"]
  question: {
    title: Question["title"]
    successRate: Question["successRate"]
    difficulty: Question["difficulty"]
    choices: Array<Pick<Choice, "uuid" | "value" | "isCorrect">>
  }
}
