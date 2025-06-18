export interface TodoHeader {
    id?: number;
    header: string;
    createdAt?: string;
    modifiedAt?: string;
}

export interface PagedResult<T> {
    totalCount: number;
    items: T[];
}

const API_URL = 'api/TodoHeader';

function getAuthHeader() {
    return {
        'Authorization': `Bearer ${sessionStorage.getItem("token")}`,
        'Content-Type': 'application/json'
    };
}

//  Listeleme
export async function getTodoHeaders(page: number = 1, pageSize: number = 10): Promise<PagedResult<TodoHeader> | null> {
    try {
        const response = await fetch(`${API_URL}/List?page=${page}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: getAuthHeader()
        });

        if (response.ok) {
            const data = await response.json();
            return data as PagedResult<TodoHeader>;
        } else {
            const err = await response.text();
            console.error("Listeleme hatası:", err);
            return null;
        }
    } catch (err) {
        console.error("Sunucu bağlantı hatası:", err);
        return null;
    }
}

//  Oluşturma
export async function createTodoHeader(payload: TodoHeader): Promise<string> {
    try {
        const response = await fetch(`${API_URL}/Create`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            return 'Başarıyla eklendi!';
        } else {
            const err = await response.text();
            return `Hata: ${err}`;
        }
    } catch (err) {
        console.error("Sunucu hatası:", err);
        return "Sunucuya bağlanılamadı.";
    }
}

//  Güncelleme
export async function updateTodoHeader(id: string, payload: TodoHeader): Promise<string> {
    try {
        const response = await fetch(`${API_URL}/Update/${id}?header=${encodeURIComponent(payload.header)}`, {
            method: 'PUT',
            headers: getAuthHeader()
        });

        if (response.ok) {
            return 'Updated successfully!';
        } else {
            const err = await response.text();
            return `Error: ${err}`;
        }
    } catch (err) {
        console.error("Update error:", err);
        return "Failed to connect to the server.";
    }
}

//  Silme
export async function deleteTodoHeader(id: number): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}/Delete/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader()
        });

        return response.ok;
    } catch (err) {
        console.error("Silme hatası:", err);
        return false;
    }
}
