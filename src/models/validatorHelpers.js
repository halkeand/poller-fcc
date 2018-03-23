const stringMinMaxTrimed = {
	type: String,
	minlength: [3, 'Can not be shorter than 3 characters'],
	maxlength: [60, 'Can not be longer than 60 characters'],
	trim: true
}

module.exports = { stringMinMaxTrimed }
