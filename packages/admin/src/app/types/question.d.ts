export type Question = {
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

export type CreateQuestionDto = {
  title: string;
  tags: Array<Tag>;
  choices: Array<Choice>;
}

export type  QuestionResponseDto = {
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

export type ImportFormInputs = {
  file: File;
}