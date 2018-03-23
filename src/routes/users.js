const express = require('express'),
	authenticate = require('../midddlewares/authenticate'),
	router = express.Router(),
	{
		getAll,
		getOne,
		addOne,
		updateOne,
		deleteOne
	} = require('../controllers/users')

router.get('/', getAll)
router.post('/', addOne)

router.get('/:id', getOne)
router.patch('/:id', authenticate, updateOne)
router.delete('/:id', authenticate, deleteOne)

module.exports = router
