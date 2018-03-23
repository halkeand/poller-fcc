const express = require("express"),
  authenticate = require("../midddlewares/authenticate"),
  router = express.Router(),
  {
    getAll,
    getOne,
    addOne,
    updateOne,
    deleteOne,
    vote
  } = require("../controllers/polls")

router.get("/", getAll)
router.post("/", authenticate, addOne)
router.post("/vote/:id/:choiceId", vote)

router.get("/:id", getOne)
router.patch("/:id", authenticate, updateOne)
router.delete("/:id", authenticate, deleteOne)

module.exports = router
