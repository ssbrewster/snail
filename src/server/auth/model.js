/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema definitions.
 */

mongoose.model(
  'OAuthTokens',
  new Schema({
    accessToken: { type: String },
    accessTokenExpiresAt: { type: Date },
    client: { type: Object }, // `client` and `user` are required in multiple places, for example `getAccessToken()`
    clientId: { type: String },
    refreshToken: { type: String },
    refreshTokenExpiresOn: { type: Date },
    user: { type: Object },
    userId: { type: String }
  })
);

mongoose.model(
  'OAuthClients',
  new Schema({
    clientId: { type: String },
    clientSecret: { type: String },
    redirectUris: { type: Array }
  })
);

mongoose.model(
  'OAuthUsers',
  new Schema({
    email: { type: String, default: '' },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
    username: { type: String }
  })
);

const OAuthTokensModel = mongoose.model('OAuthTokens');
const OAuthClientsModel = mongoose.model('OAuthClients');
const OAuthUsersModel = mongoose.model('OAuthUsers');

/**
 * Get access token.
 */

module.exports.getAccessToken = function(bearerToken) {
  // Adding `.lean()`, as we get a mongoose wrapper object back from `findOne(...)`, and oauth2-server complains.
  return OAuthTokensModel.findOne({ accessToken: bearerToken }).lean();
};

/**
 * Get client
 *
 * Return a hardcoded object because we are only concerned with password grants.
 */
module.exports.getClient = (clientId, clientSecret) =>
  Object.create({
    clientId,
    clientSecret,
    grants: ['password'],
    redirects: null
  });

/**
 * Get refresh token.
 */
module.exports.getRefreshToken = refreshToken =>
  OAuthTokensModel.findOne({ refreshToken: refreshToken }).lean();

/**
 * Get user.
 */

module.exports.getUser = (username, password) =>
  OAuthUsersModel.findOne({ username: username, password: password }).lean();

/**
 * Save token.
 */

module.exports.saveToken = (token, client, user) => {
  const accessToken = new OAuthTokensModel({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    client,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    user,
    userId: user._id
  });
  // Can't just chain `lean()` to `save()` as we did with `findOne()` elsewhere. Instead we use `Promise` to resolve the data.
  return new Promise(function(resolve, reject) {
    accessToken.save(function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  }).then(function(saveResult) {
    // `saveResult` is mongoose wrapper object, not doc itself. Calling `toJSON()` returns the doc.
    saveResult =
      saveResult && typeof saveResult == 'object'
        ? saveResult.toJSON()
        : saveResult;

    // Unsure what else points to `saveResult` in oauth2-server, making copy to be safe
    const data = new Object();

    for (const prop in saveResult) data[prop] = saveResult[prop];

    // /oauth-server/lib/models/token-model.js complains if missing `client` and `user`. Creating missing properties.
    data.client = data.clientId;
    data.user = data.userId;

    return data;
  });
};
