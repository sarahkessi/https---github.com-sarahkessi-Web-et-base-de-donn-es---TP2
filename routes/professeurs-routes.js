const express = require("express");

const controleursProfesseurs = require("../controllers/professeurs-controleurs");
const router = express.Router();

router.get("/:professeurId", controleursProfesseurs.getProfesseurById);

router.post("/", controleursProfesseurs.nouveauProfesseur);

router.patch("/:professeurId", controleursProfesseurs.modifier);

router.delete("/:professeurId", controleursProfesseurs.supprimer);

router.post("/:professeurId/cours", controleursProfesseurs.ajouterCours);

module.exports = router;