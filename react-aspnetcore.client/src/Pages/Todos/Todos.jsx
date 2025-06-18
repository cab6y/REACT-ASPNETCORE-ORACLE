import React, { useEffect, useState } from 'react';
import {
    getTodoHeaders,
    createTodoHeader,
    updateTodoHeader,
    deleteTodoHeader
} from '../../../services/Todos/TodoHeaders/todoheaderservice';
import Swal from 'sweetalert2';
import {
    DragDropContext,
    Droppable,
    Draggable
} from '@hello-pangea/dnd';

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

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(todoHeaders);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setTodoHeaders(items);

        // Ýstersen burada backend'e sýralama güncellemesi gönderebilirsin
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Left Side */}
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

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="todo-list">
                        {(provided) => (
                            <ul
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    marginTop: '20px'
                                }}
                            >
                                {todoHeaders.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id.toString()}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <li
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '10px',
                                                    marginBottom: '10px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#fff'
                                                }}
                                            >
                                                <span>{item.header}</span>
                                                <span>
                                                    <button onClick={() => handleEdit(item)}>Edit</button>{' '}
                                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                                </span>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            {/* Right Side */}
            <div style={{ width: '50%', padding: '20px', borderLeft: '1px solid #ccc' }}>
                <h2>Right Panel</h2>
                <p>You can add any additional content here, like filters or details.</p>
            </div>
        </div>
    );
};

export default Todos;
