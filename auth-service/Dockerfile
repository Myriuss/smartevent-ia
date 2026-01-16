# Use Maven image for building
FROM maven:3.9-eclipse-temurin-17 AS build

# Set the working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# Use JRE for runtime
FROM eclipse-temurin:17-jre

WORKDIR /app

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --disabled-password appuser --ingroup appgroup

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership to the non-root user
RUN chown appuser:appgroup app.jar

# Switch to non-root user
USER appuser

# Expose the port the app runs on
EXPOSE 8091

# Run the jar file
CMD ["java", "-jar", "app.jar"]
 