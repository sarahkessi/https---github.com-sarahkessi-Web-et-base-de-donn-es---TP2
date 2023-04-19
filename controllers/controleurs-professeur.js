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
    const {nom, prenom, dateEmbauche } = requete.body;
    const professeurId = requete.params.professeurId;
    
    let professeur;

    try {
        professeur = await Professeur.findById(professeurId);
        professeur.nom = nom;
        professeur.prenom = prenom;
        professeur.dateEmbauche = dateEmbauche;
        await professeur.save();
    } catch {
        return next (
            new HttpErreur("Erreur lors de la mise à jour du professeur", 500)
        );
    }
    reponse.status(200).json({professeur: professeur.toObject({getters : true}) });
}

const supprimerProfesseur = async (requete, reponse, next) => {
    const professeurId = requete.params.professeurId;
    let professeur;
    
    try {
        professeur = await Professeur.findById(professeurId);
    } catch {
        return next (
            new HttpErreur("Erreur lors de la supression du professeur", 500)
        );
    }

    if (!professeur) {
        return next (new HttpErreur("Impossible de trouver le professeur", 404));
    }

    try {
       professeur.deleteOne({id: professeurId});
    } catch {
        return next (
            new HttpErreur("Erreur lors de la suppression du professeur", 500)
        );
    }
    reponse.status(200).json({message: "Professeur supprimé"});
};

const ajouterCours = async (requete, reponse, next) => {

  const { titre, description, adresse, createur } = requete.body;
  const nouvellePlace = new Place({
    titre,
    description,
    adresse,
    image:
      "https://www.cmontmorency.qc.ca/wp-content/uploads/images/college/Porte_1_juin_2017-1024x683.jpg",
    createur,
  });

  let utilisateur;

  try {
    utilisateur = await Utilisateur.findById(createur);
    
  } catch {
    
    return next(new HttpErreur("Création de place échouée", 500));
  }

  if (!utilisateur) {
    return next(new HttpErreur("Utilisateur non trouvé selon le id"), 504);
  }

  try {

    
    await nouvellePlace.save();
    //Ce n'est pas le push Javascript, c'est le push de mongoose qui récupe le id de la place et l'ajout au tableau de l'utilisateur
    utilisateur.places.push(nouvellePlace);
    await utilisateur.save();
    //Une transaction ne crée pas automatiquement de collection dans mongodb, même si on a un modèle
    //Il faut la créer manuellement dans Atlas ou Compass
  } catch (err) {
    const erreur = new HttpErreur("Création de place échouée", 500);
    return next(erreur);
  }
  reponse.status(201).json({ place: nouvellePlace });
};



exports.updateProfesseur = updateProfesseur;
exports.getProfesseurById = getProfesseurById;
exports.nouveauProfesseur = nouveauProfesseur;
exports.supprimerProfesseur = supprimerProfesseur;
exports.ajouterCours = ajouterCours;
