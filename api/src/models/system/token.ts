import { session } from '../../config/config.js';
import jwt from 'jsonwebtoken';
import { UserObject } from '../../..';
import { User, UserRecord } from './user.js';
import { appspace, logger } from '../../appspace.js';
import { ACL } from './acl.js';

type AccessPayload = {
  id: number;
  roles: Array<string>;
  perms: Array<string>;
  email: string;
  username: string;
  unitId: number;
};

type RefreshPayload = {
  id: number;
};

class TokenModel {
  async getTokenPairForIssuer(token: string) {
    return appspace.db
      .query('activetokens')
      .where('issuer', '=', token)
      .execute()
      .then((result: any) => result[0])
      .catch((err: Error) => logger.error(err));
  }

  async cleanUp() {
    const tokens = await appspace.db
      .query('activetokens')
      .where('createdat', '=', new Date().toISOString())
      .execute()
      .then((res) => console.log(res));
  }

  async tokenExists(token: string) {
    return appspace.db
      .query('activetokens')
      .where('refreshtoken', '=', token, 'OR')
      .where('accesstoken', '=', token, 'OR')
      .execute()
      .then((res: any) => res.length > 0)
      .catch(() => false);
  }

  async issuerExists(issuer: string) {
    return appspace.db
      .query('activetokens')
      .where('issuer', '=', issuer)
      .execute()
      .then((res: any) => res.length > 0)
      .catch(() => false);
  }

  async invalidateToken(token: string) {
    return appspace.db.query('activetokens').delete().where('refreshtoken', '=', token, 'OR').where('accesstoken', '=', token, 'OR').execute();
  }

  async validateToken(token: string) {
    if (await this.tokenExists(token)) {
      try {
        var decoded = jwt.verify(token, session.accessSecret, {
          algorithms: [session.algorithm],
        }) as AccessPayload;
        const user = await User.getUserById(decoded.id);
        user.password = '-';
        return user;
      } catch (e) {
        logger.error('Token Error:', e);
        return false;
      }
    }
  }

  async invalidateIssuer(token: string) {
    return appspace.db?.query('activetokens').delete(true).where('issuer', '=', token).execute();
  }

  async issueTokenPairWithCredentials(user: UserRecord) {
    const tokenpair = await this.generateTokenPair(user);
    return appspace.db
      .query('activetokens')
      .insert()
      .set('refreshtoken', tokenpair.refreshToken)
      .set('accesstoken', tokenpair.accessToken)
      .set('username', user.username)
      .execute()
      .then(() => tokenpair)
      .catch(() => false);
  }

  async issueTokenPairWithRefresh(refreshtoken: string) {
    if (await this.tokenExists(refreshtoken)) {
      await this.invalidateToken(refreshtoken);
      try {
        var decoded = jwt.verify(refreshtoken, session.refreshSecret, {
          algorithms: [session.algorithm],
        }) as RefreshPayload;

        const user = await User.getUserById(decoded.id);
        const tokenpair = await this.generateTokenPair(user);

        return appspace.db
          .query('activetokens')
          .insert()
          .set('refreshtoken', tokenpair.refreshToken)
          .set('accesstoken', tokenpair.accessToken)
          .set('issuer', refreshtoken)
          .set('username', user.username)
          .execute()
          .then(() => tokenpair)
          .catch(() => false);
      } catch (e) {
        logger.error('Token Error:', e);
        return false;
      }
    } else if (await this.issuerExists(refreshtoken)) {
      await this.invalidateIssuer(refreshtoken);
      logger.alert('Token Error: REFRESH TOKEN REUSED!');
      return false;
    } else {
      logger.error('Token Error: Unknown Token');
      return false;
    }
  }

  async generateTokenPair(user: UserRecord) {
    let accessPayload: AccessPayload = {
      id: user.id,
      roles: await ACL.getRolesForUser(user.id),
      perms: await ACL.getPermsForUser(user.id),
      username: user.username,
      email: user.email,
      unitId: user.unit_id,
    };

    let refreshPayload: RefreshPayload = {
      id: user.id,
    };

    return {
      accessToken: jwt.sign(accessPayload, session.accessSecret, {
        expiresIn: session.accessExpiresIn,
        algorithm: session.algorithm,
      }),
      refreshToken: jwt.sign(refreshPayload, session.refreshSecret, {
        expiresIn: session.refreshExpiresIn,
        algorithm: session.algorithm,
      }),
    };
  }
}

export const Token = new TokenModel();
