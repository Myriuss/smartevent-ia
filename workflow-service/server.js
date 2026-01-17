const express = require('express');
const axios = require('axios');
const { Eureka } = require('eureka-js-client');
const app = express();
app.use(express.json());

// En local, le gateway est généralement sur localhost:8080.
// En Docker Compose, utilise http://gateway-service:8080
const GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || 'http://localhost:8080';
const EVENT_SERVICE_BASE_URL = `${GATEWAY_BASE_URL}/events`;
const AI_SERVICE_URL = `${GATEWAY_BASE_URL}/ai/generate-event-content`;

app.post('/workflow/start/:eventId', async (req, res) => {
    const eventId = req.params.eventId;

    try {
        // Récupérer l'evenement
        const eventResponse = await axios.get
            (`${EVENT_SERVICE_BASE_URL}/getEvenementById/${eventId}`);

        const event = eventResponse.data;
        console.log("Evenement récupéré:", event);

        // Appel a l'ia pour généré du contenu
        const aiRequestBody = {
            title: event.titleEvenement,
            date: event.dateEvenement,
            location: event.location,
            description: event.descriptionEvenement
        };
        console.log("Corps de la requête AI:", aiRequestBody);

        const aiResponse = await axios.post(AI_SERVICE_URL, aiRequestBody);
        const aiContent = aiResponse.data;
        console.log("Contenu généré par l'IA:", aiContent);

        // Mettre à jour l'evenement avec le contenu généré
        const updatedEvent = {
            ...event,
            titleEvenement: aiContent.title || event.titleEvenement,
            descriptionEvenement: aiContent.description || event.descriptionEvenement,
            agenda: aiContent.agenda || event.agenda,
            statusEvenement: 'GENERATED'
        };

        const updateResponse = await axios.put
            (`${EVENT_SERVICE_BASE_URL}/updateEvenement`, updatedEvent);

        console.log("Evenement mis à jour:", updateResponse.data);

        return res.status(200).json({
            message: 'Workflow IA exécuté avec succès',
            eventId,
            status: 'GENERATED',
            updatedEvent: updateResponse.data
        });
    }
    catch (error) {
        console.error('Erreur dans le workflow : ', error.message);
    }
});

app.get('/workflow/status/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    try {
        const eventResponse = await axios.get
            (`${EVENT_SERVICE_BASE_URL}/getEvenementById/${eventId}`);
        const event = eventResponse.data;
        return res.status(200).json({
            eventId,
            status: event.statusEvenement
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du statut : ', error.message);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
});

const PORT = parseInt(process.env.PORT || '3000', 10);

const EUREKA_HOST = process.env.EUREKA_HOST || 'localhost';
const EUREKA_PORT = parseInt(process.env.EUREKA_PORT || '8761', 10);
const INSTANCE_HOSTNAME = process.env.INSTANCE_HOSTNAME || 'localhost';
const INSTANCE_IP = process.env.INSTANCE_IP || '127.0.0.1';
const eureka = new Eureka({
    instance: {
        app: 'workflow-service',
        instanceId: `workflow-service:${PORT}`,
        hostName: INSTANCE_HOSTNAME,
        ipAddr: INSTANCE_IP,
        statusPageUrl: `http://${INSTANCE_HOSTNAME}:${PORT}/workflow/health`,
        port: {
            '$': PORT,
            '@enabled': 'true',
        },
        vipAddress: 'workflow-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: EUREKA_HOST,
        port: EUREKA_PORT,
        servicePath: '/eureka/apps/'
    },
});

// endpoint simple pour healthcheck Docker
app.get('/workflow/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

eureka.start(err => {
    if (err) {
        console.error('Eureka indisponible, service lancé quand même');
    } else {
        console.log('Enregistré avec succès auprès de Eureka');
    }
});

app.listen(PORT, () => {
    console.log(`Workflow Service is running on port http://localhost:${PORT}`);
});