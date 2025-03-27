import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem,
  Select,
  Typography,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import "./App.css";

const API_BASE_URL =
  "https://nccm9wuehg.execute-api.ap-southeast-1.amazonaws.com/prod";

const ITEMS_PER_PAGE = 5;

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(`${API_BASE_URL}/todo`);
    const sortedTodos = response.data.body.sort((a, b) =>
      a.task.localeCompare(b.task)
    );
    setTodos(sortedTodos);
  };

  const addTodo = async () => {
    if (!newTodo.trim()) {
      setError(true);
      return;
    }
    setError(false);
    await axios.post(`${API_BASE_URL}/todo`, {
      task: newTodo,
      progress: "To-Do",
    });
    setNewTodo("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_BASE_URL}/todo/${id}`);
    fetchTodos();
  };

  const updateTodo = async (id) => {
    await axios.put(`${API_BASE_URL}/todo/${id}`, {
      task: editText,
      progress: editStatus,
    });
    setEditingId(null);
    fetchTodos();
  };

  const filteredTodos = todos.filter(
    (todo) =>
      todo.task.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (statusFilter === "All" || todo.progress === statusFilter)
  );

  const totalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);
  const displayedTodos = filteredTodos.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container className="container">
      <h1>To-Do List</h1>

      <div className="search-filter-container">
        <TextField
          className="text-field"
          label="Search To-Do"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="To Do">To Do</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </div>

      <TextField
        className="text-field"
        label="New To-Do"
        value={newTodo}
        onChange={(e) => {
          setNewTodo(e.target.value);
          setError(false);
        }}
        error={error}
        helperText={error ? "To-Do cannot be empty" : ""}
      />
      <Button className="add-button" variant="contained" onClick={addTodo}>
        Add
      </Button>
      <List>
        {displayedTodos.map((todo) => (
          <ListItem key={todo.id} className="list-item">
            {editingId === todo.id ? (
              <TextField
                fullWidth
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              <ListItemText primary={todo.task} />
            )}

            {/* Status Label or Dropdown */}
            {editingId === todo.id ? (
              <Select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            ) : (
              <Typography className="status-label">{todo.progress}</Typography>
            )}

            <IconButton onClick={() => deleteTodo(todo.id)}>
              <DeleteIcon />
            </IconButton>

            {editingId === todo.id ? (
              <IconButton onClick={() => updateTodo(todo.id)}>
                <CheckIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  setEditingId(todo.id);
                  setEditText(todo.task);
                  setEditStatus(todo.progress);
                }}
              >
                <EditIcon />
              </IconButton>
            )}
          </ListItem>
        ))}
      </List>

      {totalPages > 1 && (
        <Pagination
          className="pagination"
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      )}
    </Container>
  );
};

export default App;
