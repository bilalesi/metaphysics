import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql"
import { includesFieldsOtherThanSelectionSet } from "lib/hasFieldSelection"
import date from "schema/v2/fields/date"
import initials from "schema/v2/fields/initials"
import { IDFields, NodeInterface } from "schema/v2/object_identification"
import { ResolverContext } from "types/graphql"
import { SaleArtworksConnectionField } from "../sale_artworks"
import ArtworkInquiries from "./artwork_inquiries"
import AuctionResultsByFollowedArtists from "./auction_results_by_followed_artists"
import Bidders from "./bidders"
import { BidderPosition } from "./bidder_position"
import BidderPositions from "./bidder_positions"
import BidderStatus from "./bidder_status"
import CollectorProfile from "./collector_profile"
import Conversation from "./conversation"
import Invoice from "./conversation/invoice"
import Conversations from "./conversations"
import { CreditCards } from "./credit_cards"
import FollowedArtists from "./followed_artists"
import FollowedArtistsArtworkGroups from "./followed_artists_artworks_group"
import FollowedFairs from "./followed_fairs"
import FollowedGalleries from "./followed_galleries"
import { followedProfiles } from "./followedProfiles"
import FollowedGenes from "./followed_genes"
import FollowedShows from "./followed_shows"
import {
  IdentityVerification,
  PendingIdentityVerification,
} from "./identity_verification"
import LotStanding from "./lot_standing"
import LotStandings from "./lot_standings"
import { MyBids } from "./myBids"
import { MyCollection, MyCollectionInfo } from "./myCollection"
import { NewWorksByInterestingArtists } from "./newWorksByInterestingArtists"
import { myLocationType } from "./myLocation"
import { RecentlyViewedArtworks } from "./recently_viewed_artworks"
import { SaleRegistrationConnection } from "./sale_registrations"
import { SavedArtworks } from "./savedArtworks"
import { WatchedLotConnection } from "./watchedLotConnection"
import { ShowsByFollowedArtists } from "./showsByFollowedArtists"
import Image, { normalizeImageData } from "../image"
import { ArtistRecommendations } from "./artistRecommendations"
import { PhoneNumber } from "../phoneNumber"
import { authentications } from "./authentications"
import { ManagedPartners } from "./partners"

