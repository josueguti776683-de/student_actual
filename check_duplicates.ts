import * as data from "./src/data";

const collections = [
  { name: "calendarDays", list: data.calendarDays },
  { name: "calendarMonths", list: data.calendarMonths },
  { name: "calendarTime", list: data.calendarTime },
  { name: "colorBasic", list: data.colorBasic },
  { name: "colorMiddle", list: data.colorMiddle },
  { name: "colorAdvanced", list: data.colorAdvanced },
  { name: "sportsBasic", list: data.sportsBasic },
  { name: "sportsMiddle", list: data.sportsMiddle },
  { name: "sportsAdvanced", list: data.sportsAdvanced },
  { name: "instrumentsBasic", list: data.instrumentsBasic },
  { name: "instrumentsMiddle", list: data.instrumentsMiddle },
  { name: "instrumentsAdvanced", list: data.instrumentsAdvanced },
  { name: "professionsBasic", list: data.professionsBasic },
  { name: "professionsMiddle", list: data.professionsMiddle },
  { name: "professionsAdvanced", list: data.professionsAdvanced },
  { name: "familyBasic", list: data.familyBasic },
  { name: "familyMiddle", list: data.familyMiddle },
  { name: "familyAdvanced", list: data.familyAdvanced },
  { name: "houseParts", list: data.houseParts },
  { name: "houseLiving", list: data.houseLiving },
  { name: "houseKitchen", list: data.houseKitchen },
  { name: "houseBedroom", list: data.houseBedroom },
  { name: "houseBathroom", list: data.houseBathroom },
  { name: "classroomSupplies", list: data.classroomSupplies },
  { name: "classroomShapes", list: data.classroomShapes },
  { name: "classroomCountries", list: data.classroomCountries },
  { name: "placesUrban", list: data.placesUrban },
  { name: "placesShops", list: data.placesShops },
  { name: "placesTransport", list: data.placesTransport },
  { name: "weatherPhenomena", list: data.weatherPhenomena },
  { name: "weatherPhrases", list: data.weatherPhrases },
  { name: "animalsFarm", list: data.animalsFarm },
  { name: "animalsForest", list: data.animalsForest },
  { name: "animalsBirds", list: data.animalsBirds },
  { name: "animalsReptiles", list: data.animalsReptiles },
  { name: "fruitsBasic", list: data.fruitsBasic },
  { name: "fruitsBerries", list: data.fruitsBerries },
  { name: "vegetablesGreens", list: data.vegetablesGreens },
  { name: "vegetablesTubers", list: data.vegetablesTubers },
  { name: "foodMeals", list: data.foodMeals },
  { name: "foodPantry", list: data.foodPantry },
  { name: "foodPrepared", list: data.foodPrepared },
  { name: "tastesBasic", list: data.tastesBasic },
  { name: "tastesAdvanced", list: data.tastesAdvanced },
  { name: "cookingVerbsList", list: data.cookingVerbsList },
  { name: "clothingBasic", list: data.clothingBasic },
  { name: "clothingWomens", list: data.clothingWomens },
];

console.log("Checking duplicates...");

const wordToLocation: { [word: string]: string[] } = {};

for (const col of collections) {
  for (const item of col.list) {
    const wordKey = item.word.toLowerCase().trim();
    if (!wordToLocation[wordKey]) {
      wordToLocation[wordKey] = [];
    }
    wordToLocation[wordKey].push(col.name);
  }
}

let duplicatesCount = 0;
for (const [word, locations] of Object.entries(wordToLocation)) {
  if (locations.length > 1) {
    console.log(`Duplicate found: "${word}" in ${JSON.stringify(locations)}`);
    duplicatesCount++;
  }
}

console.log(`Total duplicates: ${duplicatesCount}`);
