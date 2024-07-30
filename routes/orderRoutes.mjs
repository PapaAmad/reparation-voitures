// Importation des modules nécessaires
import express from 'express';
import twilio from 'twilio';

// Création du routeur Express
const router = express.Router();

// Configuration du client Twilio
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Fonction de validation des données de commande
function validateOrderData(data) {
    const { prenom, nom, telephone, cartItems, total } = data;
    
    // Vérification des champs personnels
    if (!prenom || !nom || !telephone) {
        return 'Tous les champs personnels sont requis';
    }
    
    // Vérification du panier
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return 'Le panier ne peut pas être vide';
    }
    
    // Vérification du total
    if (typeof total !== 'number' || total <= 0) {
        return 'Le total de la commande est invalide';
    }
    
    // Si toutes les vérifications sont passées, retourner null (pas d'erreur)
    return null;
}

// Fonction pour envoyer un SMS via Twilio
async function sendSMS(phoneNumber, message) {
    try {
        const result = await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        console.log('SMS envoyé avec succès:', result.sid);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi du SMS:', error);
        return false;
    }
}

// Fonction simulant la sauvegarde de la commande
function saveOrder(orderData) {
    // Génération d'un ID de commande basé sur le timestamp actuel
    const orderId = 'ORDER_' + Date.now();
    
    // Affichage de l'ID de commande dans la console (pour simulation)
    console.log('Commande sauvegardée avec ID:', orderId);
    
    // Retourne l'ID de commande généré
    return orderId;
}

// Définition de la route POST pour la création de commande
router.post('/', async (request, response) => {
    try {
        // Extraction des données de la requête
        const { prenom, nom, telephone, cartItems, total } = request.body;

        // Validation des données
        const validationError = validateOrderData(request.body);
        if (validationError) {
            // Si une erreur de validation est détectée, renvoyer une réponse d'erreur
            return response.status(400).json({ message: validationError });
        }

        // Simulation de la sauvegarde de la commande
        const orderId = saveOrder({ prenom, nom, telephone, cartItems, total });

        // Préparation du message SMS
        const fournisseurNumero = process.env.FOURNISSEUR_NUMERO || '+221770333903';
        const message = `
Nouvelle commande de ${prenom} ${nom} (${telephone}):
${cartItems.map(item => `${item.name} - ${item.price} Francs CFA x${item.quantity}`).join('\n')}
Total: ${total} Francs CFA
ID de commande: ${orderId}
        `.trim();

        // Envoi du SMS
        const smsSuccess = await sendSMS(fournisseurNumero, message);

        // Préparation de la réponse en fonction du succès de l'envoi du SMS
        if (smsSuccess) {
            response.status(201).json({ 
                message: 'Commande créée avec succès et notification SMS envoyée au fournisseur',
                orderId: orderId
            });
        } else {
            response.status(201).json({ 
                message: 'Commande créée avec succès, mais erreur lors de l\'envoi de la notification SMS',
                orderId: orderId
            });
        }
    } catch (error) {
        // En cas d'erreur non gérée, afficher l'erreur dans la console et renvoyer une réponse d'erreur
        console.error('Erreur lors du traitement de la commande:', error);
        response.status(500).json({ message: 'Erreur lors du traitement de la commande' });
    }
});

// Exportation du routeur pour utilisation dans l'application principale
export default router;