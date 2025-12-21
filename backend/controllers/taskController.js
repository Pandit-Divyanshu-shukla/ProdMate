const Task = require("../models/Task");
const Routine = require("../models/Routine");


// ----------------------------------
// ADD TASK TO A ROUTINE
// ----------------------------------
exports.addTask = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ routineId MUST come from params
    const { routineId } = req.params;

    const {
      title,
      description,
      priority,
      deadline,
      duration,
    } = req.body;

    if (!title || !routineId) {
      return res.status(400).json({
        message: "Title and routineId are required",
      });
    }

    const task = await Task.create({
      userId,
      routineId,
      title,
      description,
      priority,
      deadline,
      duration,
      isCompleted: false,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });

  } catch (error) {
    console.error("ADD TASK ERROR:", error);
    res.status(500).json({
      message: "Failed to create task",
    });
  }
};


// ----------------------------------
// GET ALL TASKS FOR A ROUTINE
// ----------------------------------
exports.getTasksByRoutine = async (req, res) => {
  try {
    const { routineId } = req.params;

    // Find tasks linked to this routine
    const tasks = await Task.find({ routineId }).sort({ createdAt: 1 });

    res.json({
      message: "Tasks fetched",
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ----------------------------------
// UPDATE TASK (EDIT / MARK COMPLETE)
// ----------------------------------
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      req.body,       // fields to update
      { new: true }   // return updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 2️⃣ Get all tasks of the same routine
    const tasks = await Task.find({ routineId: updatedTask.routineId });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.isCompleted).length;

    // 3️⃣ Calculate completion percentage
    const completionPercentage =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // 4️⃣ Update routine with new completion %
    await Routine.findByIdAndUpdate(
      updatedTask.routineId,
      {
        completionPercentage,
        isCompleted: completionPercentage === 100,
      }
    );


    res.json({
      message: "Task updated",
      updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ----------------------------------
// DELETE TASK
// ----------------------------------
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      message: "Task deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
