const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routes/user.js']

swaggerAutogen(outputFile, endpointsFiles)