const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SmartRecipe database...");

  // ==========================================
  // 1. TASTE TAGS
  // ==========================================
  const tasteTagsList = [
    "Spicy",
    "Sweet",
    "Sour",
    "Salty",
    "Bitter",
    "Umami",
    "Savory",
    "Tangy",
  ];

  const tasteMap = {};
  for (const name of tasteTagsList) {
    const tag = await prisma.tasteTag.upsert({
      where: { tasteName: name },
      update: {},
      create: { tasteName: name },
    });
    tasteMap[name] = tag.id;
  }
  console.log("✅ 8 Taste tags ready");

  // ==========================================
  // 2. DIETARY TAGS
  // ==========================================
  const dietaryTagsList = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Keto",
    "Paleo",
    "Dairy-Free",
    "Low-Carb",
    "High-Protein",
  ];

  const dietaryMap = {};
  for (const name of dietaryTagsList) {
    const tag = await prisma.dietaryTag.upsert({
      where: { tagName: name },
      update: {},
      create: { tagName: name },
    });
    dietaryMap[name] = tag.id;
  }
  console.log("✅ 8 Dietary tags ready");

  // ==========================================
  // 3. INGREDIENTS
  // ==========================================
  const ingredientNames = [
    "Atlantic Salmon Fillet",
    "Garlic",
    "Wild Honey",
    "Low-Sodium Soy Sauce",
    "Unsalted Butter",
    "Fresh Lemon Juice",
    "Ramen Noodles",
    "Szechuan Chili Oil",
    "Toasted Sesame Paste",
    "Bok Choy",
    "Chicken Breast",
    "Sun-Dried Tomatoes",
    "Baby Spinach",
    "Heavy Cream",
    "Parmesan Cheese",
    "White Quinoa",
    "Persian Cucumber",
    "Cherry Tomatoes",
    "Kalamata Olives",
    "Extra Virgin Olive Oil",
    "Beef Chuck Roast",
    "Japanese Curry Roux",
    "Carrots",
    "Russet Potatoes",
    "Yellow Onion",
    "Green Papaya",
    "Bird's Eye Chilis",
    "Roasted Peanuts",
    "Fish Sauce",
    "Lime",
    "Bitter Melon",
    "Pasture-Raised Eggs",
    "Sea Salt",
    "Ground Black Pepper",
    "Chickpeas",
    "Tahini",
    "Fresh Cilantro",
    "Cumin",
    "Ribeye Steak",
    "Avocado",
    "Red Wine Vinegar",
    "Oregano",
    "Dark Cocoa Powder (70%)",
    "Pure Maple Syrup",
    "Vanilla Extract",
    "Pizza Dough",
    "San Marzano Tomato Sauce",
    "Fresh Mozzarella",
    "Fresh Basil",
    "Aged Kimchi",
    "Pork Belly",
    "Soft Tofu",
    "Gochugaru (Korean Chili Powder)",
    "Extra Firm Tofu",
    "Broccoli Florets",
    "Mirin",
    "Ginger Root",
    "Bone-in Chicken Thighs",
    "Fresh Rosemary",
    "Dijon Mustard",
    "Arborio Rice",
    "Wild Shiitake & Cremini Mushrooms",
    "Shallots",
    "Vegetable Broth",
    "Truffle Oil",
    "Ripe Roma Tomatoes",
    "Red Bell Pepper",
    "Rolled Oats",
    "Natural Peanut Butter",
    "Chia Seeds",
    "Yukon Gold Potatoes",
    "Fresh Thyme",
  ];

  const ingredientMap = {};
  for (const name of ingredientNames) {
    const ing = await prisma.ingredient.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    ingredientMap[name] = ing.id;
  }
  console.log(`✅ ${ingredientNames.length} Ingredients ready`);

  // ==========================================
  // 4. DEMO USER & AUTHORS
  // ==========================================
  const demoHashedPassword = await bcrypt.hash("SmartRecipeDemo@2026", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@smartrecipe.app" },
    update: {
      name: "SmartRecipe Demo",
      username: "smartrecipedemo",
      password: demoHashedPassword,
      profileBio: "Official SmartRecipe Demo Account. Discover, plan, and track culinary excellence.",
      profilePicUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
    create: {
      name: "SmartRecipe Demo",
      username: "smartrecipedemo",
      email: "demo@smartrecipe.app",
      password: demoHashedPassword,
      profileBio: "Official SmartRecipe Demo Account. Discover, plan, and track culinary excellence.",
      profilePicUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
  });
  console.log("✅ Demo account ready: demo@smartrecipe.app");

  const chefHashedPassword = await bcrypt.hash("password123", 10);
  const chefUser = await prisma.user.upsert({
    where: { email: "chef@example.com" },
    update: {},
    create: {
      name: "Chef Marco Rossi",
      username: "chefmarco",
      email: "chef@example.com",
      password: chefHashedPassword,
      profileBio: "Michelin-trained culinary artist obsessed with fresh Mediterranean flavors.",
      profilePicUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80",
    },
  });

  const sarahUser = await prisma.user.upsert({
    where: { email: "sarah@smartrecipe.app" },
    update: {},
    create: {
      name: "Sarah Jenkins, RD",
      username: "sarahnurition",
      email: "sarah@smartrecipe.app",
      password: chefHashedPassword,
      profileBio: "Registered Dietitian crafting high-protein, macro-balanced wholesome feasts.",
      profilePicUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    },
  });
  console.log("✅ Community author profiles ready");

  // ==========================================
  // 5. 18 REALISTIC SAMPLE RECIPES
  // ==========================================
  const sampleRecipes = [
    {
      title: "Garlic Butter Honey Glazed Salmon",
      instructions:
        "1. Pat salmon fillets dry and season generously with sea salt and black pepper.\n2. Heat a cast-iron skillet over medium-high heat and melt 1 tbsp butter with a drizzle of olive oil.\n3. Sear salmon skin-side up for 4 minutes until golden crust develops, then carefully flip.\n4. Lower heat to medium, add minced garlic and remaining butter. Sauté for 1 minute until fragrant.\n5. Pour in wild honey, soy sauce, and fresh lemon juice. Baste the salmon continuously with pan sauce for 3 minutes.\n6. Garnish with fresh chopped parsley and lemon slices. Serve immediately with greens or grain bowl.",
      cookingTime: 20,
      calories: 480,
      protein: 42,
      carbs: 16,
      fats: 28,
      imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
      authorId: demoUser.id,
      tastes: ["Sweet", "Savory"],
      dietary: ["High-Protein", "Gluten-Free"],
      ingredients: [
        { name: "Atlantic Salmon Fillet", quantity: "2 fillets (400g)" },
        { name: "Garlic", quantity: "4 cloves minced" },
        { name: "Wild Honey", quantity: "2 tbsp" },
        { name: "Low-Sodium Soy Sauce", quantity: "1.5 tbsp" },
        { name: "Unsalted Butter", quantity: "2 tbsp" },
        { name: "Fresh Lemon Juice", quantity: "1 tbsp" },
      ],
    },
    {
      title: "Authentic Spicy Szechuan Dan Dan Noodles",
      instructions:
        "1. In a mixing bowl, whisk together Szechuan chili oil, sesame paste, soy sauce, and a splash of noodle water.\n2. Cook ramen noodles in boiling salted water for 3 to 4 minutes until al dente.\n3. Blanch baby bok choy in the same boiling water for 45 seconds; drain.\n4. Divide spicy sesame sauce into serving bowls.\n5. Add noodles and toss vigorously to coat every strand.\n6. Top with crushed roasted peanuts, blanched bok choy, and an extra drizzle of fragrant chili oil.",
      cookingTime: 18,
      calories: 550,
      protein: 19,
      carbs: 72,
      fats: 22,
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
      authorId: chefUser.id,
      tastes: ["Spicy", "Umami", "Savory"],
      dietary: ["Vegetarian", "Dairy-Free"],
      ingredients: [
        { name: "Ramen Noodles", quantity: "200g dried" },
        { name: "Szechuan Chili Oil", quantity: "2 tbsp" },
        { name: "Toasted Sesame Paste", quantity: "2.5 tbsp" },
        { name: "Low-Sodium Soy Sauce", quantity: "2 tbsp" },
        { name: "Bok Choy", quantity: "3 heads trimmed" },
        { name: "Roasted Peanuts", quantity: "2 tbsp crushed" },
      ],
    },
    {
      title: "Creamy Tuscan Garlic Chicken",
      instructions:
        "1. Season chicken breasts with salt, pepper, and dried oregano.\n2. In a deep skillet over medium-high heat, sear chicken in olive oil for 5 minutes per side until golden. Remove and set aside.\n3. In the same skillet, sauté minced garlic and chopped shallots for 1 minute.\n4. Add sun-dried tomatoes and cook for 2 minutes.\n5. Reduce heat to medium-low, pour in heavy cream and chicken broth, bring to a gentle simmer.\n6. Stir in freshly grated parmesan cheese and baby spinach until wilted.\n7. Return chicken to the sauce and simmer for 3 minutes until heated through. Serve warm.",
      cookingTime: 25,
      calories: 590,
      protein: 48,
      carbs: 9,
      fats: 40,
      imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop&q=80",
      authorId: demoUser.id,
      tastes: ["Savory", "Umami"],
      dietary: ["Keto", "Low-Carb", "High-Protein", "Gluten-Free"],
      ingredients: [
        { name: "Chicken Breast", quantity: "2 large fillets (450g)" },
        { name: "Garlic", quantity: "5 cloves minced" },
        { name: "Sun-Dried Tomatoes", quantity: "1/2 cup julienned" },
        { name: "Baby Spinach", quantity: "3 cups fresh" },
        { name: "Heavy Cream", quantity: "3/4 cup" },
        { name: "Parmesan Cheese", quantity: "1/2 cup grated" },
        { name: "Extra Virgin Olive Oil", quantity: "1 tbsp" },
      ],
    },
    {
      title: "Zesty Lemon Herb Mediterranean Quinoa Bowl",
      instructions:
        "1. Rinse quinoa and cook in vegetable broth for 15 minutes until fluffy; let cool to room temperature.\n2. Dice Persian cucumbers and halve cherry tomatoes.\n3. In a small jar, shake together fresh lemon juice, extra virgin olive oil, minced garlic, sea salt, and oregano to create the vinaigrette.\n4. In a large serving bowl, combine cooked quinoa, cucumber, cherry tomatoes, and Kalamata olives.\n5. Drizzle vinaigrette and toss thoroughly.\n6. Garnish with chopped fresh basil leaves and a squeeze of fresh lemon wedge.",
      cookingTime: 22,
      calories: 390,
      protein: 14,
      carbs: 52,
      fats: 15,
      imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
      authorId: sarahUser.id,
      tastes: ["Tangy", "Sour", "Savory"],
      dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"],
      ingredients: [
        { name: "White Quinoa", quantity: "1 cup dry" },
        { name: "Persian Cucumber", quantity: "2 cups diced" },
        { name: "Cherry Tomatoes", quantity: "1.5 cups halved" },
        { name: "Kalamata Olives", quantity: "1/3 cup pitted" },
        { name: "Extra Virgin Olive Oil", quantity: "3 tbsp" },
        { name: "Fresh Lemon Juice", quantity: "2.5 tbsp" },
        { name: "Fresh Basil", quantity: "1/4 cup chopped" },
      ],
    },
    {
      title: "Slow-Simmered Japanese Beef & Potato Curry",
      instructions:
        "1. Cut beef chuck roast into 1.5-inch bite-sized cubes. Season with salt and black pepper.\n2. In a heavy Dutch oven, sear beef in a drizzle of oil over high heat until browned on all sides; remove.\n3. Add sliced yellow onions to the pot and sauté for 8 minutes until translucent and caramelized.\n4. Return beef to the pot, add cubed potatoes, carrots, and enough water to submerge.\n5. Bring to a boil, skim off foam, then reduce heat to low, cover and simmer gently for 45 minutes.\n6. Break in Japanese curry roux blocks, stirring continuously until fully dissolved and sauce thickens.\n7. Simmer uncovered for 10 more minutes. Serve steaming hot with steamed rice.",
      cookingTime: 65,
      calories: 620,
      protein: 38,
      carbs: 54,
      fats: 28,
      imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80",
      authorId: chefUser.id,
      tastes: ["Umami", "Savory", "Sweet"],
      dietary: ["High-Protein", "Dairy-Free"],
      ingredients: [
        { name: "Beef Chuck Roast", quantity: "500g cubed" },
        { name: "Japanese Curry Roux", quantity: "1 pack (4 cubes)" },
        { name: "Russet Potatoes", quantity: "2 medium peeled & cubed" },
        { name: "Carrots", quantity: "2 peeled & cut into chunks" },
        { name: "Yellow Onion", quantity: "2 large sliced" },
      ],
    },
    {
      title: "Thai Green Papaya Salad (Som Tum)",
      instructions:
        "1. Peel green papaya and shred into thin matchstick strips using a julienne peeler; soak in ice water for 5 minutes for extra crunch.\n2. In a large wooden or clay mortar, pound bird's eye chilis and peeled garlic cloves with a pestle until crushed.\n3. Add cherry tomatoes and pound gently to release juices.\n4. Stir in fish sauce, fresh lime juice, and a touch of palm sugar or honey.\n5. Add drained green papaya and crushed roasted peanuts. Lightly pound while turning with a spoon to infuse the dressing.\n6. Plate and garnish with whole roasted peanuts and cilantro sprigs.",
      cookingTime: 15,
      calories: 190,
      protein: 6,
      carbs: 26,
      fats: 8,
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
      authorId: sarahUser.id,
      tastes: ["Spicy", "Sour", "Tangy"],
      dietary: ["Gluten-Free", "Dairy-Free", "Low-Carb"],
      ingredients: [
        { name: "Green Papaya", quantity: "3 cups shredded" },
        { name: "Bird's Eye Chilis", quantity: "3 fresh" },
        { name: "Garlic", quantity: "3 cloves" },
        { name: "Cherry Tomatoes", quantity: "1 cup halved" },
        { name: "Lime", quantity: "2 whole juiced" },
        { name: "Fish Sauce", quantity: "2 tbsp" },
        { name: "Roasted Peanuts", quantity: "1/4 cup" },
      ],
    },
    {
      title: "Charred Bitter Melon with Scrambled Eggs",
      instructions:
        "1. Cut bitter melon in half lengthwise, scrape out white pith and seeds with a spoon, and slice thinly.\n2. Toss slices with 1 tsp sea salt and let rest for 10 minutes to draw out excess bitterness; rinse well and pat dry.\n3. In a bowl, beat pasture-raised eggs with a pinch of salt and cracked black pepper.\n4. Heat olive oil in a wok over high heat. Add minced garlic and bitter melon slices; stir-fry for 3 minutes until slightly charred.\n5. Pour in beaten eggs. Let set for 15 seconds, then gently fold into soft curds with bitter melon.\n6. Remove from heat while eggs are tender and creamy. Serve immediately as a nourishing breakfast or side dish.",
      cookingTime: 15,
      calories: 260,
      protein: 16,
      carbs: 8,
      fats: 19,
      imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
      authorId: chefUser.id,
      tastes: ["Bitter", "Salty", "Savory"],
      dietary: ["Vegetarian", "Keto", "Low-Carb", "Gluten-Free", "Dairy-Free"],
      ingredients: [
        { name: "Bitter Melon", quantity: "1 medium sliced" },
        { name: "Pasture-Raised Eggs", quantity: "4 large" },
        { name: "Garlic", quantity: "2 cloves minced" },
        { name: "Extra Virgin Olive Oil", quantity: "1.5 tbsp" },
        { name: "Sea Salt", quantity: "1 tsp" },
        { name: "Ground Black Pepper", quantity: "1/2 tsp" },
      ],
    },
    {
      title: "Crispy Golden Falafel Mezze Platter",
      instructions:
        "1. Soak dried chickpeas overnight in cold water; drain thoroughly (do not use canned chickpeas for authentic texture).\n2. In a food processor, pulse chickpeas, yellow onion, garlic, fresh cilantro, cumin, and sea salt until coarsely ground.\n3. Form mixture into compact balls or patties and chill in refrigerator for 20 minutes.\n4. Heat vegetable or olive oil to 350°F (175°C) in a deep saucepan.\n5. Fry falafel in batches for 4 to 5 minutes until deeply golden brown and crisp on the outside.\n6. Whisk tahini with lemon juice, garlic, and cold water until silky smooth.\n7. Serve hot falafels alongside cucumber, tomato salad, and creamy tahini dip.",
      cookingTime: 30,
      calories: 420,
      protein: 18,
      carbs: 56,
      fats: 16,
      imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=80",
      authorId: demoUser.id,
      tastes: ["Savory", "Salty"],
      dietary: ["Vegan", "Vegetarian", "Dairy-Free"],
      ingredients: [
        { name: "Chickpeas", quantity: "2 cups soaked dried" },
        { name: "Garlic", quantity: "4 cloves" },
        { name: "Yellow Onion", quantity: "1/2 cup chopped" },
        { name: "Fresh Cilantro", quantity: "1 cup packed" },
        { name: "Cumin", quantity: "1.5 tsp ground" },
        { name: "Tahini", quantity: "1/3 cup" },
        { name: "Fresh Lemon Juice", quantity: "2 tbsp" },
      ],
    },
    {
      title: "Grilled Ribeye with Avocado Chimichurri",
      instructions:
        "1. Remove ribeye from refrigerator 30 minutes before cooking; season both sides generously with coarse sea salt and cracked pepper.\n2. In a bowl, finely mince garlic, fresh cilantro, oregano, and combine with red wine vinegar and extra virgin olive oil to make chimichurri.\n3. Fold in diced ripe avocado gently to maintain velvety chunks.\n4. Preheat cast-iron grill pan until smoking hot.\n5. Sear steak for 4 minutes, flip and cook for another 3 to 4 minutes until medium-rare (internal temp 130°F / 54°C).\n6. Rest steak on a wooden cutting board for 6 minutes to redistribute flavorful juices.\n7. Slice against the grain and spoon generous amounts of fresh avocado chimichurri across the top.",
      cookingTime: 25,
      calories: 680,
      protein: 52,
      carbs: 7,
      fats: 50,
      imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
      authorId: chefUser.id,
      tastes: ["Savory", "Tangy"],
      dietary: ["Keto", "Paleo", "Low-Carb", "High-Protein", "Gluten-Free", "Dairy-Free"],
      ingredients: [
        { name: "Ribeye Steak", quantity: "1 prime cut (350g)" },
        { name: "Avocado", quantity: "1 ripe diced" },
        { name: "Garlic", quantity: "3 cloves minced" },
        { name: "Red Wine Vinegar", quantity: "2 tbsp" },
        { name: "Extra Virgin Olive Oil", quantity: "3 tbsp" },
        { name: "Fresh Cilantro", quantity: "1/2 cup chopped" },
        { name: "Oregano", quantity: "1 tsp dried" },
      ],
    },
    {
      title: "Silky Dark Chocolate Avocado Mousse",
      instructions:
        "1. Halve ripe avocados, remove pits, and scoop flesh directly into high-speed blender container.\n2. Add unsweetened 70% dark cocoa powder, pure maple syrup, vanilla extract, and a pinch of fine sea salt.\n3. Blend on high speed for 2 minutes, stopping to scrape down sides, until velvety smooth and glossy.\n4. Taste and adjust sweetness if desired.\n5. Transfer mousse into glass ramekins and chill in the refrigerator for at least 30 minutes to set.\n6. Garnish with a sprinkle of flaky sea salt and fresh berries before serving.",
      cookingTime: 10,
      calories: 280,
      protein: 4,
      carbs: 28,
      fats: 19,
      imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
      authorId: sarahUser.id,
      tastes: ["Sweet", "Bitter"],
      dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free", "Paleo"],
      ingredients: [
        { name: "Avocado", quantity: "2 ripe medium" },
        { name: "Dark Cocoa Powder (70%)", quantity: "1/2 cup sifted" },
        { name: "Pure Maple Syrup", quantity: "1/3 cup" },
        { name: "Vanilla Extract", quantity: "1 tsp" },
        { name: "Sea Salt", quantity: "1/4 tsp" },
      ],
    },
    {
      title: "Artisan Neapolitan Margherita Pizza",
      instructions:
        "1. Place pizza stone in oven and preheat to maximum temperature (500°F / 260°C) for 45 minutes.\n2. On a lightly floured board, stretch dough gently with fingertips from center outward, preserving an airy outer crust.\n3. Spread San Marzano tomato sauce thinly over the base in concentric circles.\n4. Tear fresh mozzarella into chunks and distribute evenly.\n5. Slide pizza onto the blazing preheated stone.\n6. Bake for 8 to 10 minutes until cheese bubbles with toasted amber spots and crust is leopard-charred.\n7. Remove from oven, scatter fresh basil leaves, and finish with a drizzle of extra virgin olive oil.",
      cookingTime: 20,
      calories: 520,
      protein: 21,
      carbs: 68,
      fats: 18,
      imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
      authorId: chefUser.id,
      tastes: ["Savory", "Umami"],
      dietary: ["Vegetarian"],
      ingredients: [
        { name: "Pizza Dough", quantity: "1 artisan ball (280g)" },
        { name: "San Marzano Tomato Sauce", quantity: "1/2 cup" },
        { name: "Fresh Mozzarella", quantity: "150g torn" },
        { name: "Fresh Basil", quantity: "8 fresh leaves" },
        { name: "Extra Virgin Olive Oil", quantity: "1 tbsp" },
      ],
    },
    {
      title: "Spicy Korean Kimchi Jjigae (Stew)",
      instructions:
        "1. In a heavy stone pot or Dutch oven, sauté sliced pork belly over medium heat until lightly crisped and fat renders.\n2. Add well-fermented aged kimchi, minced garlic, and gochugaru. Stir-fry together for 5 minutes.\n3. Pour in water or kelp broth and bring to a rolling boil.\n4. Reduce heat to medium-low, cover, and simmer for 20 minutes to allow flavors to meld deeply.\n5. Gently slide in sliced soft tofu, chopped scallions, and a dash of soy sauce.\n6. Simmer for 5 more minutes until tofu absorbs the fiery broth. Serve bubbling hot with steamed rice.",
      cookingTime: 30,
      calories: 410,
      protein: 34,
      carbs: 18,
      fats: 24,
      imageUrl: "https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=800&auto=format&fit=crop&q=80",
      authorId: demoUser.id,
      tastes: ["Spicy", "Umami", "Sour"],
      dietary: ["High-Protein", "Dairy-Free", "Low-Carb"],
      ingredients: [
        { name: "Aged Kimchi", quantity: "2 cups with juices" },
        { name: "Pork Belly", quantity: "250g sliced" },
        { name: "Soft Tofu", quantity: "1 block (300g) sliced" },
        { name: "Gochugaru (Korean Chili Powder)", quantity: "1.5 tbsp" },
        { name: "Garlic", quantity: "3 cloves minced" },
        { name: "Low-Sodium Soy Sauce", quantity: "1 tbsp" },
      ],
    },
    {
      title: "Crispy Sesame Teriyaki Tofu Stir-Fry",
      instructions:
        "1. Press extra firm tofu under a clean towel with a heavy pan for 15 minutes; cut into 1-inch cubes.\n2. Dust tofu cubes lightly with cornstarch or flour for unmatched crispiness.\n3. Pan-fry tofu in sesame oil over medium-high heat for 7 minutes, turning occasionally until golden crunchy on all sides.\n4. In a small bowl, whisk together soy sauce, mirin, wild honey, and freshly grated ginger.\n5. Add broccoli florets and sliced carrots to the pan, stir-frying for 3 minutes until crisp-tender.\n6. Pour teriyaki sauce over the pan and toss until sauce reduces into a rich glossy glaze coating the tofu and vegetables.\n7. Sprinkle with toasted sesame seeds and serve with steamed rice.",
      cookingTime: 25,
      calories: 360,
      protein: 22,
      carbs: 38,
      fats: 14,
      imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
      authorId: sarahUser.id,
      tastes: ["Sweet", "Umami", "Savory"],
      dietary: ["Vegetarian", "Vegan", "Dairy-Free"],
      ingredients: [
        { name: "Extra Firm Tofu", quantity: "1 block (400g) cubed" },
        { name: "Broccoli Florets", quantity: "2 cups fresh" },
        { name: "Carrots", quantity: "1 cup julienned" },
        { name: "Low-Sodium Soy Sauce", quantity: "3 tbsp" },
        { name: "Mirin", quantity: "2 tbsp" },
        { name: "Wild Honey", quantity: "1.5 tbsp" },
        { name: "Ginger Root", quantity: "1 tbsp grated" },
      ],
    },
    {
      title: "Paleo Rosemary Lemon Roasted Chicken Thighs",
      instructions:
        "1. Preheat oven to 400°F (200°C).\n2. In a small bowl, combine olive oil, fresh lemon juice, Dijon mustard, minced garlic, finely chopped rosemary, salt, and black pepper.\n3. Pat chicken thighs dry and rub the fragrant marinade thoroughly under and over the skin.\n4. Arrange thighs skin-side up on a rimmed baking sheet.\n5. Roast in the oven for 35 to 40 minutes until skin is crackling crisp and internal temperature reaches 165°F (74°C).\n6. Baste with pan drippings and let rest for 5 minutes before serving.",
      cookingTime: 45,
      calories: 510,
      protein: 44,
      carbs: 3,
      fats: 36,
      imageUrl: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80",
      authorId: demoUser.id,
      tastes: ["Tangy", "Savory"],
      dietary: ["Paleo", "Keto", "Gluten-Free", "Dairy-Free", "Low-Carb", "High-Protein"],
      ingredients: [
        { name: "Bone-in Chicken Thighs", quantity: "4 pieces (600g)" },
        { name: "Fresh Lemon Juice", quantity: "2.5 tbsp" },
        { name: "Fresh Rosemary", quantity: "2 tbsp minced" },
        { name: "Dijon Mustard", quantity: "1.5 tbsp" },
        { name: "Garlic", quantity: "4 cloves minced" },
        { name: "Extra Virgin Olive Oil", quantity: "2 tbsp" },
      ],
    },
    {
      title: "Creamy Wild Mushroom & Truffle Risotto",
      instructions:
        "1. Heat vegetable broth in a saucepan and keep on low simmer.\n2. In a heavy-bottomed pan, melt 1 tbsp butter with olive oil over medium heat. Sauté minced shallots and garlic for 2 minutes.\n3. Add sliced wild mushrooms and cook until browned and moisture evaporates; transfer half the mushrooms to a plate for garnish.\n4. Add arborio rice to the pan and toast for 2 minutes until grains are translucent around edges.\n5. Pour in warm broth one ladle at a time, stirring steadily until each addition is absorbed before adding next (about 20 minutes).\n6. When rice is tender yet al dente, turn off heat. Stir in remaining butter and freshly grated parmesan.\n7. Drizzle with truffle oil, top with reserved sautéed mushrooms, and serve immediately.",
      cookingTime: 35,
      calories: 460,
      protein: 13,
      carbs: 62,
      fats: 17,
      imageUrl: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800&auto=format&fit=crop&q=80",
      authorId: chefUser.id,
      tastes: ["Umami", "Savory"],
      dietary: ["Vegetarian", "Gluten-Free"],
      ingredients: [
        { name: "Arborio Rice", quantity: "1.5 cups" },
        { name: "Wild Shiitake & Cremini Mushrooms", quantity: "300g sliced" },
        { name: "Shallots", quantity: "2 finely diced" },
        { name: "Vegetable Broth", quantity: "4 cups warm" },
        { name: "Parmesan Cheese", quantity: "1/2 cup grated" },
        { name: "Unsalted Butter", quantity: "2 tbsp" },
        { name: "Truffle Oil", quantity: "1 tsp finishing drizzle" },
      ],
    },
    {
      title: "Chilled Andalusian Gazpacho",
      instructions:
        "1. Core ripe Roma tomatoes, peel cucumber, and remove seeds from red bell pepper.\n2. Roughly chop tomatoes, cucumber, bell pepper, shallot, and garlic.\n3. Transfer vegetables to a high-powered blender.\n4. Add extra virgin olive oil, red wine vinegar, and sea salt.\n5. Blend on high speed for 3 minutes until completely emulsified and aerated into a creamy coral-orange soup.\n6. Pass through a fine-mesh sieve for an ultra-smooth velvety finish.\n7. Chill in the refrigerator for at least 2 hours. Serve in cold bowls garnished with finely diced cucumber and a swirl of olive oil.",
      cookingTime: 15,
      calories: 210,
      protein: 4,
      carbs: 18,
      fats: 15,
      imageUrl: "https://images.unsplash.com/photo-1547496502-affa22d38842?w=800&auto=format&fit=crop&q=80",
      authorId: sarahUser.id,
      tastes: ["Tangy", "Sour", "Savory"],
      dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Low-Carb", "Dairy-Free"],
      ingredients: [
        { name: "Ripe Roma Tomatoes", quantity: "6 large ripe" },
        { name: "Persian Cucumber", quantity: "1 peeled" },
        { name: "Red Bell Pepper", quantity: "1 medium" },
        { name: "Garlic", quantity: "1 clove" },
        { name: "Extra Virgin Olive Oil", quantity: "1/4 cup" },
        { name: "Red Wine Vinegar", quantity: "2 tbsp" },
        { name: "Sea Salt", quantity: "1 tsp" },
      ],
    },
    {
      title: "Sea Salt & Caramel Protein Energy Bites",
      instructions:
        "1. In a food processor, pulse rolled oats and chia seeds until coarsely broken.\n2. Add all-natural peanut butter, pure maple syrup, vanilla extract, and sea salt.\n3. Process until mixture forms a sticky dough that holds together when pressed.\n4. Scoop 1-tbsp portions and roll between palms into 12 smooth round energy balls.\n5. Sprinkle top of each ball with a few crystals of flaky sea salt.\n6. Chill in refrigerator for 20 minutes to firm up. Store in an airtight container for on-the-go fuel throughout the week.",
      cookingTime: 12,
      calories: 240,
      protein: 10,
      carbs: 26,
      fats: 12,
      imageUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
      authorId: demoUser.id,
      tastes: ["Sweet", "Salty"],
      dietary: ["Vegetarian", "High-Protein", "Gluten-Free", "Dairy-Free"],
      ingredients: [
        { name: "Rolled Oats", quantity: "1 cup certified gluten-free" },
        { name: "Natural Peanut Butter", quantity: "1/2 cup creamy" },
        { name: "Pure Maple Syrup", quantity: "1/4 cup" },
        { name: "Chia Seeds", quantity: "2 tbsp" },
        { name: "Sea Salt", quantity: "1/2 tsp flaky" },
        { name: "Vanilla Extract", quantity: "1 tsp" },
      ],
    },
    {
      title: "Greek Roasted Lemon Garlic Herb Potatoes",
      instructions:
        "1. Preheat oven to 400°F (200°C).\n2. Scrub Yukon gold potatoes and cut into thick rustic wedges.\n3. In a 9x13 baking dish, whisk together vegetable broth, fresh lemon juice, extra virgin olive oil, minced garlic, oregano, sea salt, and black pepper.\n4. Add potato wedges to the dish and toss to thoroughly coat in the seasoned liquid.\n5. Bake uncovered for 45 minutes, flipping wedges halfway, until potatoes are tender inside and golden brown with crispy edges.\n6. Scatter fresh oregano and fresh lemon zest before serving hot.",
      cookingTime: 50,
      calories: 290,
      protein: 5,
      carbs: 48,
      fats: 10,
      imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
      authorId: chefUser.id,
      tastes: ["Tangy", "Salty", "Savory"],
      dietary: ["Vegan", "Vegetarian", "Gluten-Free", "Dairy-Free"],
      ingredients: [
        { name: "Yukon Gold Potatoes", quantity: "800g cut into wedges" },
        { name: "Fresh Lemon Juice", quantity: "1/3 cup" },
        { name: "Extra Virgin Olive Oil", quantity: "3 tbsp" },
        { name: "Garlic", quantity: "5 cloves minced" },
        { name: "Oregano", quantity: "1.5 tbsp dried" },
        { name: "Vegetable Broth", quantity: "1/2 cup" },
        { name: "Sea Salt", quantity: "1 tsp" },
      ],
    },
  ];

  for (const r of sampleRecipes) {
    // Find or create recipe by title and authorId
    let recipe = await prisma.recipe.findFirst({
      where: { title: r.title, authorId: r.authorId },
    });

    if (!recipe) {
      recipe = await prisma.recipe.create({
        data: {
          title: r.title,
          instructions: r.instructions,
          cookingTime: r.cookingTime,
          calories: r.calories,
          protein: r.protein,
          carbs: r.carbs,
          fats: r.fats,
          imageUrl: r.imageUrl,
          authorId: r.authorId,
        },
      });
    } else {
      recipe = await prisma.recipe.update({
        where: { id: recipe.id },
        data: {
          instructions: r.instructions,
          cookingTime: r.cookingTime,
          calories: r.calories,
          protein: r.protein,
          carbs: r.carbs,
          fats: r.fats,
          imageUrl: r.imageUrl,
        },
      });
    }

    // Link Ingredients
    for (const ing of r.ingredients) {
      const ingId = ingredientMap[ing.name];
      if (ingId) {
        await prisma.recipeIngredient.upsert({
          where: { recipeId_ingredientId: { recipeId: recipe.id, ingredientId: ingId } },
          update: { quantity: ing.quantity },
          create: { recipeId: recipe.id, ingredientId: ingId, quantity: ing.quantity },
        });
      }
    }

    // Link Taste Tags
    for (const taste of r.tastes) {
      const tasteId = tasteMap[taste];
      if (tasteId) {
        await prisma.recipeTasteTag.upsert({
          where: { recipeId_tasteId: { recipeId: recipe.id, tasteId } },
          update: {},
          create: { recipeId: recipe.id, tasteId },
        });
      }
    }

    // Link Dietary Tags
    for (const tag of r.dietary) {
      const tagId = dietaryMap[tag];
      if (tagId) {
        await prisma.recipeDietaryTag.upsert({
          where: { recipeId_tagId: { recipeId: recipe.id, tagId } },
          update: {},
          create: { recipeId: recipe.id, tagId },
        });
      }
    }
  }
  console.log(`✅ ${sampleRecipes.length} realistic sample recipes seeded & linked`);

  // ==========================================
  // 6. SAMPLE RATINGS & REVIEWS
  // ==========================================
  const firstRecipe = await prisma.recipe.findFirst({ where: { title: "Garlic Butter Honey Glazed Salmon" } });
  const secondRecipe = await prisma.recipe.findFirst({ where: { title: "Authentic Spicy Szechuan Dan Dan Noodles" } });

  if (firstRecipe) {
    await prisma.rating.upsert({
      where: { userId_recipeId: { userId: chefUser.id, recipeId: firstRecipe.id } },
      update: { tasteScore: 5, healthScore: 4.8, overallScore: 4.9 },
      create: { userId: chefUser.id, recipeId: firstRecipe.id, tasteScore: 5, healthScore: 4.8, overallScore: 4.9 },
    });
  }

  if (secondRecipe) {
    await prisma.rating.upsert({
      where: { userId_recipeId: { userId: demoUser.id, recipeId: secondRecipe.id } },
      update: { tasteScore: 4.8, healthScore: 4.2, overallScore: 4.6 },
      create: { userId: demoUser.id, recipeId: secondRecipe.id, tasteScore: 4.8, healthScore: 4.2, overallScore: 4.6 },
    });
  }
  console.log("✅ Sample ratings seeded");

  // ==========================================
  // 7. SAMPLE MEAL PLAN FOR DEMO USER
  // ==========================================
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let demoMealPlan = await prisma.mealPlan.findFirst({
    where: { userId: demoUser.id, date: today },
  });

  if (!demoMealPlan) {
    demoMealPlan = await prisma.mealPlan.create({
      data: {
        userId: demoUser.id,
        date: today,
        totalCalories: 970,
      },
    });
  }

  const breakfastRecipe = await prisma.recipe.findFirst({ where: { title: "Charred Bitter Melon with Scrambled Eggs" } });
  const lunchRecipe = await prisma.recipe.findFirst({ where: { title: "Garlic Butter Honey Glazed Salmon" } });

  if (breakfastRecipe) {
    const existingItem = await prisma.mealPlanItem.findFirst({
      where: { mealPlanId: demoMealPlan.id, recipeId: breakfastRecipe.id, mealType: "Breakfast" },
    });
    if (!existingItem) {
      await prisma.mealPlanItem.create({
        data: { mealPlanId: demoMealPlan.id, recipeId: breakfastRecipe.id, mealType: "Breakfast" },
      });
    }
  }

  if (lunchRecipe) {
    const existingItem = await prisma.mealPlanItem.findFirst({
      where: { mealPlanId: demoMealPlan.id, recipeId: lunchRecipe.id, mealType: "Lunch" },
    });
    if (!existingItem) {
      await prisma.mealPlanItem.create({
        data: { mealPlanId: demoMealPlan.id, recipeId: lunchRecipe.id, mealType: "Lunch" },
      });
    }
  }
  console.log("✅ Sample meal plan with macro goals ready for Demo User");

  console.log("\n🎉 Database seed complete! All records idempotent and demo-ready.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
