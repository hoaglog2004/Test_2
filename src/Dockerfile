# B1: Build file jar (Nếu bạn chưa build ở máy cá nhân)
FROM maven:3.8.5-openjdk-21 AS build
COPY . .
RUN mvn clean package -DskipTests

# B2: Chạy ứng dụng
FROM openjdk:21-jdk-slim
COPY --from=build /target/bookReview-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]