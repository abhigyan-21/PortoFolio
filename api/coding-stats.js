const LEETCODE_USERNAME = 'AbhigyanDutta'
const GFG_HANDLE = 'abhigyandutta21'
const STATIC_STATS = {
  codechef: 88,
  hackerrank: 2,
}

const EMPTY_STATS = { total: 0, easy: 0, medium: 0, hard: 0 }

function countEntries(value) {
  return value && typeof value === 'object' ? Object.keys(value).length : 0
}

function normalizeLeetCode(payload) {
  const submissions = payload?.data?.matchedUser?.submitStats?.acSubmissionNum
  if (!Array.isArray(submissions)) throw new Error('Invalid LeetCode response')

  const byDifficulty = Object.fromEntries(
    submissions
      .filter((entry) => entry && typeof entry.difficulty === 'string')
      .map((entry) => [entry.difficulty.toLowerCase(), Number(entry.count) || 0]),
  )

  if (!payload.data.matchedUser) throw new Error('LeetCode user not found')

  return {
    total: byDifficulty.all || 0,
    easy: byDifficulty.easy || 0,
    medium: byDifficulty.medium || 0,
    hard: byDifficulty.hard || 0,
  }
}

function normalizeGfg(payload) {
  if (!payload || typeof payload !== 'object' || !payload.result) throw new Error('Invalid GFG response')

  return {
    total: Number(payload.count) || 0,
    easy: countEntries(payload.result.Easy),
    medium: countEntries(payload.result.Medium),
    hard: countEntries(payload.result.Hard),
  }
}

async function fetchLeetCode() {
  const response = await fetch('https://leetcode.com/graphql/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'query getUserProfile($username: String!) { matchedUser(username: $username) { username submitStats: submitStatsGlobal { acSubmissionNum { difficulty count } } } }',
      variables: { username: LEETCODE_USERNAME },
    }),
  })

  if (!response.ok) throw new Error('LeetCode request failed')
  return normalizeLeetCode(await response.json())
}

async function fetchGfg() {
  const params = new URLSearchParams({ handle: GFG_HANDLE, month: '', requestType: '', year: '' })
  const response = await fetch(`https://practiceapi.geeksforgeeks.org/api/v1/user/problems/submissions/?${params}`)

  if (!response.ok) throw new Error('GFG request failed')
  return normalizeGfg(await response.json())
}

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  const forceSync = request.query?.forceSync === 'true' || request.query?.forceSync === '1'
  response.setHeader('Cache-Control', forceSync ? 'no-store' : 's-maxage=43200, stale-while-revalidate=3600')

  const [leetcodeResult, gfgResult] = await Promise.allSettled([fetchLeetCode(), fetchGfg()])
  const leetcode = leetcodeResult.status === 'fulfilled' ? leetcodeResult.value : EMPTY_STATS
  const gfg = gfgResult.status === 'fulfilled' ? gfgResult.value : EMPTY_STATS
  const errors = {}

  if (leetcodeResult.status === 'rejected') errors.leetcode = 'Unable to fetch LeetCode statistics'
  if (gfgResult.status === 'rejected') errors.gfg = 'Unable to fetch GFG statistics'

  response.status(200).json({
    totalSolved: leetcode.total + gfg.total + STATIC_STATS.codechef + STATIC_STATS.hackerrank,
    leetcode,
    gfg,
    codechef: STATIC_STATS.codechef,
    hackerrank: STATIC_STATS.hackerrank,
    updatedAt: new Date().toISOString(),
    ...(Object.keys(errors).length > 0 ? { errors } : {}),
  })
}
