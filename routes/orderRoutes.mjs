import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configuration du transporteur d'e-mails avec Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Fonction de validation des données de commande
function validateOrderData(data) {
    const { prenom, nom, telephone, cartItems, total } = data;
    
    if (!prenom || !nom || !telephone) {
        return 'Tous les champs personnels sont requis';
    }
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return 'Le panier ne peut pas être vide';
    }
    
    if (typeof total !== 'number' || total <= 0) {
        return 'Le total de la commande est invalide';
    }
    
    return null;
}

// Fonction pour envoyer un e-mail
async function sendEmail(subject, text) {
  const to = process.env.GMAIL_USER; // Vous envoyez à vous-même
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: to,
      subject: subject,
      text: text
    });
    console.log('E-mail envoyé avec succès:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail:', error);
    return false;
  }
}

// Fonction simulant la sauvegarde de la commande
function saveOrder(orderData) {
    const orderId = 'ORDER_' + Date.now();
    console.log('Commande sauvegardée avec ID:', orderId);
    return orderId;
}

// Définition de la route POST pour la création de commande
router.post('/', async (request, response) => {
  try {
    const { prenom, nom, telephone, cartItems, total } = request.body;

    const validationError = validateOrderData(request.body);
    if (validationError) {
      return response.status(400).json({ message: validationError });
    }

    const orderId = saveOrder({ prenom, nom, telephone, cartItems, total });

    // Préparation du message e-mail
    const subject = `Nouvelle commande - ID: ${orderId}`;
    const message = `
Vous avez reçu une nouvelle commande :

Client: ${prenom} ${nom}
Téléphone: ${telephone}

Articles commandés:
${cartItems.map(item => `- ${item.name} - ${item.price} Francs CFA x${item.quantity}`).join('\n')}

Total: ${total} Francs CFA
ID de commande: ${orderId}

Merci de traiter cette commande dès que possible.
    `.trim();

    // Envoi de l'e-mail
    const emailSuccess = await sendEmail(subject, message);

    if (emailSuccess) {
      response.status(201).json({ 
        message: 'Commande créée avec succès et notification e-mail envoyée',
        orderId: orderId
      });
    } else {
      response.status(201).json({ 
        message: 'Commande créée avec succès, mais erreur lors de l\'envoi de la notification e-mail',
        orderId: orderId
      });
    }
  } catch (error) {
    console.error('Erreur lors du traitement de la commande:', error);
    response.status(500).json({ message: 'Erreur lors du traitement de la commande' });
  }
});

export default router;