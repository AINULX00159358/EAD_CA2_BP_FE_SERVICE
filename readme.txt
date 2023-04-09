1. Install nodejs: https://nodejs.org/en/download/
   OR
   > choco install nodejs-lts

2. cd ..../EAD_FE_CA1_2023 project folder

3. execute: npm install
 - This will use the content of the package.json file and install any needed dependencies into /node-modules folder

4. To run code locally type: node fe-server.js
 - Can access code on http://localhost:22137
 - 22137 can be changed in /config/config.json property "exposedPort"


5. docker rmi -f $(docker images -q bpfeservice)

6. docker build --no-cache --tag bpfeservice:CA2_v1 .

7. docker run --name bpfeservice -p 30256:30256 -e "MONGO_CONN_URI=mongodb://172.17.0.2:27017" bpfeservice:CA2_v1
