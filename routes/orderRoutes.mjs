// Importation des modules nécessaires
import express from 'express';
import fetch from 'node-fetch';

// Création du routeur Express
const router = express.Router();

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

// Fonction d'envoi de message WhatsApp
async function sendWhatsAppMessage(phoneNumber, message) {
    try {
        // Encodage du message pour l'URL
        const encodedMessage = encodeURIComponent(message);
        
        // Construction de l'URL pour l'API WhatsApp
        const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
        
        // Envoi de la requête à l'API WhatsApp
        const response = await fetch(url, { method: 'GET' });
        
        // Retourne true si la requête a réussi, false sinon
        return response.ok;
    } catch (error) {
        // En cas d'erreur, afficher l'erreur dans la console et retourner false
        console.error('Erreur lors de l\'envoi du message WhatsApp:', error);
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

        // Préparation du message WhatsApp
        const fournisseurNumero = process.env.FOURNISSEUR_NUMERO || '+221781698072';
        const message = `
Nouvelle commande de ${prenom} ${nom} (${telephone}):
${cartItems.map(item => `${item.name} - ${item.price} Francs CFA x${item.quantity}`).join('\n')}
Total: ${total} Francs CFA
ID de commande: ${orderId}
        `.trim();

        // Envoi du message WhatsApp
        const whatsappSuccess = await sendWhatsAppMessage(fournisseurNumero, message);

        // Préparation de la réponse en fonction du succès de l'envoi du message WhatsApp
        if (whatsappSuccess) {
            response.status(201).json({ 
                message: 'Commande créée avec succès et notification envoyée au fournisseur',
                orderId: orderId
            });
        } else {
            response.status(201).json({ 
                message: 'Commande créée avec succès, mais erreur lors de l\'envoi de la notification',
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