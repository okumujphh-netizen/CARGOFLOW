import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Notifications from "../pages/Notifications";
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

const sampleNotifications = [
    {
        id: "notification-1",
        title: "Shipment confirmed",
        message: "Your shipment CF-2026-001 has been confirmed.",
        is_read: false,
        created_at: "2026-11-20T10:00:00.000Z",
    },
    {
        id: "notification-2",
        title: "Shipment delivered",
        message: "Your shipment has been delivered successfully.",
        is_read: true,
        created_at: "2026-11-19T10:00:00.000Z",
    },
];

let notifications;
let mutationError;

function setupSupabaseMock() {
    let operation = null;

    const chain = {
        select: vi.fn(() => chain),

        eq: vi.fn(() => {
            if (operation) {
                return Promise.resolve({ error: mutationError });
            }

            return chain;
        }),

        order: vi.fn(() =>
            Promise.resolve({
                data: notifications,
                error: null,
            })
        ),

        update: vi.fn(() => {
            operation = "update";
            return chain;
        }),

        in: vi.fn(() =>
            Promise.resolve({ error: mutationError })
        ),

        delete: vi.fn(() => {
            operation = "delete";
            return chain;
        }),
    };

    supabase.from.mockReturnValue(chain);

    return chain;
}

function renderNotifications() {
    return render(<Notifications />);
}

describe("Notifications component", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        notifications = [...sampleNotifications];
        mutationError = null;

        supabase.auth.getUser.mockResolvedValue({
            data: {
                user: { id: "customer-123" },
            },
            error: null,
        });

        setupSupabaseMock();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("displays the loading message initially", () => {
        supabase.auth.getUser.mockReturnValue(new Promise(() => {}));

        renderNotifications();

        expect(
            screen.getByText("Loading notifications...")
        ).toBeInTheDocument();
    });

    it("fetches and displays notifications", async () => {
        renderNotifications();

        expect(
            await screen.findByText("Shipment confirmed")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Shipment delivered")
        ).toBeInTheDocument();

        expect(supabase.from).toHaveBeenCalledWith("notifications");
    });

    it("displays an error when the user cannot be identified", async () => {
        supabase.auth.getUser.mockResolvedValue({
            data: { user: null },
            error: { message: "Authentication failed" },
        });

        renderNotifications();

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent(
            "Unable to identify your account. Please log in again."
        );
    });

    it("displays an error when fetching notifications fails", async () => {
        supabase.from.mockImplementation(() => ({
            select: () => ({
                eq: () => ({
                    order: () =>
                        Promise.resolve({
                            data: null,
                            error: { message: "Unable to fetch notifications" },
                        }),
                }),
            }),
        }));

        renderNotifications();

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Unable to fetch notifications");
    });

    it("displays the empty state when there are no notifications", async () => {
        notifications = [];

        setupSupabaseMock();

        renderNotifications();

        expect(
            await screen.findByText("No notifications found")
        ).toBeInTheDocument();
    });

    it("filters notifications by unread and read status", async () => {
        renderNotifications();

        await screen.findByText("Shipment confirmed");

        fireEvent.click(screen.getByRole("button", { name: "unread" }));

        expect(
            screen.getByText("Shipment confirmed")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Shipment delivered")
        ).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "read" }));

        expect(
            screen.getByText("Shipment delivered")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Shipment confirmed")
        ).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "all" }));

        expect(
            screen.getByText("Shipment confirmed")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Shipment delivered")
        ).toBeInTheDocument();
    });

    it("marks an individual notification as read", async () => {
        const chain = setupSupabaseMock();

        renderNotifications();

        await screen.findByText("Shipment confirmed");

        fireEvent.click(
            screen.getAllByRole("button", {
                name: "Mark notification as read",
            })[0]
        );

        await waitFor(() => {
            expect(chain.update).toHaveBeenCalledWith({
                is_read: true,
            });
        });

        await waitFor(() => {
            expect(
                screen.queryByRole("button", {
                    name: "Mark notification as read",
                })
            ).not.toBeInTheDocument();
        });
    });

    it("marks all unread notifications as read", async () => {
        const chain = setupSupabaseMock();

        renderNotifications();

        await screen.findByText("Shipment confirmed");

        fireEvent.click(
            screen.getByRole("button", { name: "Mark All as Read" })
        );

        await waitFor(() => {
            expect(chain.update).toHaveBeenCalledWith({
                is_read: true,
            });

            expect(chain.in).toHaveBeenCalledWith(
                "id",
                ["notification-1"]
            );
        });

        await waitFor(() => {
            expect(
                screen.queryByRole("button", {
                    name: "Mark notification as read",
                })
            ).not.toBeInTheDocument();
        });
    });

    it("deletes a notification after confirmation", async () => {
        const chain = setupSupabaseMock();
        vi.spyOn(window, "confirm").mockReturnValue(true);

        renderNotifications();

        await screen.findByText("Shipment confirmed");

        const deleteButtons = screen.getAllByRole("button", {
            name: "Delete notification",
        });

        fireEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalledWith(
            "Are you sure you want to delete this notification?"
        );

        await waitFor(() => {
            expect(chain.delete).toHaveBeenCalled();
            expect(
                screen.queryByText("Shipment confirmed")
            ).not.toBeInTheDocument();
        });
    });

    it("does not delete a notification when confirmation is cancelled", async () => {
        const chain = setupSupabaseMock();
        vi.spyOn(window, "confirm").mockReturnValue(false);

        renderNotifications();

        await screen.findByText("Shipment confirmed");

        fireEvent.click(
            screen.getAllByRole("button", {
                name: "Delete notification",
            })[0]
        );

        expect(chain.delete).not.toHaveBeenCalled();

        expect(
            screen.getByText("Shipment confirmed")
        ).toBeInTheDocument();
    });

    it("displays an error when marking a notification as read fails", async () => {
        mutationError = { message: "Unable to update notification" };
        setupSupabaseMock();

        renderNotifications();

        await screen.findByText("Shipment confirmed");

        fireEvent.click(
            screen.getAllByRole("button", {
                name: "Mark notification as read",
            })[0]
        );

        expect(
            await screen.findByRole("alert")
        ).toHaveTextContent("Unable to update notification");
    });
});
