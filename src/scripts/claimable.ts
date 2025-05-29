type ClaimResponse = { data: object; retcode: number; message: string };
export interface ClaimableGame {
  name: string;
  claimRewards(): Promise<object>;
  getClaimCount(): Promise<number>;
}

const gameClasses = [
  class GenshinImpact implements ClaimableGame {
    name: string = "Genshin Impact";

    async claimRewards(): Promise<ClaimResponse> {
      const response = await fetch("https://sg-hk4e-api.hoyolab.com/event/sol/sign", {
        method: "POST",
        body: JSON.stringify({ act_id: "e202102251931481", lang: "en-us" }),
      });
      return await response.json();
    }

    async getClaimCount(): Promise<number> {
      const response = await fetch(
        "https://sg-hk4e-api.hoyolab.com/event/sol/resign_info?act_id=e202102251931481&lang=en-us",
      );
      return (await response.json()).data?.sign_cnt || 0;
    }
  },

  class HonkaiStarRail implements ClaimableGame {
    name: string = "Honkai Star Rail";

    async claimRewards(): Promise<ClaimResponse> {
      const response = await fetch("https://sg-public-api.hoyolab.com/event/luna/hkrpg/os/sign", {
        method: "POST",
        body: JSON.stringify({ act_id: "e202303301540311", lang: "en-us" }),
      });
      return await response.json();
    }

    async getClaimCount(): Promise<number> {
      const response = await fetch(
        "https://sg-public-api.hoyolab.com/event/luna/hkrpg/os/info?lang=en-us&act_id=e202303301540311",
      );
      return (await response.json()).data?.total_sign_day || 0;
    }
  },

  class ZenlessZoneZero implements ClaimableGame {
    name: string = "Zenless Zone Zero";

    async claimRewards(): Promise<ClaimResponse> {
      const response = await fetch("https://sg-public-api.hoyolab.com/event/luna/zzz/os/sign", {
        method: "POST",
        body: JSON.stringify({ act_id: "e202406031448091", lang: "en-us" }),
      });
      return await response.json();
    }

    async getClaimCount(): Promise<number> {
      const response = await fetch(
        "https://sg-public-api.hoyolab.com/event/luna/zzz/os/info?lang=en-us&act_id=e202406031448091",
      );
      return (await response.json()).data?.total_sign_day || 0;
    }
  },
];

export const gameInstances = gameClasses.map((GameClass) => new GameClass());
