module.exports = class UserDto {
  username;
  email;
  id;
  isActivated;
  userIconId;
  userFavorites;
  customPlaylists;

  constructor(model) {
    this.username = model.username;
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.userIconId = model.userIconId;
    this.userFavorites = model.userFavorites;
    this.customPlaylists = model.customPlaylists;
  }
}