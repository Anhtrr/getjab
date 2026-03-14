import type { Workout } from "@/lib/types";
import { getCustomWorkout } from "@/lib/customWorkouts";

export const workouts: Workout[] = [
  // === FREE WORKOUTS ===
  {
    id: "first-boxing-workout",
    title: "Your First Boxing Workout",
    subtitle: "Learn the basics",
    description:
      "A guided introduction to boxing. Learn your stance, the jab, the cross, and put it all together in shadow boxing rounds.",
    level: "beginner",
    goal: "technique",
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
    title: "Beginner Bag Work",
    subtitle: "Basic combos on the bag",
    description:
      "Your first heavy bag session. Learn to hit the bag with proper form using basic combinations.",
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
    title: "Shadow Boxing Fundamentals",
    subtitle: "Footwork + basic combos",
    description:
      "Build your shadow boxing skills with a focus on footwork, defense, and clean combinations. No equipment needed.",
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
    title: "Quick Cardio Boxing",
    subtitle: "Fast-paced fitness boxing",
    description:
      "A high-energy boxing cardio session that'll get your heart pumping. No equipment needed - just you and your determination.",
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

  // === PAID WORKOUTS ===
  {
    id: "power-punching",
    title: "Power Punching",
    subtitle: "Hooks, uppercuts & power combos",
    description:
      "Develop devastating power in all your punches. This workout focuses on proper mechanics for maximum impact on the heavy bag.",
    level: "intermediate",
    goal: "power",
    durationMin: 35,
    equipment: ["Heavy bag"],
    isFree: false,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 60,
        title: "Shadow Boxing Warm Up",
        instructions: "Light shadow boxing. All punches. Focus on rotation and footwork.",
        tips: ["Loosen up your hips", "Warm up your shoulders with arm circles"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Power Jab-Cross",
        instructions:
          "Heavy 1-2s on the bag. Sit down on every punch. Full hip rotation on the cross.",
        combos: ["1-2 (Power Jab-Cross)"],
        tips: ["Drive off your back foot", "Exhale sharply on impact"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Lead Hook",
        instructions:
          "Practice the lead hook on the bag. Pivot your lead foot, rotate your torso. Short and tight.",
        combos: ["3 (Lead Hook)", "1-2-3 (Jab-Cross-Hook)"],
        tips: [
          "Elbow stays at 90 degrees",
          "Turn your whole body, not just your arm",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Rear Uppercut",
        instructions:
          "Practice the rear uppercut. Dip slightly, drive upward from your legs. Short range punch.",
        combos: ["6 (Rear Uppercut)", "1-2-6 (Jab-Cross-Uppercut)"],
        tips: ["Bend your knees before the uppercut", "Palm faces you on the uppercut"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Power Combos",
        instructions:
          "Big combinations with power on every shot. Take your time between combos - quality over quantity.",
        combos: ["1-2-3-2 (Jab-Cross-Hook-Cross)", "1-6-3-2 (Jab-Uppercut-Hook-Cross)"],
        tips: ["Each punch should have bad intentions", "Reset fully between combos"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Body Shots",
        instructions:
          "All punches to the body. Bend your knees to get low. Hooks and uppercuts to the body area of the bag.",
        combos: ["3-body (Body Hook)", "6-body (Body Uppercut)"],
        tips: ["Level change with your legs, not your back", "Dig into the bag"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Power Finisher",
        instructions:
          "Last round! Throw your hardest combos. Leave everything on the bag.",
        combos: [
          "1-2-3-2 (Jab-Cross-Hook-Cross)",
          "1-2-5-2 (Jab-Cross-Uppercut-Cross)",
        ],
        tips: ["Final push - give it everything!", "Stay controlled even when tired"],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down",
        instructions: "Light shadow boxing, then stretch. Focus on shoulders, hips, and wrists.",
        tips: ["Shake out your hands", "Hydrate and recover"],
      },
    ],
  },
  {
    id: "speed-precision",
    title: "Speed & Precision",
    subtitle: "Fast combos & accuracy drills",
    description:
      "Sharpen your hand speed and accuracy. Quick combinations with emphasis on clean technique at high speed.",
    level: "intermediate",
    goal: "speed",
    durationMin: 30,
    equipment: ["Heavy bag"],
    isFree: false,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 30,
        title: "Speed Warm Up",
        instructions:
          "Fast shadow boxing. Quick jabs, fast feet. Build up your speed gradually.",
        tips: ["Stay light on your feet", "Relax your shoulders"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Speed Jabs",
        instructions:
          "Rapid-fire jabs on the bag. Focus on snap and retraction. The fastest jab is the one that comes back quickest.",
        combos: ["1-1-1 (Triple Jab)"],
        tips: ["Speed is relaxation", "Snap the punch back to your chin"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Fast 1-2s",
        instructions:
          "Quick 1-2 combos. Touch and go. Throw the combo and immediately reset. Repeat.",
        combos: ["1-2 (Fast Jab-Cross)"],
        tips: ["Think 'touch' not 'hit'", "Stay balanced at speed"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "3-Punch Speed Combos",
        instructions:
          "Fast 3-punch combinations. Let the punches flow together. Hands stay near your face between combos.",
        combos: ["1-2-3 (Jab-Cross-Hook)", "1-2-1 (Jab-Cross-Jab)"],
        tips: ["Chain the punches - no pauses", "Pop pop pop rhythm"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Speed Bursts",
        instructions:
          "30 seconds moderate pace, 30 seconds MAX SPEED. Alternate. Fast hands, fast feet.",
        combos: ["1-2 (Jab-Cross)", "1-1-2 (Double Jab-Cross)"],
        tips: ["Explode on the fast intervals", "Recover during moderate pace"],
      },
      {
        type: "conditioning",
        durationSec: 120,
        restSec: 30,
        title: "Speed Challenge",
        instructions:
          "How many clean 1-2s can you throw in 2 minutes? Count them. Every punch must be crisp.",
        combos: ["1-2 (Jab-Cross)"],
        tips: ["Quality at speed - don't get sloppy", "This is your test - give it everything"],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down",
        instructions:
          "Slow shadow boxing, then stretch. Focus on wrist and shoulder mobility.",
        tips: ["Roll your wrists", "Deep breathing"],
      },
    ],
  },
  {
    id: "defensive-boxing",
    title: "Defensive Boxing",
    subtitle: "Slips, rolls & counter-punching",
    description:
      "The best offense is a good defense. Learn to slip, roll, and counter-punch. Pure shadow boxing - no equipment needed.",
    level: "intermediate",
    goal: "technique",
    durationMin: 30,
    equipment: [],
    isFree: false,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 30,
        title: "Warm Up & Movement",
        instructions:
          "Light shadow boxing with emphasis on head movement. Slip left, slip right, roll under. Get your body moving.",
        tips: ["Bend at the knees and waist to slip", "Keep your eyes forward"],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 30,
        title: "Slipping Drill",
        instructions:
          "Practice slipping: imagine a jab coming, slip your head to the outside. Alternate sides. Slip left, reset, slip right, reset.",
        tips: [
          "Slip by bending at the waist",
          "Move your head just enough to avoid the punch",
          "Keep your hands up while slipping",
        ],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 30,
        title: "Rolling Under",
        instructions:
          "Practice the roll (bob and weave): bend your knees, dip under an imaginary hook, come up on the other side.",
        tips: [
          "U-shape motion with your body",
          "Drive back up with your legs",
          "Stay compact",
        ],
      },
      {
        type: "technique",
        durationSec: 180,
        restSec: 45,
        title: "Slip & Counter",
        instructions:
          "Slip the imaginary jab, then immediately counter with your cross. Slip outside, throw the 2.",
        combos: ["Slip - 2 (Slip-Counter Cross)"],
        tips: [
          "Counter while your opponent is extended",
          "The slip creates the angle for the counter",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Defensive Combos",
        instructions:
          "Throw a combo, then immediately defend. 1-2, slip-slip. 1-2-3, roll under. Offense to defense flow.",
        combos: [
          "1-2, Slip-Slip",
          "1-2-3, Roll",
          "1-2, Roll, 3-2 (Counter combo)",
        ],
        tips: ["Defense should be automatic after attacking", "Don't admire your work - move!"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Counter-Punching Flow",
        instructions:
          "Slip, roll, and counter in flowing combinations. Imagine an aggressive opponent - make them miss and make them pay.",
        combos: [
          "Slip - 2-3 (Counter Cross-Hook)",
          "Roll - 3-2 (Hook-Cross counter)",
          "Slip - 6-3-2 (Uppercut-Hook-Cross)",
        ],
        tips: ["Stay calm and let them come to you", "Counter with authority"],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down",
        instructions:
          "Light movement and stretching. Focus on your neck, shoulders, and lower back.",
        tips: ["Gently stretch your neck", "Great defensive work today!"],
      },
    ],
  },
  {
    id: "body-shot-specialist",
    title: "Body Shot Specialist",
    subtitle: "Body targeting techniques",
    description:
      "Master the art of body punching. Learn to dig hooks and uppercuts to the body on the heavy bag.",
    level: "intermediate",
    goal: "technique",
    durationMin: 30,
    equipment: ["Heavy bag"],
    isFree: false,
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
        combos: ["1-body (Body Jab)"],
        tips: ["Level change with your legs", "Keep your head off the center line"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Head-Body Combo",
        instructions:
          "Jab to the head, cross to the body. Change levels between punches.",
        combos: ["1-head, 2-body (Jab Head, Cross Body)"],
        tips: ["The head shot sets up the body shot", "Disguise your body attack"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 45,
        title: "Body Hook",
        instructions:
          "Lead hook to the body. Get low, dig the hook in with a tight arm. Pivot and drive through.",
        combos: ["1-2, 3-body (Jab-Cross, Body Hook)"],
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
          "3-body, 3-head (Body Hook, Head Hook)",
          "1-2, 3-body, 3-head",
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
          "1-2, 3-body, 2-head",
          "1-body, 6-body, 3-head",
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
  {
    id: "advanced-combo-flow",
    title: "Advanced Combo Flow",
    subtitle: "Complex 6-8 punch combos",
    description:
      "Long, flowing combinations that build hand speed, coordination, and fight IQ. For experienced boxers ready to level up their offense.",
    level: "advanced",
    goal: "general",
    durationMin: 40,
    equipment: ["Heavy bag"],
    isFree: false,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 60,
        title: "Technical Warm Up",
        instructions:
          "Shadow boxing with 3-4 punch combos. All punches. Focus on smooth transitions between punches.",
        tips: ["Flow between punches", "Emphasize rotation"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "6-Punch Combo 1",
        instructions:
          "Jab-Cross-Hook-Cross-Hook-Cross. The classic long combo. Build speed gradually.",
        combos: ["1-2-3-2-3-2 (Jab-Cross-Hook-Cross-Hook-Cross)"],
        tips: ["Start slow, build speed", "Don't sacrifice form for speed"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "6-Punch Combo 2",
        instructions:
          "Jab-Jab-Cross-Uppercut-Hook-Cross. Mix punch types for variety.",
        combos: ["1-1-2-6-3-2 (Jab-Jab-Cross-Uppercut-Hook-Cross)"],
        tips: ["The uppercut creates the opening for the hook", "Flow don't force"],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "8-Punch Flow",
        instructions:
          "Double jab-Cross-Lead Hook-Cross-Lead Uppercut-Cross-Lead Hook-Cross. The ultimate flow combo.",
        combos: ["1-1-2-3-2-5-2-3 (Full 8-punch combination)"],
        tips: [
          "Break it into pairs: 1-1, 2-3, 2-5, 2-3",
          "Each punch sets up the next",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Body-Head Flows",
        instructions:
          "Long combos mixing levels: Jab-Cross-Body Hook-Head Hook-Cross-Body Uppercut-Head Hook.",
        combos: ["1-2-3body-3head-2-6body-3head"],
        tips: [
          "Smooth level changes",
          "The body shots slow them down, the head shots finish",
        ],
      },
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 60,
        title: "Creative Combos",
        instructions:
          "Build your own 6-8 punch combos. Start each combo differently. Mix all punch types and levels.",
        tips: [
          "Start combos with different punches",
          "End every combo with a strong shot",
          "Move after each combo",
        ],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Rapid Fire Round",
        instructions:
          "Non-stop long combos. Pick any combination and keep them flowing. Don't stop punching.",
        tips: ["This is cardio and technique combined", "Push through the fatigue"],
      },
      {
        type: "cooldown",
        durationSec: 120,
        restSec: 0,
        title: "Cool Down",
        instructions:
          "Active recovery with light shadow boxing and full body stretch.",
        tips: ["Replay the combos slowly in your mind", "Stretch everything"],
      },
    ],
  },
  {
    id: "fight-conditioning",
    title: "Fight Conditioning",
    subtitle: "High-intensity training",
    description:
      "A brutal conditioning session that simulates fight-pace intensity. Not for the faint of heart. Build the cardio of a fighter.",
    level: "advanced",
    goal: "conditioning",
    durationMin: 45,
    equipment: ["Heavy bag", "Jump rope"],
    isFree: false,
    rounds: [
      {
        type: "warmup",
        durationSec: 180,
        restSec: 30,
        title: "Jump Rope Warm Up",
        instructions:
          "3 minutes of jump rope. Start with basic bounce, mix in double-unders and high knees.",
        tips: ["Stay on the balls of your feet", "Wrists, not arms"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Bag Intervals",
        instructions:
          "20 seconds all-out on the bag, 10 seconds rest. Repeat for 3 minutes. Max effort punches.",
        combos: ["All punches - max speed"],
        tips: ["TRUE max effort on work intervals", "Active recovery in rest"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Jump Rope Round 2",
        instructions:
          "3 minutes. Every 30 seconds, do 10 high knees. Push the pace.",
        tips: ["Don't trip on the transitions", "Keep a steady rhythm"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Heavy Bag Power Round",
        instructions:
          "Hardest shots you can throw for 3 minutes. Every punch should shake the bag. Take 3-5 seconds between combos.",
        combos: ["1-2-3-2 Power combos", "3-body, 3-head"],
        tips: ["SIT DOWN on every punch", "Breathe out forcefully"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Bodyweight Burnout",
        instructions:
          "10 push-ups, 10 squats, 10 burpees. Then fast shadow boxing until the round ends. Repeat if time allows.",
        tips: ["Modify push-ups if needed", "Keep moving - no standing still"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Speed Bag Simulation",
        instructions:
          "Non-stop straight punches on the heavy bag. Light, fast, continuous. Don't stop your hands.",
        tips: ["Think speed, not power", "This is pure cardio"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Combo Sprints",
        instructions:
          "Throw a 4-punch combo, then immediately throw 20 fast jabs. Reset. Repeat.",
        combos: ["1-2-3-2, then 20 fast jabs"],
        tips: ["The jabs are the sprint portion", "Don't slow down on the jabs"],
      },
      {
        type: "conditioning",
        durationSec: 180,
        restSec: 30,
        title: "Championship Round",
        instructions:
          "Last round! 3 minutes all-out. Everything you've got. Combos, power shots, speed - empty the tank.",
        tips: [
          "This is where champions are made",
          "You can do ANYTHING for 3 minutes",
        ],
      },
      {
        type: "cooldown",
        durationSec: 180,
        restSec: 0,
        title: "Cool Down",
        instructions:
          "Walk it out. Deep breathing. Full body stretch - hold each stretch for 30 seconds.",
        tips: ["You earned this rest", "Hydrate immediately"],
      },
    ],
  },
  {
    id: "counter-punching-workshop",
    title: "Counter-Punching Workshop",
    subtitle: "Defensive counters mastery",
    description:
      "Advanced defensive techniques and counter-punching combinations. Learn to make your opponent pay for every punch they throw.",
    level: "advanced",
    goal: "technique",
    durationMin: 35,
    equipment: [],
    isFree: false,
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
        combos: ["Pull-back, 2 (Pull Counter Cross)"],
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
          "Slip outside - 2 (Cross counter)",
          "Slip outside - 2-3 (Cross-Hook counter)",
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
          "Roll - 3 (Lead Hook counter)",
          "Roll - 3-2 (Hook-Cross counter)",
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
          "Catch - 2-3 (Cross-Hook)",
          "Catch - 2-3-2 (Cross-Hook-Cross)",
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
          "Slip - 2-3-2 (Counter combo)",
          "Roll - 3-2-3 (Hook-Cross-Hook)",
          "Pull - 2-3-2 (Cross-Hook-Cross)",
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
    title: "Full Camp Round",
    subtitle: "Complete training session",
    description:
      "A comprehensive training session that covers everything: warm up, technique, bag work, conditioning, and cool down. The ultimate boxing workout.",
    level: "advanced",
    goal: "general",
    durationMin: 50,
    equipment: ["Heavy bag", "Jump rope"],
    isFree: false,
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
  // === CUSTOM: ANH'S HEAVY BAG SESSION ===
  {
    id: "anhs-heavy-bag",
    title: "Anh's Heavy Bag Session",
    subtitle: "10 rounds · progressive combos",
    description:
      "Full heavy bag session: build from singles to complex combos, with a double burnout finisher. 3-minute rounds, 90-second rest.",
    level: "advanced",
    goal: "general",
    durationMin: 43,
    equipment: ["Heavy bag"],
    isFree: true,
    rounds: [
      // Round 1: Singles only - jabs and crosses
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Singles: Jab & Cross",
        instructions:
          "Single shots only. Focus on snapping the jab and sitting down on the cross. Every punch returns to guard.",
        combos: ["1 (Jab)", "2 (Cross)"],
        tips: [
          "Pop the jab. Fast out, fast back",
          "Rotate your hips fully on the cross",
          "Move your feet between shots",
        ],
      },
      // Round 2: Power hooks & uppercuts - max 2-punch combos
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Power Hooks & Uppercuts",
        instructions:
          "Hooks and uppercuts only. Throw singles or doubles max. Sit down on every shot. This is a power round.",
        combos: ["3 (Lead Hook)", "4 (Rear Hook)", "5 (Lead Uppercut)", "6 (Rear Uppercut)", "3-4 (Hook-Hook)", "5-6 (Uppercut-Uppercut)"],
        tips: [
          "Turn your whole body into the hook",
          "Short, tight arc. Don't wind up",
          "Uppercuts drive upward from the legs",
        ],
      },
      // Round 3: Freeform - 3-punch combos
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Building Combos",
        instructions:
          "Start linking punches. 3-punch combos mixing straights and hooks. Find your rhythm on the bag.",
        combos: ["1-2-3 (Jab-Cross-Hook)", "1-1-2 (Jab-Jab-Cross)", "2-3-2 (Cross-Hook-Cross)"],
        tips: [
          "Every combo starts with a jab or a feint",
          "Snap the last punch. Don't let it die",
        ],
      },
      // Round 4: Freeform - adding body work
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Head & Body",
        instructions:
          "Mix levels. Go upstairs and downstairs. Dig to the body then come back up top.",
        combos: ["1-2-3body (Jab-Cross-Body Hook)", "1-2body-3 (Jab-Body Cross-Hook)", "1-2-5body-2 (Jab-Cross-Body Uppercut-Cross)"],
        tips: [
          "Bend your knees to go to the body. Don't just lean",
          "Come back upstairs with authority",
        ],
      },
      // Round 5: Freeform - 4-punch combos with defense
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "4-Punch Combinations",
        instructions:
          "Longer combos now. Throw 4-punch sequences and move. Slip after your combo like someone's firing back.",
        combos: ["1-2-3-2 (Jab-Cross-Hook-Cross)", "1-2-5-2 (Jab-Cross-Uppercut-Cross)", "1-1-2-3 (Jab-Jab-Cross-Hook)"],
        tips: [
          "Stay balanced through all 4 punches",
          "Slip or roll after every combo",
        ],
      },
      // Round 6: Freeform - mixing everything, 4-5 punch
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Full Arsenal",
        instructions:
          "Everything is on the table. Long combos, body shots, uppercuts, hooks. Work the bag like a real opponent.",
        combos: ["1-2-3-4-2 (Jab-Cross-Hook-Hook-Cross)", "1-2-3body-2-3 (Jab-Cross-Body Hook-Cross-Hook)", "1-6-3-2 (Jab-Rear Uppercut-Hook-Cross)"],
        tips: [
          "Punch in bunches then reset",
          "Throw combos from different angles",
        ],
      },
      // Round 7: Freeform - hardest combos, 5-6 punch
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 90,
        title: "Championship Round",
        instructions:
          "Dig deep. Long combinations with power on every shot. Move your head between combos. Fight like it's the last round.",
        combos: ["1-2-3-2-1-2 (Jab-Cross-Hook-Cross-Jab-Cross)", "1-2-5body-2-3-2 (Jab-Cross-Body Uppercut-Cross-Hook-Cross)", "1-1-2-3-4-2 (Jab-Jab-Cross-Hook-Hook-Cross)"],
        tips: [
          "Don't slow down. Empty the tank",
          "Snap every punch, even when tired",
        ],
      },
      // Round 8: Burnout - 1:30 jab-cross, 20s rest, 1:30 body hooks
      {
        type: "conditioning",
        durationSec: 90,
        restSec: 20,
        title: "Burnout: Jab-Cross",
        instructions:
          "Non-stop jab-cross for 90 seconds. Don't stop. Short, fast punches. Breathe through it.",
        combos: ["1-2 (Jab-Cross)"],
        tips: [
          "Short punches. Don't overextend",
          "Exhale on every punch",
          "Your arms will burn. Keep going",
        ],
      },
      // Round 9: Burnout part 2
      {
        type: "conditioning",
        durationSec: 90,
        restSec: 90,
        title: "Burnout: Body Hooks",
        instructions:
          "Non-stop body hooks for 90 seconds. Alternate left and right. Dig deep and rip to the body.",
        combos: ["3body-4body (Body Hook-Body Hook)"],
        tips: [
          "Stay low, bend your knees",
          "Turn into every hook",
          "This is the hardest part. Don't quit",
        ],
      },
      // Round 10: Closer
      {
        type: "bagwork",
        durationSec: 180,
        restSec: 0,
        title: "Victory Lap",
        instructions:
          "Last round. You survived the burnout. Move and pick your shots. Throw what feels good. Leave it all on the bag.",
        combos: ["1-2-3 (Jab-Cross-Hook)", "1-2-3-2 (Jab-Cross-Hook-Cross)", "1-2-5-2-3 (Jab-Cross-Uppercut-Cross-Hook)"],
        tips: [
          "Compose yourself. Clean technique to finish",
          "End the last 30 seconds with everything you've got",
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
