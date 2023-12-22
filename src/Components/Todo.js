import React, { useState, useEffect } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Snackbar, Alert } from "@mui/material";

const Todo = () => {
  // State for the input text
  const [text, setText] = useState("");
  // State for storing the list of TODO items
  const [todos, setTodos] = useState([]);
  // State for managing the visibility of the Snackbar
  const [open, setOpen] = React.useState(false);

  // Effect to load TODOs from local storage on component mount
  useEffect(() => {
    // Get stored TODOs from local storage, or an empty array if none
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    // Set the state with stored TODOs if available
    if (storedTodos.length > 0) {
      setTodos(storedTodos);
    }
  }, []);

  // Effect to save TODOs to local storage whenever the todos state changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Function to handle opening the Snackbar
  const handleClick = () => {
    setOpen(true);
  };

  // Function to handle closing the Snackbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // Function to add a new TODO
  const addTodo = () => {
    // Check if the input text is empty, show error if true
    if (text.trim() === "") {
      handleClick();
      return;
    }
    // Create a new TODO object
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };
    // Update the state with the new TODO at the beginning of the list
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
    // Clear the input text
    setText("");
  };

  // Function to mark a TODO as completed or incomplete
  const completeTodo = (id) => {
    setTodos((prevTodos) => {
      // Map through the previous TODOs and update the completed status of the clicked TODO
      const updatedTodos = prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      // Move completed TODOs to the bottom
      const sortedTodos = [
        ...updatedTodos.filter((todo) => !todo.completed),
        ...updatedTodos.filter((todo) => todo.completed),
      ];
      // Return the sorted TODOs
      return sortedTodos;
    });
  };

  // Function to reset/clear all TODOs
  const resetTodos = () => {
    setTodos([]);
  };

  return (
    <div>
      <CssBaseline />
      <Container maxWidth="md">
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              Please enter a valid TODO!
            </Alert>
          </Snackbar>
        </Stack>
        <Box
          sx={{
            bgcolor: "#cfe8fc",
            height: "sm",
            padding: "30px",
            margin: "20px",
            borderRadius: "20px",
          }}
        >
          <h2 style={{ color: "#1976d2" }}>Todo App</h2>
          <Box sx={{ display: "flex" }}>
            {/* Input field for entering new TODO */}
            <TextField
              sx={{ width: "100%", mb: 2 }}
              id="outlined-basic"
              label="Enter Your Todo Here"
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
            />
            {/* Reset button to clear all TODOs */}
            <Button
              onClick={resetTodos}
              variant="contained"
              sx={{ ml: 2, borderRadius: "20px", height: "55px" }}
            >
              Reset
            </Button>
          </Box>
          {/* Display the list of TODOs */}
          <Box sx={{ mt: 2 }}>
            {todos.map((todo) => (
              <Box
                key={todo.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#e0f7fa",
                  borderRadius: "10px",
                  padding: "10px",
                  mb: 1,
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
                onClick={() => completeTodo(todo.id)}
              >
                {todo.text}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Todo;
