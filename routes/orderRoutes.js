const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/order', async (req, res) => {
    const { prenom, nom, telephone, cartItems } = req.body;

    const fournisseurNumero = '+221781698072'; // Remplacez par le numéro de téléphone réel du fournisseur
    const message = `Nouvelle commande de ${prenom} ${nom} (${telephone}):
${cartItems.map(item => `${item.name} - ${item.price} Francs CFA`).join('\n')}`;

    try {
        const whatsappResponse = await fetch(`https://api.whatsapp.com/send?phone=${fournisseurNumero}&text=${encodeURIComponent(message)}`);

        if (whatsappResponse.ok) {
            res.status(200).send('Commande envoyée avec succès');
        } else {
            res.status(500).send('Erreur lors de l\'envoi du message WhatsApp');
        }
    } catch (error) {
        res.status(500).send('Erreur lors de l\'envoi du message WhatsApp');
    }
});

module.exports = router;
