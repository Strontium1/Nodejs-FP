import swaggerAutogen from "swagger-autogen";

const doc = {
    info: {
      version: "v1.3",
      title: "Dokumentasi API BukaToko",
      description: "Dokumentasi API BukaToko",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local Server",
      },
      {
        url: "https://nodejs-fp.vercel.app/",
        description: "Production",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
      schemas: {
        LoginRequest: {
          $email: "joni2024@yopmail.com",
          $password: "123412341",
        },
        RegisterRequest: {
          $username: "joni2024",
          $email: "joni2024@yopmail.com",
          $password: "123412341",
          $confirmPassword: "123412341",
        },
        UpdateProfileRequest: {
          $username: "joni2024",
          $email: "joni2024@yopmail.com",
          $password: "123412341",
          $confirmPassword: "123412341",
        },
        ProductCreate: {
          $name: "Apel Merah",
          $description: "Buah apel merah segar",
          $images: "aqwek192iweNAHh6738sfasd",
          $price: 6000,
          $qty: 999,
          categoryId: "kfvj2i29fm26382sasf"
        },
        CategoryCreate: {
          $name: "Buah-buahan",
          products: "kfvj2i29fm26382sasf"
        },
        OrderCreate: {
          $itemDetails: [{
            name: "Apel",
            qty: 3
          }],
          $status: "pending"
        },
      },
    },
  };

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../routes/api.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);