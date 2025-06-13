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
            return 'Kayýt baþarýlý!';
        } else {
            const err = await response.json();
            return `Hata: ${JSON.stringify(err)}`;
        }
    } catch (err) {
        console.error('Sunucuya baðlanýlamadý:', err);
        return 'Sunucuya baðlanýlamadý.';
    }
}
