const axios = require("axios");
const querystring = require("querystring");

// Middleware function to check if a valid user access token is present in the headers
const authenticateUser = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({
        message: "Unauthorized: Missing Authorization header",
      });
    }

    const userAccessToken = authorizationHeader.split(" ")[1];

    if (!userAccessToken) {
      return res.status(401).json({
        message: "Unauthorized: Missing user access token",
      });
    }

    // Validate the user access token
    const introspectResponse = await axios.post(
      `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.REALM}/protocol/openid-connect/token/introspect`,
      querystring.stringify({
        token: userAccessToken,
        client_id: `${process.env.CLIENT_ID}`,
        client_secret: `${process.env.CLIENT_SECRET}`,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const isTokenActive = introspectResponse.data.active;

    if (!isTokenActive) {
      return res.status(401).json({
        message: "Unauthorized: Invalid or expired user access token",
      });
    }

    req.userAccessToken = userAccessToken;

    next();
  } catch (error) {
    // console.error("Error authenticating user:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = authenticateUser;
