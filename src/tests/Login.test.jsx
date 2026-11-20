

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/Login";
import { supabase } from "../lib/supabase";

vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
    },
  },
}));

const renderLogin = () => {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login form", () => {
    renderLogin();

    expect(
      screen.getByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/email address/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Password", { selector: "input" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /sign in/i })
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

    expect(
      screen.getByLabelText(/email address/i)
    ).toHaveValue("customer@example.com");

    expect(
      screen.getByLabelText("Password", { selector: "input" })
    ).toHaveValue("TestPassword123");
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    renderLogin();

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

  it("displays an authentication error when login fails", async () => {
    const user = userEvent.setup();

    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" },
    });

    renderLogin();

    await user.type(
      screen.getByLabelText(/email address/i),
      "customer@example.com"
    );

    await user.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "WrongPassword123"
    );

    await user.click(
      screen.getByRole("button", { name: /sign in/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/invalid login credentials/i)
      ).toBeInTheDocument();
    });
  });
});
