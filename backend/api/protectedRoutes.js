const express = require("express");
const router = express.Router();
const axios = require("axios");
const querystring = require("querystring");
const authenticateUser = require("../middlewares/authMiddleware");

// Apply the authenticateUser middleware to all routes in this router
router.use(authenticateUser);

router.get("/users", async (req, res) => {
  try {
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

    const allUsersResponse = await axios.get(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.REALM}/users`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientAccessToken}`,
        },
      }
    );
    const users = allUsersResponse.data;
    // console.log(users);

    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Error in /users route:", error);
    res.status(error.response ? error.response.status : 500).json({
      message: "Request failed",
    });
  }
});

router.post("/password-policy", async (req, res) => {
  const { passwordPolicy } = req.body;
  try {
    const clientTokenResponse = await axios.post(
      "http://localhost:8080/realms/ang-realm/protocol/openid-connect/token",
      querystring.stringify({
        grant_type: "client_credentials",
        client_id: "admin-rest-client",
        username: "keycloak-master-user",
        password: "12345678",
        client_secret: "lpDwMdkgPK1qnVNx7DAvRhJY0sgAoAhc",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const clientAccessToken = clientTokenResponse.data.access_token;

    await axios.put(
      "http://localhost:8080/admin/realms/ang-realm",
      {
        passwordPolicy: passwordPolicy,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientAccessToken}`,
        },
      }
    );

    res.status(200).json({
      message: "Password policy updated successfully",
    });
  } catch (error) {
    console.log("password policy error: ", error);
  }
});

router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;

  try {
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

    //get all the users
    const allUsersResponse = await axios.get(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.REALM}/users`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientAccessToken}`,
        },
      }
    );
    const users = allUsersResponse.data;
    // console.log(users);

    // Find the user by email
    const user = users.find((user) => user.email === email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user.id;
    // console.log("user id is: ",userId);

    //reset password
    const resetPasswordResponse = await axios.put(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.REALM}/users/${userId}/reset-password`,
      {
        type: "password",
        value: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clientAccessToken}`,
        },
      }
    );

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.response.data.error_description,
    });
  }
});

module.exports = router;
