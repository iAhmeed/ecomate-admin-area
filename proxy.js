import { jwtVerify, SignJWT } from "jose";
import { NextResponse } from "next/server";
export default async function proxy(req) {
    try {
        let cookie;
        cookie = req.cookies.get("session")?.value;
        const path = req.nextUrl.pathname;
        if (!cookie) {
            if (path !== "/login" && path !== "/forgot-password" && path !== "/reset-password") {
                return NextResponse.redirect(new URL("/login", req.url));
            }
            return NextResponse.next();
        }
        const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);
        const { payload } = await jwtVerify(cookie, encodedKey, { algorithms: ["HS256"] });
        if (path === "/login" || path === "/forgot-password" || path === "/reset-password") {
            return NextResponse.redirect(new URL("/home", req.url));
        }
        const responseCheck = await fetch(`${req.nextUrl.origin}/api/validate-session`, {
            method: 'POST',
            body: JSON.stringify({
                adminId: payload.adminId,
                tokenVersion: payload.tokenVersion
            }),
        });

        const { isValid } = await responseCheck.json();

        if (!isValid) {
            // Password changed! Wipe the cookie and send to login
            const response = NextResponse.redirect(new URL("/login", req.url));
            response.cookies.delete("session");
            return response;
        }
        const currentTime = Math.floor(Date.now() / 1000);
        const newExpiry = currentTime + 7 * 24 * 60 * 60;
        const expiresIn = newExpiry - currentTime;

        const newToken = await new SignJWT({ adminId: payload.adminId, tokenVersion: payload.tokenVersion })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(newExpiry)
            .sign(encodedKey);

        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-session-expires-in", expiresIn.toString());

        const response = NextResponse.next({ request: { headers: requestHeaders } });

        response.cookies.set("session", newToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;

    } catch (err) {
        console.error("JWT Middleware Error:", err.message);
        if (cookie) {
            return NextResponse.redirect(new URL("/home", req.url));
        }
        else {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }
}

export const config = {
    matcher: [
        // Match all pages except internal Next.js paths
        '/((?!_next|api|favicon.ico|maisonweb-logo.jpeg).*)',
    ],
};
