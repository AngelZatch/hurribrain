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
