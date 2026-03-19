import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
	const adminEmail = process.env.ADMIN_EMAIL || 'admin@test.com'

	const existing = await prisma.user.findUnique({
		where: { email: adminEmail },
	})

	if (existing) {
		return
	}

	const hashedPassword = await bcrypt.hash(
		process.env.ADMIN_PASSWORD || '123456',
		10,
	)

	await prisma.user.create({
		data: {
			name: 'Admin',
			email: adminEmail,
			password: hashedPassword,
			role: Role.ADMIN,
		},
	})

	console.log('Admin user created!')
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect())
