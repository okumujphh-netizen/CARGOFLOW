import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BookShipment from "../pages/BookShipment";
import { supabase } from "../lib/supabase";

vi.mock("../components/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

const mockUser = {
  id: "customer-123",
  email: "customer@example.com",
};

function renderBookShipment() {
  return render(
    <MemoryRouter>
      <BookShipment />
    </MemoryRouter>
  );
}

async function fillBookingForm(user, options = {}) {
  await user.type(
    screen.getByLabelText(/shipment origin/i),
    options.origin || " Mombasa, Kenya "
  );

  await user.type(
    screen.getByLabelText(/shipment destination/i),
    options.destination || " Dubai, UAE "
  );

  await user.type(
    screen.getByLabelText(/cargo description/i),
    options.cargo || " Electronics "
  );

  if (options.deliveryDate) {
    await user.type(
      screen.getByLabelText(/expected delivery date/i),
      options.deliveryDate
    );
  }
}

describe("BookShipment", () => {
  let insertMock;

  beforeEach(() => {
    vi.clearAllMocks();

    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    insertMock = vi.fn().mockResolvedValue({
      error: null,
    });

    supabase.from.mockReturnValue({
      insert: insertMock,
    });

    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue(
      "abcd1234-5678-90ab-cdef-123456789abc"
    );
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders the shipment booking form", () => {
    renderBookShipment();

    expect(
      screen.getByRole("heading", { name: /book a shipment/i })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/shipment origin/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/shipment destination/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/cargo description/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/expected delivery date/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /submit shipment booking/i })
    ).toBeInTheDocument();
  });

  it("allows a customer to enter shipment details", async () => {
    const user = userEvent.setup();

    renderBookShipment();

    await fillBookingForm(user);

    expect(screen.getByLabelText(/shipment origin/i)).toHaveValue(
      " Mombasa, Kenya "
    );

    expect(screen.getByLabelText(/shipment destination/i)).toHaveValue(
      " Dubai, UAE "
    );

    expect(screen.getByLabelText(/cargo description/i)).toHaveValue(
      " Electronics "
    );
  });

  it("submits a shipment successfully and generates a tracking number", async () => {
    const user = userEvent.setup();

    renderBookShipment();

    await fillBookingForm(user, {
      deliveryDate: "2027-01-15",
    });

    await user.click(
      screen.getByRole("button", { name: /submit shipment booking/i })
    );

    await waitFor(() => {
      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(supabase.from).toHaveBeenCalledWith("shipments");
      expect(insertMock).toHaveBeenCalledTimes(1);
    });

    const submittedShipment = insertMock.mock.calls[0][0][0];

    expect(submittedShipment).toMatchObject({
      customer_id: mockUser.id,
      tracking_number: expect.stringMatching(/^CF-\d{4}-ABCD1234$/),
      origin: "Mombasa, Kenya",
      destination: "Dubai, UAE",
      cargo_description: "Electronics",
      status: "pending",
      estimated_delivery: "2027-01-15",
    });

    expect(submittedShipment.booking_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    expect(
      await screen.findByRole("status")
    ).toHaveTextContent(/your shipment booking was successful/i);

    expect(screen.getByRole("status")).toHaveTextContent(
      /CF-\d{4}-ABCD1234/
    );
  });

  it("resets the form after a successful booking", async () => {
    const user = userEvent.setup();

    renderBookShipment();

    await fillBookingForm(user);

    await user.click(
      screen.getByRole("button", { name: /submit shipment booking/i })
    );

    await screen.findByRole("status");

    expect(screen.getByLabelText(/shipment origin/i)).toHaveValue("");
    expect(screen.getByLabelText(/shipment destination/i)).toHaveValue("");
    expect(screen.getByLabelText(/cargo description/i)).toHaveValue("");
    expect(screen.getByLabelText(/expected delivery date/i)).toHaveValue("");
  });

  it("shows an error when the customer is not authenticated", async () => {
    const user = userEvent.setup();

    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    renderBookShipment();

    await fillBookingForm(user);

    await user.click(
      screen.getByRole("button", { name: /submit shipment booking/i })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /please sign in before booking a shipment/i
    );

    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("displays a Supabase booking error", async () => {
    const user = userEvent.setup();

    insertMock.mockResolvedValue({
      error: { message: "Database booking failed" },
    });

    renderBookShipment();

    await fillBookingForm(user);

    await user.click(
      screen.getByRole("button", { name: /submit shipment booking/i })
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Database booking failed"
    );
  });

  it("stores a null delivery date when no date is selected", async () => {
    const user = userEvent.setup();

    renderBookShipment();

    await fillBookingForm(user);

    await user.click(
      screen.getByRole("button", { name: /submit shipment booking/i })
    );

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledTimes(1);
    });

    const submittedShipment = insertMock.mock.calls[0][0][0];

    expect(submittedShipment.estimated_delivery).toBeNull();
  });

  it("shows a loading state while the booking is being submitted", async () => {
    const user = userEvent.setup();

    let resolveBooking;

    insertMock.mockReturnValue(
      new Promise((resolve) => {
        resolveBooking = resolve;
      })
    );

    renderBookShipment();

    await fillBookingForm(user);

    await user.click(
      screen.getByRole("button", { name: /submit shipment booking/i })
    );

    expect(
      await screen.findByRole("button", { name: /submitting booking/i })
    ).toBeDisabled();

    resolveBooking({ error: null });

    expect(await screen.findByRole("status")).toBeInTheDocument();
  });
});