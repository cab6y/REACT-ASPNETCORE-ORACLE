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
            <form onSubmit={handleSubmit} className="container mt-5" style={{ maxWidth: '500px' }}>
                <div className="card p-4 shadow">
                    <h3 className="mb-4 text-center">Sign Up</h3>

                    <div className="mb-3">
                        <input name="name" className="form-control" placeholder="First Name" value={form.name} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <input name="surname" className="form-control" placeholder="Last Name" value={form.surname} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <input name="username" className="form-control" placeholder="Username" value={form.username} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <input name="email" type="email" className="form-control" placeholder="Email Address" value={form.email} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <input name="telephone" className="form-control" placeholder="Phone Number" value={form.telephone} onChange={handleChange} />
                    </div>

                    <div className="mb-4">
                        <input name="password" type="password" className="form-control" placeholder="Password" value={form.password} onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </div>
            </form>


            {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </div>
    );
};

export default SignUp;
