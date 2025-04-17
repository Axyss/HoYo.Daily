export function claimGenshinReward(): Promise<any> {
  return fetch("https://sg-hk4e-api.hoyolab.com/event/sol/sign", {
    method: "POST",
    body: JSON.stringify({act_id: "e202102251931481"}),
  })
}

export function claimStarRailReward(): void {

}
export function claimZenlessReward(): void {

}