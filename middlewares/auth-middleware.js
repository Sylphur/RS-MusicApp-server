const ApiError = require("../exceptions/api-error");
const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
  try {
    const authorisationHeader = req.headers.authorisation; // не работает??
    console.log('Request:')
    console.log(req)
    console.log('Headers:')
    console.log(authorisationHeader)
    if (!authorisationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorisationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}