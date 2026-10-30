import type { GuideCopy } from '../guideContent';
export default {
    "title": "Guide des cartes FF14",
    "eyebrow": "Référence de création",
    "intro": "Choisissez les informations utiles et accordez image et texte. Revenez ensuite à l’éditeur.",
    "contentsLabel": "Sommaire",
    "useCasesTitle": "Définir l’objectif",
    "useCasesIntro": "Ces exemples fictifs montrent différents usages des champs disponibles.",
    "useCases": [
        {
            "id": "social",
            "title": "Présentation sociale",
            "summary": "Présentez brièvement personnage et style de jeu.",
            "fieldsLabel": "Champs conseillés",
            "fields": [
                "Nom et Monde",
                "Job principal et activités",
                "Courte présentation"
            ],
            "exampleLabel": "Exemple fictif",
            "example": "J’aime les donjons tranquilles et le logement le week-end. Débutants bienvenus !",
            "privacy": "Omettez nom réel, coordonnées et lieux habituels si vous ne souhaitez pas les partager."
        },
        {
            "id": "recruitment",
            "title": "Recrutement de CL ou d’équipe fixe",
            "summary": "Précisez horaires et type de groupe recherché.",
            "fieldsLabel": "Champs conseillés",
            "fields": [
                "Monde et centre de données",
                "Jobs principaux et secondaires",
                "Horaires et présentation"
            ],
            "exampleLabel": "Exemple fictif",
            "example": "En ligne après 21 h KST. Je cherche un groupe patient pour apprendre.",
            "privacy": "Partagez les créneaux nécessaires et utilisez les contacts sûrs de la communauté."
        },
        {
            "id": "screenshot",
            "title": "Souvenir de capture",
            "summary": "Laissez la capture et l’ambiance au premier plan.",
            "fieldsLabel": "Champs conseillés",
            "fields": [
                "Capture haute résolution",
                "Disposition et couleur",
                "Quelques autocollants"
            ],
            "exampleLabel": "Exemple fictif",
            "example": "Une carte autour d’une capture /gpose à conserver.",
            "privacy": "Vérifiez les noms d’autres joueurs et les messages visibles."
        }
    ],
    "sectionLabel": "Étapes de rédaction",
    "sections": [
        {
            "id": "purpose",
            "title": "Choisir le message",
            "intro": "Plus de détails ne signifie pas une meilleure carte. Décidez de ce qui doit être compris au premier regard.",
            "points": [
                "Distinguez identité (nom, Monde, job) et préférences (activités, horaires).",
                "Aucun profil officiel ou Lodestone n’est copié automatiquement.",
                "La capture et les informations seront visibles dans l’image partagée."
            ]
        },
        {
            "id": "screenshot",
            "title": "Choisir et recadrer la capture",
            "intro": "La lisibilité du personnage passe avant la décoration.",
            "points": [
                "Choisissez visage, tenue ou silhouette et gardez une marge pour le format.",
                "Vérifiez le contraste du nom et des icônes sur les fonds clairs et sombres.",
                "Une source peu définie reste pixelisée à l’agrandissement. Utilisez une capture haute résolution.",
                "Revérifiez le cadrage après un changement de disposition."
            ]
        },
        {
            "id": "profile",
            "title": "Rédiger le profil",
            "intro": "Commencez par une phrase sur vos activités, horaires ou échanges recherchés.",
            "points": [
                "Si le nom public diffère du nom en jeu, activez l’indication correspondante.",
                "Indiquez Monde et centre de données pour faciliter les rencontres.",
                "Les étiquettes donnent le ton ; la présentation ajoute les détails.",
                "Évitez vrais noms, coordonnées et horaires personnels trop précis."
            ]
        },
        {
            "id": "jobs",
            "title": "Afficher jobs et style de jeu",
            "intro": "Le job principal donne un point focal ; les autres montrent vos activités.",
            "points": [
                "Choisissez un job principal représentatif, ou utilisez la liste sans job principal.",
                "Combat, artisanat et récolte sont séparés. Limitez les sélections pour rester lisible.",
                "Quelques étiquettes précises valent mieux que toutes les options.",
                "Les niveaux ne sont pas vérifiés automatiquement. Ajoutez une date si utile."
            ]
        },
        {
            "id": "style",
            "title": "Régler style et décoration",
            "intro": "Couleurs et autocollants complètent l’ambiance sans masquer les informations.",
            "points": [
                "Vérifiez aussi les petits libellés lors du choix de la police.",
                "Évaluez le contraste de l’accent avec les noms, icônes et textes.",
                "Placez les autocollants dans l’espace libre, sans couvrir les informations.",
                "Fixez d’abord disposition et cadrage, puis couleurs et autocollants."
            ]
        },
        {
            "id": "save",
            "title": "Vérifier avant de partager",
            "intro": "L’enregistrement télécharge un PNG de la carte actuelle. Relisez les éléments visibles.",
            "points": [
                "Si le téléchargement est bloqué, essayez Chrome, Safari ou Edge hors navigateur intégré.",
                "Effacer les données du site peut supprimer l’édition. Gardez PNG et sauvegardes JSON.",
                "Vérifiez nom, Monde, noms d’autres joueurs et messages dans la capture.",
                "Ce projet est non officiel. Jeux, polices et images restent à leurs ayants droit."
            ]
        }
    ],
    "referenceTitle": "Périmètre pris en charge",
    "referenceIntro": "Ces listes utilisent les mêmes données que l’éditeur et suivent ses mises à jour.",
    "roleNames": {
        "battle": "Jobs de combat",
        "crafting": "Artisans",
        "gathering": "Récolteurs"
    },
    "jobCountLabel": " jobs",
    "worldScopeTitle": "Mondes et centres de données",
    "worldScopeIntro": "Mondes coréens et globaux. Aucun import automatique depuis Lodestone.",
    "regionCountLabel": " régions",
    "dataCenterCountLabel": " centres de données",
    "worldCountLabel": " Mondes",
    "checklistTitle": "Vérification avant enregistrement",
    "checklistIntro": "Cette liste reste dans la session, sans envoi au serveur ni compte.",
    "checklist": [
        {
            "id": "image",
            "label": "Position et échelle de l’image correctes."
        },
        {
            "id": "identity",
            "label": "Nom et Monde corrects."
        },
        {
            "id": "job",
            "label": "Job principal et activités à jour."
        },
        {
            "id": "privacy",
            "label": "Aucune information privée visible."
        },
        {
            "id": "contrast",
            "label": "Contraste suffisant des textes et couleurs."
        },
        {
            "id": "share",
            "label": "Carte lisible à l’endroit où elle sera partagée."
        }
    ],
    "createCta": "Retour à l’éditeur",
    "exampleNotice": "Ces exemples fictifs illustrent une approche de rédaction."
,
 "checklistProgress": (completed: number, total: number) => `${completed}/${total} vérifiés`
} satisfies GuideCopy;
