# SmartEventAI — Démarrage avec Docker

Ce projet contient plusieurs microservices (Spring Boot), une API IA (FastAPI), un service workflow (Node.js) et 2 fronts Angular.

## Pré-requis
- Docker + Docker Compose (v2)

## Démarrage (backend)
Depuis la racine du repo (`smarteventai-master`) :

```bash
# Optionnel : changer le mot de passe Postgres (sinon: postgres)
export POSTGRES_PASSWORD=postgres

# Lancer les microservices (sans UI, sans LLM)
docker compose up --build
```

Services exposés sur la machine :
- Eureka : `http://localhost:8761`
- Config Server : `http://localhost:8888`
- Gateway : `http://localhost:8080`
- Auth Service : `http://localhost:8091`
- Event Service : `http://localhost:8090`
- AI Service (FastAPI) : `http://localhost:8000/docs`
- Workflow Service : `http://localhost:3000/workflow/health`

## Avec les fronts Angular (optionnel)

```bash
docker compose --profile ui up --build
```

- Front (user) : `http://localhost:4200`
- Front Admin : `http://localhost:4201`

## Avec Ollama (LLM local, optionnel)
L’API IA est prévue pour appeler Ollama.

```bash
docker compose --profile llm up --build
```

Ollama sera accessible sur `http://localhost:11434`.

> Remarque : si tu n’as pas encore téléchargé le modèle (`mistral`), exécute :
> `docker exec -it smartevent_ollama ollama pull mistral`

## Notes importantes
- Les **configs** Spring sont servies via le `config-server` en mode **native** en lisant le dossier `./config-repo` monté dans le container.
- Des fichiers `*-docker.properties` ont été ajoutés dans `config-repo/` et sont utilisés via `SPRING_PROFILES_ACTIVE=docker`.
- Postgres initialise automatiquement `auth_db` et `event_db` via `docker/postgres/init.sql`.

## Arrêter et nettoyer
```bash
docker compose down
# supprimer aussi les volumes (DB) :
docker compose down -v
```
