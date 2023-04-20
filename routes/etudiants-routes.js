const express = require("express");

const controleursEtudiant = require("../controllers/etudiants-controleurs");
const router = express.Router();

router.post("/ajouter", controleursEtudiant.nouvelEtudiant);

router.get("/:etudiantId", controleursEtudiant.getEtudiantById);

router.patch("/:etudiantId", controleursEtudiant.updateEtudiant);

router.delete("/:etudiantId", controleursEtudiant.supprimerEtudiant);

// router.patch("/:etudiantId/cours", controleursEtudiant.ajouterCours);

module.exports = router;
