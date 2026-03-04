FROM NODE

ARG NODE_ENV=development
WORKDIR /app


COPY package*.json ./





RUN if [ "$NODE_ENV" = "production" ]; then npm install --production; else npm install; fi

COPY . .


RUN npm run build


EXPOSE 443


CMD [ "node" , "dist/server.js" ]


