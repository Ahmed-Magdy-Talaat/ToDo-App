import React, { useEffect, useState } from "react";
import {
  AppBar,
  Container,
  CssBaseline,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Toolbar,
  Typography,
  TextField,
  Button,
  Box,
  Radio,
  InputAdornment,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import "./App.css";
import axios from "axios";
import { styled } from "@mui/material/styles";
import PopUp from "./Components/PopUp";

const StyledContainer = styled(Container)`
  background-color: rgb(232, 229, 229);
  border-radius: 10px;
  color: black;
  padding: 1.5em 0em;
`;
const Litem = styled(ListItem)`
  background-color: rgb(224, 34, 0);
  border-radius: 15px;
`;
function App() {
  const [tasks, setTasks] = useState([]);
  const [show, setShow] = useState(false);
  const [task, setTask] = useState(undefined);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [status, setStatus] = useState(false);
  const [statOrPend, setStatOrPend] = useState("pending");

  const handleSearch = (text) => {
    const filTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredTasks(filTasks);
  };
  const checkIsLate = (dueDate, creationDate) => {
    if (!dueDate) return false;
    const now = new Date();
    dueDate = new Date(dueDate);
    creationDate = new Date(creationDate);
    return now > dueDate && dueDate > creationDate;
  };

  const getTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/");
      if (!response.ok) console.log("Error in Fetching Process");
      const updatedTasks = response.data.map((task) => ({
        ...task,
        isLate: checkIsLate(task.dueDate, task.creationDate), // Pass both dueDate and creationDate
      }));

      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    } catch (err) {
      console.log("Error in getting Data");
    }
  };

  const deleteTask = async (task) => {
    try {
      const response = await axios.post("http://localhost:5000/delete", task);
      console.log("Task deleted successfully:", response.data);
    } catch (err) {
      console.log("error :", err);
    }
    getTasks();
  };

  const updateTaskStatus = async (task) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/updateStat",
        task
      );
      console.log("status is updated");
      getTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
      // Handle error, show an error message to the user, etc.
    }
  };
  const handleStatus = (task) => {
    // Update the status state based on the current value
    setStatus((prevStatus) => !prevStatus);

    const newStatus = status ? "done" : "pending";
    setStatOrPend(newStatus);

    task.status = newStatus;
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <StyledContainer
        maxWidth="sm"
        style={{
          marginTop: "1.2em",
        }}
      >
        <Typography variant="h4" align="center">
          To Do App
        </Typography>
        <Container maxWidth="md" style={{ marginTop: "60px" }}>
          <TextField
            label="Search"
            fullWidth
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box textAlign="center">
            <Button
              variant="contained"
              width="lg"
              sx={{
                backgroundColor: "#E02200",
                marginTop: "30px",
                width: "250px",
              }}
              onClick={() => setShow(true)}
              // onClick={}
            >
              Add
            </Button>
          </Box>
          <List
            style={{
              marginTop: "20px",
              overflowY: "auto",
            }}
          >
            {filteredTasks.map((task, index) => (
              <Litem key={task._id} sx={{ marginTop: "0.5em", width: "100%" }}>
                <IconButton edge="start">
                  <Radio
                    className="custom-radio"
                    maxWidth="sm"
                    value="option1"
                    sx={{ color: "white" }}
                    checked={task.status === "done"}
                    checkedIcon={<CheckIcon sx={{ color: "white" }} />}
                    onClick={() => {
                      handleStatus(task);
                      updateTaskStatus(task);
                    }}
                  />
                </IconButton>
                <ListItemText
                  primary={task.title}
                  sx={{ color: "white" }}
                  secondary={
                    <>
                      <Typography variant="body2" color="white">
                        Description: {task.description}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Due Date: {task.dueDate}
                      </Typography>
                      <Typography variant="body2" color="white">
                        Creation Date: {task.creationDate}
                      </Typography>
                      <Typography variant="body2" color="white">
                        isLate: {task.isLate ? "true" : "false"}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <EditIcon
                      sx={{ color: "white" }}
                      onClick={() => {
                        setShow(true);
                        setTask(task);
                      }}
                    />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon
                      sx={{ color: "white" }}
                      onClick={() => deleteTask(task)}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </Litem>
            ))}
          </List>
        </Container>
      </StyledContainer>
      {show && (
        <PopUp
          setShow={() => {
            setShow(false);
            setTask(undefined);
          }}
          task={task}
          getAll={getTasks}
          checkLate={checkIsLate}
        />
      )}
    </>
  );
}

export default App;
