FROM node:latest
WORKDIR /backend
COPY package.json .
RUN npm i --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]