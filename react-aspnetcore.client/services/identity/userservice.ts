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
            return 'Kay�t ba�ar�l�!';
        } else {
            const err = await response.json();
            return `Hata: ${JSON.stringify(err)}`;
        }
    } catch (err) {
        console.error('Sunucuya ba�lan�lamad�:', err);
        return 'Sunucuya ba�lan�lamad�.';
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
                username: data.username // backend bu bilgiyi d�nerse
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
        console.error("Session kontrol hatas�:", err);
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
        console.error("��k�� s�ras�nda hata:", err);
        return false;
    }
}
