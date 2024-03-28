
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        "openapi": '3.0.0',
        "info": {
            "title": "Inovus API",
            "description": "An all-in-one API for unified control and management over every facet of Inovus' digital ecosystem.",
            "version": "1.0.0",
            "contact": {
                "email": "mail@inovuslabs.org"
            },
            "license": {
                "name": "MPL-2.0",
                "url": "https://www.mozilla.org/en-US/MPL/2.0/"
            }
        },
        "servers": [
            {
                "url": "http://localhost:3000",
                "description": "Development server"
            },
            {
                "url": "https://api.inovuslabs.org",
                "description": "Production server"
            }
        ],
        "tags": [
            {
                "name": "Auth",
                "description": "Authentication operations"
            }
        ],
        "schemes": [
            "https",
            "http"
        ],
        "paths": {

            "/auth/register": {
                "post": {
                    "tags": [
                        "Auth"
                    ],
                    "summary": "Register a new user",
                    "description": "Register a new user in the system.",
                    "operationId": "registerUser",
                    "requestBody": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "first_name": {
                                            "type": "string",
                                            "example": "John"
                                        },
                                        "last_name": {
                                            "type": "string",
                                            "example": "Doe"
                                        },
                                        "mobile": {
                                            "type": "string",
                                            "example": "9876543210"
                                        },
                                        "email": {
                                            "type": "string",
                                            "example": "john@company.com"
                                        },
                                        "dob": {
                                            "type": "string",
                                            "example": "1990-01-01"
                                        },
                                        "gender": {
                                            "type": "string",
                                            "example": "male"
                                        },
                                        "department": {
                                            "type": "string",
                                            "example": "Computer Science"
                                        },
                                        "batch": {
                                            "type": "string",
                                            "example": "2015"
                                        },
                                        "college": {
                                            "type": "string",
                                            "example": "Kristu Jyoti College of Management and Technology"
                                        },
                                        "roles": {
                                            "type": "array",
                                            "example": ["General User"]
                                        },
                                        "password": {
                                            "type": "string",
                                            "example": "Qwerty@123"
                                        },
                                        "status": {
                                            "type": "string",
                                            "example": "inactive",
                                        },
                                    },
                                }
                            }
                        },
                        "required": true
                    },
                    "responses": {
                        "200": {
                            "description": "User created successfully"
                        },
                        "400": {
                            "description": "Error creating user"
                        }
                    }
                }
            },

            "/auth/login": {
                "post": {
                    "tags": [
                        "Auth"
                    ],
                    "summary": "Login a user",
                    "description": "Login a user in the system.",
                    "operationId": "loginUser",
                    "requestBody": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "email": {
                                            "type": "string",
                                            "example": "john@company.com"
                                        },
                                        "password": {
                                            "type": "string",
                                            "example": "Qwerty@123"
                                        }
                                    }
                                }
                            }
                        },
                        "required": true
                    },
                    "responses": {
                        "200": {
                            "description": "User logged in successfully"
                        },
                        "401": {
                            "description": "Error logging in user"
                        },
                        "500": {
                            "description": "Error logging in user"
                        }
                    }
                }
            },
        },

    },
    apis: ['./routes/api/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};