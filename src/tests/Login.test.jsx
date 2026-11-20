
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import { supabase } from "../lib/supabase";

vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
  },
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form correctly", () => {
    renderLogin();

    expect(
      screen.getByRole("heading", { name: "Welcome Back" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Sign In" })
    ).toBeInTheDocument();
  });

  it("allows users to enter their email and password", async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.type(
      screen.getByLabelText(/email address/i),
      "customer@example.com"
    );

    await user.type(
     screen.getByLabelText("Password", { selector: "input" }),
      "TestPassword123"
    );

    expect(screen.getByLabelText(/email address/i))
      .toHaveValue("customer@example.com");

    expect(screen.getByLabelText(/password/i))
      .toHaveValue("TestPassword123");
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    renderLogin();

    const passwordInput = screen.getByLabelText(/password/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", { name: "Show password" })
    );

    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(
      screen.getByRole("button", { name: "Hide password" })
    );

    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("displays an authentication error when login fails", async () => {
    const user = userEvent.setup();

    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: "Invalid login credentials" },
    });

    renderLogin();

    await user.type(
      screen.getByLabelText(/email address/i),
      "customer@example.com"
    );

    await user.type(
      screen.getByLabelText(/password/i),
      "WrongPassword123"
    );

    await user.click(
      screen.getByRole("button", { name: "Sign In" })
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Invalid login credentials");

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "customer@example.com",
      password: "WrongPassword123",
    });
  });
});
