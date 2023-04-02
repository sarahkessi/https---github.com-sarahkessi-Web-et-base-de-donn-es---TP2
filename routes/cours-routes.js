const express = require("express");

const controleursCours = require("../controllers/cours-controleurs");
const router = express.Router();

router.get("/:coursId", controleursCours.getCoursById);

router.post('/', controleursCours.creerCours);

router.patch("/:coursId", controleursCours.modifier);

router.delete("/:coursId", controleursCours.supprimer);

module.exports = router;