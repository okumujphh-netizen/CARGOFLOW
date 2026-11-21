
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MyShipments from "../pages/myshipments";
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

const mockShipments = [
  {
    id: "shipment-1",
    tracking_number: "CF-2026-ABC12345",
    origin: "Mombasa, Kenya",
    destination: "Dubai, UAE",
    cargo_description: "Electronics",
    status: "in_transit",
    booking_date: "2026-11-20",
    estimated_delivery: "2026-12-05",
  },
  {
    id: "shipment-2",
    tracking_number: "CF-2026-XYZ67890",
    origin: "Nairobi, Kenya",
    destination: "London, UK",
    cargo_description: "Clothing",
    status: "pending",
    booking_date: "2026-11-19",
    estimated_delivery: null,
  },
];

function renderMyShipments() {
  return render(
    <MemoryRouter>
      <MyShipments />
    </MemoryRouter>
  );
}

describe("MyShipments", () => {
  let selectMock;
  let eqMock;
  let orderMock;

  beforeEach(() => {
    vi.clearAllMocks();

    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    });

    orderMock = vi.fn().mockResolvedValue({
      data: mockShipments,
      error: null,
    });

    eqMock = vi.fn().mockReturnValue({
      order: orderMock,
    });

    selectMock = vi.fn().mockReturnValue({
      eq: eqMock,
    });

    supabase.from.mockReturnValue({
      select: selectMock,
    });
  });

  afterEach(() => {
    cleanup();
  });
  it("displays the loading state while shipments are being fetched", async () => {
    let resolveShipments;

    orderMock.mockReturnValue(
      new Promise((resolve) => {
        resolveShipments = resolve;
      })
    );

    renderMyShipments();

    expect(
      screen.getByText(/loading your shipments/i)
    ).toBeInTheDocument();

    await act(async () => {
      resolveShipments({
        data: [],
        error: null,
      });
    });
  });


  it("fetches and displays the customer's shipments", async () => {
    renderMyShipments();

    expect(
      await screen.findByText("CF-2026-ABC12345")
    ).toBeInTheDocument();

    expect(
      screen.getByText("CF-2026-XYZ67890")
    ).toBeInTheDocument();

    expect(screen.getByText("Mombasa, Kenya")).toBeInTheDocument();
    expect(screen.getByText("Dubai, UAE")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Clothing")).toBeInTheDocument();

    expect(screen.getByText("in transit")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
    expect(screen.getByText("2026-11-20")).toBeInTheDocument();
    expect(screen.getByText("2026-12-05")).toBeInTheDocument();
  });

  it("filters shipments by the authenticated customer's ID", async () => {
    renderMyShipments();

    await screen.findByText("CF-2026-ABC12345");

    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabase.from).toHaveBeenCalledWith("shipments");

    expect(selectMock).toHaveBeenCalledWith(
      "id, tracking_number, origin, destination, cargo_description, status, booking_date, estimated_delivery"
    );

    expect(eqMock).toHaveBeenCalledWith(
      "customer_id",
      mockUser.id
    );

    expect(orderMock).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
  });

  it("displays the correct total shipment count", async () => {
    renderMyShipments();

    await screen.findByText("CF-2026-ABC12345");

    expect(screen.getByText("Total Shipments")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("displays an empty state when the customer has no shipments", async () => {
    orderMock.mockResolvedValue({
      data: [],
      error: null,
    });

    renderMyShipments();

    expect(
      await screen.findByRole("heading", {
        name: /no shipments yet/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /your bookings will appear here once you create your first shipment/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /book your first shipment/i,
      })
    ).toHaveAttribute("href", "/book-shipment");

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("displays an error when the customer is not authenticated", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    renderMyShipments();

    expect(
      await screen.findByText(
        /unable to identify your account\. please log in again/i
      )
    ).toBeInTheDocument();

    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("displays an authentication error when getUser fails", async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: "Authentication failed" },
    });

    renderMyShipments();

    expect(
      await screen.findByText(
        /unable to identify your account\. please log in again/i
      )
    ).toBeInTheDocument();

    expect(supabase.from).not.toHaveBeenCalled();
  });

  it("displays a database error when shipments cannot be loaded", async () => {
    orderMock.mockResolvedValue({
      data: null,
      error: { message: "Unable to retrieve shipments" },
    });

    renderMyShipments();

    expect(
      await screen.findByText("Unable to retrieve shipments")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Unable to load shipments")
    ).toBeInTheDocument();
  });

  it("displays fallback values for missing shipment dates and descriptions", async () => {
    orderMock.mockResolvedValue({
      data: [
        {
          id: "shipment-3",
          tracking_number: "CF-2026-FALLBACK",
          origin: "Kisumu, Kenya",
          destination: "Nairobi, Kenya",
          cargo_description: "",
          status: "confirmed",
          booking_date: null,
          estimated_delivery: null,
        },
      ],
      error: null,
    });

    renderMyShipments();

    expect(
      await screen.findByText("CF-2026-FALLBACK")
    ).toBeInTheDocument();

    expect(screen.getByText("Not available")).toBeInTheDocument();
    expect(screen.getByText("Not scheduled")).toBeInTheDocument();
    expect(screen.getByText("confirmed")).toBeInTheDocument();
  });
});
