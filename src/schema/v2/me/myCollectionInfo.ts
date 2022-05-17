import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLInt,
} from "graphql"
import { ResolverContext } from "types/graphql"

const MyCollectionInfoType = new GraphQLObjectType<any, ResolverContext>({
  name: "MyCollectionInfo",
  fields: () => ({
    description: {
      type: new GraphQLNonNull(GraphQLString),
    },
    default: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    includesPurchasedArtworks: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: (myCollection) => myCollection.includes_purchased_artworks,
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    private: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    artworkCount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    artistCount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  }),
})

export const MyCollectionInfo: GraphQLFieldConfig<any, ResolverContext> = {
  type: MyCollectionInfoType,
  description: "Info about the current user's my-collection",
  resolve: async ({ id }, _options, { collectionLoader }) => {
    if (!collectionLoader) {
      return null
    }
    const collectionResponse = await collectionLoader("my-collection", {
      user_id: id,
      private: true,
    })

    return collectionResponse
  },
}
