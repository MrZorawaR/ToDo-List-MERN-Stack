const express = require('express');
const Todo = require('../Models/Todos.js');

const router = express.Router();

// GET all todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new todo
router.post('/', async (req, res) => {
  const { task, priority, dueDate } = req.body;

  if (!task || !dueDate) {
    return res.status(400).json({ message: 'Task and due date are required' });
  }

  const newTodo = new Todo({
    task,
    priority,
    dueDate,
  });

  try {
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT to update a todo
router.put('/:id', async (req, res) => {
  const { task, priority, dueDate, completed } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { task, priority, dueDate, completed },
      { new: true, runValidators: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a todo
router.delete('/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    res.json(deletedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
