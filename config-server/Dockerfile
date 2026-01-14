# syntax=docker/dockerfile:1

FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app/config-server

# Copier le module
COPY config-server/mvnw ./mvnw
COPY config-server/pom.xml ./pom.xml
COPY config-server/.mvn ./.mvn
RUN chmod +x mvnw

# Pré-charger les dépendances
RUN ./mvnw dependency:go-offline -B -q

# Copier les sources
COPY config-server/src ./src

# Build du module uniquement
RUN ./mvnw package -DskipTests -B -q

FROM eclipse-temurin:17-jre
WORKDIR /app

# curl pour les healthchecks Docker
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy jar
COPY --from=build /app/config-server/target/*.jar app.jar

# Actuator defaults
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

EXPOSE 8080

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]