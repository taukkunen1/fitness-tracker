/**
 * ======================================================================
 * INITIAL USERS DATA
 * ======================================================================
 * 
 * Default user profiles for demonstration and testing:
 * - Pedro: 30 year old male with complete body metrics
 * - Valentina: 28 year old female with complete body metrics
 * 
 * These users are created with detailed bioimpedance analysis data,
 * body composition metrics, circumferences, and metabolic rates.
 * ======================================================================
 */

const initialUsers = (function() {
  const now = Date.now();
  return {
    pedro: {
      id: 'pedro',
      name: 'Pedro',
      gender: 'male',
      age: 30,
      height: 175,
      workoutHistory: [],
      mealHistory: [],
      workoutLogs: [],
      bodyMetrics: [{
        id: 'm_pedro_' + now,
        date: new Date().toISOString().split('T')[0],
        weight: 68.95,
        bodyFat: 18.8,
        muscleMass: 28.9,
        visceralFat: 8,
        waterPercent: 55.0,
        waterWeight: parseFloat((68.95 * 0.55).toFixed(2)),
        bmr: Math.round(10 * 68.95 + 6.25 * 175 - 5 * 30 + 5),
        muscleSize: 40,
        bmi: parseFloat((68.95 / ((175/100) * (175/100))).toFixed(1)),
        muscleMassRightArm: 3.2,
        muscleMassLeftArm: 3.1,
        muscleMassRightLeg: 9.5,
        muscleMassLeftLeg: 9.4,
        muscleMassTrunk: 26.7,
        bodyFatRightArm: 18.5,
        bodyFatLeftArm: 18.6,
        bodyFatRightLeg: 20.2,
        bodyFatLeftLeg: 20.3,
        bodyFatTrunk: 21.5,
        boneMass: 3.2,
        proteinMass: 13.5,
        mineralMass: 4.1,
        rmr: 1580,
        tdee: 2200,
        impedance: 485,
        phaseAngle: 6.8,
        reactance: 58,
        resistance: 480,
        metabolicAge: 28,
        bodyAge: 29,
        chest: 93.5,
        waist: 80.5,
        hips: 88.5,
        rightArm: 27,
        leftArm: 28,
        rightThigh: 52,
        leftThigh: 51.5,
        rightCalf: 35,
        leftCalf: 34.5,
        neck: 36.5,
        shoulders: 106.5,
        rightForearm: 26.5,
        leftForearm: 26,
        abdomen: 84.5
      }],
      goals: { weight: 75, bodyFat: 15, muscleMass: 32 },
      customPrograms: {},
      progressPhotos: [],
      apiKey: '',
      webhookUrl: '',
      webhookAuthHeader: '',
      hevyApiKey: 'fa507d87-7469-44d3-ae05-ba394af832d4'
    },
    valentina: {
      id: 'valentina',
      name: 'Valentina',
      gender: 'female',
      age: 28,
      height: 165,
      workoutHistory: [],
      mealHistory: [],
      workoutLogs: [],
      bodyMetrics: [{
        id: 'm_valentina_' + (now + 1),
        date: new Date().toISOString().split('T')[0],
        weight: 58,
        bodyFat: 25,
        muscleMass: 21,
        visceralFat: 5,
        waterPercent: 50,
        waterWeight: parseFloat((58 * 0.5).toFixed(2)),
        bmr: Math.round(10 * 58 + 6.25 * 165 - 5 * 28 - 161),
        muscleSize: 36,
        bmi: 21.3,
        muscleMassRightArm: 2.1,
        muscleMassLeftArm: 2.0,
        muscleMassRightLeg: 7.8,
        muscleMassLeftLeg: 7.7,
        muscleMassTrunk: 20.4,
        bodyFatRightArm: 24.2,
        bodyFatLeftArm: 24.5,
        bodyFatRightLeg: 26.1,
        bodyFatLeftLeg: 26.3,
        bodyFatTrunk: 25.8,
        boneMass: 2.3,
        proteinMass: 10.2,
        mineralMass: 3.1,
        rmr: 1290,
        tdee: 1750,
        impedance: 550,
        phaseAngle: 5.9,
        reactance: 52,
        resistance: 545,
        metabolicAge: 26,
        bodyAge: 27,
        chest: 88,
        waist: 68,
        hips: 92,
        rightArm: 28,
        leftArm: 27.5,
        rightThigh: 52,
        leftThigh: 51.5,
        rightCalf: 35,
        leftCalf: 34.5,
        neck: 32,
        shoulders: 96
      }],
      goals: { weight: 60, bodyFat: 22, muscleMass: 23 },
      customPrograms: {},
      progressPhotos: []
    }
  };
})();

console.log('✅ Initial Users data loaded (Pedro, Valentina)');
