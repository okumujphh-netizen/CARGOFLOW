

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Register from "../pages/Register";
import { supabase } from "../lib/supabase";

vi.mock("../lib/supabase", () => ({
    supabase: {
        auth: {
            signUp: vi.fn(),
        },
    },
}));

describe("Register Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderRegister = () => {
        return render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );
    };

    it("renders the registration form", () => {
        renderRegister();

        expect(
            screen.getByRole("heading", { name: /create account/i })
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText(/full name/i)
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText(/email address/i)
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText(/phone number/i)
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText("Password", { selector: "input" })
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText("Confirm Password", {
                selector: "input",
            })
        ).toBeInTheDocument();

        expect(
            screen.getByRole("button", { name: /create account/i })
        ).toBeInTheDocument();
    });

    it("allows users to enter registration details", async () => {
        const user = userEvent.setup();

        renderRegister();

        await user.type(
            screen.getByLabelText(/full name/i),
            "Test Customer"
        );

        await user.type(
            screen.getByLabelText(/email address/i),
            "customer@example.com"
        );

        await user.type(
            screen.getByLabelText(/phone number/i),
            "+254712345678"
        );

        await user.type(
            screen.getByLabelText("Password", { selector: "input" }),
            "TestPassword123"
        );

        await user.type(
            screen.getByLabelText("Confirm Password", {
                selector: "input",
            }),
            "TestPassword123"
        );

        expect(screen.getByLabelText(/full name/i)).toHaveValue(
            "Test Customer"
        );

        expect(screen.getByLabelText(/email address/i)).toHaveValue(
            "customer@example.com"
        );

        expect(screen.getByLabelText(/phone number/i)).toHaveValue(
            "+254712345678"
        );

        expect(
            screen.getByLabelText("Password", { selector: "input" })
        ).toHaveValue("TestPassword123");

        expect(
            screen.getByLabelText("Confirm Password", {
                selector: "input",
            })
        ).toHaveValue("TestPassword123");
    });

    it("toggles password visibility", async () => {
        const user = userEvent.setup();

        renderRegister();

        const passwordInput = screen.getByLabelText("Password", {
            selector: "input",
        });

        expect(passwordInput).toHaveAttribute("type", "password");

        await user.click(
            screen.getByRole("button", { name: /show password/i })
        );

        expect(passwordInput).toHaveAttribute("type", "text");

        await user.click(
            screen.getByRole("button", { name: /hide password/i })
        );

        expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("displays an error when registration fails", async () => {
        const user = userEvent.setup();

        supabase.auth.signUp.mockResolvedValue({
            data: {
                user: null,
                session: null,
            },
            error: {
                message: "Email already registered",
            },
        });

        renderRegister();

        await user.type(
            screen.getByLabelText(/full name/i),
            "Test Customer"
        );

        await user.type(
            screen.getByLabelText(/email address/i),
            "customer@example.com"
        );

        await user.type(
            screen.getByLabelText(/phone number/i),
            "+254712345678"
        );

        await user.type(
            screen.getByLabelText("Password", { selector: "input" }),
            "TestPassword123"
        );

        await user.type(
            screen.getByLabelText("Confirm Password", {
                selector: "input",
            }),
            "TestPassword123"
        );

        await user.click(
            screen.getByRole("button", { name: /create account/i })
        );

        await waitFor(() => {
            expect(
                screen.getByText(/email already registered/i)
            ).toBeInTheDocument();
        });

        expect(supabase.auth.signUp).toHaveBeenCalled();
    });
});
