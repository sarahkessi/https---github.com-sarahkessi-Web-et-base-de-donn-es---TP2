const { v4: uuidv4 } = require("uuid");
const { default: mongoose, mongo } = require("mongoose");
const HttpErreur = require("../models/http-erreur");

const Etudiant = require("../models/etudiant");
const Cours = require("../models/cours");

const nouvelEtudiant = async (requete, reponse, next) => {
  const { nom, noAdmission } = requete.body;
  let nouvelEtudiant = new Etudiant({
    nom,
    noAdmission,
    listeCours: [],
  });

  try {
    await nouvelEtudiant.save();
  } catch (err) {
    console.log(err);
    return next(
      new HttpErreur("Erreur lors de la création de l'étudiant", 422)
    );
  }
  reponse
    .status(201)
    .json({ etudiant: nouvelEtudiant.toObject({ getter: true }) });
};

const getEtudiantById = async (requete, reponse, next) => {
  const etudiantId = requete.params.etudiantId;
  let etudiant;

  try {
    etudiant = await Etudiant.findById(etudiantId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération de l'étudiant", 500)
    );
  }
  if (!etudiant) {
    return next(new HttpErreur("Aucun élève trouvé pour l'id fourni", 400));
  }
  reponse.json({ etudiant: etudiant.toObject({ getters: true }) });
};

const updateEtudiant = async (requete, reponse, next) => {
  const { nom, listeCours } = requete.body;
  const etudiantId = requete.params.etudiantId;

  let etudiant;
  let cours;

  try {
    etudiant = await Etudiant.findById(etudiantId);
    cours = await Cours.findById(listeCours);

    etudiant.nom = nom;
    etudiant.listeCours = listeCours;

    await etudiant.save();
    cours.etudiants.push(etudiant);
    await cours.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour de l'étudiant", 500)
    );
  }
  reponse.status(200).json({ etudiant: etudiant.toObject({ getters: true }) });
};

const supprimerEtudiant = async (requete, reponse, next) => {
  const etudiantId = requete.params.etudiantId;
  let etudiant;

  try {
    etudiant = await Etudiant.findById(etudiantId).populate("listeCours");
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de l'élève", 500)
    );
  }
  if (!etudiant) {
    return next(new HttpErreur("Impossible de trouver l'étudiant", 404));
  }

  try {
    etudiant.deleteOne({ id: etudiantId });
    //etudiant.listeCours.pull(etudiant);
    // await etudiant.listeCours.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de l'élève", 500)
    );
  }
  reponse.status(200).json({ message: "Étudiant supprimé." });
};

exports.nouvelEtudiant = nouvelEtudiant;
exports.getEtudiantById = getEtudiantById;
exports.updateEtudiant = updateEtudiant;
exports.supprimerEtudiant = supprimerEtudiant;
