to run all containers :
docker compose --profile ui up -d

to check the logs :
docker logs -f smartevent_gateway
docker logs -f smartevent_front


Eureka : http://localhost:8761
➡️ Tu dois voir des instances enregistrées (gateway, auth, event, ai, workflow…)

Config server (test) : http://localhost:8888/application/default
➡️ Doit renvoyer du JSON de config

Gateway health : http://localhost:8080/actuator/health
➡️ Doit être UP

Front : http://localhost:4200
Admin : http://localhost:4201
AI docs : http://localhost:8000/docs