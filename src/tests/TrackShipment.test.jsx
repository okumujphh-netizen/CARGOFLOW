
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TrackShipment from "../pages/TrackShipment";
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

const mockShipment = {
  id: "shipment-1",
  tracking_number: "CF-2026-ABC12345",
  origin: "Mombasa, Kenya",
  destination: "Dubai, UAE",
  cargo_description: "Electronics",
  status: "in_transit",
  booking_date: "2026-11-20",
  estimated_delivery: "2026-12-05",
};

function renderTrackShipment() {
  return render(
    <MemoryRouter>
      <TrackShipment />
    </MemoryRouter>
  );
}

describe("TrackShipment", () => {
  let maybeSingleMock;
  let secondEqMock;
  let firstEqMock;
  let selectMock;

  beforeEach(() => {
    vi.clearAllMocks();

    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    maybeSingleMock = vi.fn().mockResolvedValue({
      data: mockShipment,
      error: null,
    });

    secondEqMock = vi.fn().mockReturnValue({
      maybeSingle: maybeSingleMock,
    });

    firstEqMock = vi.fn().mockReturnValue({
      eq: secondEqMock,
    });

    selectMock = vi.fn().mockReturnValue({
      eq: firstEqMock,
    });

    supabase.from.mockReturnValue({
      select: selectMock,
    });
  });

  afterEach(() => {
    cleanup();
  });

  function submitTrackingNumber(value = "CF-2026-ABC12345") {
    fireEvent.change(screen.getByLabelText(/tracking number/i), {
      target: { value },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /track shipment/i })
    );
  }

  it("renders the tracking form and initial empty state", () => {
    renderTrackShipment();

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: "Track Shipment" })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/tracking number/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/ready to track your shipment/i)
    ).toBeInTheDocument();
  });

  it("displays a validation error when the tracking number is empty", async () => {
    renderTrackShipment();

    fireEvent.click(
      screen.getByRole("button", { name: /track shipment/i })
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent("Please enter a tracking number.");

    expect(supabase.auth.getUser).not.toHaveBeenCalled();
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("tracks and displays a shipment successfully", async () => {
    renderTrackShipment();

    submitTrackingNumber();

    expect(
      await screen.findByText("CF-2026-ABC12345")
    ).toBeInTheDocument();

    expect(screen.getByText("Mombasa, Kenya")).toBeInTheDocument();
    expect(screen.getByText("Dubai, UAE")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();

    // In Transit appears in both the status badge and progress timeline.
    expect(screen.getAllByText("In Transit")).toHaveLength(2);

    expect(screen.getByText("Shipment Progress")).toBeInTheDocument();
    expect(screen.getByText("Booking Received")).toBeInTheDocument();
    expect(screen.getByText("Shipment Confirmed")).toBeInTheDocument();
    expect(screen.getByText("Delivered")).toBeInTheDocument();

    expect(
      screen.getByText("Current shipment status")
    ).toBeInTheDocument();
  });

  it("queries shipments using the tracking number and authenticated customer ID", async () => {
    renderTrackShipment();

    submitTrackingNumber("  CF-2026-ABC12345  ");

    await screen.findByText("CF-2026-ABC12345");

    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabase.from).toHaveBeenCalledWith("shipments");

    expect(selectMock).toHaveBeenCalledWith(
      "id, tracking_number, origin, destination, cargo_description, status, booking_date, estimated_delivery"
    );

    expect(firstEqMock).toHaveBeenCalledWith(
      "tracking_number",
      "CF-2026-ABC12345"
    );

    expect(secondEqMock).toHaveBeenCalledWith(
      "customer_id",
      mockUser.id
    );

    expect(maybeSingleMock).toHaveBeenCalledTimes(1);
  });

  it("displays an error when the customer is not authenticated", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    renderTrackShipment();
    submitTrackingNumber();

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Unable to identify your account. Please log in again."
    );

    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("displays an error when authentication fails", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Authentication failed" },
    });

    renderTrackShipment();
    submitTrackingNumber();

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Unable to identify your account. Please log in again."
    );

    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("displays an error when no matching shipment is found", async () => {
    maybeSingleMock.mockResolvedValue({
      data: null,
      error: null,
    });

    renderTrackShipment();
    submitTrackingNumber();

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "No shipment found with that tracking number in your account."
    );
  });

  it("displays an error when the shipment database query fails", async () => {
    maybeSingleMock.mockResolvedValue({
      data: null,
      error: { message: "Database unavailable" },
    });

    renderTrackShipment();
    submitTrackingNumber();

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Something went wrong while tracking your shipment. Please try again."
    );
  });

  it("displays cancelled shipment information", async () => {
    maybeSingleMock.mockResolvedValue({
      data: {
        ...mockShipment,
        status: "cancelled",
      },
      error: null,
    });

    renderTrackShipment();
    submitTrackingNumber();

    expect(
      await screen.findByText("Shipment Cancelled")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "This shipment is no longer progressing through delivery."
      )
    ).toBeInTheDocument();
  });

  it("displays a fallback message for an unknown shipment status", async () => {
    maybeSingleMock.mockResolvedValue({
      data: {
        ...mockShipment,
        status: "on_hold",
        booking_date: null,
        estimated_delivery: null,
        cargo_description: "",
      },
      error: null,
    });

    renderTrackShipment();
    submitTrackingNumber();

    expect(
      await screen.findByText("On Hold")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Progress information is not available for this status."
      )
    ).toBeInTheDocument();

    expect(screen.getAllByText("Not available")).toHaveLength(2);
    expect(screen.getByText("Not provided")).toBeInTheDocument();
  });
});