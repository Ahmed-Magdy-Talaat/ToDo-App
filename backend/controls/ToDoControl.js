const ToDoModel = require("../Models/model");

module.exports.getToDo = async (req, res) => {
  const toDo = await ToDoModel.find();
  res.send(toDo);
};

module.exports.saveToDo = async (req, res) => {
  const { title, description, dueDate, creationDate, status, isLate } =
    req.body;
  try {
    const newToDo = await ToDoModel.create({
      title,
      description,
      dueDate,
      creationDate,
      status,
      isLate,
    });
    res.status(200).json(newToDo);
  } catch (err) {
    console.error("Error creating to-do:", err);
    res.status(500).json({ error: "Could not create to-do item" });
  }
};

module.exports.updateToDo = async (req, res) => {
  const { _id, title, description, dueDate, status, isLate } = req.body;

  try {
    const updatedToDo = await ToDoModel.findOneAndUpdate(
      { _id }, // Use an object to specify the condition for the update
      {
        $set: {
          title,
          description,
          dueDate,
          status,
          isLate,
        },
      },
      {
        new: true, // This option returns the updated document
      }
    );

    if (!updatedToDo) {
      return res.status(404).json({ error: "To-do item not found" });
    }

    res.json(updatedToDo);
  } catch (err) {
    console.error("Error updating to-do item:", err);
    res.status(500).json({ error: "Could not update to-do item" });
  }
};

//delete item
module.exports.deleteToDo = async (req, res) => {
  const { _id } = req.body;
  try {
    const ToDo = await ToDoModel.findByIdAndDelete(_id); // Use findByIdAndDelete with the _id
    if (!ToDo) {
      return res.status(404).json({ error: "To-do item not found" });
    }

    res.json({ message: "To-do item deleted successfully", ToDo });
  } catch (err) {
    console.error("Error deleting to-do item:", err);
    res.status(500).json({ error: "Could not delete to-do item" });
  }
};

module.exports.updateTaskStatus = async (req, res) => {
  const { _id, status } = req.body;
  try {
    const updTask = await ToDoModel.findOneAndUpdate(
      { _id }, // Query to find the task by its ID
      { status }, // Update object to set the new status
      { new: true } // Options to return the updated task
    );

    if (!updTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task status updated successfully", updTask });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ error: "Could not update task status" });
  }
};
