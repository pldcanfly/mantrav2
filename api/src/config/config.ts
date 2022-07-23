'use strict';

interface Config {
  db: DBConfig;
  debug: boolean;
  port: number;
  session: SessionConfig;
  maxLogoFilesize: number;
  maxHeaderFilesize: number;
}

import { DBConfig, SessionConfig } from '../..';

export const useCache = true;

export const session: SessionConfig = {
  salt: '$',
  algorithm: 'HS512',
  accessExpiresIn: '3m',
  accessSecret: '@kr!UrdJm9@@$jfqjgmb2N^Aj!P!vuHCSVdwLXxgbpGqx9#WQ&EtjtHRPW!emw@@8Dp-rU@jUZK$85nwhHvdjH7CHEVt^9f@CQ+Va=Z8?sPm6kJUU_MU5z5PrJF@F4KWJu!3eEuUUQXv$_AbeYcFCSTdBsG24Zp#T&RrQ8z!HVBeG8ax#X&2+Q!gUvXRYKRjd6Xr2aFd*?tH4qpp+Py**RspJz-P?tG_2NuC!s!mr$sG3J#Y5pKae7!kSz_sGwYB',
  refreshExpiresIn: '48h',
  refreshSecret: 'h$SKrafK+Ch+RpB5nCW2!6R4zrPK%bEM_KUt3pn?B$?gsmVgkr+et=ngYrdQ@X@CP#uwv@fA%MnK89=s?j#q_A#W%X@7qfQdWFdh#$RV$Ta+^TvcEgAJmPVm?X4!Y$KTQM+S$%XkG#KXK@TLc5M4h*@u%PfFdCPNvT4ZTw9j!gvnaavsW%n5xueYrDdJ=QmbdZ7dJ@F6$J&hf2tQd^fNyuz4ezt-N%958cpYVq3BLDd_5nXqnSr23tw=^3VZACmv',
};
