const UserModel = require('../models/user-model');
const BCRYPT = require('bcrypt');
const UUID = require('uuid');
const MAIL_SERVICE = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error')

class UserService {
  async registration(username, email, password) {
    const UsernameCandidate = await UserModel.findOne({username})
    if (UsernameCandidate) {
      throw ApiError.BadRequest(`Пользователь с именем ${username} уже существует`);
    }
    const PasswordCandidate = await UserModel.findOne({email})
    if (PasswordCandidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    }
    const hashPassword = await BCRYPT.hash(password, 3); // пароль + соль, что такое соль?
    const activationLink = UUID.v4();
    const user = await UserModel.create({username, email, password: hashPassword, activationLink});
    // await MAIL_SERVICE.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(user); // id, username, email, isActivated
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {...tokens, user: userDto}
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({activationLink})
    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации');
    }
    user.isActivated = true;
    await user.save();
  }

  async login (username, email, password) {
    const user = await UserModel.findOne({username})
    if (!user) {
      throw ApiError.BadRequest('Пользователь с таким именем не найден');
    }
    const pass = await UserModel.findOne({email})
    if (!pass) {
      throw ApiError.BadRequest('Пользователь с таким email не найден');
    }
    const isPassEquals = await BCRYPT.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль');
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
}

module.exports = new UserService();