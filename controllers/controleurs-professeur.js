const { v4: uuidv4 } = require("uuid");
const { default: mongoose, mongo } = require("mongoose");
const HttpErreur = require("../models/http-erreur");

const Professeur = require("../models/professeur");

const PROFESSEURS = [
  {
    id: "p1",
    nom: "Labranche",
    prenom: "Sylvain",
    dateEmbauche: "23 juin 2012",
  },
];

const getProfesseurById = async (requete, reponse, next) => {
  const professeurId = requete.params.professeurId;
  let professeur;

  try {
    professeur = await Professeur.findById(professeurId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération du professeur", 500)
    );
  }
  if (!professeur) {
    return next(
      new HttpErreur("Aucun professeur trouvé pour l'id fourni", 400)
    );
  }
  reponse.json({ professeur: professeur.toObject({ getters: true }) });
};

const nouveauProfesseur = async (requete, reponse, next) => {
  const { nom, prenom, dateEmbauche } = requete.body;
  let nouveauProfesseur = new Professeur({
    nom,
    prenom,
    dateEmbauche,
    image: "image.png",
    cours: [],
  });

  try {
    await nouveauProfesseur.save();
  } catch (err) {
    console.log(err);
    return next(new HttpErreur("Erreur lors de l'ajout du professeur", 422));
  }
  reponse
    .status(201)
    .json({ professeur: nouveauProfesseur.toObject({ getter: true }) });
};

const updateProfesseur = async (requete, reponse, next) => {
  const { nom, prenom, dateEmbauche } = requete.body;
  const professeurId = requete.params.professeurId;

  let professeur;

  try {
    professeur = await Professeur.findById(professeurId);
    professeur.nom = nom;
    professeur.prenom = prenom;
    professeur.dateEmbauche = dateEmbauche;
    await professeur.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour du professeur", 500)
    );
  }
  reponse
    .status(200)
    .json({ professeur: professeur.toObject({ getters: true }) });
};

const supprimerProfesseur = async (requete, reponse, next) => {
  const professeurId = requete.params.professeurId;
  let professeur;

  try {
    professeur = await Professeur.findById(professeurId);
  } catch {
    return next(
      new HttpErreur("Erreur lors de la supression du professeur", 500)
    );
  }

  if (!professeur) {
    return next(new HttpErreur("Impossible de trouver le professeur", 404));
  }

  try {
    professeur.deleteOne({ id: professeurId });
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression du professeur", 500)
    );
  }
  reponse.status(200).json({ message: "Professeur supprimé" });
};

exports.updateProfesseur = updateProfesseur;
exports.getProfesseurById = getProfesseurById;
exports.nouveauProfesseur = nouveauProfesseur;
exports.supprimerProfesseur = supprimerProfesseur;
