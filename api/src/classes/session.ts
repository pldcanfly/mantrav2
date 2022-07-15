// 'use strict';

// import fs = require('fs');
// import jwt = require('jsonwebtoken');
// import config from '../config/config';
// import crypto = require('crypto');
// import { LoginParams, ModelObject, Namespace, Payload, UserObject } from '../..';
// import { UserModel } from '../models/user';

// class Session {
//   private userobject: UserObject = {};
//   private _token: string = '';
//   private namespace: Namespace;
//   private usermodel: UserModel | undefined;

//   constructor(namespace: Namespace) {
//     this.namespace = namespace;
//     this.usermodel = namespace.users;
//   }

//   async login(params: LoginParams) {
//     if (params.token) {
//       return this.buildWithToken(params.token);
//     } else if (params.user && params.password) {
//       return this.buildWithCredentials(params.user, params.password);
//     }
//   }

//   get currentUser() {
//     return this.userobject;
//   }

//   get role() {
//     return this.userobject.role || 'unregistered';
//   }

//   get isLoggedIn() {
//     return this.role != 'unregistered';
//   }

//   refresh() {
//     console.log('Hi!', this._token, this.isLoggedIn);
//     if (this.isLoggedIn) {
//       return this.buildToken(this.currentUser);
//     } else {
//       this.namespace.status = 403;
//       return;
//     }
//   }

//   checkPasswords(hashed: string, clear: string) {
//     let salt = hashed.split(config.session.salt)[0];
//     if (this.usermodel) {
//       return this.usermodel.cryptPassword(clear, salt) == hashed;
//     }

//     return false;
//   }

//   async buildWithToken(token: string) {
//     if (!this.usermodel) {
//       return false;
//     }
//     try {
//       var decoded = jwt.verify(token, config.session.secret, {
//         algorithms: [config.session.algorithm],
//       }) as Payload;
//       let dbuser = await this.usermodel.getUserById(decoded.userid);
//       //dbuser.unternehmen = await this.unternehmenmodel.getUnternehmenForUser(dbuser.id);

//       if (dbuser != []) {
//         this.userobject = dbuser;
//       } else {
//         this.namespace.status = 403;
//       }

//       this._token = token;
//       return token;
//     } catch (err) {
//       console.error('Token Error:', err);
//       //this.namespace.status = 403;
//       return false; // Token failed
//     }
//   }

//   async buildWithCredentials(user: string, password: string) {
//     if (!this.usermodel) {
//       return false;
//     }
//     try {
//       let dbuser = await this.usermodel.getUserByEmail(user);
//       //dbuser.unternehmen = await this.unternehmenmodel.getUnternehmenForUser(dbuser.id);

//       if (dbuser != []) {
//         //console.log(dbuser.password);
//         if (dbuser && this.checkPasswords(dbuser.password, password)) {
//           // ENCRYPT ME

//           this.buildToken(dbuser);
//           this.userobject = dbuser;

//           return this._token;
//         }
//       }

//       this.namespace.status = 403;
//     } catch (err) {
//       console.log(err);
//     }

//     return false; // Login failed
//   }

//   buildToken(userobj: UserObject) {
//     let payload: Payload = {
//       userid: userobj.id,
//       role: userobj.role,
//       unternehmen: [],
//     };
//     if (!userobj.unternehmen) {
//       return false;
//     }
//     userobj.unternehmen.forEach(function (unternehmen: ModelObject) {
//       payload.unternehmen.push(unternehmen.id);
//     });

//     this._token = jwt.sign(payload, config.session.secret, {
//       expiresIn: config.session.expiresIn,
//       algorithm: config.session.algorithm,
//     });

//     return this._token;
//   }
// }

// export { Session };
