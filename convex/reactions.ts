import { v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { QueryCtx, mutation } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

const getMember = async (ctx: QueryCtx, workspaceId: Id<'workspaces'>, userId: Id<'users'>) => {
  return await ctx.db
    .query('members')
    .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', workspaceId))
    .unique();
};

export const toggle = mutation({
  args: {
    messageId: v.id('messages'),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new Error('Message not found');
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    if (!member) {
      throw new Error('Member not found');
    }

    const existingMessageReactionFromUser = await ctx.db
      .query('reactions')
      .filter((q) =>
        q.and(q.eq(q.field('messageId'), args.messageId), q.eq(q.field('memberId'), member._id), q.eq(q.field('value'), args.value))
      )
      .first();

    if (existingMessageReactionFromUser) {
      await ctx.db.delete(existingMessageReactionFromUser._id);

      return existingMessageReactionFromUser._id;
    } else {
      const reactionId = await ctx.db.insert('reactions', {
        value: args.value,
        memberId: member._id,
        messageId: message._id,
        workspaceId: message.workspaceId,
      });

      return reactionId;
    }
  },
});
