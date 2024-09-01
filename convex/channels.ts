import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', args.workspaceId))
      .unique();

    if (!members) {
      return [];
    }

    const channels = await ctx.db
      .query('channels')
      .withIndex('by_workspace_id', (q) => q.eq('workspaceId', args.workspaceId))
      .collect();

    return channels;
  },
});

export const getById = query({
  args: {
    channelId: v.id('channels'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    const channel = await ctx.db.get(args.channelId);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    if (!channel) {
      throw new Error('Channel not found');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', channel.workspaceId))
      .unique();

    if (!member) {
      throw new Error('Unauthorized');
    }

    return channel;
  },
});

export const update = mutation({
  args: {
    channelId: v.id('channels'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const channel = await ctx.db.get(args.channelId);

    if (!channel) {
      throw new Error('Channel not found');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', channel.workspaceId))
      .unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const parsedName = args.name.replace(/\s+/g, '-').toLowerCase();

    await ctx.db.patch(args.channelId, {
      name: parsedName,
    });

    return true;
  },
});

export const remove = mutation({
  args: {
    channelId: v.id('channels'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const channel = await ctx.db.get(args.channelId);

    if (!channel) {
      throw new Error('Channel not found');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', channel.workspaceId))
      .unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    await ctx.db.delete(args.channelId);

    return true;
  },
});

export const create = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', args.workspaceId))
      .unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const parsedName = args.name.replace(/\s+/g, '-').toLowerCase();

    const channel = await ctx.db.insert('channels', {
      name: parsedName,
      workspaceId: args.workspaceId,
    });

    return channel;
  },
});
