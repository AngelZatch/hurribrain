export class Question {
  uuid?: string;
  title: string;
  tags: Array<Tag>;
  choices: Array<Choice>;
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