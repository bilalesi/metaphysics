import { pageable } from "relay-cursor-paging"
import { GraphQLFieldConfig } from "graphql"
import { ResolverContext } from "types/graphql"
import { connectionWithCursorInfo } from "schema/v2/fields/pagination"
import {
  ConversationEventUnion,
  fetchOrderEventsForPagination,
} from "./orderEvents"
import { fetchMessagesForPagination } from "./messageEvents"
import { fetchHybridConnection } from "./hybridConnection"

/*
TODO: cursors and pagination must be encoded and decoded correctly.
Ids are already encoded with positions.
*/
export const eventConnection: GraphQLFieldConfig<any, ResolverContext> = {
  description: "Messages and other events in a conversation.",
  type: connectionWithCursorInfo({
    nodeType: ConversationEventUnion,
  }).connectionType,
  args: pageable({}),
  //   sort: {
  //     type: new GraphQLEnumType({
  //       name: "sortMessages",
  //       values: {
  //         DESC: { value: "desc" },
  //         ASC: { value: "asc" },
  //       },
  //     }),
  //   },
  // }),
  resolve: async (
    parent,
    args,
    ctx: {
      conversationMessagesLoader?: any
      exchangeGraphQLLoader?: any
      userID?: string
    }
  ) => {
    const { id: conversationID } = parent

    const { conversationMessagesLoader, exchangeGraphQLLoader, userID } = ctx
    if (!(conversationMessagesLoader && exchangeGraphQLLoader && userID))
      return null

    const result = await fetchHybridConnection({
      args,
      fetchers: {
        msg: fetchMessagesForPagination(
          conversationID,
          conversationMessagesLoader,
          parent
        ),
        ord: fetchOrderEventsForPagination(
          conversationID,
          userID,
          exchangeGraphQLLoader
        ),
      },
      transform: (args, nodes) => {
        // 6. sort the nodes (only supports sorting by createdAt/_at key)
        const sorter =
          args.sort === "DESC"
            ? (a, b) =>
                extractNodeDate(a.createdAt) - extractNodeDate(b.createdAt)
            : (a, b) =>
                extractNodeDate(b.createdAt) - extractNodeDate(a.createdAt)

        return nodes.sort(sorter)
      },
    })

    return result
  },
}
const extractNodeDate = (node) => {
  return node["createdAt"] || node["created_at"]
}
