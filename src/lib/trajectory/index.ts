import { getCachedBicycleRoute } from "../api/cache";
import { addGpsError } from "../geo/addGpsError";
import { addTimestampsToLineString } from "../geo/addTimestampsToLineString";
import { combineLineStrings } from "../geo/combineLineStrings";
import { randomizeLineString } from "../geo/randomizeLineString";

const GPS_ACCURACY = 8;

const locations: { [key: string]: GeoJSON.Point } = {
  home: {
    type: "Point",
    coordinates: [7.623717922327842, 51.952141291436476],
  },
  work: {
    type: "Point",
    coordinates: [7.649098540767625, 51.96097234827013],
  },
  sport: {
    type: "Point",
    coordinates: [7.600278892995561, 51.95255370788976],
  },
  cafe: {
    type: "Point",
    coordinates: [7.620884957998243, 51.970133322643676],
  },
  supermarket: {
    type: "Point",
    coordinates: [7.625736172138119, 51.952455854737394],
  },
  botanical: {
    type: "Point",
    coordinates: [7.6108939164708715, 51.963633325821746],
  },
  market: {
    type: "Point",
    coordinates: [7.6255726820270695, 51.96260666149166],
  },
  club: {
    type: "Point",
    coordinates: [7.6382685510688475, 51.943808470854435],
  },
};

function day(dayOfMonth: number, hour: number, minute: number) {
  const day = new Date();
  day.setFullYear(2023);
  day.setMonth(2);
  day.setDate(dayOfMonth);
  day.setHours(hour);
  day.setMinutes(minute);
  return day;
}

// home to work from 21:00 day before until 18:20
async function getHomeWorkTrajectory(dayOfMonth: number) {
  const dwellHome = addTimestampsToLineString(
    addGpsError(locations.home, 20, 100),
    day(dayOfMonth - 1, 22, 0),
    day(dayOfMonth, 7, 30)
  );
  const homeToWork = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.home, locations.work),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 7, 30),
    day(dayOfMonth, 7, 50)
  );
  const dwellWork = addTimestampsToLineString(
    addGpsError(locations.work, 20, 50),
    day(dayOfMonth, 7, 50),
    day(dayOfMonth, 18, 0)
  );
  const workToHome = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.work, locations.home),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 18, 0),
    day(dayOfMonth, 18, 20)
  );
  return combineLineStrings(dwellHome, homeToWork, dwellWork, workToHome);
}

async function getChillHomeTrajectory(dayOfMonth: number) {
  const dwellHome = addTimestampsToLineString(
    addGpsError(locations.home, 20, 100),
    day(dayOfMonth, 18, 20),
    day(dayOfMonth, 22, 0)
  );

  return combineLineStrings(dwellHome);
}

// home to sport from 18:20 until 22
async function getHomeSportTrajectory(dayOfMonth: number) {
  const dwellHome = addTimestampsToLineString(
    addGpsError(locations.home, 20, 3),
    day(dayOfMonth, 18, 20),
    day(dayOfMonth, 18, 40)
  );
  const homeToSport = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.home, locations.sport),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 18, 40),
    day(dayOfMonth, 19, 0)
  );
  const dwellSport = addTimestampsToLineString(
    addGpsError(locations.sport, 20, 100),
    day(dayOfMonth, 19, 0),
    day(dayOfMonth, 21, 0)
  );
  const sportToHome = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.sport, locations.home),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 21, 0),
    day(dayOfMonth, 21, 20)
  );
  const dwellHome2 = addTimestampsToLineString(
    addGpsError(locations.home, 20, 50),
    day(dayOfMonth, 21, 20),
    day(dayOfMonth, 22, 0)
  );
  return combineLineStrings(
    dwellHome,
    homeToSport,
    dwellSport,
    sportToHome,
    dwellHome2
  );
}

async function getHomeSupermarketTrajectory(dayOfMonth: number) {
  const dwellHome = addTimestampsToLineString(
    addGpsError(locations.home, 20, 50),
    day(dayOfMonth, 18, 20),
    day(dayOfMonth, 18, 30)
  );
  const homeToSupermarket = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.home, locations.supermarket),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 18, 30),
    day(dayOfMonth, 18, 40)
  );
  const dwellSupermarket = addTimestampsToLineString(
    addGpsError(locations.supermarket, 10, 10),
    day(dayOfMonth, 18, 40),
    day(dayOfMonth, 19, 0)
  );
  const supermarketToHome = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.supermarket, locations.home),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 19, 0),
    day(dayOfMonth, 19, 10)
  );
  const dwellHome2 = addTimestampsToLineString(
    addGpsError(locations.home, 20, 50),
    day(dayOfMonth, 19, 10),
    day(dayOfMonth, 22, 0)
  );
  return combineLineStrings(
    dwellHome,
    homeToSupermarket,
    dwellSupermarket,
    supermarketToHome,
    dwellHome2
  );
}

