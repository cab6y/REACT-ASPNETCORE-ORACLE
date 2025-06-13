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

        // Veritabanýna gitmesini istemediðin alanlar da varsa burada filtrele
        const payload = {
            ...form,
            isDeleted: false, // backend bu alaný istiyorsa
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
                setMessage('Kayýt baþarýlý!');
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
            console.error('Baðlantý hatasý:', err);
            setMessage('Sunucuya baðlanýlamadý.');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto' }}>
            <h2>Kayýt Ol</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Ad" value={form.name} onChange={handleChange} required /><br /><br />
                <input name="surname" placeholder="Soyad" value={form.surname} onChange={handleChange} required /><br /><br />
                <input name="username" placeholder="Kullanýcý Adý" value={form.username} onChange={handleChange} required /><br /><br />
                <input name="email" type="email" placeholder="E-posta" value={form.email} onChange={handleChange} required /><br /><br />
                <input name="telephone" placeholder="Telefon" value={form.telephone} onChange={handleChange} /><br /><br />
                <input name="password" type="password" placeholder="Þifre" value={form.password} onChange={handleChange} required /><br /><br />

                <button type="submit">Kayýt Ol</button>
            </form>

            {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </div>
    );
};

export default SignUp;
