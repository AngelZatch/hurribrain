import { Static, Type } from "@sinclair/typebox"

// Tag Response Schema
export const TagResponseSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
    name: Type.String({ examples: ["Jeux Vidéo", "Musique", "Cinéma"] }),
    description: Type.Optional(
      Type.String({
        examples: [
          "Testez vos connaissances sur Mario, Pokémon et plein d'autres licences connues.",
          "Arriverez-vous à reconnaître les artistes derrière vos chansons préférées ?",
          "Scorsese, Spielberg, Nolan... Quel réalisateur se cache derrière ces films cultes ?",
        ],
      })
    ),
  },
  {
    $id: "Tag",
    description: "Tag entity",
  }
)

// GET Tags
export const TagParamsSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
  },
  {
    $id: "GetTag",
    description: "Get Tag entity",
  }
)

export type GetTagParams = Static<typeof TagParamsSchema>
export type GetTagReply = Static<typeof TagResponseSchema>
export type GetTagsReply = Array<GetTagReply>

// POST Tags
export const CreateTagSchema = Type.Object(
  {
    name: Type.String(),
    description: Type.Optional(Type.String()),
  },
  {
    $id: "CreateTag",
    description: "Create Tag entity",
  }
)

export type PostTagBody = Static<typeof CreateTagSchema>
export type PostTagReply = Static<typeof TagResponseSchema>

// PUT Tags
export const UpdateTagSchema = Type.Object(
  {
    name: Type.Optional(Type.String()),
    description: Type.Optional(Type.String()),
  },
  {
    $id: "UpdateTag",
    description: "Update Tag entity",
  }
)

export type PutTagBody = Static<typeof UpdateTagSchema>
export type PutTagReply = Static<typeof TagResponseSchema>
