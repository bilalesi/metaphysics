import "./lib/loadenv"
import chalk from "chalk"
import xapp from "@artsy/xapp"

const {
  ALGOLIA_APP_ID,
  ALGOLIA_RESTRICT_INDICES,
  ALGOLIA_SEARCH_API_KEY,
  ARTICLE_REQUEST_THROTTLE_MS,
  BIDDER_POSITION_MAX_BID_AMOUNT_CENTS_LIMIT,
  CACHE_COMPRESSION_DISABLED,
  CACHE_DISABLED,
  CACHE_LIFETIME_IN_SECONDS,
  CACHE_NAMESPACE,
  CACHE_QUERY_LOGGING_THRESHOLD_MS,
  CACHE_RETRIEVAL_TIMEOUT_MS,
  CAUSALITY_API_BASE,
  CAUSALITY_TOKEN,
  CONVECTION_API_BASE,
  CONVECTION_APP_ID,
  CONVECTION_GEMINI_TEMPLATE,
  DD_TRACER_HOSTNAME,
  DD_TRACER_SERVICE_NAME,
  DELTA_API_BASE,
  DIFFUSION_API_BASE,
  DIFFUSION_APP_ID,
  DIFFUSION_REQUEST_THROTTLE_MS,
  DIFFUSION_TOKEN,
  DISABLE_SCHEMA_STITCHING,
  EMBEDLY_ENDPOINT,
  EMBEDLY_KEY,
  ENABLE_ASYNC_STACK_TRACES,
  ENABLE_GEOLOCATION_LOGGING,
  ENABLE_GRAPHQL_UPLOAD,
  ENABLE_GRAVITY_MARKETING_COLLECTIONS,
  ENABLE_METRICS,
  ENABLE_QUERY_TRACING,
  ENABLE_REQUEST_LOGGING,
  ENABLE_RESOLVER_BATCHING,
  EXCHANGE_API_BASE,
  EXCHANGE_APP_ID,
  FREEGEOIP_API_KEY,
  GALAXY_API_BASE,
  GALAXY_TOKEN,
  GEMINI_API_BASE,
  GEMINI_ENDPOINT,
  GEODATA_API_BASE,
  GRAVITY_API_BASE,
  GRAVITY_API_BASE_GREEN,
  GRAVITY_API_PERCENT_REDIRECT,
  GRAVITY_API_URL,
  GRAVITY_GRAPHQL_ENDPOINT,
  GRAVITY_ID,
  GRAVITY_SECRET,
  HMAC_SECRET,
  IMPULSE_API_BASE,
  IMPULSE_APPLICATION_ID,
  INTROSPECT_TOKEN,
  IP_DENYLIST,
  KAWS_API_BASE,
  LOG_QUERY_DETAILS_THRESHOLD,
  MEMCACHED_MAX_POOL,
  MEMCACHED_URL,
  METAPHYSICS_PRODUCTION_ENDPOINT,
  METAPHYSICS_STAGING_ENDPOINT,
  NODE_ENV,
  PORT,
  POSITRON_API_BASE,
  PREDICTION_ENDPOINT,
  QUERY_DEPTH_LIMIT,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  REQUEST_THROTTLE_MS,
  REQUEST_TIMEOUT_MS,
  RESOLVER_TIMEOUT_MS,
  SENTRY_PRIVATE_DSN,
  STATSD_HOST,
  STATSD_PORT,
  VORTEX_API_BASE,
  VORTEX_APP_ID,
  VORTEX_TOKEN,
} = process.env

const mustHave = {
  // Reliant Artsy Services
  CAUSALITY_API_BASE,
  CONVECTION_API_BASE,
  CONVECTION_APP_ID,
  DELTA_API_BASE,
  GEMINI_API_BASE,
  GEMINI_ENDPOINT,
  GEODATA_API_BASE,
  GRAVITY_API_BASE,
  GRAVITY_GRAPHQL_ENDPOINT,
  GRAVITY_API_URL,
  GRAVITY_ID,
  GRAVITY_SECRET,
  IMPULSE_API_BASE,
  IMPULSE_APPLICATION_ID,
  POSITRON_API_BASE,
  EXCHANGE_API_BASE,
  KAWS_API_BASE,
  VORTEX_API_BASE,
  VORTEX_APP_ID,
  VORTEX_TOKEN,
}

Object.keys(mustHave).forEach((key) => {
  if (!mustHave[key]) {
    const file = chalk.whiteBright(".env.example")
    throw new Error(
      `You need to have the ENV var ${key} set up - check out ${file}.`
    )
  }
})

/**
 * Use this if "0" should be respected as 0 and only use the default value for
 * other falsy values, such as `undefined`, `null`, or an empty string.
 *
 * Because JS treats 0 as falsy, the following returns 42: `Number("0") || 42`
 */
function IntWithDefault(value: any | undefined, defaultValue: number): number {
  const result = parseInt(value, 10)
  return result === Number.NaN ? defaultValue : result
}

