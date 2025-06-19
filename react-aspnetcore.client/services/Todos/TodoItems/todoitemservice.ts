export interface TodoItem {
    id: string;
    description: string;
    isCompleted: boolean;
    todoHeaderId: string;
}

export interface CreateTodoItem {
    description: string;
    isCompleted: boolean;
    todoHeaderId: string;
}

const API_URL = 'api/TodoItem';

function getAuthHeader() {
    return {
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    };
}

// 📥 Get all items under a specific header
export async function getTodoItemsByHeaderId(headerId: string): Promise<TodoItem[] | null> {
    try {
        const response = await fetch(`${API_URL}?headerid=${headerId}`, {
            method: 'GET',
            headers: getAuthHeader()
        });

        if (response.status === 404) {
            return []; // No items found
        }

        if (response.ok) {
            const data = await response.json();
            return data as TodoItem[];
        } else {
            const error = await response.text();
            console.error("Failed to fetch todo items:", error);
            return null;
        }
    } catch (error) {
        console.error("Server error:", error);
        return null;
    }
}

// ➕ Create a new todo item
export async function createTodoItem(payload: CreateTodoItem): Promise<string> {
    try {
        const response = await fetch(`${API_URL}`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            return "Item created successfully!";
        } else {
            const error = await response.text();
            return `Error: ${error}`;
        }
    } catch (error) {
        console.error("Failed to connect to server:", error);
        return "Unable to reach the server.";
    }
}

// ✏️ Update existing todo item
export async function updateTodoItem(id: string, payload: TodoItem): Promise<string> {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            return "Item updated successfully!";
        } else {
            const error = await response.text();
            return `Error: ${error}`;
        }
    } catch (error) {
        console.error("Update failed:", error);
        return "Unable to reach the server.";
    }
}

// ❌ Delete (soft-delete) todo item
export async function deleteTodoItem(id: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });

        return response.ok;
    } catch (error) {
        console.error("Deletion failed:", error);
        return false;
    }
}