export const meType = new GraphQLObjectType<any, ResolverContext>({
  name: "Me",
  interfaces: [NodeInterface],
  fields: {
    ...IDFields,
    artistRecommendations: ArtistRecommendations,
    artworkInquiriesConnection: ArtworkInquiries,
    auctionResultsByFollowedArtists: AuctionResultsByFollowedArtists,
    authentications: authentications,
    bidders: Bidders,
    bidderStatus: BidderStatus,
    bidderPositions: BidderPositions,
    bidderPosition: BidderPosition,
    bio: {
      type: GraphQLString,
      resolve: (_root, options, { collectorProfileLoader }) => {
        if (!collectorProfileLoader) {
          throw new Error("You need to be signed in to perform this action")
        }
        return collectorProfileLoader(options).then(({ bio }) => bio)
      },
    },
    collectorLevel: {
      type: GraphQLInt,
      resolve: ({ collector_level }) => {
        return collector_level
      },
    },
    collectorProfile: CollectorProfile,
    conversation: Conversation,
    conversationsConnection: Conversations,
    createdAt: date,
    creditCards: CreditCards,
    email: {
      type: GraphQLString,
    },
    emailFrequency: {
      description: "Frequency of marketing emails.",
      resolve: ({ email_frequency }) => email_frequency,
      type: GraphQLString,
    },
    canRequestEmailConfirmation: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: "Whether user is allowed to request email confirmation",
      resolve: ({ can_request_email_confirmation }) =>
        can_request_email_confirmation,
    },
    followsAndSaves: {
      type: new GraphQLObjectType<any, ResolverContext>({
        name: "FollowsAndSaves",
        fields: {
          bundledArtworksByArtistConnection: FollowedArtistsArtworkGroups,
          artistsConnection: FollowedArtists,
          artworksConnection: SavedArtworks,
          fairsConnection: FollowedFairs,
          galleriesConnection: FollowedGalleries,
          profilesConnection: followedProfiles,
          genesConnection: FollowedGenes,
          showsConnection: FollowedShows,
        },
      }),
      resolve: () => ({}),
    },
    hasCreditCards: {
      type: GraphQLBoolean,
      resolve: (_root, _options, { meCreditCardsLoader }) => {
        if (!meCreditCardsLoader) return null
        return meCreditCardsLoader().then(({ body }) => {
          return body && body.length > 0
        })
      },
    },
    hasPassword: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ has_password }) => has_password,
    },
    hasQualifiedCreditCards: {
      type: GraphQLBoolean,
      resolve: (_root, _options, { meCreditCardsLoader }) => {
        if (!meCreditCardsLoader) return null
        return meCreditCardsLoader({ qualified_for_bidding: true }).then(
          ({ body }) => {
            return body && body.length > 0
          }
        )
      },
    },
    hasSecondFactorEnabled: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ second_factor_enabled }) => second_factor_enabled,
    },
    icon: {
      type: Image.type,
      resolve: (_root, options, { collectorProfileLoader }) => {
        if (!collectorProfileLoader) {
          throw new Error("You need to be signed in to perform this action")
        }
        return collectorProfileLoader(options).then(({ icon }) =>
          normalizeImageData(icon)
        )
      },
    },
    invoice: Invoice,
    identityVerification: IdentityVerification,
    identityVerified: {
      type: GraphQLBoolean,
      resolve: ({ identity_verified }) => identity_verified,
    },
    inquiryIntroduction: {
      type: GraphQLString,
      resolve: async (_me, _options, { inquiryIntroductionLoader }) => {
        const { introduction } = await inquiryIntroductionLoader?.()
        return introduction
      },
    },
    isCollector: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ is_collector }) => {
        return !!is_collector
      },
    },
    labFeatures: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
      description: "List of lab features for this user",
      resolve: ({ lab_features }) => lab_features || [],
    },
    location: { type: myLocationType },
    lotsByFollowedArtistsConnection: SaleArtworksConnectionField,
    lotStanding: LotStanding,
    lotStandings: LotStandings,
    partners: ManagedPartners,
    myCollectionConnection: MyCollection,
    myCollectionInfo: MyCollectionInfo,
    myBids: MyBids,
    name: {
      type: GraphQLString,
    },
    newWorksByInterestingArtists: NewWorksByInterestingArtists,
    initials: initials("name"),
    paddleNumber: {
      type: GraphQLString,
      resolve: ({ paddle_number }) => paddle_number,
    },
    pendingIdentityVerification: PendingIdentityVerification,
    phone: {
      type: GraphQLString,
    },
    phoneNumber: {
      type: PhoneNumber.type,
      resolve: ({ phone }, _, context, info) =>
        PhoneNumber.resolve?.(null, { phoneNumber: phone }, context, info),
    },
    priceRange: {
      type: GraphQLString,
      resolve: ({ price_range }) => price_range,
    },
    priceRangeMin: {
      type: GraphQLFloat,
      resolve: ({ price_range }) => price_range?.split(":")[0],
    },
    priceRangeMax: {
      type: GraphQLFloat,
      resolve: ({ price_range }) => price_range?.split(":")[1],
    },
    privacy: { type: GraphQLInt },
    profession: {
      type: GraphQLString,
    },
    receivePurchaseNotification: {
      description: "This user should receive purchase notifications",
      type: GraphQLBoolean,
      resolve: ({ receive_purchase_notification }) =>
        receive_purchase_notification,
    },
    receiveOutbidNotification: {
      description: "This user should receive outbid notifications",
      type: GraphQLBoolean,
      resolve: ({ receive_outbid_notification }) => receive_outbid_notification,
    },
    receiveLotOpeningSoonNotification: {
      description: "This user should receive lot opening notifications",
      type: GraphQLBoolean,
      resolve: ({ receive_lot_opening_soon_notification }) =>
        receive_lot_opening_soon_notification,
    },
    receiveSaleOpeningClosingNotification: {
      description:
        "This user should receive sale opening/closing notifications",
      type: GraphQLBoolean,
      resolve: ({ receive_sale_opening_closing_notification }) =>
        receive_sale_opening_closing_notification,
    },
    receiveNewWorksNotification: {
      description: "This user should receive new works notifications",
      type: GraphQLBoolean,
      resolve: ({ receive_new_works_notification }) =>
        receive_new_works_notification,
    },
    receiveNewSalesNotification: {
      description: "This user should receive new sales notifications",
      type: GraphQLBoolean,
      resolve: ({ receive_new_sales_notification }) =>
        receive_new_sales_notification,
    },
    receivePromotionNotification: {
      description: "This user should receive promotional notifications",
      type: GraphQLBoolean,
      resolve: ({ receive_promotion_notification }) =>
        receive_promotion_notification,
    },
    recentlyViewedArtworkIds: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
      resolve: ({ recently_viewed_artwork_ids }) => recently_viewed_artwork_ids,
    },
    recentlyViewedArtworksConnection: RecentlyViewedArtworks,
    saleRegistrationsConnection: SaleRegistrationConnection,
    shareFollows: {
      type: new GraphQLNonNull(GraphQLBoolean),
      resolve: ({ share_follows }) => {
        return !!share_follows
      },
    },
    type: {
      type: GraphQLString,
    },
    showsByFollowedArtists: ShowsByFollowedArtists,
    unreadNotificationsCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "A count of unread notifications.",
      resolve: (_root, options, { notificationsFeedLoader }) => {
        if (!notificationsFeedLoader)
          throw new Error("You need to be signed in to perform this action")

        return notificationsFeedLoader(options).then(({ total_unread }) => {
          return total_unread || 0
        })
      },
    },
    unreadConversationCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: "The count of conversations with unread messages.",
      resolve: (_root, _options, { conversationsLoader }) => {
        if (!conversationsLoader) return 0
        const expand = ["total_unread_count"]
        return conversationsLoader({ page: 1, size: 0, expand }).then(
          ({ total_unread_count }) => total_unread_count
        )
      },
    },
    watchedLotConnection: WatchedLotConnection,
  },
})

const MeField: GraphQLFieldConfig<void, ResolverContext> = {
  type: meType,
  resolve: (_root, _options, { userID, meLoader }, info) => {
    if (!meLoader) return null
    const fieldsNotRequireLoader = [
      "id",
      "internalID",
      "creditCards",
      "hasCreditCards",
      "hasQualifiedCreditCards",
      "bidders",
      "bidderPositions",
      "bidderPosition",
      "bidderStatus",
      "lotStanding",
      "lotStandings",
      "saleRegistrationsConnection",
      "conversation",
      "conversations",
      "collectorProfile",
      "artworkInquiries",
      "followsAndSaves",
      "lotsByFollowedArtistsConnection",
      "identityVerification",
      "unreadNotificationsCount",
    ]
    if (includesFieldsOtherThanSelectionSet(info, fieldsNotRequireLoader)) {
      return meLoader()
    }
    // The email and is_collector are here so that the type system's `isTypeOf`
    // resolves correctly when we're skipping gravity data
    return { id: userID, email: null, is_collector: null }
  },
}

export default MeField
