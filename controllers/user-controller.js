const userService = require("../service/user-service");
const {validationResult} = require('express-validator');
const ApiError = require("../exceptions/api-error");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()))
      }
      const {username, email, password} = req.body;
      const userData = await userService.registration(username, email, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true})  
      return res.json(userData); //токен и информация о пользователе на клиент
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true}) 
      return res.json(userData); //токен и информация о пользователе на клиент
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);  //или вернуть 200й код если нам не надо токен на фронт
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.DEPLOY_URL); //сюда сунуть адрес фронтенда
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true}) //сюда можно сунуть флаг secure если деплоить через https:// 
      return res.json(userData); //токен и информация о пользователе на клиент
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async changeAccountSettings(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()))
      }
      const {email, username, userIconId} = req.body;
      const userData = await userService.changeAccountSettings(email, username, userIconId);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async accountSetter(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()))
      }
      const {refreshToken} = req.cookies;
      const {changedUser} = req.body;
      const userData = await userService.accountSetter(refreshToken, changedUser);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.getUser(refreshToken);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}


module.exports = new UserController();