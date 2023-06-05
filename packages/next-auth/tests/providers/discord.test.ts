import Discord from "../../src/providers/discord"

const mockValues = {
  clientId: "123",
  clientSecret: "testvalue",
} as const

it("should always contain default values", () => {
  const provider = Discord({ ...mockValues })

  expect((provider.authorization as string).includes("identify")).toBeTruthy()
})

it("should add any additional scopes", () => {
  const provider = Discord({
    ...mockValues,
    additionalScopes: ["guilds.join"],
  })

  expect(
    (provider.authorization as string).includes("guilds.join")
  ).toBeTruthy()
})

it("should not contain duplicate values", () => {
  const provider = Discord({
    ...mockValues,
    additionalScopes: ["identify", "email"],
  })

  const identifyOccurences = (
    (provider.authorization as string).match(/identify/g) || []
  ).length

  expect(identifyOccurences).toBe(1)
})
