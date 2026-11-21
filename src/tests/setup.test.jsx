import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function TestComponent() {
  return <h1>CargoFlow Testing Works!</h1>;
}

describe("CargoFlow Testing Setup", () => {
  it("renders the test component successfully", () => {
    render(<TestComponent />);

    expect(
      screen.getByText("CargoFlow Testing Works!")
    ).toBeInTheDocument();
  });
});