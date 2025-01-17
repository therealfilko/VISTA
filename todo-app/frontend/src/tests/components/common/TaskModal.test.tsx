import { render, screen, fireEvent } from "@testing-library/react";
import TaskModal from "../../../components/common/TaskModal";

describe("TaskModal", () => {
  test("saves task with correct data", () => {
    const mockSave = jest.fn();
    const mockTask = {
      title: "test",
      category: "",
      assignee: "",
      deadline: "",
      description: "",
    };

    render(
      <TaskModal
        isOpen={true}
        task={mockTask}
        columns={{}}
        currentColumn="1"
        onClose={() => {}}
        onSave={mockSave}
        onDelete={() => {}}
        onTaskChange={() => {}}
        onColumnChange={() => {}}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/titel/i), {
      target: { value: "New Task" },
    });

    fireEvent.click(screen.getByText(/speichern/i));
    expect(mockSave).toHaveBeenCalled();
  });
});
