export const authRoutes = {
    signIn: "/sign-in",
    workspaces: "/workspaces",
    home: "/",
} as const;

export const protectedRoutes = [
    authRoutes.workspaces,
] as const;

export const unauthenticatedRoutes = [authRoutes.signIn] as const;

export function isProtectedRoute(pathname: string) {
    return protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
}

export function isUnauthenticatedRoute(pathname: string) {
    return unauthenticatedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );
}