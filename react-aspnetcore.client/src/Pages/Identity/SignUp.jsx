import React, { useState } from 'react';
import { signUpUser } from '../../../services/identity/userservice';
import Swal from 'sweetalert2';

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
        Swal.showLoading();
        e.preventDefault();

        const msg = await signUpUser(form);
        setMessage(msg);

        if (msg.toLowerCase().includes("created")) {
            Swal.fire("Success", "User Created Successfully", 'success');
            setForm({
                name: '',
                surname: '',
                username: '',
                email: '',
                password: '',
                telephone: ''
            });
        }

    };

    return (
        <div style={{ maxWidth: '500px', margin: 'auto' }}>
            <form onSubmit={handleSubmit} className="container mt-5">
                <div className="card p-4 shadow">
                    <h3 className="mb-4 text-center">Sign Up</h3>

                    {['name', 'surname', 'username', 'email', 'telephone', 'password'].map((field, i) => (
                        <div className="mb-3" key={i}>
                            <input
                                type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
                                name={field}
                                className="form-control"
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                value={form[field]}
                                onChange={handleChange}
                                required={field !== 'telephone'}
                            />
                        </div>
                    ))}

                    <button type="submit" className="btn btn-primary w-100">Sign Up</button>
                </div>
            </form>

            {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </div>
    );
};

export default SignUp;