export default {
  ALGOLIA_APP_ID,
  ALGOLIA_RESTRICT_INDICES,
  ALGOLIA_SEARCH_API_KEY,
  ARTICLE_REQUEST_THROTTLE_MS: Number(ARTICLE_REQUEST_THROTTLE_MS) || 600000,
  BIDDER_POSITION_MAX_BID_AMOUNT_CENTS_LIMIT:
    Number(BIDDER_POSITION_MAX_BID_AMOUNT_CENTS_LIMIT) ||
    Number.MAX_SAFE_INTEGER,
  CACHE_COMPRESSION_DISABLED: CACHE_COMPRESSION_DISABLED === "true",
  CACHE_DISABLED: CACHE_DISABLED === "true",
  CACHE_LIFETIME_IN_SECONDS: Number(CACHE_LIFETIME_IN_SECONDS) || 60, // 1 minute
  CACHE_NAMESPACE: CACHE_NAMESPACE || "",
  CACHE_QUERY_LOGGING_THRESHOLD_MS:
    Number(CACHE_QUERY_LOGGING_THRESHOLD_MS) || 1000,
  CACHE_RETRIEVAL_TIMEOUT_MS: Number(CACHE_RETRIEVAL_TIMEOUT_MS) || 2000,
  CAUSALITY_API_BASE,
  CAUSALITY_TOKEN,
  CONVECTION_API_BASE,
  CONVECTION_APP_ID,
  CONVECTION_GEMINI_TEMPLATE,
  DD_TRACER_HOSTNAME: DD_TRACER_HOSTNAME || "localhost",
  DD_TRACER_SERVICE_NAME: DD_TRACER_SERVICE_NAME || "metaphysics",
  DELTA_API_BASE,
  DIFFUSION_API_BASE,
  DIFFUSION_APP_ID,
  DIFFUSION_TOKEN,
  DIFFUSION_REQUEST_THROTTLE_MS:
    Number(DIFFUSION_REQUEST_THROTTLE_MS) || 600000, // 5 minutes
  DISABLE_SCHEMA_STITCHING,
  EMBEDLY_ENDPOINT,
  EMBEDLY_KEY,
  ENABLE_ASYNC_STACK_TRACES,
  ENABLE_METRICS,
  ENABLE_GEOLOCATION_LOGGING: ENABLE_GEOLOCATION_LOGGING === "true",
  ENABLE_GRAPHQL_UPLOAD: ENABLE_GRAPHQL_UPLOAD === "true",
  ENABLE_GRAVITY_MARKETING_COLLECTIONS:
    ENABLE_GRAVITY_MARKETING_COLLECTIONS !== "false",
  ENABLE_QUERY_TRACING,
  ENABLE_REQUEST_LOGGING,
  ENABLE_RESOLVER_BATCHING: ENABLE_RESOLVER_BATCHING === "true",
  FREEGEOIP_API_KEY,
  GALAXY_API_BASE,
  GALAXY_TOKEN,
  GEMINI_API_BASE,
  GEMINI_ENDPOINT,
  GEODATA_API_BASE,
  GRAPHQL_UPLOAD_MAX_FILE_SIZE_IN_BYTES: 300 * 1000, // 300kb
  GRAPHQL_UPLOAD_MAX_FILES: 1,
  GRAVITY_API_BASE,
  GRAVITY_API_BASE_GREEN: GRAVITY_API_BASE_GREEN || null,
  GRAVITY_API_PERCENT_REDIRECT: Number(GRAVITY_API_PERCENT_REDIRECT) || 0,
  GRAVITY_GRAPHQL_ENDPOINT,
  GRAVITY_API_URL,
  GRAVITY_ID,
  GRAVITY_SECRET,
  // Gets set (+ refreshed) from src/index.js.
  // Initially set from library for hot-reloading.
  GRAVITY_XAPP_TOKEN: xapp.token,
  KAWS_API_BASE,
  HMAC_SECRET: HMAC_SECRET as string,
  IMPULSE_API_BASE,
  IMPULSE_APPLICATION_ID,
  INTROSPECT_TOKEN,
  IP_DENYLIST: IP_DENYLIST || "",
  LOG_QUERY_DETAILS_THRESHOLD,
  MEMCACHED_MAX_POOL: Number(MEMCACHED_MAX_POOL) || 10,
  MEMCACHED_URL: MEMCACHED_URL || "localhost:11211",
  METAPHYSICS_STAGING_ENDPOINT,
  METAPHYSICS_PRODUCTION_ENDPOINT,
  NODE_ENV: NODE_ENV || "development",
  PORT: Number(PORT) || 3000,
  POSITRON_API_BASE,
  PREDICTION_ENDPOINT,
  PRODUCTION_ENV: NODE_ENV === "production",
  QUERY_DEPTH_LIMIT: Number(QUERY_DEPTH_LIMIT) || null,
  RATE_LIMIT_MAX: IntWithDefault(RATE_LIMIT_MAX, 100),
  RATE_LIMIT_WINDOW_MS: Number(RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  REQUEST_THROTTLE_MS: Number(REQUEST_THROTTLE_MS) || 5000,
  REQUEST_TIMEOUT_MS: Number(REQUEST_TIMEOUT_MS) || 5000,
  RESOLVER_TIMEOUT_MS: Number(RESOLVER_TIMEOUT_MS) || 0,
  SENTRY_PRIVATE_DSN,
  EXCHANGE_API_BASE,
  EXCHANGE_APP_ID,
  STATSD_HOST: STATSD_HOST || "localhost",
  STATSD_PORT: Number(STATSD_PORT) || 8125,
  VORTEX_API_BASE,
  VORTEX_APP_ID,
  VORTEX_TOKEN,
}
