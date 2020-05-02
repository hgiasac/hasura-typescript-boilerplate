FROM node:lts-alpine

# Working in root app
WORKDIR /usr/src/app
COPY . .
RUN npm config set unsafe-perm true 
RUN npm install 

# Exec app
RUN npm run build
EXPOSE 9000

CMD ["npm", "start"]
