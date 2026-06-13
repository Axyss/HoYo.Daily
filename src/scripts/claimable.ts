type ClaimResponse = { retcode: number; message: string; data?: object };
type ClaimCountResponse = { retcode: number; message: string; data?: { sign_cnt?: number; total_sign_day?: number }; };

async function safeFetch(input: RequestInfo | URL, init?: RequestInit,): Promise<ClaimCountResponse | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(input, init);
    const data = (await response.json()) as ClaimCountResponse;

    if (data.retcode === 0) {
      return data;
    }
    if (attempt > 0) {
      console.warn(`[claimable.ts]: Retrying fetch to '${input}' ${attempt}/2 (${data.retcode})`);
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  return null;
}

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
      const data = await safeFetch(
        "https://sg-hk4e-api.hoyolab.com/event/sol/resign_info?act_id=e202102251931481&lang=en-us",
      );
      return data?.data?.sign_cnt ?? 0;
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
      const data = await safeFetch(
        "https://sg-public-api.hoyolab.com/event/luna/hkrpg/os/info?lang=en-us&act_id=e202303301540311",
      );
      return data?.data?.total_sign_day ?? 0;
    }
  },

  class ZenlessZoneZero implements ClaimableGame {
    name: string = "Zenless Zone Zero";

    async claimRewards(): Promise<ClaimResponse> {
      const response = await fetch("https://sg-public-api.hoyolab.com/event/luna/zzz/os/sign", {
        method: "POST",
        body: JSON.stringify({ act_id: "e202406031448091", lang: "en-us" }),
        headers: {
          "X-Rpc-Signgame": "zzz",
        },
      });
      return await response.json();
    }

    async getClaimCount(): Promise<number> {
      const data = await safeFetch(
        "https://sg-public-api.hoyolab.com/event/luna/zzz/os/info?lang=en-us&act_id=e202406031448091",
        {
          headers: {
            "X-Rpc-Signgame": "zzz",
          },
        },
      );
      return data?.data?.total_sign_day ?? 0;
    }
  },

  class HonkaiImpact3rd implements ClaimableGame {
    name: string = "Honkai Impact 3rd";

    async claimRewards(): Promise<ClaimResponse> {
      const response = await fetch("https://sg-public-api.hoyolab.com/event/mani/sign", {
        method: "POST",
        body: JSON.stringify({ act_id: "e202110291205111", lang: "en-us" }),
      });
      return await response.json();
    }

    async getClaimCount(): Promise<number> {
      const data = await safeFetch(
        "https://sg-public-api.hoyolab.com/event/mani/info?lang=en-us&act_id=e202110291205111",
      );
      return data?.data?.total_sign_day ?? 0;
    }
  },

  class TearsOfThemis implements ClaimableGame {
    name: string = "Tears of Themis";

    async claimRewards(): Promise<ClaimResponse> {
      const response = await fetch("https://sg-public-api.hoyolab.com/event/luna/nxx/os/sign", {
        method: "POST",
        body: JSON.stringify({ act_id: "e202202281857121", lang: "en-us" }),
      });
      return await response.json();
    }

    async getClaimCount(): Promise<number> {
      const data = await safeFetch(
        "https://sg-public-api.hoyolab.com/event/luna/nxx/os/info?lang=en-us&act_id=e202202281857121",
      );
      return data?.data?.total_sign_day ?? 0;
    }
  },
];

export const gameInstances = gameClasses.map((GameClass) => new GameClass());
