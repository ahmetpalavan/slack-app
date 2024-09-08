import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { mutation, query, QueryCtx } from './_generated/server';

const populateUser = (ctx: QueryCtx, id: Id<'users'>) => {
  return ctx.db.get(id);
};

export const current = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', args.workspaceId))
      .unique();

    if (!member) {
      return null;
    }

    return member;
  },
});

export const getById = query({
  args: {
    id: v.id('members'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db.get(args.id);

    if (!member) {
      return null;
    }

    const currentMember = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', member.workspaceId));

    if (!currentMember) {
      return null;
    }

    const user = await populateUser(ctx, member.userId);

    if (!user) {
      return null;
    }

    return {
      ...member,
      user,
    };
  },
});

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', args.workspaceId))
      .unique();

    if (!member) {
      return null;
    }

    const data = await ctx.db
      .query('members')
      .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.workspaceId))
      .collect();

    const members = [];

    for (const member of data) {
      members.push({
        ...member,
        user: await populateUser(ctx, member.userId),
      });
    }

    return members;
  },
});

export const update = mutation({
  args: {
    id: v.id('members'),
    role: v.union(v.literal('admin'), v.literal('member')),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const member = await ctx.db.get(args.id);

    if (!member) {
      throw new Error('Member not found');
    }

    const currentMember = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', member.workspaceId))
      .unique();

    if (!currentMember || currentMember.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(args.id, {
      role: args.role,
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('members'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      console.log('User not authenticated');
      throw new Error('Unauthorized');
    }

    const member = await ctx.db.get(args.id);

    if (!member) {
      throw new Error('Member not found');
    }

    const currentMember = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', member.workspaceId))
      .unique();

    if (!currentMember) {
      console.log('No current member found for userId:', userId);
      throw new Error('Unauthorized');
    }

    if (currentMember.role !== 'admin') {
      console.log('User is not an admin:', userId);
      throw new Error('Unauthorized');
    }

    if (member.role === 'admin') {
      throw new Error('Cannot remove admin');
    }

    if (currentMember._id === args.id) {
      throw new Error('Cannot remove self');
    }

    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query('messages')
        .withIndex('member_id', (q) => q.eq('memberId', member._id))
        .collect(),
      ctx.db
        .query('reactions')
        .withIndex('by_member_id', (q) => q.eq('memberId', member._id))
        .collect(),
      ctx.db
        .query('conversations')
        .filter((q) => q.or(q.eq(q.field('memberOneId'), member._id), q.eq(q.field('memberTwoId'), member._id)))
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    for (const reaction of reactions) {
      await ctx.db.delete(reaction._id);
    }

    for (const conversation of conversations) {
      await ctx.db.delete(conversation._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
