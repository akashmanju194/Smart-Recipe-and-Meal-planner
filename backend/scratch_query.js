const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("--- Executing raw SQL queries using Prisma ---");
  
  console.log("\n1. Fetching users:");
  const users = await prisma.$queryRaw`SELECT id, name, username, email FROM users;`;
  console.log(users);

  console.log("\n2. Fetching recipes (title and macros):");
  const recipes = await prisma.$queryRaw`SELECT title, calories, protein, carbs, fats FROM recipes;`;
  console.log(recipes);
  
  console.log("\n3. Fetching average ratings for recipes:");
  const ratings = await prisma.$queryRaw`SELECT "recipeId", AVG("overallScore") as avg_rating FROM ratings GROUP BY "recipeId";`;
  console.log(ratings);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
