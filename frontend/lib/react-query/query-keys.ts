export const queryKeys = {
  authedUser: ["authedUser"] as const,
  cars: (filters) => ["cars", filters] as const,
  conversations: (userId: string) => ["conversations", userId] as const,
  messages: (conversationId: string) => ["messages", conversationId] as const,
  wishlist: (userId: string) => ["wl-cars-ids", userId]
}