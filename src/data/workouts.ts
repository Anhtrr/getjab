import type { Workout } from "@/lib/types";
import { getCustomWorkout } from "@/lib/customWorkouts";

export const workouts: Workout[] = [
  // === BEGINNER LEVEL (4 workouts, all free) ===
  {
    id: "first-boxing-workout",
    title: "Boxing 101",
    subtitle: "Learn the fundamentals",
    description:
      "Master the basics of boxing with proper form and technique. This workout introduces you to the core punches and movement patterns that form the foundation of all boxing training.",
    level: "beginner",
    goal: "general",
    durationMin: 20,
    equipment: [],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 30,
        title: "Warm Up",
        instructions:
          "Jump in place, arm circles, shoulder rolls. Get your body moving and loose.",
        tips: [
          "Start slow and build intensity",
          "Rotate your wrists and ankles",
        ],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 30,
        title: "Stance & Movement",
        instructions:
          "Get in your boxing stance: lead foot forward, hands up by your chin, elbows tucked. Practice stepping forward, back, and side to side.",
        tips: [
          "Weight balanced 50/50 on both feet",
          "Stay on the balls of your feet",
          "Keep your chin down",
        ],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 30,
        title: "The Jab (1)",
        instructions:
          "Throw the jab: extend your lead hand straight out, rotate your fist, snap it back. Practice single jabs with good form.",
        combos: ["1 (Jab)"],
        tips: [
          "Snap the punch - fast out, fast back",
          "Don't drop your rear hand",
          "Step forward slightly with each jab",
        ],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 30,
        title: "The Cross (2)",
        instructions:
          "Throw the cross: rotate your hips and rear shoulder, extend your rear hand straight. Power comes from your legs and hips.",
        combos: ["2 (Cross)"],
        tips: [
          "Pivot your back foot as you throw",
          "Rotate your hips fully",
          "Return to guard position after every punch",
        ],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 60,
        title: "Jab-Cross Combo (1-2)",
        instructions:
          "Put it together! Throw the jab immediately followed by the cross. This is the most fundamental combo in boxing.",
        combos: ["1-2 (Jab-Cross)"],
        tips: [
          "The jab sets up the cross",
          "Keep a rhythm: snap-BANG",
          "Move your feet between combos",
        ],
      },
      {
        type: "bagwork",
        durationSec: 120,
        restSec: 30,
        title: "Shadow Boxing Round 1",
        instructions:
          "Free shadow boxing! Move around, throw jabs and crosses. Focus on form over speed.",
        combos: ["1 (Jab)", "2 (Cross)", "1-2 (Jab-Cross)", "1-1-2 (Jab-Jab-Cross)"],
        tips: ["Breathe out with each punch", "Imagine an opponent in front of you"],
      },
      {
        type: "bagwork",
        durationSec: 120,
        restSec: 0,
        title: "Shadow Boxing Round 2",
        instructions:
          "Last round! Pick up the pace. Mix jabs, crosses, and movement. Finish strong!",
        combos: ["1-2 (Jab-Cross)", "1-1-2 (Jab-Jab-Cross)"],
        tips: ["Push through fatigue", "Keep your hands up even when tired"],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down",
        instructions:
          "Slow down. Light stretching: arms across chest, shoulder stretch, quad stretch, hamstring stretch. Breathe deeply.",
        tips: ["Hold each stretch for 15-20 seconds", "Great job completing your first workout!"],
      },
    ],
  },
  {
    id: "beginner-bag-work",
    title: "First Rounds on the Bag",
    subtitle: "Basic combos on the heavy bag",
    description:
      "Take your skills to the heavy bag. Learn to transfer power from your body to the bag while maintaining balance and form. Your first taste of real impact training.",
    level: "beginner",
    goal: "general",
    durationMin: 30,
    equipment: ["Heavy bag"],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 60,
        title: "Warm Up",
        instructions:
          "Shadow boxing to warm up. Light jabs, crosses, and movement. Get your blood flowing.",
        tips: ["Focus on form, not power", "Loosen up your shoulders"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Single Shots",
        instructions:
          "Single punches on the bag. Jabs and crosses only. Focus on making solid contact and returning to guard.",
        combos: ["1 (Jab)", "2 (Cross)"],
        tips: ["Hit through the bag, not at it", "Keep your wrist straight on impact"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Jab-Cross Rounds",
        instructions:
          "Throw 1-2 combos on the bag. Step in, throw the combo, step back. Repeat.",
        combos: ["1-2 (Jab-Cross)"],
        tips: [
          "Plant your feet before punching",
          "The cross should be your power shot",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Double Jab Cross",
        instructions:
          "Add a double jab before the cross. The first jab measures distance, the second sets up the cross.",
        combos: ["1-1-2 (Jab-Jab-Cross)"],
        tips: ["Keep the jabs sharp and quick", "Sit down on the cross"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Mix It Up",
        instructions:
          "Alternate between 1-2 and 1-1-2. Move around the bag between combos. Stay active.",
        combos: ["1-2 (Jab-Cross)", "1-1-2 (Jab-Jab-Cross)"],
        tips: ["Circle the bag - don't stand still", "Work at 60-70% power"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Power Round",
        instructions:
          "Hard shots only. Pick your moments and throw with intention. Quality over quantity.",
        combos: ["1-2 (Jab-Cross)", "2 (Cross)"],
        tips: ["Breathe out sharply on power shots", "Reset fully between combos"],
      },
      {
        type: "conditioning",
        durationSec: 120,
        restSec: 30,
        title: "Burnout Round",
        instructions:
          "Non-stop punching! Straight punches on the bag. Keep your hands moving for the entire round.",
        tips: ["Short, fast punches", "Don't stop moving your hands"],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down",
        instructions:
          "Light shadow boxing, then stretching. Focus on shoulders, arms, and hips.",
        tips: ["Shake out your hands", "Stretch your hip flexors"],
      },
    ],
  },
  {
    id: "shadow-boxing-fundamentals",
    title: "Shadow Work",
    subtitle: "Footwork and shadow boxing basics",
    description:
      "Shadow boxing is where champions are refined. Work on movement, timing, and visualization without the bag. This is your mental and technical laboratory.",
    level: "beginner",
    goal: "technique",
    durationMin: 25,
    equipment: [],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 30,
        title: "Dynamic Warm Up",
        instructions:
          "High knees, butt kicks, arm swings, torso twists. Get your whole body warmed up.",
        tips: ["Increase intensity gradually"],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 30,
        title: "Footwork Drill",
        instructions:
          "Practice your boxing footwork: forward, backward, lateral movement. Stay in your stance the whole time.",
        tips: [
          "Lead foot moves first when going forward",
          "Rear foot moves first when going back",
          "Small, quick steps",
        ],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 30,
        title: "Jab & Move",
        instructions:
          "Throw a jab, then move. Step left and jab. Step right and jab. Circle and jab. Constant movement.",
        combos: ["1 (Jab)"],
        tips: ["Jab from wherever you are", "Don't stop moving your feet"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Combo Round 1",
        instructions:
          "Shadow box with 1-2 and 1-2-1 combos. Focus on smooth, flowing combinations with movement between.",
        combos: ["1-2 (Jab-Cross)", "1-2-1 (Jab-Cross-Jab)"],
        tips: ["Stay relaxed between combos", "Hands up, chin down"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Combo Round 2",
        instructions:
          "Add the hook! Practice 1-2-3 combinations. The hook comes from your lead hand with a bent arm.",
        combos: ["1-2-3 (Jab-Cross-Hook)"],
        tips: [
          "The hook is a short, tight punch",
          "Pivot your lead foot on the hook",
          "Keep your elbow at 90 degrees",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 30,
        title: "Free Shadow Boxing",
        instructions:
          "Put it all together. Mix all your combos with footwork. Visualize an opponent.",
        combos: [
          "1-2 (Jab-Cross)",
          "1-2-3 (Jab-Cross-Hook)",
          "1-1-2 (Jab-Jab-Cross)",
        ],
        tips: ["Think offense AND defense", "Move your head after combos"],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down & Stretch",
        instructions:
          "Slow shadow boxing for 30 seconds, then full body stretch. Hold each position.",
        tips: ["Focus on your breathing", "Stretch your shoulders and hips"],
      },
    ],
  },
  {
    id: "quick-cardio-boxing",
    title: "Cardio Blitz",
    subtitle: "High energy boxing cardio",
    description:
      "Short, intense, and effective. This high-energy workout will get your heart pumping and burn calories fast. Perfect for when you're short on time but need to break a sweat.",
    level: "beginner",
    goal: "conditioning",
    durationMin: 20,
    equipment: [],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 120,
        restSec: 20,
        title: "Quick Warm Up",
        instructions:
          "Jumping jacks, high knees, shadow jabs. Get your heart rate up!",
        tips: ["Start at moderate pace"],
      },
      {
        type: "conditioning",
        durationSec: 120,
        restSec: 30,
        title: "Speed Jabs",
        instructions:
          "Fast jabs! Alternate hands. Keep them coming non-stop. Light and quick.",
        combos: ["1 (Jab)", "Alternate hand jabs"],
        tips: ["Speed over power", "Breathe rhythmically"],
      },
      {
        type: "conditioning",
        durationSec: 120,
        restSec: 30,
        title: "Combo Cardio",
        instructions:
          "1-2 combos as fast as you can. Every 20 seconds, throw 10 fast jabs then back to combos.",
        combos: ["1-2 (Jab-Cross)", "Fast jabs x10"],
        tips: ["Push the pace!", "Stay in your stance"],
      },
      {
        type: "conditioning",
        durationSec: 120,
        restSec: 30,
        title: "Uppercut Burnout",
        instructions:
          "Alternate uppercuts from both hands. Squat slightly and drive up with your legs. Non-stop.",
        combos: ["5-6 (Lead Uppercut-Rear Uppercut)"],
        tips: ["Power comes from your legs", "Keep your core tight"],
      },
      {
        type: "conditioning",
        durationSec: 120,
        restSec: 30,
        title: "Hook City",
        instructions:
          "Alternate lead and rear hooks. Pivot your feet with each hook. Keep the pace high.",
        combos: ["3-4 (Lead Hook-Rear Hook)"],
        tips: ["Short, compact hooks", "Rotate your whole body"],
      },
      {
        type: "conditioning",
        durationSec: 120,
        restSec: 30,
        title: "Everything Round",
        instructions:
          "Throw every punch you know! Jabs, crosses, hooks, uppercuts. Mix it all up at high speed.",
        combos: [
          "1-2 (Jab-Cross)",
          "3-4 (Hooks)",
          "5-6 (Uppercuts)",
          "1-2-3 (Jab-Cross-Hook)",
        ],
        tips: ["Leave it all out there!", "Last push - you got this!"],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down",
        instructions:
          "Walk it off. Deep breaths. Full body stretching.",
        tips: ["Bring your heart rate down slowly", "Hydrate!"],
      },
    ],
  },

  // === INTERMEDIATE LEVEL (5 workouts) ===
  {
    id: "sweet-science-rounds",
    title: "Sweet Science Rounds",
    subtitle: "Progressive technique building on the bag",
    description:
      "Master the art of boxing through progressive combo building. Each round adds complexity, taking you from basic combinations to advanced 4-punch sequences with body work. Learn to punch in bunches and move like a boxer.",
    level: "intermediate",
    goal: "technique",
    durationMin: 35,
    equipment: ["Heavy bag"],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 120,
        restSec: 60,
        title: "Light Warmup",
        instructions: "Light jabs and movement. Get loose, find your rhythm.",
        combos: ["1 (Jab)", "1-1 (Double Jab)"],
        tips: [
          "Stay light on your feet",
          "Don't overextend yet, just warm up",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "The 1-2 Foundation",
        instructions:
          "The jab-cross and its variations. This is the foundation of all boxing offense.",
        combos: [
          "1-2 (Jab-Cross)",
          "1-1-2 (Double Jab-Cross)",
          "2-1 (Cross-Jab)",
        ],
        tips: [
          "Rotate your hips on the cross",
          "Bring your hands back to guard after every punch",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Adding the Hook",
        instructions: "Introduce the lead hook into your combinations.",
        combos: [
          "1-2-3 (Jab-Cross-Hook)",
          "2-3 (Cross-Hook)",
          "3-2 (Hook-Cross)",
        ],
        tips: [
          "Turn your whole body into the hook",
          "Keep a tight arc, don't swing wide",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "4-Punch Combos",
        instructions: "Extend your combinations. Learn to punch in bunches.",
        combos: [
          "1-2-3-2 (Jab-Cross-Hook-Cross)",
          "1-2-5-2 (Jab-Cross-Uppercut-Cross)",
        ],
        tips: [
          "Stay balanced through all 4 punches",
          "The last punch should be the hardest",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Body Work",
        instructions:
          "Go downstairs. Learn to attack the body without losing balance.",
        combos: [
          "1-2-3body (Jab-Cross-Body Hook)",
          "1-2-3body-2 (Jab-Cross-Body Hook-Cross)",
        ],
        tips: [
          "Bend your knees to go low, don't lean",
          "Come back up with authority",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Mix Everything",
        instructions:
          "Combine head shots, body shots, and movement. This is where it all comes together.",
        combos: [
          "1-2-3-2 (Jab-Cross-Hook-Cross)",
          "1-2-3body-2 (Jab-Cross-Body Hook-Cross)",
          "2-3-2 (Cross-Hook-Cross)",
        ],
        tips: [
          "Punch in bunches then reset",
          "Move your feet between combos",
        ],
      },
      {
        type: "conditioning",
        durationSec: 120,
        restSec: 60,
        title: "Non-Stop 1-2s",
        instructions:
          "Non-stop jab-cross for 2 minutes. Short, fast punches. This is your conditioning test.",
        combos: ["1-2 (Jab-Cross)"],
        tips: [
          "Don't overextend, keep it short",
          "Breathe on every punch",
        ],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cooldown",
        instructions: "Light movement, easy jabs. Cool down and recover.",
        tips: [
          "Let your heart rate come down",
          "Shake out your arms",
        ],
      },
    ],
  },
  {
    id: "fight-conditioning",
    title: "Championship Rounds",
    subtitle: "Fight simulation conditioning",
    description:
      "Simulate the pace of a real fight. Rounds alternate between high-output offense and active recovery, teaching you to manage your energy across a full session. Build the cardio to go the distance.",
    level: "intermediate",
    goal: "conditioning",
    durationMin: 35,
    equipment: ["Heavy bag"],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 30,
        title: "Shadow Boxing Warm Up",
        instructions:
          "Light shadow boxing. All punches. Focus on rhythm and breathing.",
        tips: ["Stay loose", "Find your breathing pattern"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 60,
        title: "Round 1: High Pace",
        instructions:
          "High output bag work. Throw 3-punch combos non-stop. Fight pace.",
        combos: ["1-2-3 (Jab-Cross-Hook)", "1-1-2 (Double Jab-Cross)"],
        tips: ["Push the pace", "Constant output"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Round 2: Active Recovery",
        instructions:
          "Moderate pace. Move around the bag, work on technique. Recover while staying active.",
        combos: ["1-2 (Jab-Cross)", "2-3 (Cross-Hook)"],
        tips: ["Control your breathing", "Stay technical"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 60,
        title: "Round 3: Power Combos",
        instructions:
          "4-punch power combinations. Every punch with bad intentions.",
        combos: ["1-2-3-2 (Jab-Cross-Hook-Cross)", "1-2-5-2 (Jab-Cross-Uppercut-Cross)"],
        tips: ["Maximum effort", "Rest between combos if needed"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Round 4: Movement",
        instructions:
          "Circle the bag. Work angles. Lower intensity but constant movement.",
        combos: ["1-2-3 (Jab-Cross-Hook)"],
        tips: ["Work your footwork", "Stay in rhythm"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 60,
        title: "Round 5: Body Attack",
        instructions:
          "Mix head and body shots. High pace. Change levels constantly.",
        combos: [
          "1-2-3body-2 (Jab-Cross-Body Hook-Cross)",
          "3body-3-2 (Body Hook-Head Hook-Cross)",
        ],
        tips: ["Fast level changes", "Don't slow down on body shots"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Round 6: Championship Round",
        instructions:
          "Final push. Everything you have left. This is where fights are won.",
        combos: [
          "1-2-3-2 (Jab-Cross-Hook-Cross)",
          "1-2-3body-3-2 (Jab-Cross-Body Hook-Head Hook-Cross)",
        ],
        tips: [
          "Leave it all in this round",
          "Champions are made in the last round",
        ],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down",
        instructions: "Walk it off. Deep breathing. Stretch everything.",
        tips: ["You went the distance", "Hydrate and recover"],
      },
    ],
  },
  {
    id: "advanced-combo-flow",
    title: "Combination Punching",
    subtitle: "Link your punches together",
    description:
      "Learn to throw 3-5 punch combinations with flow and rhythm. This workout builds your ability to chain punches together naturally, mixing hooks, uppercuts, and body shots into smooth sequences.",
    level: "intermediate",
    goal: "general",
    durationMin: 35,
    equipment: ["Heavy bag"],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 60,
        title: "Technical Warm Up",
        instructions:
          "Shadow boxing with 2-3 punch combos. Focus on smooth transitions between punches.",
        tips: ["Flow between punches", "Emphasize rotation"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "3-Punch Foundations",
        instructions:
          "Build your foundation with classic 3-punch combos. Find your rhythm.",
        combos: [
          "1-2-3 (Jab-Cross-Hook)",
          "1-1-2 (Jab-Jab-Cross)",
          "2-3-2 (Cross-Hook-Cross)",
        ],
        tips: ["Each punch sets up the next", "Stay balanced"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "4-Punch Sequences",
        instructions:
          "Extend to 4 punches. Learn to maintain form and power through longer combos.",
        combos: [
          "1-2-3-2 (Jab-Cross-Hook-Cross)",
          "1-2-5-2 (Jab-Cross-Uppercut-Cross)",
          "1-1-2-3 (Jab-Jab-Cross-Hook)",
        ],
        tips: ["Don't sacrifice form for length", "Breathe through the combo"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Mixing Levels",
        instructions:
          "Add body work into your 4-punch combos. Head-body combinations.",
        combos: [
          "1-2-3body-2 (Jab-Cross-Body Hook-Cross)",
          "1-2-3body-3 (Jab-Cross-Body Hook-Head Hook)",
        ],
        tips: [
          "Smooth level changes",
          "The body shot opens up the head",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "5-Punch Flow",
        instructions:
          "Long combinations. Punch in bunches. This is where you learn offensive pressure.",
        combos: [
          "1-2-3-2-3 (Jab-Cross-Hook-Cross-Hook)",
          "1-2-3body-3-2 (Jab-Cross-Body Hook-Head Hook-Cross)",
          "1-6-3-2-3 (Jab-Uppercut-Hook-Cross-Hook)",
        ],
        tips: [
          "Each punch flows into the next",
          "Stay balanced through all 5",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Creative Combinations",
        instructions:
          "Mix all your combos. Start with different punches. Vary your combinations.",
        combos: [
          "1-2-3-2 (Jab-Cross-Hook-Cross)",
          "2-3-2-3 (Cross-Hook-Cross-Hook)",
          "1-6-3-2 (Jab-Uppercut-Hook-Cross)",
        ],
        tips: [
          "Don't be predictable",
          "End every combo with a strong shot",
        ],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Rapid Fire Combos",
        instructions:
          "Non-stop combinations. Pick any combo and keep them flowing. Don't stop punching.",
        tips: ["This is cardio and technique combined", "Push through the fatigue"],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down",
        instructions:
          "Light shadow boxing and full body stretch.",
        tips: ["Replay the combos slowly in your mind", "Stretch everything"],
      },
    ],
  },
  {
    id: "speed-precision",
    title: "Speed Kills",
    subtitle: "Fast hands win fights",
    description:
      "Develop explosive hand speed and rapid-fire combinations. This workout focuses on speed over power, teaching you to throw fast, clean, multi-punch combinations that overwhelm opponents.",
    level: "intermediate",
    goal: "speed",
    durationMin: 30,
    equipment: ["Heavy bag"],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 120,
        restSec: 60,
        title: "Fast Jabs",
        instructions: "Speed warmup. Fast jabs only. Light and quick.",
        combos: ["1 (Jab)", "1-1 (Double Jab)", "1-1-1 (Triple Jab)"],
        tips: [
          "Speed, not power",
          "Snap it back fast as you throw it",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Speed Doubles",
        instructions:
          "2-punch speed combos. Both punches should sound like one hit.",
        combos: [
          "1-2 (Jab-Cross)",
          "3-2 (Hook-Cross)",
          "5-2 (Uppercut-Cross)",
        ],
        tips: [
          "Both punches should sound like one hit",
          "Speed comes from relaxation",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Speed Triples",
        instructions: "3-punch speed combos. Quick hands, quick reset.",
        combos: [
          "1-2-3 (Jab-Cross-Hook)",
          "1-1-2 (Double Jab-Cross)",
          "2-3-2 (Cross-Hook-Cross)",
        ],
        tips: [
          "Fast hands, fast reset",
          "Don't telegraph your punches",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Speed 4-Punch",
        instructions: "4 punches at max speed. All 4 should blur together.",
        combos: [
          "1-2-3-2 (Jab-Cross-Hook-Cross)",
          "1-2-1-2 (Jab-Cross-Jab-Cross)",
        ],
        tips: [
          "All 4 punches should blur together",
          "Stay light on your feet",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Speed 5-Punch",
        instructions:
          "5-punch speed combinations. Don't slow down on the last punches.",
        combos: [
          "1-2-3-2-3 (Jab-Cross-Hook-Cross-Hook)",
          "1-1-2-3-2 (Double Jab-Cross-Hook-Cross)",
        ],
        tips: [
          "Don't slow down on the 4th and 5th punch",
          "Breathe between combos",
        ],
      },
      {
        type: "conditioning",
        durationSec: 120,
        restSec: 30,
        title: "Speed Challenge",
        instructions:
          "How many clean 1-2s can you throw in 2 minutes? Every punch must be crisp. This is your test.",
        combos: ["1-2 (Jab-Cross)"],
        tips: [
          "Quality at speed, not sloppy",
          "This is your benchmark",
        ],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cooldown",
        instructions: "Easy shadow boxing. Let your arms recover.",
        tips: ["Shake out your hands", "Deep breathing"],
      },
    ],
  },
  {
    id: "body-shot-specialist",
    title: "Body Snatcher",
    subtitle: "Rip the body, kill the head",
    description:
      "Master the brutal art of body punching. Learn to attack downstairs with hooks, uppercuts, and crosses to the body. Break down your opponent's will with vicious body work.",
    level: "intermediate",
    goal: "power",
    durationMin: 30,
    equipment: ["Heavy bag"],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 45,
        title: "Warm Up",
        instructions:
          "Shadow boxing with emphasis on bending your knees and changing levels. Practice dipping low.",
        tips: ["Warm up your core with twists", "Practice level changes"],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 45,
        title: "Body Jab",
        instructions:
          "Jab to the body: bend your knees to get low, keep your rear hand up protecting your head. Straight punch to the midsection.",
        combos: ["1body (Body Jab)"],
        tips: ["Level change with your legs", "Keep your head off the center line"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Head-Body Combo",
        instructions:
          "Jab to the head, cross to the body. Change levels between punches.",
        combos: ["1-2body (Jab-Body Cross)"],
        tips: ["The head shot sets up the body shot", "Disguise your body attack"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Body Hook",
        instructions:
          "Lead hook to the body. Get low, dig the hook in with a tight arm. Pivot and drive through.",
        combos: ["1-2-3body (Jab-Cross-Body Hook)"],
        tips: ["Compact hook - don't swing wide", "Dig in and rip"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Body-Head Combos",
        instructions:
          "Go low then high. Body hook followed by a head hook. Make them drop their hands, then go upstairs.",
        combos: [
          "3body-3 (Body Hook-Head Hook)",
          "1-2-3body-3 (Jab-Cross-Body Hook-Head Hook)",
        ],
        tips: ["The level change makes this deadly", "Head follows the body shot immediately"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 30,
        title: "All Levels",
        instructions:
          "Mix head and body shots freely. Jab high, hook low, cross high, uppercut low. Keep your opponent guessing.",
        combos: [
          "1-2-3body-2 (Jab-Cross-Body Hook-Cross)",
          "1-5body-6-3 (Jab-Body Uppercut-Rear Uppercut-Hook)",
        ],
        tips: ["Constant level changes", "Your opponent can't block everywhere"],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down",
        instructions:
          "Light stretching. Focus on your core, obliques, and lower back.",
        tips: ["Your core did a lot of work today - stretch it out"],
      },
    ],
  },

  // === ADVANCED LEVEL (6 workouts) ===
  {
    id: "anhs-heavy-bag",
    title: "Peek-a-Boo Bag Session",
    subtitle: "Mike Tyson-inspired progressive heavy bag work",
    description:
      "A complete heavy bag session inspired by Cus D'Amato's peek-a-boo style. Progressive rounds build from singles to 6-punch combinations with body work, defense, and brutal conditioning burnouts. Head movement between combos, relentless pressure, explosive power.",
    level: "advanced",
    goal: "general",
    durationMin: 43,
    equipment: ["Heavy bag"],
    isFree: true,
    rounds: [
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Straight Shots",
        instructions: "Singles only. Work on clean, crisp punches.",
        combos: ["1 (Jab)", "2 (Cross)"],
        tips: [
          "Pop the jab, fast out fast back",
          "Sit down on the cross, drive from the back foot",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Inside Weapons",
        instructions: "Hooks and uppercuts. Get comfortable on the inside.",
        combos: [
          "3 (Lead Hook)",
          "6 (Rear Uppercut)",
          "3-4 (Lead Hook-Rear Hook)",
          "5-6 (Lead Uppercut-Rear Uppercut)",
        ],
        tips: [
          "Short tight hooks, no winding up",
          "Uppercuts drive up from the legs",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Building Combos",
        instructions: "3-punch combinations. Start building your offense.",
        combos: [
          "1-2-3 (Jab-Cross-Hook)",
          "1-6-3 (Jab-Uppercut-Hook)",
          "2-3-2 (Cross-Hook-Cross)",
        ],
        tips: [
          "Every combo starts with proper setup",
          "Snap the last punch",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Level Changes",
        instructions:
          "Attack head and body. Learn to change levels without telegraphing.",
        combos: [
          "1-2-3body (Jab-Cross-Body Hook)",
          "3body-3-2 (Body Hook-Head Hook-Cross)",
          "1-2-5body-2 (Jab-Cross-Body Uppercut-Cross)",
        ],
        tips: [
          "Bend your knees to go low, don't lean",
          "Go down then come back up with power",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Offense and Defense",
        instructions: "Integrate defense into your offense. Throw, slip, counter.",
        combos: [
          "1-2-Slip-2-3 (Jab-Cross-Slip-Cross-Hook)",
          "1-2-3-Roll-3-2 (Jab-Cross-Hook-Roll-Hook-Cross)",
        ],
        tips: [
          "Move your head after every combo",
          "The counter should be sharp and immediate",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Long Combinations",
        instructions: "5-punch combos. Punch in bunches, overwhelm the opponent.",
        combos: [
          "1-2-3-2-3 (Jab-Cross-Hook-Cross-Hook)",
          "1-2-3body-3-2 (Jab-Cross-Body Hook-Head Hook-Cross)",
          "1-6-3-2-3 (Jab-Uppercut-Hook-Cross-Hook)",
        ],
        tips: [
          "Punch in bunches, don't single-shot",
          "Stay balanced through all 5 punches",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Championship Round",
        instructions:
          "Everything. 5-6 punch combinations. This is where champions are made.",
        combos: [
          "1-2-3-2-3-2 (Jab-Cross-Hook-Cross-Hook-Cross)",
          "1-1-2-6-3-2 (Jab-Jab-Cross-Uppercut-Hook-Cross)",
          "1-2-3body-2-3-2 (Jab-Cross-Body Hook-Cross-Head Hook-Cross)",
        ],
        tips: [
          "Don't slow down, maintain intensity",
          "Every punch counts",
        ],
      },
      {
        type: "conditioning",
        durationSec: 90,
        restSec: 20,
        title: "Burnout: Straights",
        instructions:
          "Non-stop 1-2s for 90 seconds. Your arms will burn. Keep going.",
        combos: ["1-2 (Jab-Cross)"],
        tips: [
          "Short punches, don't overextend",
          "This is mental, push through",
        ],
      },
      {
        type: "conditioning",
        durationSec: 90,
        restSec: 90,
        title: "Burnout: Body",
        instructions:
          "Non-stop alternating body hooks. This is the hardest round. Don't quit.",
        combos: ["3body-4body (Body Hook-Body Rear Hook)"],
        tips: [
          "Stay low, bend your knees",
          "This separates the tough from the weak",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 0,
        title: "Victory Lap",
        instructions:
          "You made it. Clean technique to finish. End the last 30 seconds with everything you have left.",
        combos: [
          "1-2-3 (Jab-Cross-Hook)",
          "1-2-3-2 (Jab-Cross-Hook-Cross)",
          "1-2-5-2-3 (Jab-Cross-Uppercut-Cross-Hook)",
        ],
        tips: [
          "Clean technique even when tired",
          "Finish strong, this is your victory lap",
        ],
      },
    ],
  },
  {
    id: "kronk-gym-rounds",
    title: "Kronk Gym Rounds",
    subtitle: "Emanuel Steward's legendary pressure fighting",
    description:
      "Aggressive, high-output pressure fighting from the legendary Kronk Gym. Learn to apply non-stop pressure with power punches, body attack, and relentless combinations. This is Detroit heavy-handed boxing at its finest.",
    level: "advanced",
    goal: "power",
    durationMin: 40,
    equipment: ["Heavy bag"],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 120,
        restSec: 60,
        title: "Warm Up Your Weapons",
        instructions: "Power jab warmup. Get your shoulders ready for heavy work.",
        combos: ["1-1 (Double Jab)", "1-2 (Jab-Cross)"],
        tips: ["Start controlled, we're building to power"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Straight and Hard",
        instructions:
          "Straight shots with bad intentions. Every cross should move the bag.",
        combos: [
          "1-2 (Jab-Cross)",
          "1-2-1-2 (Jab-Cross-Jab-Cross)",
          "1-1-2 (Double Jab-Cross)",
        ],
        tips: [
          "Every cross should move the bag off its chain",
          "Step into your punches, use your legs",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Hook City",
        instructions:
          "Hooks and power. Turn your whole body into every punch.",
        combos: [
          "2-3 (Cross-Hook)",
          "1-2-3-4 (Jab-Cross-Hook-Rear Hook)",
          "3-2-3 (Hook-Cross-Hook)",
        ],
        tips: [
          "Short hooks, maximum rotation",
          "Double up the hooks, don't single-shot",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Coming Up the Middle",
        instructions: "Uppercut combos. Split the guard, come up the middle.",
        combos: [
          "1-6-3-2 (Jab-Uppercut-Hook-Cross)",
          "1-2-5-2-3 (Jab-Cross-Uppercut-Cross-Hook)",
          "5-2-3 (Uppercut-Cross-Hook)",
        ],
        tips: [
          "Uppercuts set up everything",
          "Drive from your legs, not your arms",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Rip the Body",
        instructions: "Body attack. Break their will with body shots.",
        combos: [
          "1-2-3body-2 (Jab-Cross-Body Hook-Cross)",
          "1-2body-3 (Jab-Body Cross-Hook)",
          "3body-3-2-3 (Body Hook-Head Hook-Cross-Hook)",
        ],
        tips: [
          "The body shot opens up the head",
          "Commit to the level change, don't half-ass it",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Non-Stop Pressure",
        instructions:
          "Long power combos. Don't give them a chance to breathe.",
        combos: [
          "1-2-3-2-3-2 (Jab-Cross-Hook-Cross-Hook-Cross)",
          "1-2-3body-3-2-3 (Jab-Cross-Body Hook-Head Hook-Cross-Hook)",
          "1-6-3-2-3-2 (Jab-Uppercut-Hook-Cross-Hook-Cross)",
        ],
        tips: [
          "Don't give them a chance to breathe",
          "Punch in bunches, this is Kronk style",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Adapt and Attack",
        instructions:
          "Everything with defense. Throw, defend, counter. Complete fighting.",
        combos: [
          "1-2-3-Slip-2-3 (Jab-Cross-Hook-Slip-Cross-Hook)",
          "Slip-3-2-3-2 (Slip-Hook-Cross-Hook-Cross)",
        ],
        tips: [
          "Offense and defense are one thing",
          "Counter immediately after defense",
        ],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 60,
        title: "Empty the Tank",
        instructions:
          "Non-stop power 4-punch combos. Every punch full power. This is where champions are made.",
        combos: ["1-2-3-2 (Jab-Cross-Hook-Cross)"],
        tips: [
          "This is where champions are made",
          "Push through the burn, don't slow down",
        ],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cooldown",
        instructions: "Easy movement, light shadow boxing. Let your body recover.",
        tips: ["You earned this", "Stretch everything"],
      },
    ],
  },
  {
    id: "power-punching",
    title: "Mexican Style Bag Work",
    subtitle: "Relentless pressure and body attack",
    description:
      "Canelo. Chavez. Barrera. Mexican boxing is built on relentless pressure, devastating body work, and never giving your opponent a moment to breathe. This workout pushes you with 5-6 punch power combos, constant level changes, and a double burnout finale.",
    level: "advanced",
    goal: "power",
    durationMin: 40,
    equipment: ["Heavy bag"],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 120,
        restSec: 60,
        title: "Heavy Hands Warmup",
        instructions: "Get loose. We're going heavy today.",
        combos: ["1-2 (Jab-Cross)", "1-2-3 (Jab-Cross-Hook)"],
        tips: ["Rotate your hips on every punch", "Find your range"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Pressure Straights",
        instructions:
          "Step forward with every combo. Close distance. Make them feel you.",
        combos: [
          "1-2-1-2 (Jab-Cross-Jab-Cross)",
          "1-1-2-3 (Double Jab-Cross-Hook)",
          "1-2-3-2 (Jab-Cross-Hook-Cross)",
        ],
        tips: ["Step in with the jab, don't reach", "Every cross should move the bag"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Body Ripping",
        instructions: "Go to the body. Break them down. Body shots end fights.",
        combos: [
          "1-2-3body (Jab-Cross-Body Hook)",
          "3body-3-2 (Body Hook-Head Hook-Cross)",
          "1-2-5body-2 (Jab-Cross-Body Uppercut-Cross)",
          "6body-3 (Body Rear Uppercut-Head Hook)",
        ],
        tips: ["Bend your knees, don't lean", "Every body shot should dig in"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Level Change Warfare",
        instructions:
          "Head, body, head. Keep switching levels. They can't guard what they can't predict.",
        combos: [
          "1-2-3body-3-2 (Jab-Cross-Body Hook-Head Hook-Cross)",
          "1-2-3body-2-3 (Jab-Cross-Body Hook-Cross-Head Hook)",
          "3body-3-2-3body (Body Hook-Head Hook-Cross-Body Hook)",
        ],
        tips: [
          "The level change is the weapon, the punches are the delivery",
          "Fast down, fast up",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Mexican Combinations",
        instructions:
          "Long power combos. Walk them down. Don't stop punching.",
        combos: [
          "1-2-3-2-3-2 (Jab-Cross-Hook-Cross-Hook-Cross)",
          "1-6-3-2-3 (Jab-Uppercut-Hook-Cross-Hook)",
          "1-2-3-4-2 (Jab-Cross-Hook-Rear Hook-Cross)",
        ],
        tips: ["Every punch should have bad intentions", "Pressure. Pressure. Pressure."],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "The Full Mexican",
        instructions:
          "Everything together. Long combos with body work mixed in. Break the bag.",
        combos: [
          "1-2-3body-2-3-2 (Jab-Cross-Body Hook-Cross-Head Hook-Cross)",
          "1-2-5body-2-3-2 (Jab-Cross-Body Uppercut-Cross-Hook-Cross)",
          "1-6-3body-3-2 (Jab-Uppercut-Body Hook-Head Hook-Cross)",
        ],
        tips: [
          "This is where you earn the Mexican style",
          "Don't slow down on the body shots",
        ],
      },
      {
        type: "conditioning",
        durationSec: 90,
        restSec: 20,
        title: "Burnout: Jab-Cross",
        instructions:
          "Non-stop 1-2s. Short, fast, don't stop. Breathe through it.",
        combos: ["1-2 (Jab-Cross)"],
        tips: ["Short punches, don't overextend", "Your arms will burn, keep going"],
      },
      {
        type: "conditioning",
        durationSec: 90,
        restSec: 60,
        title: "Burnout: Body Hooks",
        instructions:
          "Alternating body hooks, non-stop. Stay low and rip the body.",
        combos: ["3body-4body (Body Hook-Body Rear Hook)"],
        tips: ["Stay low the entire round", "This is the hardest part, don't quit"],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cooldown",
        instructions: "Light shadow boxing. You earned this rest.",
        tips: ["Breathe deeply", "Stretch your core"],
      },
    ],
  },
  {
    id: "philly-shell-rounds",
    title: "Philly Shell Rounds",
    subtitle: "Mayweather's defensive mastery",
    description:
      "Make them miss. Make them pay. This advanced defensive workout teaches you to slip, roll, pull, and counter on the heavy bag with long counter combinations. Inspired by Floyd Mayweather and James Toney - the most frustrating fighters to face.",
    level: "advanced",
    goal: "technique",
    durationMin: 40,
    equipment: ["Heavy bag"],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 120,
        restSec: 60,
        title: "Rhythm and Movement",
        instructions:
          "Light jabs with head movement between every punch. Find your rhythm.",
        combos: ["1 (Jab)", "1-2 (Jab-Cross)", "1-2-3 (Jab-Cross-Hook)"],
        tips: ["Move your head after every combo", "Stay loose and relaxed"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Slip and Counter",
        instructions:
          "Slip the punch, fire back with a full counter combination.",
        combos: [
          "Slip-2-3 (Slip-Cross-Hook)",
          "Slip-2-3-2 (Slip-Cross-Hook-Cross)",
          "Slip-3-2-3 (Slip-Hook-Cross-Hook)",
        ],
        tips: [
          "Slip with your whole body, not just your neck",
          "The counter should be immediate",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Roll and Punish",
        instructions:
          "Roll under the hook, come up throwing 3-4 punch counters.",
        combos: [
          "Roll-3-2-3 (Roll-Hook-Cross-Hook)",
          "Roll-6-3-2 (Roll-Uppercut-Hook-Cross)",
          "Roll-3-2-3-2 (Roll-Hook-Cross-Hook-Cross)",
        ],
        tips: [
          "Bend your knees, load your legs like a spring",
          "Come up with everything",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "The Pull Counter",
        instructions:
          "Mayweather's signature. Pull back, let it miss, fire the cross straight back.",
        combos: [
          "Pull-2-3 (Pull-Cross-Hook)",
          "Pull-2-3-2 (Pull-Cross-Hook-Cross)",
          "Pull-2-3body-2 (Pull-Cross-Body Hook-Cross)",
        ],
        tips: [
          "Pull with your hips",
          "The cross goes right back down the center line",
          "Add a body shot to keep them guessing",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Offense Into Defense Into Offense",
        instructions:
          "Throw a combo, defend the return, counter immediately. This is how real fights flow.",
        combos: [
          "1-2-Slip-2-3-2 (Jab-Cross-Slip-Cross-Hook-Cross)",
          "1-2-3-Roll-3-2 (Jab-Cross-Hook-Roll-Hook-Cross)",
          "1-2-Pull-2-3 (Jab-Cross-Pull-Cross-Hook)",
        ],
        tips: [
          "The fight doesn't stop after your combo",
          "Defense is just the bridge between your offense",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Advanced Counter Combinations",
        instructions:
          "Long counter sequences. Make them pay for every punch they throw.",
        combos: [
          "Slip-2-3-2-3 (Slip-Cross-Hook-Cross-Hook)",
          "Roll-6-3-2-3 (Roll-Uppercut-Hook-Cross-Hook)",
          "Pull-2-3body-3-2 (Pull-Cross-Body Hook-Head Hook-Cross)",
        ],
        tips: [
          "5-punch counters separate good fighters from great ones",
          "Stay balanced through the whole sequence",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Full Philly Shell Flow",
        instructions:
          "Everything together. Slip, roll, pull, counter, body shots. The complete defensive fighter.",
        combos: [
          "1-2-Slip-2-3body-3-2 (Jab-Cross-Slip-Cross-Body Hook-Head Hook-Cross)",
          "Slip-2-3-Roll-3-2 (Slip-Cross-Hook-Roll-Hook-Cross)",
          "Pull-2-3-2-3 (Pull-Cross-Hook-Cross-Hook)",
          "Roll-6-3-2-3-2 (Roll-Uppercut-Hook-Cross-Hook-Cross)",
        ],
        tips: [
          "This round is the test",
          "Make them miss, make them pay, make them quit",
        ],
      },
      {
        type: "conditioning",
        durationSec: 90,
        restSec: 60,
        title: "Counter Burnout",
        instructions:
          "Non-stop slip and counter. Slip, cross, hook. Repeat. Don't stop.",
        combos: ["Slip-2-3 (Slip-Cross-Hook)"],
        tips: [
          "Keep your head moving even when tired",
          "Speed and precision, not power",
        ],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cooldown",
        instructions:
          "Easy shadow boxing with head movement. Float like a butterfly.",
        tips: ["Deep breathing", "You just learned defensive mastery"],
      },
    ],
  },
  {
    id: "counter-punching-workshop",
    title: "Hit and Don't Get Hit",
    subtitle: "Master defensive boxing and counters",
    description:
      "The highest level of boxing: make them miss and make them pay. This workshop teaches advanced defensive techniques, counter punching, and the art of hitting without getting hit. Pure boxing IQ.",
    level: "advanced",
    goal: "technique",
    durationMin: 35,
    equipment: [],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 45,
        title: "Defensive Warm Up",
        instructions:
          "Shadow boxing with lots of head movement. Slips, rolls, and pull-backs between every combo.",
        tips: ["Make defense your default mode", "Stay relaxed"],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 45,
        title: "Pull Counter",
        instructions:
          "Imagine a jab coming. Pull your head straight back (just out of range), then immediately counter with your cross.",
        combos: ["Pull-2 (Pull Counter Cross)"],
        tips: [
          "Minimal pull - just enough to miss",
          "Counter IMMEDIATELY - timing is everything",
        ],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 45,
        title: "Slip & Cross Counter",
        instructions:
          "Slip outside the jab (head moves to your right if orthodox), then counter with a sharp cross.",
        combos: [
          "Slip-2 (Cross counter)",
          "Slip-2-3 (Cross-Hook counter)",
        ],
        tips: [
          "The slip loads your rear hand",
          "Counter from the angle you've created",
        ],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 45,
        title: "Roll & Counter Hook",
        instructions:
          "Roll under the imaginary hook, come up with your own hook. The roll loads your legs for a powerful counter.",
        combos: [
          "Roll-3 (Lead Hook counter)",
          "Roll-3-2 (Hook-Cross counter)",
        ],
        tips: [
          "The roll gives you a huge mechanical advantage",
          "Drive up from your legs into the hook",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Catch & Counter",
        instructions:
          "Practice catching the jab in your rear glove, then immediately countering. Catch - fire back.",
        combos: [
          "Catch-2-3 (Cross-Hook)",
          "Catch-2-3-2 (Cross-Hook-Cross)",
        ],
        tips: [
          "The catch is a subtle move - don't reach for it",
          "Fire back before they retract",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Counter Combinations",
        instructions:
          "Chain defensive moves with counter combinations. Visualize incoming punches and respond with authority.",
        combos: [
          "Slip-2-3-2 (Counter combo)",
          "Roll-3-2-3 (Hook-Cross-Hook)",
          "Pull-2-3-2 (Cross-Hook-Cross)",
        ],
        tips: [
          "Let your defense flow right into offense",
          "Every defense creates a counter opportunity",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 30,
        title: "Free Counter Boxing",
        instructions:
          "Shadow box an aggressive opponent. Make them miss, make them pay. Use all your counter techniques.",
        tips: [
          "Mix up your counters - be unpredictable",
          "Sometimes the best counter is to just move",
        ],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down",
        instructions: "Light shadow boxing and stretching. Focus on neck and lower back.",
        tips: ["Replay your favorite counter combinations mentally"],
      },
    ],
  },
  {
    id: "full-camp-round",
    title: "Camp Mode",
    subtitle: "Complete training camp simulation",
    description:
      "The complete fighter's workout. Jump rope, heavy bag, shadow boxing, and conditioning. This is what professional boxers do in training camp. Put it all together and train like a pro.",
    level: "advanced",
    goal: "general",
    durationMin: 50,
    equipment: ["Heavy bag", "Jump rope"],
    isFree: true,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 30,
        title: "Jump Rope",
        instructions: "3 minutes of jump rope. Mix up your footwork: bounce step, running in place, side-to-side.",
        tips: ["Light and bouncy", "Get in a rhythm"],
      },
      {
        type: "warmup",
        durationSec: 180,
        restSec: 30,
        title: "Shadow Boxing Warm Up",
        instructions:
          "Light technical shadow boxing. All punches, all defenses. Focus on form.",
        tips: ["Use this round to find your rhythm", "Smooth and controlled"],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 45,
        title: "Technical Drilling",
        instructions:
          "Pick 2-3 combos and drill them perfectly. Repeat each combo 10 times with perfect form.",
        combos: ["1-2-3 (Jab-Cross-Hook)", "1-2-3-2 (Jab-Cross-Hook-Cross)"],
        tips: ["Perfect practice makes perfect", "Slow is smooth, smooth is fast"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Heavy Bag Round 1",
        instructions:
          "Medium pace bag work. Work on your timing and distance. Clean shots only.",
        combos: ["1-2 (Jab-Cross)", "1-2-3 (Jab-Cross-Hook)"],
        tips: ["Find your range", "Every punch has a purpose"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Heavy Bag Round 2",
        instructions:
          "Pick up the pace. Longer combos, more volume. Move around the bag.",
        combos: [
          "1-2-3-2 (Jab-Cross-Hook-Cross)",
          "1-1-2-3-2 (Double Jab-Cross-Hook-Cross)",
        ],
        tips: ["Higher work rate this round", "Circle the bag between combos"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Heavy Bag Round 3",
        instructions:
          "Power round. Sit down on your shots. Big combos with bad intentions.",
        combos: [
          "1-2-3-2 (Power combo)",
          "1-2-5-2-3 (Jab-Cross-Uppercut-Cross-Hook)",
        ],
        tips: ["Maximum power output", "You should hear the bag pop"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Conditioning: Bag Sprints",
        instructions:
          "30 seconds all-out punching, 30 seconds active rest (footwork). 3 intervals.",
        tips: ["Max effort on sprints", "Stay moving during rest"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Conditioning: Bodyweight",
        instructions:
          "Circuit: 10 push-ups, 10 squat jumps, 20 mountain climbers. Shadow box rest. Repeat.",
        tips: ["No rest between exercises", "Shadow box to recover"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 30,
        title: "Championship Round",
        instructions:
          "Everything you have left. Fight-pace bag work. Act like there's a crowd watching.",
        combos: ["Freestyle - your best combinations"],
        tips: [
          "Leave it ALL in this round",
          "Show what you're made of",
        ],
      },
      {
        type: "cooldown",
        durationSec: 180,
        restSec: 0,
        title: "Cool Down & Stretch",
        instructions:
          "Walk it off. 3 minutes of full body stretching. Deep breaths. You crushed it.",
        tips: [
          "Hold each stretch 20-30 seconds",
          "Champion-level session complete",
        ],
      },
    ],
  },
];

export function getWorkout(id: string): Workout | undefined {
  const staticWorkout = workouts.find((w) => w.id === id);
  if (staticWorkout) return staticWorkout;
  return getCustomWorkout(id);
}

export function getWorkoutsByLevel(level: string): Workout[] {
  if (level === "all") return workouts;
  return workouts.filter((w) => w.level === level);
}

export function getWorkoutsByGoal(goal: string): Workout[] {
  if (goal === "all") return workouts;
  return workouts.filter((w) => w.goal === goal);
}
