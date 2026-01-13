
# SmartEventAI – Docker Setup

## Run all containers
Run all containers (backend + UI) in detached mode:

```bash
docker compose --profile ui up -d
```

---

## Check logs
Check logs for a specific container:

```bash
docker logs -f smartevent_gateway
docker logs -f smartevent_front
```

(You can replace the container name with any service, e.g. `smartevent_auth`, `smartevent_event`, `smartevent_ai`, etc.)

---

##  Services & URLs

###  Service Discovery
**Eureka**
- URL: http://localhost:8761  
- Expected: You should see registered instances such as  
  `gateway`, `auth`, `event`, `ai`, `workflow`, ...

---

### Configuration
**Config Server (test)**
- URL: http://localhost:8888/application/default  
- Expected: A JSON configuration response

---

### API Gateway
**Gateway health**
- URL: http://localhost:8080/actuator/health  
- Expected status: `UP`

---

### Frontends
- **User Front**: http://localhost:4200  
- **Admin Front**: http://localhost:4201  

---

### AI Service
**Swagger / API Docs**
- URL: http://localhost:8000/docs  

---

## Stop containers
Stop all containers:

```bash
docker compose down
```

---

## Notes
- Containers keep running in background when started with `-d`.
- Logs are always accessible using `docker logs -f <container_name>`.
