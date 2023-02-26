const UserModel = require('../models/user-model');
const BCRYPT = require('bcrypt');
const UUID = require('uuid');
const MAIL_SERVICE = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error')

class UserService {
  async registration(username, email, password) {
    const EmailCandidate = await UserModel.findOne({email})
    if (EmailCandidate) {
      throw ApiError.BadRequest(`Email is already taken: ${email}`);
    }
    const hashPassword = await BCRYPT.hash(password, 3); // пароль + соль, что такое соль?
    const activationLink = UUID.v4();
    const userIconId = Math.floor(Math.random() * 11);
    const user = await UserModel.create({username, email, password: hashPassword, activationLink, userIconId});
    await MAIL_SERVICE.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
      .catch((err) => {console.log('Sending mail error, probably impossible email. Log: ', err)})

    const userDto = new UserDto(user); // id, username, email, isActivated, icon, favorites, playlists
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto}
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({activationLink})
    if (!user) {
      throw ApiError.BadRequest('Incorrect activation link');
    }
    user.isActivated = true;
    await user.save();
  }

  async login (email, password) {
    // const user = await UserModel.findOne({username})
    // if (!user) {
    //   throw ApiError.BadRequest('Пользователь с таким именем не найден');
    // }
    const user = await UserModel.findOne({email})
    if (!user) {
      throw ApiError.BadRequest('Incorrect email');
    }
    const isPassEquals = await BCRYPT.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Incorrect password');
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto}
  }

  async logout (refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh (refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id); 
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto}
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async changeAccountSettings(email, username, userIconId) {
    const user = await UserModel.findOne({email})
    if (!user) {
      throw ApiError.BadRequest('Incorrect email');
    }
    user.username = username;
    user.userIconId = userIconId;
    await user.save();
    return user;
  }

  async accountSetter(refreshToken, changedUser) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id); 
     console.log("Taken user: ", changedUser);
      console.log('Object to change ', user)
      user.username = changedUser.username;
      user.userIconId = changedUser.userIconId;
      user.userFavorites = changedUser.userFavorites;
      user.customPlaylists = changedUser.customPlaylists;
      console.log('Object to save: ', user);
    await user.save();
    return user;
  }

  async getUser(refreshToken) {
    if (!refreshToken) {
      return {};
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const user = await UserModel.findById(userData.id); 
    return user;
  }
}

module.exports = new UserService();