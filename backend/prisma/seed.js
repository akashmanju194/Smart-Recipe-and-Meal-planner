const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Seed Taste Tags ---
  const tasteTags = ["Spicy", "Sweet", "Sour", "Salty", "Bitter", "Umami", "Savory", "Tangy"];
  for (const name of tasteTags) {
    await prisma.tasteTag.upsert({
      where: { tasteName: name },
      update: {},
      create: { tasteName: name },
    });
  }
  console.log("✅ Taste tags seeded");

  // --- Seed Dietary Tags ---
  const dietaryTags = ["Vegetarian", "Vegan", "Gluten-Free", "Keto", "Paleo", "Dairy-Free", "Low-Carb", "High-Protein"];
  for (const name of dietaryTags) {
    await prisma.dietaryTag.upsert({
      where: { tagName: name },
      update: {},
      create: { tagName: name },
    });
  }
  console.log("✅ Dietary tags seeded");

  // --- Seed Ingredients ---
  const ingredients = [
    "Chicken Breast", "Rice", "Garlic", "Onion", "Tomato",
    "Olive Oil", "Salt", "Pepper", "Lemon", "Ginger",
    "Soy Sauce", "Honey", "Butter", "Flour", "Egg",
    "Milk", "Cheese", "Basil", "Oregano", "Chili Flakes",
  ];
  for (const name of ingredients) {
    await prisma.ingredient.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("✅ Ingredients seeded");

  // --- Seed Demo User ---
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "chef@example.com" },
    update: {},
    create: {
      name: "Demo Chef",
      username: "demochef",
      email: "chef@example.com",
      password: hashedPassword,
      profileBio: "Passionate home cook sharing my favorite recipes with the world! 🍳",
    },
  });
  console.log("✅ Demo user seeded");

  // --- Seed Sample Recipes ---
  const recipe1 = await prisma.recipe.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Garlic Honey Chicken",
      instructions:
        "1. Season chicken breasts with salt and pepper.\n2. Heat olive oil in a pan over medium-high heat.\n3. Sear chicken 5 min per side until golden.\n4. Add minced garlic, cook 1 min.\n5. Pour in honey and soy sauce, simmer 3 min.\n6. Serve with steamed rice and garnish with sesame seeds.",
      cookingTime: 25,
      calories: 420,
      protein: 35,
      carbs: 45,
      fats: 10,
      authorId: user.id,
    },
  });

  const recipe2 = await prisma.recipe.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "Classic Margherita Pizza",
      instructions:
        "1. Preheat oven to 475°F (245°C).\n2. Roll out pizza dough on a floured surface.\n3. Spread tomato sauce evenly.\n4. Add fresh mozzarella slices and basil leaves.\n5. Drizzle with olive oil.\n6. Bake for 10-12 minutes until crust is golden.\n7. Slice and serve immediately.",
      cookingTime: 30,
      calories: 350,
      protein: 12,
      carbs: 50,
      fats: 11,
      authorId: user.id,
    },
  });
  console.log("✅ Sample recipes seeded");

  // --- Link Ingredients to Recipes ---
  const chickenId = (await prisma.ingredient.findUnique({ where: { name: "Chicken Breast" } })).id;
  const garlicId = (await prisma.ingredient.findUnique({ where: { name: "Garlic" } })).id;
  const honeyId = (await prisma.ingredient.findUnique({ where: { name: "Honey" } })).id;
  const soyId = (await prisma.ingredient.findUnique({ where: { name: "Soy Sauce" } })).id;
  const tomatoId = (await prisma.ingredient.findUnique({ where: { name: "Tomato" } })).id;
  const cheeseId = (await prisma.ingredient.findUnique({ where: { name: "Cheese" } })).id;
  const basilId = (await prisma.ingredient.findUnique({ where: { name: "Basil" } })).id;

  const recipeIngredients = [
    { recipeId: recipe1.id, ingredientId: chickenId, quantity: "2 breasts" },
    { recipeId: recipe1.id, ingredientId: garlicId, quantity: "4 cloves" },
    { recipeId: recipe1.id, ingredientId: honeyId, quantity: "3 tbsp" },
    { recipeId: recipe1.id, ingredientId: soyId, quantity: "2 tbsp" },
    { recipeId: recipe2.id, ingredientId: tomatoId, quantity: "1 cup sauce" },
    { recipeId: recipe2.id, ingredientId: cheeseId, quantity: "200g mozzarella" },
    { recipeId: recipe2.id, ingredientId: basilId, quantity: "handful" },
  ];

  for (const ri of recipeIngredients) {
    await prisma.recipeIngredient.upsert({
      where: { recipeId_ingredientId: { recipeId: ri.recipeId, ingredientId: ri.ingredientId } },
      update: {},
      create: ri,
    });
  }
  console.log("✅ Recipe ingredients linked");

  // --- Link Taste Tags ---
  const savoryTag = await prisma.tasteTag.findUnique({ where: { tasteName: "Savory" } });
  const sweetTag = await prisma.tasteTag.findUnique({ where: { tasteName: "Sweet" } });

  await prisma.recipeTasteTag.upsert({
    where: { recipeId_tasteId: { recipeId: recipe1.id, tasteId: savoryTag.id } },
    update: {},
    create: { recipeId: recipe1.id, tasteId: savoryTag.id },
  });
  await prisma.recipeTasteTag.upsert({
    where: { recipeId_tasteId: { recipeId: recipe1.id, tasteId: sweetTag.id } },
    update: {},
    create: { recipeId: recipe1.id, tasteId: sweetTag.id },
  });
  console.log("✅ Taste tags linked");

  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
