const express = require("express");

const controleursEtudiant = require("../controllers/etudiants-controleurs");
const router = express.Router();

router.post("/", controleursEtudiant.nouvelEtudiant);

router.get("/:etudiantId", controleurs.getEtudiantById);

router.patch("/:etudiantId", controleursEtudiant.update);

router.delete("/:etudiantId", controleursEtudiant.supprimer);

router.patch("/:etudiantId/cours", controleursEtudiant.ajouterCours);

module.exports = router;