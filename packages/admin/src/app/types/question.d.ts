export class Question {
  uuid?: string;
  title: string;
  asset?: string;
  tags: Array<Tag>;
  choices: Array<Choice>;
  createdAt: Date;
  updatedAt: Date;
  successRate?: number;
  difficulty?: string;
}

export class CreateQuestionDto {
  title: string;
  tags: Array<Tag>;
  choices: Array<Choice>;
}

export class QuestionResponseDto {
  data: Array<Question>;
  nextCursor: number;
}

export type QuestionFormInputs = {
  title: Question["title"];
  "choices-0": Choice["value"];
  "choices-1": Choice["value"];
  "choices-2": Choice["value"];
  "choices-3": Choice["value"];
  tags: Array<Tag>;
};