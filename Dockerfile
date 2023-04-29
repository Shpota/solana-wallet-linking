FROM node:18.16.0 AS JS_BUILD
COPY . /code
WORKDIR /code/client
RUN ls  -la
RUN npm install && npm run build

FROM eclipse-temurin:17.0.7_7-jdk AS JAVA_BUILD
COPY . /code
WORKDIR /code
COPY --from=JS_BUILD /code/src/main/resources* /code/src/main/resources
RUN ./gradlew shadowJar

FROM eclipse-temurin:17.0.7_7-jre
COPY --from=JAVA_BUILD /code/build/libs/solana-wallet-linking-1.0-SNAPSHOT-all.jar ./
CMD java -jar solana-wallet-linking-1.0-SNAPSHOT-all.jar