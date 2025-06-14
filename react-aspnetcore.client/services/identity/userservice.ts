export interface UserPayload {
    name: string;
    surname: string;
    username: string;
    email: string;
    password: string;
    telephone: string;
}
export async function signUpUser(payload: UserPayload): Promise<string> {
    try {
        const response = await fetch('api/User/SignUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            return 'User Successfully Created!';
        } else {
            const text = await response.text();
            return `Hata: ${text}`;
        }
    } catch (err) {
        console.error('Sunucuya baðlanýlamadý:', err);
        return 'Sunucuya baðlanýlamadý.';
    }
}

export async function signIn(email: string, password: string): Promise<{ token: string, username: string } | null> {
    try {
        const url = `api/User/Login?emailorusername=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
        const response = await fetch(url, { method: 'GET' });

        if (response.ok) {
            const data = await response.json();
            return {
                token: data.token,
                username: data.username // backend bu bilgiyi dönerse
            };
        } else {
            const err = await response.json();
            console.error('Login error:', err);
            return null;
        }
    } catch (err) {
        console.error('Login exception:', err);
        return null;
    }
}
export async function checkSession(): Promise<boolean> {
    try {
        const response = await fetch('api/User/SessionCount', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        });

        return response.ok;
    } catch (err) {
        console.error("Session kontrol hatasý:", err);
        return false;
    }
}

export async function logout(): Promise<boolean> {
    try {
        const response = await fetch('api/User/Logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        });

        return response.ok;
    } catch (err) {
        console.error("Çýkýþ sýrasýnda hata:", err);
        return false;
    }
}


export interface PagedResult<T> {
    totalCount: number;
    items: T[];
}

export interface User {
    id: string;
    name: string;
    surname: string;
    username: string;
    email: string;
    telephone: string;
    createdAt: string;
}

export async function getUsers(page: number = 1, pageSize: number = 10): Promise<PagedResult<User> | null> {
    try {
        const response = await fetch(`api/User/List?page=${page}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data as PagedResult<User>;
        } else {
            const err = await response.json();
            console.error("Kullanýcý listeleme hatasý:", err);
            return null;
        }
    } catch (err) {
        console.error("Sunucuya baðlanýlamadý:", err);
        return null;
    }
}

export async function deleteUser(id: string): Promise<boolean> {
    try {
        const response = await fetch(`api/User/Delete?Id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("token")}`
            }
        });

        return response.ok;
    } catch (err) {
        console.error("Kullanýcý silme hatasý:", err);
        return false;
    }
}
