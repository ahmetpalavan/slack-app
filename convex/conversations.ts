import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const createOrGetConversation = mutation({
  args: {
    memberId: v.id('members'),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const currentMember = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', args.workspaceId))
      .unique();

    const otherMember = await ctx.db.get(args.memberId);

    if (!currentMember || !otherMember) {
      throw new Error('Invalid member');
    }

    const existingConversation = await ctx.db
      .query('conversations')
      .filter((q) =>
        q.or(
          q.and(q.eq(q.field('memberOneId'), currentMember._id), q.eq(q.field('memberTwoId'), otherMember._id)),
          q.and(q.eq(q.field('memberOneId'), otherMember._id), q.eq(q.field('memberTwoId'), currentMember._id))
        )
      )
      .unique();

    if (existingConversation) {
      return existingConversation._id;
    }

    const conversationId = await ctx.db.insert('conversations', {
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
      workspaceId: args.workspaceId,
    });

    return conversationId;
  },
});