async function getHomeMarketBotanicalTrajectory(dayOfMonth: number) {
  const dwellHome = addTimestampsToLineString(
    addGpsError(locations.home, 20, 50),
    day(dayOfMonth - 1, 22, 0),
    day(dayOfMonth, 10, 0)
  );
  const homeToMarket = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.home, locations.market),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 10, 0),
    day(dayOfMonth, 10, 20)
  );
  const dwellMarket = addTimestampsToLineString(
    addGpsError(locations.market, 20, 30),
    day(dayOfMonth, 10, 20),
    day(dayOfMonth, 12, 0)
  );
  const marketToBotanical = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.market, locations.botanical),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 12, 0),
    day(dayOfMonth, 12, 10)
  );
  const dwellBotanical = addTimestampsToLineString(
    addGpsError(locations.botanical, 50, 100),
    day(dayOfMonth, 12, 10),
    day(dayOfMonth, 13, 30)
  );
  const botanicalToHome = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.botanical, locations.home),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 13, 30),
    day(dayOfMonth, 13, 50)
  );
  const dwellHome2 = addTimestampsToLineString(
    addGpsError(locations.home, 20, 50),
    day(dayOfMonth, 13, 50),
    day(dayOfMonth, 23, 0)
  );
  return combineLineStrings(
    dwellHome,
    homeToMarket,
    dwellMarket,
    marketToBotanical,
    dwellBotanical,
    botanicalToHome,
    dwellHome2
  );
}

async function getHomeClubTrajectory(dayOfMonth: number) {
  const homeToClub = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.home, locations.club),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 23, 0),
    day(dayOfMonth, 23, 20)
  );
  const dwellClub = addTimestampsToLineString(
    addGpsError(locations.club, 20, 100),
    day(dayOfMonth, 23, 20),
    day(dayOfMonth + 1, 2, 0)
  );
  const clubToHome = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.club, locations.home),
      GPS_ACCURACY
    ),
    day(dayOfMonth + 1, 2, 0),
    day(dayOfMonth + 1, 2, 20)
  );

  return combineLineStrings(homeToClub, dwellClub, clubToHome);
}

async function getCoffeeSundayTrajectory(dayOfMonth: number) {
  const dwellHome = addTimestampsToLineString(
    addGpsError(locations.home, 20, 50),
    day(dayOfMonth, 2, 20),
    day(dayOfMonth, 13, 0)
  );
  const homeToCafe = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.home, locations.cafe),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 13, 0),
    day(dayOfMonth, 13, 20)
  );
  const dwellCafe = addTimestampsToLineString(
    addGpsError(locations.cafe, 20, 70),
    day(dayOfMonth, 13, 20),
    day(dayOfMonth, 14, 30)
  );
  const cafeToHome = addTimestampsToLineString(
    randomizeLineString(
      await getCachedBicycleRoute(locations.cafe, locations.home),
      GPS_ACCURACY
    ),
    day(dayOfMonth, 14, 30),
    day(dayOfMonth, 14, 50)
  );
  const dwellHome2 = addTimestampsToLineString(
    addGpsError(locations.home, 20, 50),
    day(dayOfMonth, 14, 50),
    day(dayOfMonth, 22, 0)
  );
  return combineLineStrings(
    dwellHome,
    homeToCafe,
    dwellCafe,
    cafeToHome,
    dwellHome2
  );
}

export default async function getTrajectory() {
  // --- WEEK 1 ---
  // MONDAY
  const day1 = await getHomeWorkTrajectory(6);
  const supermarket1 = await getHomeSupermarketTrajectory(6);
  // TUESDAY
  const day2 = await getHomeWorkTrajectory(7);
  const chill2 = await getChillHomeTrajectory(7);
  // WEDNESDAY
  const day3 = await getHomeWorkTrajectory(8);
  const sport3 = await getHomeSportTrajectory(8);
  // THURSDAY
  const day4 = await getHomeWorkTrajectory(9);
  const supermarket4 = await getHomeSupermarketTrajectory(9);
  // FRIDAY
  const day5 = await getHomeWorkTrajectory(10);
  const sport5 = await getHomeSportTrajectory(10);
  // SATURDAY
  const day6 = await getHomeMarketBotanicalTrajectory(11);
  const club6 = await getHomeClubTrajectory(11);
  // SUNDAY
  const cafe7 = await getCoffeeSundayTrajectory(12);
  // --- WEEK 1 ---

  // --- WEEK 1 ---
  // MONDAY
  const day21 = await getHomeWorkTrajectory(13);
  const supermarket21 = await getHomeSupermarketTrajectory(13);
  // TUESDAY
  const day22 = await getHomeWorkTrajectory(14);
  const chill22 = await getChillHomeTrajectory(14);
  // WEDNESDAY
  const day23 = await getHomeWorkTrajectory(15);
  const sport23 = await getHomeSportTrajectory(15);
  // THURSDAY
  const day24 = await getHomeWorkTrajectory(16);
  const supermarket24 = await getHomeSupermarketTrajectory(16);
  // FRIDAY
  const day25 = await getHomeWorkTrajectory(17);
  const sport25 = await getHomeSportTrajectory(17);
  // SATURDAY
  const day26 = await getHomeMarketBotanicalTrajectory(18);
  const club26 = await getHomeClubTrajectory(18);
  // SUNDAY
  const cafe27 = await getCoffeeSundayTrajectory(19);
  // --- WEEK 1 ---

  return combineLineStrings(
    // WEEK 1
    day1,
    supermarket1,
    day2,
    chill2,
    day3,
    sport3,
    day4,
    supermarket4,
    day5,
    sport5,
    day6,
    club6,
    cafe7,
    // WEEK 2
    day21,
    supermarket21,
    day22,
    chill22,
    day23,
    sport23,
    day24,
    supermarket24,
    day25,
    sport25,
    day26,
    club26,
    cafe27
  );
}
