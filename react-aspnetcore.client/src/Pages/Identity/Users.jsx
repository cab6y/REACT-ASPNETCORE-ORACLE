import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../../services/identity/userservice';
import Swal from 'sweetalert2';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchUsers();
    }, [page]);

    const fetchUsers = async () => {
        const result = await getUsers(page, pageSize);
        if (result) {
            setUsers(result.items);
            setTotalCount(result.totalCount);
        } else {
            console.error("Kullanıcılar alınamadı");
        }
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page * pageSize < totalCount) setPage(page + 1);
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const success = await deleteUser(id);
                if (success) {
                    Swal.fire('Deleted!', 'User has been deleted successfully.', 'success');
                    fetchUsers(); // Listeyi güncelle
                } else {
                    Swal.fire('Error', 'Failed to delete the user.', 'error');
                }
            }
        });
       
    };

    return (
        <div className="container mt-4">
            <h2>Kullanıcı Listesi</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Delete</th> {/* yeni kolon */}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} onClick={() => handleDelete(user.id)} style={{ cursor: 'pointer' }}>
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.telephone}</td>
                            <td>🗑️</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-between align-items-center">
                <button onClick={handlePrev} disabled={page === 1} className="btn btn-secondary">← Before</button>
                <span>Sayfa {page}</span>
                <button onClick={handleNext} disabled={page * pageSize >= totalCount} className="btn btn-secondary">Next →</button>
            </div>
        </div>
    );
};

export default Users;
