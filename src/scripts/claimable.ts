// Genshin Impact
export async function claimGenshinRewards(): Promise<Response> {
  return await fetch("https://sg-hk4e-api.hoyolab.com/event/sol/sign", {
    method: "POST",
    body: JSON.stringify({ act_id: "e202102251931481", lang: "en-us" }),
  });
}

export async function listGenshinRewards(): Promise<Response> {
  const response = await fetch(
    "https://sg-hk4e-api.hoyolab.com/event/sol/home?act_id=e202102251931481&lang=en-us",
  );
  return (await response.json()).data.awards;
}

export async function getGenshinClaimCount(): Promise<number> {
  const response = await fetch(
    "https://sg-hk4e-api.hoyolab.com/event/sol/resign_info?act_id=e202102251931481&lang=en-us",
  );
  const data = await response.json();
  return data.data.sign_cnt;
}

// Honkai: Star Rail
export async function claimStarRailRewards(): Promise<Response> {
  return await fetch("https://sg-public-api.hoyolab.com/event/luna/hkrpg/os/sign", {
    method: "POST",
    body: JSON.stringify({ act_id: "e202303301540311", lang: "en-us" }),
  });
}

export async function listStarRailRewards(): Promise<Response> {
  const response = await fetch(
    "https://sg-public-api.hoyolab.com/event/luna/hkrpg/os/home?lang=en-us&act_id=e202303301540311",
  );
  return (await response.json()).data.awards;
}

export async function getStarRailClaimCount(): Promise<number> {
  const response = await fetch(
    "https://sg-public-api.hoyolab.com/event/luna/hkrpg/os/info?lang=en-us&act_id=e202303301540311",
  );
  const data = await response.json();
  return data.data.total_sign_day;
}

// Zenless Zone Zero
export async function claimZenlessRewards(): Promise<Response> {
  return await fetch("https://sg-public-api.hoyolab.com/event/luna/zzz/os/sign", {
    method: "POST",
    body: JSON.stringify({ act_id: "e202406031448091", lang: "en-us" }),
  });
}

export async function listZenlessRewards(): Promise<Response> {
  const response = await fetch(
    "https://sg-public-api.hoyolab.com/event/luna/zzz/os/info?lang=en-us&act_id=e202406031448091",
  );
  return (await response.json()).data.awards;
}

export async function getZenlessClaimCount(): Promise<number> {
  const response = await fetch(
    "https://sg-public-api.hoyolab.com/event/luna/zzz/os/info?lang=en-us&act_id=e202406031448091",
  );
  const data = await response.json();
  return data.data.total_sign_day;
}
