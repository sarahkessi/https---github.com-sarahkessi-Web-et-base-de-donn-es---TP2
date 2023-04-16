const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const coursSchema = new Schema({
    titre:{type: String, required: true},
    discipline:{type: String, required: true},
    etudiants: [{type: mongoose.Types.ObjectId, required: true, ref:"Etudiant"}]
})

module.exports = mongoose.model("Cours", coursSchema);