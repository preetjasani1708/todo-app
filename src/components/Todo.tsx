import { Check, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState, FormEvent } from "react";

export default function Todo() {
  const [todos, setTodos] = useState<
    {
      id: number;
      task: string;
      completed: boolean;
    }[]
  >([]);
  const [currentTodo, setCurrentTodo] = useState<string>("");
  const [isInitialLoaded, setIsInitialLoaded] = useState<boolean>(false);

  const addTodo = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (currentTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          task: currentTodo,
          completed: false,
        },
      ]);
      setCurrentTodo("");
    }
  };

  const toggleTodo = (id: number): void => {
    setTodos(
      todos.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteTodo = (id: number): void => {
    setTodos(todos.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((item) => !item.completed));
  };

  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error("Fail to load todos from local storage: ", error);
    } finally {
      setIsInitialLoaded(true);
    }
  }, []);

  useEffect(() => {
    // Save todos to local storage whenever todos change, but only after initial load 
    if (isInitialLoaded) {
      try {
        localStorage.setItem("todos", JSON.stringify(todos));
      } catch (error) {
        console.error("Fail to save todos in local storage: ", error);
      }
    }
  }, [todos, isInitialLoaded]);

  return (
    <div className="flex flex-col items-center p-6 mx-auto max-w-md w-full bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Todo Application</h1>

      <form onSubmit={addTodo} className="w-full flex mb-6">
        <input
          type="text"
          value={currentTodo}
          onChange={(e) => setCurrentTodo(e.target.value)}
          placeholder="Add a new task....."
          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 flex items-center justify-center"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="w-full">
        {todos.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No tasks yet. Add one above!
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {todos.map((item) => (
              <li
                key={item.id}
                className="py-3 flex items-center justify-between group"
              >
                <div className="flex items-center">
                  <button
                    onClick={() => toggleTodo(item.id)}
                    className={`w-6 h-6 mr-3 min-w-[24px] rounded-full border flex items-center justify-center ${
                      item.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    {item.completed && <Check size={14} />}
                  </button>
                  <span
                    className={`${
                      item.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                    style={{
                      wordBreak: 'break-word'
                    }}
                  >
                    {item.task}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(item.id)}
                  className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {todos.some((item) => item.completed) && (
          <div className="flex justify-end mt-4">
            <button
              onClick={clearCompleted}
              className="text-sm text-gray-500 hover:text-red-500 flex items-center"
            >
              <X size={16} className="mr-1" /> Clear Completed
            </button>
          </div>
        )}

        {todos.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 text-center">
            {todos.filter((item) => !item.completed).length} tasks remaining
          </div>
        )}
      </div>
    </div>
  );
}
