
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../lib/supabase";

vi.mock("../lib/supabase", () => ({
    supabase: {
        auth: {
            getSession: vi.fn(),
            signOut: vi.fn(),
        },
        from: vi.fn(),
    },
}));

describe("ProtectedRoute Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockSession = (session) => {
        supabase.auth.getSession.mockResolvedValue({
            data: { session },
            error: null,
        });
    };

    const mockProfile = (role) => {
        const single = vi.fn().mockResolvedValue({
            data: { role },
            error: null,
        });

        const eq = vi.fn().mockReturnValue({ single });
        const select = vi.fn().mockReturnValue({ eq });

        supabase.from.mockReturnValue({ select });

        return { single, eq, select };
    };

    const renderProtectedRoute = (allowedRole) => {
        return render(
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute allowedRole={allowedRole}>
                                <h1>Protected Content</h1>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/login"
                        element={<h1>Login Page</h1>}
                    />

                    <Route
                        path="/admin"
                        element={<h1>Admin Dashboard</h1>}
                    />

                    <Route
                        path="/dashboard"
                        element={<h1>Customer Dashboard</h1>}
                    />
                </Routes>
            </MemoryRouter>
        );
    };

    it("shows a loading message while checking authentication", async () => {
        let resolveSession;

        supabase.auth.getSession.mockReturnValue(
            new Promise((resolve) => {
                resolveSession = resolve;
            })
        );

        renderProtectedRoute("customer");

        expect(
            screen.getByText(/checking authentication/i)
        ).toBeInTheDocument();

        resolveSession({
            data: { session: null },
            error: null,
        });

        expect(
            await screen.findByRole("heading", { name: /login page/i })
        ).toBeInTheDocument();
    });

    it("redirects unauthenticated users to login", async () => {
        mockSession(null);

        renderProtectedRoute("customer");

        expect(
            await screen.findByRole("heading", { name: /login page/i })
        ).toBeInTheDocument();

        expect(supabase.from).not.toHaveBeenCalled();
    });

    it("allows authenticated customers to access customer routes", async () => {
        mockSession({
            user: { id: "customer-123" },
        });

        mockProfile("customer");

        renderProtectedRoute("customer");

        expect(
            await screen.findByRole("heading", {
                name: /protected content/i,
            })
        ).toBeInTheDocument();

        expect(supabase.from).toHaveBeenCalledWith("profiles");
    });

    it("allows authenticated admins to access admin routes", async () => {
        mockSession({
            user: { id: "admin-123" },
        });

        mockProfile("admin");

        renderProtectedRoute("admin");

        expect(
            await screen.findByRole("heading", {
                name: /protected content/i,
            })
        ).toBeInTheDocument();
    });

    it("redirects customers away from admin routes", async () => {
        mockSession({
            user: { id: "customer-123" },
        });

        mockProfile("customer");

        renderProtectedRoute("admin");

        expect(
            await screen.findByRole("heading", {
                name: /customer dashboard/i,
            })
        ).toBeInTheDocument();
    });

    it("redirects admins away from customer routes", async () => {
        mockSession({
            user: { id: "admin-123" },
        });

        mockProfile("admin");

        renderProtectedRoute("customer");

        expect(
            await screen.findByRole("heading", {
                name: /admin dashboard/i,
            })
        ).toBeInTheDocument();
    });

    it("displays an error when session verification fails", async () => {
        supabase.auth.getSession.mockResolvedValue({
            data: { session: null },
            error: { message: "Session verification failed" },
        });

        renderProtectedRoute("customer");

        expect(
            await screen.findByText(/session verification failed/i)
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /sign out/i })
        ).toBeInTheDocument();
    });

    it("displays an error when the user profile cannot be found", async () => {
        mockSession({
            user: { id: "customer-123" },
        });

        const single = vi.fn().mockResolvedValue({
            data: null,
            error: { message: "Profile not found" },
        });

        supabase.from.mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({ single }),
            }),
        });

        renderProtectedRoute("customer");

        expect(
            await screen.findByText(/profile not found/i)
        ).toBeInTheDocument();
    });
});
