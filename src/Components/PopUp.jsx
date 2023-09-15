import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { styled } from "@mui/material/styles";
import {
  Radio,
  Box,
  Container,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";

const StyledContainer = styled(Container)`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const MainContainer = styled(Container)`
  width: 70%;
  height: 90%;
  background-color: rgb(232, 229, 229);
  z-index: 10000;
  display: flex;
  flex: column;
  gap: 0.3em;
  padding: 2em 0.5em;
  @media (max-width: 600px) {
    /* Adjust styles for mobile devices */
    width: 100%;
    height: 100%;
    padding: 0.3em; /* Adjust padding for better spacing on small screens */
  }
`;

const Layout = styled(Container)`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
`;
const SpBox = styled(Box)`
  position: absolute;
  top: 3%;
  right: 0;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

function PopUp({ checkLate, task, setShow, getAll }) {
  const [taskText, setTaskText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [creationDate, setCreationDate] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const checkIdx = () => {
    if (typeof task !== "undefined" && task !== null) {
      setIsEdit(true);
      setTaskText(task.title || "");
      setDescriptionText(task.description || "");
      setDueDate(task.dueDate || "");
      setCreationDate(task.creationDate || "");
      setSelectedValue(task.status || "pending");
    }
  };

  useEffect(() => {
    checkIdx();
  }, []);

  const addTask = async () => {
    if (!taskText || !dueDate || !selectedValue) {
      alert(
        "Please fill in all required fields (Title, Due Date, and Status)."
      );
      return;
    }
    const lateOrNot = checkLate(dueDate);
    const newTask = {
      title: taskText,
      description: descriptionText,
      dueDate: dueDate,
      creationDate: creationDate,
      status: selectedValue,
      isLate: lateOrNot,
    };
    try {
      const response = await axios.post("http://localhost:5000/save", newTask);
      console.log("Data posted successfully:", response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
    setShow();
    getAll();
  };

  const updateTask = async () => {
    const lateOrNot = checkLate(dueDate);
    const updatedTask = {
      _id: task._id,
      title: taskText,
      description: descriptionText,
      dueDate: dueDate,
      creationDate: creationDate,
      status: selectedValue,
      isLate: lateOrNot,
    };
    try {
      const response = await axios.post(
        "http://localhost:5000/update",
        updatedTask
      );
      console.log("Data posted successfully:", response.data);
    } catch (error) {
      console.error("Error posting data:", error);
    }
    setShow();
    getAll();
    setIsEdit(false);
    task = "undefined";
  };
  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <>
      <Layout maxWidth="xl">
        <StyledContainer>
          <MainContainer
            maxWidth="md"
            style={{ marginTop: "10px", position: "relative" }}
          >
            <SpBox
              onClick={() => {
                setShow();
                setIsEdit(false);
              }}
            >
              <AiOutlineClose />
            </SpBox>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography align="center" variant="h4">
                  What To Do
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Task"
                  variant="outlined"
                  fullWidth
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  value={descriptionText}
                  onChange={(e) => setDescriptionText(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Due Date
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Creation Date
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="date"
                  value={creationDate}
                  onChange={(e) => setCreationDate(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" align="start" sx={{ padding: "0" }}>
                  Status
                </Typography>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <RadioGroup
                    aria-label="status"
                    name="status" // Add the name attribute
                    value={selectedValue}
                    onChange={handleRadioChange}
                  >
                    <Grid item xs={12} sx={{ marginLeft: "30px" }}>
                      <FormControlLabel
                        value="pending"
                        control={<Radio />}
                        label="Pending"
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ marginLeft: "30px" }}>
                      <FormControlLabel
                        value="done"
                        control={<Radio />}
                        label="Done"
                      />
                    </Grid>
                  </RadioGroup>
                </Grid>
              </Grid>

              <Grid item xs={12} style={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "rgb(224, 34, 0)",
                    width: "200px",
                    marginTop: "-15px",
                  }}
                  onClick={isEdit ? updateTask : addTask}
                >
                  {isEdit ? "Update" : "Add"}
                </Button>
              </Grid>
            </Grid>
          </MainContainer>
        </StyledContainer>
      </Layout>
    </>
  );
}

export default PopUp;
