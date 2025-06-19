import React, { useEffect, useState } from 'react';
import {
    getTodoHeaders,
    createTodoHeader,
    updateTodoHeader,
    deleteTodoHeader
} from '../../../services/Todos/TodoHeaders/todoheaderservice';

import {
    getTodoItemsByHeaderId,
    createTodoItem,
    deleteTodoItem,
    updateTodoItem
} from '../../../services/Todos/TodoItems/todoitemservice';

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

    const [selectedHeaderId, setSelectedHeaderId] = useState(null);
    const [todoItems, setTodoItems] = useState([]);
    const [itemDescription, setItemDescription] = useState('');
    const [editItemId, setEditItemId] = useState(null);

    const loadData = async () => {
        const result = await getTodoHeaders();
        if (result) setTodoHeaders(result.items);
    };

    const loadTodoItems = async (headerId) => {
        const result = await getTodoItemsByHeaderId(headerId);
        if (result) setTodoItems(result);
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
            if (id === selectedHeaderId) {
                setSelectedHeaderId(null);
                setTodoItems([]);
            }
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(todoHeaders);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setTodoHeaders(items);
    };

    const handleHeaderClick = (headerId) => {
        setSelectedHeaderId(headerId);
        loadTodoItems(headerId);
        setItemDescription('');
        setEditItemId(null);
    };

    const handleItemCreate = async () => {
        if (!itemDescription.trim() || !selectedHeaderId) return;

        await createTodoItem({
            description: itemDescription,
            isCompleted: false,
            todoHeaderId: selectedHeaderId
        });

        setItemDescription('');
        loadTodoItems(selectedHeaderId);
    };

    const handleItemEdit = (item) => {
        setItemDescription(item.description);
        setEditItemId(item.id);
    };

    const handleItemUpdate = async () => {
        if (!itemDescription.trim() || !selectedHeaderId || !editItemId) return;

        await updateTodoItem(editItemId, {
            id: editItemId,
            description: itemDescription,
            isCompleted: false,
            todoHeaderId: selectedHeaderId
        });

        setItemDescription('');
        setEditItemId(null);
        loadTodoItems(selectedHeaderId);
    };

    const handleItemDelete = async (itemId) => {
        const result = await Swal.fire({
            title: 'Delete this item?',
            text: 'This cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            await deleteTodoItem(itemId);
            loadTodoItems(selectedHeaderId);
        }
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
                                style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}
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
                                                onClick={() => handleHeaderClick(item.id)}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    padding: '10px',
                                                    marginBottom: '10px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    backgroundColor: item.id === selectedHeaderId ? '#e3f2fd' : '#fff',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <span>{item.header}</span>
                                                <span>
                                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }}>Edit</button>{' '}
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>Delete</button>
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
                <h2>Todo Items</h2>
                {selectedHeaderId ? (
                    <>
                        <ul>
                            {todoItems.map(item => (
                                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span>{item.description}</span>
                                    <span>
                                        <button onClick={() => handleItemEdit(item)}>Edit</button>{' '}
                                        <button onClick={() => handleItemDelete(item.id)}>Delete</button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div style={{ marginTop: '10px' }}>
                            <input
                                type="text"
                                value={itemDescription}
                                onChange={(e) => setItemDescription(e.target.value)}
                                placeholder="New todo item"
                            />
                            <button onClick={editItemId ? handleItemUpdate : handleItemCreate}>
                                {editItemId ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Select a header to see its items.</p>
                )}
            </div>
        </div>
    );
};

export default Todos;
