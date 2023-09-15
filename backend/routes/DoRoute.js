const { Router } = require("express");
const {
  getToDo,
  saveToDo,
  updateToDo,
  deleteToDo,
  updateTaskStatus,
} = require("../controls/ToDoControl");

const router = Router();

router.get("/", getToDo);
router.post("/save", saveToDo);
router.post("/update", updateToDo);
router.post("/delete", deleteToDo);
router.post("/updateStat", updateTaskStatus);
module.exports = router;
