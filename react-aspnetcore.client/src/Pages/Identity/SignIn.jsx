import React, { useState } from "react";
import { signIn } from "../../../services/identity/userservice";

const SignIn = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    function handleChange(e) {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const result = await signIn(form.email, form.password);

        if (result) {
            sessionStorage.setItem("token", result.token);
            sessionStorage.setItem("username", form.email);
            window.location.href = "/";
        } else {
            setError("Login failed! Please check your credentials.");
        }
    };

    return (
        <div
            className="position-absolute top-50 start-50 translate-middle"
            style={{ width: "100%", maxWidth: "400px" }}
        >
            <div className="card p-4 shadow">
                <h3 className="text-center mb-4">Sign In</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="form-control"
                            id="email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="form-control"
                            id="password"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
