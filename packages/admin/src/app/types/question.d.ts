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
  // tags: Array<Tag>;
  choices: Array<Choice>;
}

export class QuestionResponseDto {
  data: Array<Question>;
  nextCursor: number;
}