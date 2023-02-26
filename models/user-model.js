const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
  username: {type: String, required: true, unique: false},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String},
  userIconId : {type: Number, required: true},
  userFavorites: {
    tracks: {type: [Number], default: []},
    albums: {type: [Number], default: []},
    artists: {type: [Number], default: []},
    playlists: {type: [Number], default: []},
    radio: {type: [Number], default: []},
  },
  customPlaylists: {type: [{
    playlistName: {type: String},
    playlistTracks: {type: [Number]}
  }], default: []}
})

module.exports = model('User', UserSchema);