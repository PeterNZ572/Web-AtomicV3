import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

const run = async () => {
  const [, , email, newPassword] = process.argv

  if (!email || !newPassword) {
    console.error('Usage: tsx src/scripts/reset-password.ts <email> <new-password>')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    overrideAccess: true,
  })

  if (!result.docs[0]) {
    console.error(`No user found with email: ${email}`)
    const all = await payload.find({ collection: 'users', overrideAccess: true })
    console.log('Existing users:', all.docs.map((u) => u.email))
    process.exit(1)
  }

  await payload.update({
    collection: 'users',
    id: result.docs[0].id,
    data: { password: newPassword, loginAttempts: 0, lockUntil: null } as any,
    overrideAccess: true,
  })

  console.log(`Password updated and account unlocked for ${email}`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
