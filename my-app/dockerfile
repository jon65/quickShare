FROM node:19.6.0-alpine

WORKDIR /

# copy package.json before backend code for efficiency
# if code changes, this won't repeat
COPY package.json ./

RUN npm install

# copy code in parent dir to speficied WORKDIR
# if code changes, only here below is run
COPY . .

RUN npm run build

# run on container starting
EXPOSE 3000
