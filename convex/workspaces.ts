import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

const generateCode = () => {
  const code = Array.from({ length: 6 }, () => '0123456789abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 36)]).join('');
  return code;
};

export const newJoinCode = mutation({
  args: {
    id: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', args.id))
      .unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    const joinCode = generateCode();

    await ctx.db.patch(args.id, { joinCode });

    return joinCode;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error('Unauthorized');
    }

    const joinCode = generateCode();

    const workspaceId = await ctx.db.insert('workspaces', {
      name: args.name,
      joinCode,
      userId,
    });

    await ctx.db.insert('members', {
      userId,
      workspaceId,
      role: 'admin',
    });

    await ctx.db.insert('channels', {
      name: 'general',
      workspaceId,
    });

    return workspaceId;
  },
});

export const get = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query('members')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);

    let workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

export const getById = query({
  args: { id: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', args.id))
      .unique();

    if (!member) {
      return null;
    }

    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id('workspaces'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', args.id))
      .unique();

    if (!member || member.role !== 'admin') {
      throw new Error('Unauthorized');
    }

    await ctx.db.patch(args.id, { name: args.name });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const [member] = await Promise.all([
      ctx.db
        .query('members')
        .withIndex('by_user_id_and_workspace_id', (q) => q.eq('userId', userId).eq('workspaceId', args.id))
        .collect(),
    ]);

    for (const m of member) {
      await ctx.db.delete(m._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
