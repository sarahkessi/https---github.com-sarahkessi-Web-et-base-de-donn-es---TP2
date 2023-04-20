const { v4: uuidv4 } = require("uuid");
const { default: mongoose, mongo } = require("mongoose");
const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours");
const Professeur = require("../models/professeur");

const getCoursById = async (requete, reponse, next) => {
  const coursId = requete.params.coursId;
  let cours;

  try {
    cours = await Cours.findById(coursId);
  } catch (err) {
    return next(new HttpErreur("Erreur lors de la récupération du cours", 500));
  }
  if (!cours) {
    return next(new HttpErreur("Aucun cours trouvé pour l'id fourni", 400));
  }
  reponse.json({ cours: cours.toObject({ getters: true }) });
};

const creerCours = async (requete, reponse, next) => {
  const { titre, createur } = requete.body;

  const nouveauCours = new Cours({
    titre,
    createur,
    etudiants: [],
  });

  let professeur;

  try {
    professeur = await Professeur.findById(createur);
  } catch {
    return next(new HttpErreur("Création du cours échouée", 500));
  }

  if (!professeur) {
    return next(new HttpErreur("Professeur non trouvé selon le id"), 504);
  }

  try {
    if (createur.length > 1) {
      return next(new HttpErreur("Veuillez entrer un seul professeur"));
    }
    await nouveauCours.save();
    professeur.cours.push(nouveauCours);
    await professeur.save();
    //Une transaction ne crée pas automatiquement de collection dans mongodb, même si on a un modèle
    //Il faut la créer manuellement dans Atlas ou Compass
  } catch (err) {
    const erreur = new HttpErreur("Création du cours échoué", 500);
    return next(erreur);
  }
  reponse.status(201).json({ cours: nouveauCours });
};

const updateCours = async (requete, reponse, next) => {
  const { titre, createur } = requete.body;
  const coursId = requete.params.coursId;

  let cours;
  let professeur;

  try {
    cours = await Cours.findById(coursId);
    professeur = await Professeur.findById(createur);

    cours.titre = titre;
    cours.createur = createur;

    if (createur.length > 1) {
      return next(new HttpErreur("Veuillez entrer un seul professeur"));
    }
    await cours.save();
    professeur.cours.push(cours);
    await professeur.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour de la place", 500)
    );
  }
  reponse.status(200).json({ cours: cours.toObject({ getters: true }) });
};

const supprimerCours = async (requete, reponse, next) => {
  const coursId = requete.params.coursId;

  let cours;
  try {
    cours = await Cours.findById(coursId).populate("createur");
  } catch {
    return next(new HttpErreur("Erreur lors de la suppression du cours", 500));
  }
  if (!cours) {
    return next(new HttpErreur("Impossible de trouver le cours", 404));
  }

  try {
    cours.deleteOne({ id: coursId });
    cours.createur.cours.deleteOne(cours);
    await cours.createur.save();
  } catch {
    return next(new HttpErreur("Erreur lors de la suppression du cours", 500));
  }
  reponse.status(200).json({ message: "Cours supprimé." });
};

exports.creerCours = creerCours;
exports.getCoursById = getCoursById;
exports.updateCours = updateCours;
exports.supprimerCours = supprimerCours;
