FROM node:22.14-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
# Runs Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

# docker build -t react-template .
# docker run -p 80:80 react-template
