# Step 1: build an angular app using the production config
FROM node:latest AS build

WORKDIR /app

# copy package.json and package-lock.json files
COPY package*.json ./

# run a clean install of the dependencies
RUN npm ci

# install Angular CLI globally
RUN npm install -g @angular/cli

# copy all files
COPY . .

# build the application
RUN npm run build --configuration=production -- --base-href=/g24/

# Step 2: we use the nginx image to serve the application
FROM nginx:latest

# copy the build output to replace the default nginx contents
COPY --from=build /app/dist/g24/browser /usr/share/nginx/html/g24

# copy nginx config file to replace the default nginx contents
COPY nginx.conf /etc/nginx/conf.d/default.conf

# expose port 80
EXPOSE 8080

# run nginx
CMD ["nginx", "-g", "daemon off;"]