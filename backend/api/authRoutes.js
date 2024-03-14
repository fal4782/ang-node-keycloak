const express = require("express");
const router = express.Router();
const axios = require("axios");
const querystring = require("querystring");

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    // Get the admin access token using client credentials grant
    const clientTokenResponse = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.REALM}/protocol/openid-connect/token`,
      querystring.stringify({
        grant_type: "client_credentials",
        client_id: `${process.env.CLIENT_ID}`,
        username: `${process.env.MASTER_USER}`,
        password: `${process.env.MASTER_USER_PASSWORD}`,
        client_secret: `${process.env.CLIENT_SECRET}`,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const clientAccessToken = clientTokenResponse.data.access_token;

    const createUserResponse = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.REALM}/users`,
      {
        username: name,
        email,
        enabled: true,
        credentials: [
          {
            type: "password",
            value: password,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientAccessToken}`,
        },
      }
    );

    // console.log("CREATE USER: ",createUserResponse.config.data);

    const userAuthResponse = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.REALM}/protocol/openid-connect/token`,
      querystring.stringify({
        grant_type: "password",
        client_id: `${process.env.CLIENT_ID}`,
        client_secret: `${process.env.CLIENT_SECRET}`,
        username: email,
        password: password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${clientAccessToken}`,
        },
      }
    );

    const userAccessToken = userAuthResponse.data.access_token;

    if (userAccessToken) {
      //   console.log("user created successfully");
      res.status(201).json({
        message: "User created successfully",
        user: JSON.parse(createUserResponse.config.data),
        user_acess_token: userAccessToken,
      });
    }
  } catch (error) {
    console.log("Error creating user:", error.response.data.errorMessage);
    res.status(501).json({
      error: error.response.data.errorMessage,
    });
    // console.log("ERROR: ",error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Obtain access token using client credentials grant
    const clientTokenResponse = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.REALM}/protocol/openid-connect/token`,
      querystring.stringify({
        grant_type: "client_credentials",
        client_id: `${process.env.CLIENT_ID}`,
        client_secret: `${process.env.CLIENT_SECRET}`,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const clientAccessToken = clientTokenResponse.data.access_token;

    const userAuthResponse = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.REALM}/protocol/openid-connect/token`,
      querystring.stringify({
        grant_type: "password",
        client_id: `${process.env.CLIENT_ID}`,
        client_secret: `${process.env.CLIENT_SECRET}`,
        username: email,
        password: password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${clientAccessToken}`,
        },
      }
    );

    const userAccessToken = userAuthResponse.data.access_token;

    if (userAccessToken) {
      res.status(200).json({
        message: "Login successful",
        email,
        user_acess_token: userAccessToken,
      });
    }
  } catch (error) {
    console.log("ERROR IN LOGIN: ", error.response.data.error_description);
    res.status(error.response.status).json({
      errorText: error.response.data.error_description,
    });
  }
});

module.exports = router;
