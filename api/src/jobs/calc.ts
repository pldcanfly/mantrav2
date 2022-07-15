'use strict';

import { Job } from '../classes/scheduler/job.js';
import { PostgreSQL_DB } from '../classes/dbs/postgresql_db.js';
import { ClickEventData, ClickRecord, ImpressionEventData } from '../models/click.js';
import { CampaignData, CampaignDetails, CampaignRecord } from '../models/campaign.js';

const db = new PostgreSQL_DB();

class CalcJob extends Job {
  async run() {
    // const now = new Date();
    // const days = 10;
    const start = Date.now();
    this.sendMessage('log', 'Recalculation in Progress');
    const campaigns: {
      [propName: string]: {
        name: string;
        ase: string;
        details: CampaignDetails;
        urls: {
          mobile: { [propName: string]: Array<string> };
          desktop: { [propName: string]: Array<string> };
        };
      };
    } = {};

    console.time('processAllClicks');

    let batch = true;
    let page = 0;
    const batchsize = 500000;
    while (batch) {
      console.time('fetchClick');
      let clicks = await db
        .query('clicks')
        .limit(batchsize, page * batchsize)
        .execute()
        .then((res: Array<ClickRecord>) => res);

      console.timeEnd('fetchClick');

      console.time('processClick');
      if (clicks.length <= 0) {
        batch = false;
        break;
      }
      for (const click of clicks) {
        if (!campaigns[click.campaign]) {
          const details: CampaignDetails = { clicks: { mobile: 0, desktop: 0 }, impressions: { mobile: 0, desktop: 0 } };
          var ase = '0';
          var urls: {
            mobile: { [propName: string]: Array<string> };
            desktop: { [propName: string]: Array<string> };
          } = { mobile: {}, desktop: {} };
          switch (click.type) {
            case 'click':
              const clickdata = click.data as ClickEventData;
              details[clickdata.pos.toString()] = {
                mobile: click.mobile ? 1 : 0,
                desktop: click.mobile ? 0 : 1,
              };

              let [mobileclicks, desktopclicks] = [details['clicks'].mobile, details['clicks'].desktop];

              details['clicks'] = {
                mobile: click.mobile ? mobileclicks + 1 : mobileclicks,
                desktop: click.mobile ? desktopclicks : desktopclicks + 1,
              };
              if (click.mobile) {
                urls.mobile[clickdata.pos] = [decodeURIComponent(clickdata.url)];
              } else {
                urls.desktop[clickdata.pos] = [decodeURIComponent(clickdata.url)];
              }

              break;
            case 'impression':
              const impressiondata = click.data as ImpressionEventData;
              let [mobileimpressions, desktopimpressions] = [details['impressions'].mobile, details['impressions'].desktop];

              details['impressions'] = {
                mobile: click.mobile ? mobileimpressions + 1 : mobileimpressions,
                desktop: click.mobile ? desktopimpressions : desktopimpressions + 1,
              };

              if (impressiondata.ase != '12345' && impressiondata.ase != '0') ase = impressiondata.ase;

              break;
          }

          campaigns[click.campaign] = {
            name: click.campaign,
            details,
            ase,
            urls,
          };
        } else {
          switch (click.type) {
            case 'click':
              if (click.data && 'pos' in click.data) {
                let pos = click.data.pos ?? 'unbekannt';
                if (campaigns[click.campaign].details[pos]) {
                  if (click.mobile) {
                    campaigns[click.campaign].details[pos].mobile++;
                  } else {
                    campaigns[click.campaign].details[pos].desktop++;
                  }
                } else {
                  campaigns[click.campaign].details[pos] = {
                    mobile: click.mobile ? 1 : 0,
                    desktop: click.mobile ? 0 : 1,
                  };
                }

                let [mobileclicks, desktopclicks] = [campaigns[click.campaign].details['clicks'].mobile, campaigns[click.campaign].details['clicks'].desktop];

                campaigns[click.campaign].details['clicks'] = {
                  mobile: click.mobile ? mobileclicks + 1 : mobileclicks,
                  desktop: click.mobile ? desktopclicks : desktopclicks + 1,
                };

                if (click.mobile) {
                  if (campaigns[click.campaign].urls.mobile[click.data.pos]) {
                    if (!campaigns[click.campaign].urls.mobile[click.data.pos].includes(decodeURIComponent(click.data.url))) {
                      campaigns[click.campaign].urls.mobile[click.data.pos].push(decodeURIComponent(click.data.url));
                    }
                  } else {
                    campaigns[click.campaign].urls.mobile[click.data.pos] = [decodeURIComponent(click.data.url)];
                  }
                } else {
                  if (campaigns[click.campaign].urls.desktop[click.data.pos]) {
                    if (!campaigns[click.campaign].urls.desktop[click.data.pos].includes(decodeURIComponent(click.data.url))) {
                      campaigns[click.campaign].urls.desktop[click.data.pos].push(decodeURIComponent(click.data.url));
                    }
                  } else {
                    campaigns[click.campaign].urls.desktop[click.data.pos] = [decodeURIComponent(click.data.url)];
                  }
                }
              }

              break;

            case 'impression':
              const impressiondata = click.data as ImpressionEventData;

              let [mobileimpressions, desktopimpressions] = [campaigns[click.campaign].details['impressions'].mobile, campaigns[click.campaign].details['impressions'].desktop];
              campaigns[click.campaign].details['impressions'] = {
                mobile: click.mobile ? mobileimpressions + 1 : mobileimpressions,
                desktop: click.mobile ? desktopimpressions : desktopimpressions + 1,
              };

              if (campaigns[click.campaign].ase == '0') {
                campaigns[click.campaign].ase = impressiondata.ase;
              }

              break;
          }
        }
      }

      page++;

      console.timeEnd('processClick');
    }

    console.timeEnd('processAllClicks');

    for (const index in campaigns) {
      const campaign = campaigns[index];

      const existing = await db
        .query('campaigns')
        .where('name', '=', campaign.name)

        .execute()
        .then((res: Array<CampaignRecord>) => res);

      const query = db.query('campaigns');
      if (existing.length > 0) {
        query.update().where('id', '=', existing[0].id);
      } else {
        query.insert().set('name', campaign.name);
      }

      const data = {
        details: campaign.details,
        ase: campaign.ase,
        urls: campaign.urls,
      };

      await query.set('data', data).set('updatedat', new Date(Date.now())).execute();
    }

    this.sendMessage('log', `Recalculation finished in ${Date.now() - start}ms.`);
    this.die();
  }

  die() {
    db.close();
    super.die();
  }
}

export default new CalcJob().run();
