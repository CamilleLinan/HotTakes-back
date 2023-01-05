const Sauce = require('../models/Sauce.model');
const fs = require('fs');

// Créer une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    const userId = req.body.userId
    const name = req.body.name;
    const heat = req.body.heat;

    const sauce = new Sauce({
        ...sauceObject,
        userId,
        name,
        heat
    });

    sauce.save()
        .then((sauce) => res.status(201).json({ sauce, message: "Sauce créée !" }))
        .catch(error => res.status(400).json({ error }));
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject.userId;
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then((modifySauce) => res.status(200).json({ modifySauce, message: "Sauce modifiée !" }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(404).json({ error }));
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                const filename = sauce.imageUrl.split('/images')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch(error => res.status(404).json({ error }))
};

// Afficher une seule sauce avec son ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.aggregate([
        {"$lookup": {
            "from": "users",
            "localField": "userId",
            "foreignField": "_id",
            "as": "User"
        }},
    ]).sort({sauceNumber:-1})
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};

// Liker un post
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {(req.body.like)  
            if (sauce.usersLiked.find(user => user === req.body.userId)) {
                // Supprimer son like
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { likes: -1 },
                    $pull: { usersLiked: req.body.userId },
                    _id: req.params.id
                })
                    .then(() => res.status(201).json({ message: "Votre avis a bien été modifié !" }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                // Ajouter un like
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { likes: 1 },
                    $push: { usersLiked: req.body.userId },
                    _id: req.params.id
                })
                    .then(() => res.status(201).json({ message: "Votre avis est bien pris en compte (like) !" }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}

// Liker un post
exports.dislikeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {(req.body.dislike)  
            if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                // Supprimer son dislike
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes: -1 },
                    $pull: { usersDisliked: req.body.userId },
                    _id: req.params.id
                })
                    .then(() => res.status(201).json({ message: "Votre avis a bien été modifié !" }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                // Ajouter un dislike
                Sauce.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: req.body.userId },
                    _id: req.params.id
                })
                    .then(() => res.status(201).json({ message: "Votre avis est bien pris en compte (dislike) !" }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
}