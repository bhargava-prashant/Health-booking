# Use official Node.js image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install express pg dotenv cors validator

# Copy the rest of the application code
COPY . .

# Expose the port the service will run on
EXPOSE 5003
# Change port according to each service

# Start the service
CMD ["npm", "start"]
