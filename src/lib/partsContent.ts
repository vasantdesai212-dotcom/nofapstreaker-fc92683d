export interface PartContent {
  part_id: string;
  day_index: number;
  title: string;
  short_tooltip: string;
  description: string;
  technical_summary: string[];
  motivation: string;
  micro_task: string;
  ui_hint: string;
  image_tag: string;
  estimated_words: number;
  tags: string[];
  notes_for_dev?: string;
}

export const PARTS_CONTENT: PartContent[] = [
  {
    part_id: "p01",
    day_index: 1,
    title: "Main Chassis",
    short_tooltip: "The chassis is the car's structural foundation — your streak builds the frame.",
    description: "The chassis is the car's skeleton: it holds the engine, suspension and body together. Completing this part early means you've started a stable foundation — the habit framework that future wins attach to. Without a solid frame, other parts won't function well.",
    technical_summary: [
      "Primary load-bearing structure for vehicle components",
      "Defines mounting points for engine, suspension, and body",
      "Critical for crash safety and overall rigidity"
    ],
    motivation: "Day 1: You built the foundation. Keep the frame solid — one day at a time.",
    micro_task: "Write 1 line: why you started this streak.",
    ui_hint: "Chassis — Why it matters",
    image_tag: "main_chassis",
    estimated_words: 60,
    tags: ["core", "structure"],
    notes_for_dev: "Keep tooltip short for small screens; description used in modal."
  },
  {
    part_id: "p02",
    day_index: 2,
    title: "Subframe",
    short_tooltip: "The subframe isolates vibrations — your second day absorbs the initial shock.",
    description: "The subframe bolts to the chassis and carries the engine and suspension loads while dampening road vibrations. Day two is where the initial adrenaline fades and real discipline starts. This part proves the foundation isn't a fluke — it's becoming a structure.",
    technical_summary: [
      "Bolted sub-assembly that isolates drivetrain vibrations",
      "Supports engine weight and front suspension geometry",
      "Allows modular removal for service access"
    ],
    motivation: "Day 2 done. The novelty's gone — now it's just you and the commitment.",
    micro_task: "Set a phone reminder for your hardest hour tomorrow.",
    ui_hint: "Subframe — Building stability",
    image_tag: "subframe",
    estimated_words: 55,
    tags: ["core", "structure"],
    notes_for_dev: "Pair visually with chassis; same category icon."
  },
  {
    part_id: "p03",
    day_index: 3,
    title: "Engine Mount",
    short_tooltip: "Engine mounts anchor your power source — three days means the habit is anchored.",
    description: "Engine mounts secure the power unit to the chassis, absorbing torque and vibration so the car runs smoothly. Three consecutive days create the first real neural pathway reinforcement. The mount is small but without it, everything rattles apart under load.",
    technical_summary: [
      "Rubber-metal hybrid absorbs engine torque reaction",
      "Prevents drivetrain movement under acceleration",
      "Failure causes excessive vibration and component wear"
    ],
    motivation: "Three days anchored. Small part, massive consequence if it's missing.",
    micro_task: "Delete one app or bookmark that triggers you.",
    ui_hint: "Engine Mount — Anchoring power",
    image_tag: "engine_mount",
    estimated_words: 55,
    tags: ["core", "structure"]
  },
  {
    part_id: "p04",
    day_index: 4,
    title: "Engine Block",
    short_tooltip: "The block is where combustion happens — day four ignites real momentum.",
    description: "The engine block is the heart of the car: a cast-iron or aluminum housing where fuel ignites and pistons fire. Day four marks the shift from 'trying' to 'doing.' You're past the easy part. Now the real engine of discipline starts generating power.",
    technical_summary: [
      "Houses cylinders, coolant passages, and oil galleries",
      "Cast from aluminum alloy or iron for thermal management",
      "All rotating assembly components mount inside the block"
    ],
    motivation: "Four days in. The engine is cast — now keep firing.",
    micro_task: "Do 20 pushups right now. Burn the restless energy.",
    ui_hint: "Engine Block — Raw power",
    image_tag: "engine_block",
    estimated_words: 58,
    tags: ["power", "engine"]
  },
  {
    part_id: "p05",
    day_index: 5,
    title: "Pistons",
    short_tooltip: "Pistons convert pressure to motion — day five converts intention to rhythm.",
    description: "Pistons move up and down inside the cylinders, converting explosive combustion pressure into rotational force. Five days means you're developing a rhythm. Each day is a stroke in the cycle — intake, compress, power, exhaust. Miss one and the engine stalls.",
    technical_summary: [
      "Reciprocating components converting gas pressure to linear motion",
      "Forged aluminum for strength-to-weight ratio",
      "Piston rings seal combustion gases and manage oil"
    ],
    motivation: "Five strokes complete. The rhythm is forming — don't break the cycle.",
    micro_task: "Take a cold shower for 60 seconds. Build discomfort tolerance.",
    ui_hint: "Pistons — Finding rhythm",
    image_tag: "pistons",
    estimated_words: 55,
    tags: ["power", "engine"]
  },
  {
    part_id: "p06",
    day_index: 6,
    title: "Crankshaft",
    short_tooltip: "The crankshaft turns linear force into rotation — day six turns effort into habit.",
    description: "The crankshaft converts the pistons' up-and-down motion into smooth rotational power that drives the wheels. Day six is where raw willpower starts becoming a repeatable pattern. The crank is forged under extreme pressure — just like your resolve right now.",
    technical_summary: [
      "Converts reciprocating piston motion to rotational output",
      "Forged steel, precision-balanced for high RPM operation",
      "Counterweights reduce vibration at operating speeds"
    ],
    motivation: "Six days forged. Your effort is turning into something that moves.",
    micro_task: "Journal one urge you resisted today and how.",
    ui_hint: "Crankshaft — Turning effort",
    image_tag: "crankshaft",
    estimated_words: 56,
    tags: ["power", "engine"]
  },
  {
    part_id: "p07",
    day_index: 7,
    title: "Turbo / Supercharger",
    short_tooltip: "Forced induction multiplies power — one week multiplies your momentum.",
    description: "A turbocharger or supercharger forces extra air into the engine, dramatically increasing power output. One full week is a serious milestone. The boost isn't just incremental — it compounds. You're running on forced induction now: same effort, bigger results.",
    technical_summary: [
      "Compresses intake air for increased combustion efficiency",
      "Turbo uses exhaust gas; supercharger is belt-driven",
      "Intercooler prevents detonation from excessive heat"
    ],
    motivation: "Week one: boosted. Same you, significantly more capable.",
    micro_task: "Tell one trusted person you're on a 7-day streak.",
    ui_hint: "Forced Induction — One week",
    image_tag: "turbo",
    estimated_words: 55,
    tags: ["power", "engine"]
  },
  {
    part_id: "p08",
    day_index: 8,
    title: "Exhaust Headers",
    short_tooltip: "Headers expel waste gases efficiently — day eight clears out old patterns.",
    description: "Exhaust headers channel spent combustion gases away from the engine quickly and efficiently, improving power and preventing backpressure. By day eight, you're learning to let go of old triggers and mental junk. Clearing the exhaust means the engine breathes clean.",
    technical_summary: [
      "Tubular manifold optimized for exhaust gas flow",
      "Equal-length design reduces cylinder back-pressure",
      "Connects to catalytic converter and exhaust system"
    ],
    motivation: "Eight days: the waste is clearing out. Breathe easier.",
    micro_task: "Unfollow one social media account that doesn't serve you.",
    ui_hint: "Headers — Clearing waste",
    image_tag: "exhaust_headers",
    estimated_words: 55,
    tags: ["power", "engine"]
  },
  {
    part_id: "p09",
    day_index: 9,
    title: "Gearbox Housing",
    short_tooltip: "The gearbox housing protects the gears — day nine protects your progress.",
    description: "The gearbox housing encases all transmission gears, bearings, and shafts in a sealed unit filled with lubricant. Day nine is about containment: you've built real momentum and now you need structure to protect it. The housing keeps everything aligned under stress.",
    technical_summary: [
      "Cast aluminum or magnesium alloy enclosure",
      "Maintains gear alignment under high torque loads",
      "Sealed environment for transmission fluid retention"
    ],
    motivation: "Nine days contained. Protect what you've built — structure matters.",
    micro_task: "Identify your top trigger time today and plan around it.",
    ui_hint: "Gearbox — Protecting gains",
    image_tag: "gearbox_housing",
    estimated_words: 55,
    tags: ["drivetrain", "transmission"]
  },
  {
    part_id: "p10",
    day_index: 10,
    title: "Gear Set",
    short_tooltip: "Gears multiply torque at different speeds — day ten shifts your approach up.",
    description: "The gear set consists of precisely machined cogs that multiply engine torque at various speeds. At day ten, you're learning to shift: some days need low-gear grinding, others call for high-gear cruising. Flexibility in approach while maintaining the streak is key.",
    technical_summary: [
      "Helical or straight-cut gears for torque multiplication",
      "Synchromesh rings enable smooth gear engagement",
      "Gear ratios optimized for acceleration and top speed"
    ],
    motivation: "Ten days. You're learning when to grind and when to cruise.",
    micro_task: "Read one article about dopamine and habit loops.",
    ui_hint: "Gear Set — Shifting up",
    image_tag: "gear_set",
    estimated_words: 55,
    tags: ["drivetrain", "transmission"]
  },
  {
    part_id: "p11",
    day_index: 11,
    title: "Clutch Assembly",
    short_tooltip: "The clutch connects and disconnects power — day eleven is about conscious control.",
    description: "The clutch assembly lets the driver connect or disconnect the engine from the gearbox smoothly. Day eleven is about conscious engagement: you choose when to apply effort and when to disengage from temptation. Mastering the clutch means mastering transitions.",
    technical_summary: [
      "Friction disc transfers engine torque to transmission input",
      "Pressure plate clamps disc against flywheel surface",
      "Release bearing disengages clutch when pedal is pressed"
    ],
    motivation: "Eleven days of choosing when to engage. That's control.",
    micro_task: "Practice 2 minutes of box breathing: 4 in, 4 hold, 4 out, 4 hold.",
    ui_hint: "Clutch — Conscious control",
    image_tag: "clutch_assembly",
    estimated_words: 52,
    tags: ["drivetrain", "transmission"]
  },
  {
    part_id: "p12",
    day_index: 12,
    title: "Driveshaft",
    short_tooltip: "The driveshaft transfers power to the axle — day twelve transfers intent to action.",
    description: "The driveshaft is a spinning tube that carries rotational force from the gearbox to the rear axle. Twelve days in, your intention has become a physical connection between thought and behavior. The shaft must be balanced — any wobble at speed causes failure.",
    technical_summary: [
      "Tubular steel or carbon fiber rotating shaft",
      "Universal joints accommodate suspension travel angles",
      "Precision-balanced to prevent vibration at high RPM"
    ],
    motivation: "Twelve days connected. Thought to action, no wobble.",
    micro_task: "Go for a 10-minute walk with no phone.",
    ui_hint: "Driveshaft — Steady transfer",
    image_tag: "driveshaft",
    estimated_words: 54,
    tags: ["drivetrain", "transmission"]
  },
  {
    part_id: "p13",
    day_index: 13,
    title: "Differential",
    short_tooltip: "The diff splits power to both wheels — day thirteen balances your life evenly.",
    description: "The differential splits torque between the drive wheels while allowing them to spin at different speeds in corners. Day thirteen is about balance: directing your energy across work, rest, and recovery without losing traction on any front. One wheel spinning wastes power.",
    technical_summary: [
      "Splits input torque between left and right drive wheels",
      "Allows speed difference during cornering maneuvers",
      "Limited-slip variants prevent single-wheel spin under load"
    ],
    motivation: "Thirteen days balanced. Split your energy, keep both wheels gripping.",
    micro_task: "Spend 5 minutes on a hobby you've neglected recently.",
    ui_hint: "Differential — Balanced power",
    image_tag: "differential",
    estimated_words: 56,
    tags: ["drivetrain", "transmission"]
  },
  {
    part_id: "p14",
    day_index: 14,
    title: "Front Coilovers",
    short_tooltip: "Front coilovers absorb impacts — two weeks means you handle bumps better.",
    description: "Front coilovers combine a spring and damper into one unit, absorbing road impacts and keeping the tires in contact with the surface. Two weeks in, you've learned to absorb daily stressors without losing composure. The suspension doesn't eliminate bumps — it manages them.",
    technical_summary: [
      "Combined coil spring and hydraulic damper unit",
      "Adjustable ride height and damping characteristics",
      "Maintains tire contact patch over uneven surfaces"
    ],
    motivation: "Two weeks. You don't avoid bumps anymore — you absorb them.",
    micro_task: "Name one stressor from today. Write how you handled it.",
    ui_hint: "Front Coilovers — Two weeks",
    image_tag: "front_coilovers",
    estimated_words: 55,
    tags: ["suspension", "milestone"]
  },
  {
    part_id: "p15",
    day_index: 15,
    title: "Rear Coilovers",
    short_tooltip: "Rear coilovers keep the back end planted — day fifteen keeps you grounded.",
    description: "Rear coilovers stabilize the back of the car during acceleration and cornering, preventing the tail from stepping out unexpectedly. Halfway to day thirty, stability at the rear means your progress is grounded. You're not just surviving the streak — you're stabilizing it.",
    technical_summary: [
      "Rear-mounted spring-damper for traction under acceleration",
      "Prevents axle hop and rear-end instability",
      "Tuned for weight transfer balance with front units"
    ],
    motivation: "Fifteen days grounded. The back end is planted — push harder.",
    micro_task: "Do a 5-minute stretch routine before bed tonight.",
    ui_hint: "Rear Coilovers — Staying planted",
    image_tag: "rear_coilovers",
    estimated_words: 54,
    tags: ["suspension"]
  },
  {
    part_id: "p16",
    day_index: 16,
    title: "Control Arms",
    short_tooltip: "Control arms guide wheel movement precisely — day sixteen refines your reactions.",
    description: "Control arms connect the wheel hubs to the chassis, guiding vertical wheel travel while maintaining alignment. At sixteen days, your reactions to triggers are becoming more refined — less panicked, more guided. The arms ensure the wheels go where you point them.",
    technical_summary: [
      "Forged aluminum links connecting hub to chassis",
      "Bushings allow controlled pivot movement",
      "Geometry defines camber, caster, and toe under load"
    ],
    motivation: "Sixteen days of guided response. You go where you aim now.",
    micro_task: "When an urge hits today, count to 30 before doing anything.",
    ui_hint: "Control Arms — Guided response",
    image_tag: "control_arms",
    estimated_words: 52,
    tags: ["suspension"]
  },
  {
    part_id: "p17",
    day_index: 17,
    title: "Front Brakes",
    short_tooltip: "Front brakes provide 70% of stopping power — day seventeen sharpens your ability to stop.",
    description: "Front brakes handle roughly seventy percent of the car's total braking force through large discs and multi-piston calipers. Seventeen days in, your ability to stop yourself — to say no at the critical moment — is your most valuable skill. Brakes save more than speed does.",
    technical_summary: [
      "Ventilated disc with multi-piston caliper for heat management",
      "Handles majority of braking force due to weight transfer",
      "Brake pads are consumable components requiring monitoring"
    ],
    motivation: "Seventeen days. Your ability to stop is stronger than any urge.",
    micro_task: "Identify one situation this week where you successfully said no.",
    ui_hint: "Front Brakes — Power to stop",
    image_tag: "front_brakes",
    estimated_words: 56,
    tags: ["suspension"]
  },
  {
    part_id: "p18",
    day_index: 18,
    title: "Rear Brakes",
    short_tooltip: "Rear brakes stabilize under braking — day eighteen adds backup to your defenses.",
    description: "Rear brakes provide supplementary stopping power and prevent the car from becoming unstable during hard braking. Day eighteen adds depth to your defense system. You have primary willpower and now you have backup mechanisms — routines, environment changes, accountability.",
    technical_summary: [
      "Smaller disc or drum assembly for rear axle braking",
      "Electronic brake distribution balances front-rear forces",
      "Parking brake mechanism integrated into rear assembly"
    ],
    motivation: "Eighteen days with backup systems. You're harder to stop now.",
    micro_task: "Tell someone your current streak count. Accountability is a brake.",
    ui_hint: "Rear Brakes — Backup defense",
    image_tag: "rear_brakes",
    estimated_words: 53,
    tags: ["suspension"]
  },
  {
    part_id: "p19",
    day_index: 19,
    title: "Front Left Wheel",
    short_tooltip: "First wheel on — day nineteen starts putting you on the road.",
    description: "The front left wheel is the first of four contact points with the ground. Nineteen days means your build is nearly road-ready. Each wheel represents a pillar of your new routine: physical health, mental clarity, productive time, and social connection. First pillar installed.",
    technical_summary: [
      "Forged aluminum alloy for strength and reduced mass",
      "Hub-centric mounting ensures concentricity at speed",
      "Lug pattern torqued to manufacturer specification"
    ],
    motivation: "Nineteen days. First wheel down — you're getting road-ready.",
    micro_task: "Do something physical for 10 minutes: walk, lift, stretch.",
    ui_hint: "Front Left — First contact",
    image_tag: "front_left_wheel",
    estimated_words: 55,
    tags: ["wheels"]
  },
  {
    part_id: "p20",
    day_index: 20,
    title: "Front Right Wheel",
    short_tooltip: "Second wheel on — day twenty doubles your stability.",
    description: "The front right wheel completes the front axle contact, dramatically improving directional stability. Twenty days is two-thirds of the way. With two wheels, the car can steer — you now have real direction in this process, not just willpower but purposeful navigation.",
    technical_summary: [
      "Matched specification to left wheel for balance",
      "Alignment set for optimal straight-line tracking",
      "Wheel bearing allows free rotation with minimal friction"
    ],
    motivation: "Twenty days. Two wheels turning — you can actually steer now.",
    micro_task: "Write down where you want to be at day 30.",
    ui_hint: "Front Right — Direction set",
    image_tag: "front_right_wheel",
    estimated_words: 52,
    tags: ["wheels"]
  },
  {
    part_id: "p21",
    day_index: 21,
    title: "Rear Left Wheel",
    short_tooltip: "Three weeks in, third wheel mounted — your traction is real now.",
    description: "The rear left wheel adds drive traction, allowing the car to put power to the ground. Twenty-one days is the commonly cited habit formation threshold. Whether that's precise science or not, three weeks of consistency is undeniably real progress. Traction is earned.",
    technical_summary: [
      "Drive wheel receiving torque from differential output",
      "Wider profile for improved traction under acceleration",
      "Tire compound selected for grip and longevity balance"
    ],
    motivation: "Three weeks. This is no longer an experiment — it's a habit.",
    micro_task: "Reflect: what's different about you compared to day one?",
    ui_hint: "Rear Left — Three weeks",
    image_tag: "rear_left_wheel",
    estimated_words: 54,
    tags: ["wheels", "milestone"]
  },
  {
    part_id: "p22",
    day_index: 22,
    title: "Rear Right Wheel",
    short_tooltip: "Fourth wheel on — the car is fully grounded now.",
    description: "The rear right wheel completes the set. All four corners are now in contact with the road — the car can roll under its own power. Day twenty-two means your rebuild is structurally complete and functional. Everything from here is refinement, not survival.",
    technical_summary: [
      "Final drive wheel completing four-point ground contact",
      "Full vehicle weight now distributed across all wheels",
      "Dynamic balance checked for vibration-free rolling"
    ],
    motivation: "Twenty-two days. All four wheels down. You're rolling.",
    micro_task: "Reward yourself with something healthy you enjoy. You earned it.",
    ui_hint: "Rear Right — Fully grounded",
    image_tag: "rear_right_wheel",
    estimated_words: 52,
    tags: ["wheels"]
  },
  {
    part_id: "p23",
    day_index: 23,
    title: "Tires",
    short_tooltip: "Tires are the only thing touching the road — grip is everything.",
    description: "Tires are the car's only contact with the road surface. Every force — acceleration, braking, turning — passes through a palm-sized contact patch on each tire. Day twenty-three: your grip on this new behavior is everything. The best engine means nothing without traction.",
    technical_summary: [
      "Rubber compound engineered for specific grip conditions",
      "Tread pattern channels water and provides mechanical grip",
      "Contact patch size determines maximum available traction"
    ],
    motivation: "Twenty-three days of grip. The rubber meets the road — literally.",
    micro_task: "Check your environment: remove one remaining trigger source.",
    ui_hint: "Tires — Grip is everything",
    image_tag: "tires",
    estimated_words: 56,
    tags: ["wheels"]
  },
  {
    part_id: "p24",
    day_index: 24,
    title: "Body Shell",
    short_tooltip: "The body shell defines the car's identity — day twenty-four shapes yours.",
    description: "The body shell is the car's outer skin, defining its shape, aerodynamics, and visual identity. By day twenty-four, your new identity is taking visible form. People around you may notice changes — better mood, sharper focus, more presence. The shell shows the world what's underneath.",
    technical_summary: [
      "Stamped steel or carbon fiber monocoque outer panels",
      "Defines aerodynamic profile and drag coefficient",
      "Provides pedestrian safety and occupant protection zones"
    ],
    motivation: "Twenty-four days. The outside is starting to match the inside.",
    micro_task: "Ask someone close if they've noticed any change in you.",
    ui_hint: "Body Shell — Visible change",
    image_tag: "body_shell",
    estimated_words: 58,
    tags: ["body"]
  },
  {
    part_id: "p25",
    day_index: 25,
    title: "Doors",
    short_tooltip: "Doors let you in and keep threats out — day twenty-five sets your boundaries.",
    description: "Doors provide access to the car's interior while sealing it from noise, weather, and intrusion. Twenty-five days means your personal boundaries are well-defined. You know what to let in and what to keep out. A car without doors is exposed; a person without boundaries is vulnerable.",
    technical_summary: [
      "Hinged panel with internal beam for side-impact protection",
      "Weatherstrip sealing prevents water and wind intrusion",
      "Latch mechanism with safety lock prevents accidental opening"
    ],
    motivation: "Twenty-five days of knowing what to let in and what to block.",
    micro_task: "Set one clear digital boundary: screen time limit or site blocker.",
    ui_hint: "Doors — Setting boundaries",
    image_tag: "doors",
    estimated_words: 57,
    tags: ["body"]
  },
  {
    part_id: "p26",
    day_index: 26,
    title: "Windshield",
    short_tooltip: "The windshield lets you see ahead clearly — day twenty-six brings clarity.",
    description: "The windshield provides clear forward visibility while protecting occupants from wind, debris, and the elements. Twenty-six days in, you're seeing further ahead than you could at the start. The mental fog that comes with compulsive behavior is lifting. Vision improves with discipline.",
    technical_summary: [
      "Laminated safety glass prevents shattering on impact",
      "UV-filtering layer protects interior and occupants",
      "Bonded to frame for structural rigidity contribution"
    ],
    motivation: "Twenty-six days. The fog is clearing — look how far you can see.",
    micro_task: "Set one goal for the next 30 days after this cycle ends.",
    ui_hint: "Windshield — Clear vision",
    image_tag: "windshield",
    estimated_words: 55,
    tags: ["body"]
  },
  {
    part_id: "p27",
    day_index: 27,
    title: "Side Windows",
    short_tooltip: "Side windows complete the cabin view — three days left, full awareness.",
    description: "Side windows provide peripheral visibility and cabin ventilation while maintaining the sealed environment. Day twenty-seven gives you full situational awareness — you can see threats approaching from the sides, not just straight ahead. Peripheral awareness prevents blindside relapses.",
    technical_summary: [
      "Tempered glass shatters into safe granular pieces",
      "Power regulation for controlled ventilation",
      "Tinted variants reduce glare and interior heat"
    ],
    motivation: "Twenty-seven days. Full peripheral awareness — no blind spots left.",
    micro_task: "Identify your three biggest remaining risk situations. Write them down.",
    ui_hint: "Side Glass — Full awareness",
    image_tag: "side_windows",
    estimated_words: 52,
    tags: ["body"]
  },
  {
    part_id: "p28",
    day_index: 28,
    title: "Rear Spoiler",
    short_tooltip: "The spoiler adds downforce at speed — day twenty-eight adds grip under pressure.",
    description: "A rear spoiler generates aerodynamic downforce, pressing the car onto the road at high speeds when grip matters most. Two days left — this is where the pressure peaks. The spoiler doesn't help at low speed; it activates exactly when the stakes are highest. Like your discipline now.",
    technical_summary: [
      "Generates vertical load from airflow at high velocity",
      "Increases rear tire grip during high-speed cornering",
      "Adjustable angle optimizes downforce-to-drag ratio"
    ],
    motivation: "Twenty-eight days. Maximum pressure, maximum grip. Hold the line.",
    micro_task: "Visualize crossing day 30. Hold that image for 60 seconds.",
    ui_hint: "Spoiler — Grip under pressure",
    image_tag: "rear_spoiler",
    estimated_words: 58,
    tags: ["aero"]
  },
  {
    part_id: "p29",
    day_index: 29,
    title: "Front Splitter",
    short_tooltip: "The front splitter cuts through the air — day twenty-nine cuts through resistance.",
    description: "The front splitter is a flat extension beneath the bumper that manages airflow under the car, creating front-end downforce and reducing lift. Day twenty-nine: one day remains. The splitter does its work invisibly underneath — just like the quiet discipline that got you here.",
    technical_summary: [
      "Flat plane redirecting airflow under the vehicle floor",
      "Creates low-pressure zone for front-axle downforce",
      "Carbon fiber or composite for lightweight rigidity"
    ],
    motivation: "Twenty-nine days. One left. The resistance is almost behind you.",
    micro_task: "Write tomorrow's schedule hour by hour. Leave no idle gaps.",
    ui_hint: "Splitter — Cutting through",
    image_tag: "front_splitter",
    estimated_words: 55,
    tags: ["aero"]
  },
  {
    part_id: "p30",
    day_index: 30,
    title: "Final Paint & Badges",
    short_tooltip: "Paint and badges complete the build — day thirty completes you.",
    description: "The final paint coat and manufacturer badges are applied last, transforming a collection of mechanical parts into a finished machine with an identity. Day thirty: you did it. Every part assembled, every day honored. This isn't the end — it's the first completed build. Start the next one.",
    technical_summary: [
      "Multi-layer paint: primer, base coat, clear coat, polish",
      "Manufacturer badges applied as final identity markers",
      "Full quality inspection before delivery sign-off"
    ],
    motivation: "Thirty days. The build is complete. You are the machine now.",
    micro_task: "Screenshot your completed car. Save it. Remember what you built.",
    ui_hint: "Final Paint — Build complete",
    image_tag: "final_paint",
    estimated_words: 58,
    tags: ["finish", "milestone"],
    notes_for_dev: "Trigger celebration animation on day 30 completion."
  }
];

export const getPartContent = (dayIndex: number): PartContent | undefined =>
  PARTS_CONTENT.find((p) => p.day_index === dayIndex);
