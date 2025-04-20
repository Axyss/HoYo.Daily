export function claimGenshinReward(): Promise<any> {
  return fetch("https://sg-hk4e-api.hoyolab.com/event/sol/sign", {
    method: "POST",
    body: JSON.stringify({act_id: "e202102251931481"}),
  })
}

export function claimStarRailReward(): Promise<any> {
  return fetch("https://sg-public-api.hoyolab.com/event/luna/hkrpg/os/sign", {
    method: "POST",
    body: JSON.stringify({act_id: "e202303301540311"}),
  })
}

export function claimZenlessReward(): void {

}