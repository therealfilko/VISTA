import { apiService } from "../../../services/apiService";

// Korrektes Mock für axios
jest.mock("axios", () => ({
  create: () => ({
    get: jest.fn(() =>
      Promise.resolve({
        data: [{ id: 1, title: "To Do", todos: [] }],
      }),
    ),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  }),
}));

describe("API Service", () => {
  test("getColumns returns column data", async () => {
    const data = await apiService.getColumns();
    expect(data[0].title).toBe("To Do");
  });
});
