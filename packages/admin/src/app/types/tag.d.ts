export class Tag {
  uuid?: string;
  name: string;
  description?: string;
}

export class CreateTagDto {
  name: string;
  description?: string;
}