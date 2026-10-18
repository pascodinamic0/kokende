/** True when Clerk publishable + secret keys are configured. */
export function clerkEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
      process.env.CLERK_SECRET_KEY,
  );
}

export const AUTH_PROVIDERS = ['google', 'apple'] as const;
