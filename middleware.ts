import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';

const isSignInPage = createRouteMatcher(['/auth']);

export default convexAuthNextjsMiddleware((ctx) => {
  if (!isSignInPage(ctx) && !isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(ctx, '/auth');
  }

  if (isSignInPage(ctx) && isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(ctx, '/');
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
