import React, { useEffect, useState } from 'react';
import {
    getTodoHeaders,
    createTodoHeader,
    updateTodoHeader,
    deleteTodoHeader
} from '../../../services/Todos/TodoHeaders/todoheaderservice';
import Swal from 'sweetalert2';

const Todos = () => {
    const [todoHeaders, setTodoHeaders] = useState([]);
    const [header, setTitle] = useState('');
    const [editId, setEditId] = useState(null);

    const loadData = async () => {
        const result = await getTodoHeaders();
        if (result) {
            setTodoHeaders(result.items);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!header.trim()) return;

        if (editId) {
            await updateTodoHeader(editId, { header });
            setEditId(null);
        } else {
            await createTodoHeader({ header });
        }

        setTitle('');
        loadData();
    };

    const handleEdit = (header) => {
        setTitle(header.header);
        setEditId(header.id);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            await deleteTodoHeader(id);
            await loadData();
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Left Side: Table */}
            <div style={{ width: '50%', padding: '20px' }}>
                <h2>Todo Groups</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={header}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                    />
                    <button type="submit">{editId ? 'Update' : 'Create'}</button>
                </form>

                <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
                    <thead>
                        <tr>
                            <th>header</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todoHeaders.map(header => (
                            <tr key={header.id}>
                                <td>{header.header}</td>
                                <td>
                                    <button onClick={() => handleEdit(header)}>Edit</button>
                                    <button onClick={() => handleDelete(header.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Right Side: Placeholder */}
            <div style={{ width: '50%', padding: '20px', borderLeft: '1px solid #ccc' }}>
                <h2>Right Panel</h2>
                <p>You can add any additional content here, like filters or details.</p>
            </div>
        </div>
    );
};

export default Todos;
