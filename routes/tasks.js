const express = require('express')
const router = express.Router()
const Task = require('../models/Task')
const { ensureAuthenticated } = require('../middleware/auth')

router.get('/', async (req, res) => {
  const tasks = await Task.find().sort({ dueDate: 1 })
  res.render('tasks/list', { tasks })
})

router.get('/search', async (req, res) => {
  const q = req.query.q || ''
  const tasks = await Task.find({ title: new RegExp(q, 'i') })
  res.render('tasks/search', { tasks, q })
})


router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ dueDate: 1 })
  res.render('tasks/dashboard', { user: req.user, tasks })
})

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('tasks/add')
})

router.post('/add', ensureAuthenticated, async (req, res) => {
  const { title, description, dueDate, status } = req.body
  await Task.create({
    title,
    description,
    dueDate,
    status,
    userId: req.user.id
  })
  res.redirect('/tasks/dashboard')
})

router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const task = await Task.findById(req.params.id)
  if (task.userId !== req.user.id) return res.redirect('/tasks/dashboard')
  res.render('tasks/edit', { task })
})

router.post('/edit/:id', ensureAuthenticated, async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, req.body)
  res.redirect('/tasks/dashboard')
})

router.get('/delete/:id', ensureAuthenticated, async (req, res) => {
  const task = await Task.findById(req.params.id)
  if (task.userId !== req.user.id) return res.redirect('/tasks/dashboard')
  res.render('tasks/delete', { task })
})

router.post('/delete/:id', ensureAuthenticated, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id)
  res.redirect('/tasks/dashboard')
})

module.exports = router
