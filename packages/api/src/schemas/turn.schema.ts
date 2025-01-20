import { Loaded } from "@mikro-orm/core"
import { Turn } from "@src/entities/turn.entity.js"

export type PlayableTurn = Loaded<
  Turn,
  never,
  | "game"
  | "finishedAt"
  | "startedAt"
  | "uuid"
  | "position"
  | "question.title"
  | "question.successRate"
  | "question.difficulty"
  | "question.choices.uuid"
  | "question.choices.value",
  never
>

export type PlayedTurn = Loaded<
  Turn,
  never,
  | "game"
  | "finishedAt"
  | "startedAt"
  | "uuid"
  | "position"
  | "question.title"
  | "question.difficulty"
  | "question.choices.uuid"
  | "question.choices.value"
  | "question.choices.isCorrect",
  never
>
