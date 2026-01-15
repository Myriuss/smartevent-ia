# syntax=docker/dockerfile:1

FROM maven:3.9.12-eclipse-temurin-17 AS build
WORKDIR /app

# Copy wrapper + pom first for better caching
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw

# Pre-fetch deps
RUN ./mvnw -q -DskipTests dependency:go-offline

# Copy sources
COPY src src

# Build
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

# curl pour les healthchecks Docker
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Copy jar
COPY --from=build /app/target/*.jar app.jar

# Actuator defaults
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0"

EXPOSE 8080

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
