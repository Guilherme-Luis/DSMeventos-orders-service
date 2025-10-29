import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();

const { API_VERSION, NODE_ENV, PORT } = process.env;

if (!API_VERSION || !NODE_ENV || !PORT) {
    throw new Error("Variable is not defined in environment variables");
}

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DSMeventos - Orders Service",
            version: API_VERSION,
            description: "API documentation for the DSMeventos orders service",
        },
        servers: [
            { url: `http://localhost:${PORT}/api/${NODE_ENV}` },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./src/routes/*.js", "./src/models/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);
export const swaggerDocs = (app) => {
    app.use(`/api/${NODE_ENV}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger docs available at http://localhost:${PORT}/api/${NODE_ENV}/docs`);
};
