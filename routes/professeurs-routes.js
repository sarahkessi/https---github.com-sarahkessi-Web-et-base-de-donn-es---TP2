const express = require("express");

const controleursProfesseurs = require("../controllers/controleurs-professeur");
const router = express.Router();

router.get("/:professeurId", controleursProfesseurs.getProfesseurById);

router.post("/ajouter", controleursProfesseurs.nouveauProfesseur);

// router.patch("/:professeurId", controleursProfesseurs.updateProfesseur);

// router.delete("/:professeurId", controleursProfesseurs.supprimerProfesseur);

//router.post("/:professeurId/cours", controleursProfesseurs.ajouterCours);

module.exports = router;