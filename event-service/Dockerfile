# syntax=docker/dockerfile:1

FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app/event-service

# Copier le module
COPY event-service/mvnw ./mvnw
COPY event-service/pom.xml ./pom.xml
COPY event-service/.mvn ./.mvn
RUN chmod +x mvnw

# Pré-charger les dépendances
RUN ./mvnw dependency:go-offline -B -q

# Copier les sources
COPY event-service/src ./src

# Build du module uniquement
RUN ./mvnw package -DskipTests -B -q

FROM eclipse-temurin:17-jre
WORKDIR /app

# curl pour les healthchecks Docker
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy jar
COPY --from=build /app/event-service/target/*.jar app.jar

# Actuator defaults
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

EXPOSE 8090

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]