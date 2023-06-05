import type { OAuthConfig, OAuthUserConfig } from "."

export interface DiscordProfile extends Record<string, any> {
  accent_color: number
  avatar: string
  banner: string
  banner_color: string
  discriminator: string
  email: string
  flags: number
  id: string
  image_url: string
  locale: string
  mfa_enabled: boolean
  premium_type: number
  public_flags: number
  username: string
  verified: boolean
}

export interface DiscordOAuthUserConfig<P extends DiscordProfile>
  extends OAuthUserConfig<P> {
  /**
   * Allow for additional scopes to be added to the authorization URL for your Discord login. The
   * default scopes are `identify` and `email` and are required for next-auth to work and will be
   * present next to your own scopes.
   */
  additionalScopes?: string[]
}

const DEFAULT_SCOPES = ["identify", "email"]

export default function Discord<P extends DiscordProfile>(
  options: DiscordOAuthUserConfig<P>
): OAuthConfig<P> {
  const { additionalScopes, ...innerOptions } = options

  const hasAdditionalScopes =
    Array.isArray(additionalScopes) && additionalScopes.length > 0
  const scopes = hasAdditionalScopes
    ? additionalScopes.filter((s) => !DEFAULT_SCOPES.includes(s))
    : []
  const stringifiedScopes = scopes.concat(DEFAULT_SCOPES).join("+")

  return {
    id: "discord",
    name: "Discord",
    type: "oauth",
    authorization: `https://discord.com/api/oauth2/authorize?scope=${stringifiedScopes}`,
    token: "https://discord.com/api/oauth2/token",
    userinfo: "https://discord.com/api/users/@me",
    profile(profile) {
      if (profile.avatar === null) {
        const defaultAvatarNumber = parseInt(profile.discriminator) % 5
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
      } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png"
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
      }
      return {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: profile.image_url,
      }
    },
    style: {
      logo: "/discord.svg",
      logoDark: "/discord-dark.svg",
      bg: "#fff",
      text: "#7289DA",
      bgDark: "#7289DA",
      textDark: "#fff",
    },
    options: innerOptions,
  }
}
