import React, { useState } from 'react';

const SignUp = () => {
    const [form, setForm] = useState({
        name: '',
        surname: '',
        username: '',
        email: '',
        password: '',
        telephone: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Veritaban�na gitmesini istemedi�in alanlar da varsa burada filtrele
        const payload = {
            ...form,
            isDeleted: false, // backend bu alan� istiyorsa
        };

        try {
            const response = await fetch('identity/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setMessage('Kay�t ba�ar�l�!');
                setForm({
                    name: '',
                    surname: '',
                    username: '',
                    email: '',
                    password: '',
                    telephone: '',
                });
            } else {
                const err = await response.json();
                setMessage(`Hata: ${JSON.stringify(err)}`);
            }
        } catch (err) {
            console.error('Ba�lant� hatas�:', err);
            setMessage('Sunucuya ba�lan�lamad�.');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto' }}>
            <h2>Kay�t Ol</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Ad" value={form.name} onChange={handleChange} required /><br /><br />
                <input name="surname" placeholder="Soyad" value={form.surname} onChange={handleChange} required /><br /><br />
                <input name="username" placeholder="Kullan�c� Ad�" value={form.username} onChange={handleChange} required /><br /><br />
                <input name="email" type="email" placeholder="E-posta" value={form.email} onChange={handleChange} required /><br /><br />
                <input name="telephone" placeholder="Telefon" value={form.telephone} onChange={handleChange} /><br /><br />
                <input name="password" type="password" placeholder="�ifre" value={form.password} onChange={handleChange} required /><br /><br />

                <button type="submit">Kay�t Ol</button>
            </form>

            {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </div>
    );
};

export default SignUp;
