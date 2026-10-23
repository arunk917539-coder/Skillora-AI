export const CATEGORIES = [
  "Communication",
  "Teamwork",
  "Conflict Resolution",
  "Ethical Decision-Making",
  "Prioritization",
] as const;

export type CategoryType = (typeof CATEGORIES)[number];
export type DifficultyType = "Easy" | "Medium" | "Hard";
export type CompetencyKey = "communication" | "problemSolving" | "collaboration" | "accountability" | "planning";

export type RubricCriterion = {
  competency: CompetencyKey;
  description: string;
  strongEvidence: string[];
  weakSignals: string[];
};

export type WorkplaceScenario = {
  id: string;
  category: CategoryType;
  difficulty: DifficultyType;
  prompt: string;
  competencies: CompetencyKey[];
  rubric: RubricCriterion[];
  exampleStrongResponse: string;
  requiredConcepts: string[];
  acceptableAlternatives: string[];
  criticalErrors: string[];
};

export const STANDARD_RUBRICS: Record<CompetencyKey, { description: string; strongEvidence: string[]; weakSignals: string[] }> = {
  communication: {
    description: "Clear, structured, and empathetic communication adapted to stakeholders.",
    strongEvidence: ["Clarifies assumptions early", "Uses structured reasoning", "Communicates proactively with impacted parties"],
    weakSignals: ["Vague or ambiguous phrasing", "Fails to inform key stakeholders", "Aggressive or dismissive tone"],
  },
  problemSolving: {
    description: "Systematic root-cause analysis, balanced trade-off evaluation, and sound decision-making.",
    strongEvidence: ["Identifies underlying root causes", "Evaluates practical trade-offs", "Proposes realistic mitigation steps"],
    weakSignals: ["Treats symptoms only", "Ignores obvious operational risks", "Proposes impractical or unfeasible actions"],
  },
  collaboration: {
    description: "Cross-functional partnership, active listening, and constructive team alignment.",
    strongEvidence: ["Invites input from relevant peers", "Considers cross-functional impact", "Fosters psychological safety"],
    weakSignals: ["Works in an isolated silo", "Dismisses feedback from teammates", "Refuses to compromise on non-critical items"],
  },
  accountability: {
    description: "Ownership of outcomes, transparent escalation, ethical integrity, and follow-through.",
    strongEvidence: ["Takes personal ownership of deliverables", "Escalates blockers promptly and transparently", "Follows through with documentation"],
    weakSignals: ["Deflects blame to others", "Hides mistakes or delays", "Fails to establish clear ownership"],
  },
  planning: {
    description: "Structured prioritization, milestone scheduling, contingency planning, and resource management.",
    strongEvidence: ["Sequences actions logically", "Establishes concrete timelines and owners", "Includes contingency buffers"],
    weakSignals: ["No timeline or milestones", "Unrealistic scheduling", "Lacks risk mitigation plan"],
  },
};

export function rubricFor(keys: CompetencyKey[]): RubricCriterion[] {
  return keys.map((key) => ({
    competency: key,
    description: STANDARD_RUBRICS[key].description,
    strongEvidence: STANDARD_RUBRICS[key].strongEvidence,
    weakSignals: STANDARD_RUBRICS[key].weakSignals,
  }));
}

export const SCENARIOS: WorkplaceScenario[] = [
  // ==========================================
  // COMMUNICATION (9 scenarios: 3 Easy, 3 Medium, 3 Hard)
  // ==========================================
  {
    id: "comm-easy-1",
    category: "Communication",
    difficulty: "Easy",
    prompt: "A teammate misunderstood your written message regarding a report deadline, resulting in duplicate effort. How do you address this with them?",
    competencies: ["communication", "collaboration"],
    rubric: rubricFor(["communication", "collaboration"]),
    exampleStrongResponse: "I would reach out directly with a brief call or 1-on-1 meeting. I would take ownership for the ambiguous wording in my message, clarify the intended goals, and ask how we can best split or combine the work done so no effort is wasted.",
    requiredConcepts: ["Acknowledge ambiguity and take shared ownership", "Use direct 1-on-1 dialogue rather than email debate", "Align on combining or redistributing the work"],
    acceptableAlternatives: ["Propose a quick sync to review current draft", "Create a shared document with clear section ownership"],
    criticalErrors: ["Blaming the colleague publicly", "Ignoring the duplicated effort and discarding their work silently"],
  },
  {
    id: "comm-easy-2",
    category: "Communication",
    difficulty: "Easy",
    prompt: "You are handing off a critical project to a colleague while you take planned leave. How do you ensure a seamless transition?",
    competencies: ["communication", "planning"],
    rubric: rubricFor(["communication", "planning"]),
    exampleStrongResponse: "I would prepare a structured handover document outlining active deliverables, key stakeholder contacts, known risks, and upcoming deadlines. I would schedule a 30-minute walkthrough meeting before leaving to answer questions and designate a backup point of contact.",
    requiredConcepts: ["Structured handover document", "Live walkthrough meeting before departure", "Clear stakeholder contacts and escalation points"],
    acceptableAlternatives: ["Recorded video walkthrough of active tasks with ticket links", "Shared checklist reviewed with team lead"],
    criticalErrors: ["Leaving without documenting key logins or contacts", "Sending an unorganized list of links right before departure"],
  },
  {
    id: "comm-easy-3",
    category: "Communication",
    difficulty: "Easy",
    prompt: "A client submits a request with vague requirements and an urgent deadline. How do you respond to clarify expectations?",
    competencies: ["communication", "problemSolving"],
    rubric: rubricFor(["communication", "problemSolving"]),
    exampleStrongResponse: "I would thank the client for reaching out, acknowledge their timeline, and provide a concise list of 2–3 specific clarifying questions. I would offer a brief 10-minute discovery call to confirm scope and propose a prioritized minimal viable deliverable to meet their immediate deadline.",
    requiredConcepts: ["Acknowledge timeline empathetically", "Ask targeted clarifying questions", "Propose minimal viable scope or quick sync"],
    acceptableAlternatives: ["Share examples of previous solutions to narrow choices", "Provide tiered options based on delivery time"],
    criticalErrors: ["Guessing requirements without asking", "Refusing to assist until complete specs are provided"],
  },
  {
    id: "comm-med-1",
    category: "Communication",
    difficulty: "Medium",
    prompt: "A critical project deliverable will be delayed by two days due to unexpected dependencies. How do you communicate this to your team lead and key stakeholders?",
    competencies: ["communication", "accountability", "planning"],
    rubric: rubricFor(["communication", "accountability", "planning"]),
    exampleStrongResponse: "I would notify the project lead immediately before the deadline arrives. I would outline the specific dependency delay, provide the updated delivery date, and present a revised schedule with options to release non-dependent components early to minimize stakeholder disruption.",
    requiredConcepts: ["Early notification before deadline passes", "Transparent root cause without deflecting blame", "Revised schedule with concrete mitigation options"],
    acceptableAlternatives: ["Offer partial milestone delivery", "Reallocate temporary resources to unblock the dependency"],
    criticalErrors: ["Waiting until the deadline day to announce the delay", "Concealing the delay hoping to catch up over the weekend"],
  },
  {
    id: "comm-med-2",
    category: "Communication",
    difficulty: "Medium",
    prompt: "You notice a peer consistently dominates design reviews, cutting off quieter teammates before they finish speaking. How do you address this?",
    competencies: ["communication", "collaboration"],
    rubric: rubricFor(["communication", "collaboration"]),
    exampleStrongResponse: "During the meeting, I would gently intervene by saying, 'I want to make sure we hear the rest of Maya's thought before we move on.' Afterwards, in private, I would share constructive feedback emphasizing the value of creating room for all perspectives.",
    requiredConcepts: ["In-meeting gentle facilitation to bridge quieter colleagues", "Private, respectful 1-on-1 feedback", "Framing around overall team outcome and inclusive decision-making"],
    acceptableAlternatives: ["Adopting structured round-robin speaking formats", "Partnering with the meeting facilitator to set norms"],
    criticalErrors: ["Calling them out aggressively in public chat", "Ignoring the behavior and letting quieter team members disengage"],
  },
  {
    id: "comm-med-3",
    category: "Communication",
    difficulty: "Medium",
    prompt: "Two department heads give you contradictory instructions on the branding tone for an upcoming campaign. How do you resolve the mixed messaging?",
    competencies: ["communication", "problemSolving"],
    rubric: rubricFor(["communication", "problemSolving"]),
    exampleStrongResponse: "I would document both sets of requirements side by side with the trade-offs of each. I would then schedule a joint 15-minute alignment sync with both leaders, present the comparison constructively, and facilitate an agreed direction aligned with executive campaign goals.",
    requiredConcepts: ["Objective comparison of both requirements", "Joint alignment meeting rather than back-channel triangulation", "Decision criteria anchored in organizational objectives"],
    acceptableAlternatives: ["Propose a hybrid or tiered approach with user testing data", "Escalate to campaign executive sponsor if alignment stalls"],
    criticalErrors: ["Secretly picking one leader and ignoring the other", "Complaining about leadership dysfunction to colleagues"],
  },
  {
    id: "comm-hard-1",
    category: "Communication",
    difficulty: "Hard",
    prompt: "A severe data-sync outage affects enterprise customers during peak business hours. As the lead, how do you manage executive, customer-facing, and engineering communications simultaneously?",
    competencies: ["communication", "problemSolving", "accountability"],
    rubric: rubricFor(["communication", "problemSolving", "accountability"]),
    exampleStrongResponse: "I would immediately establish three synchronized communication cadences: an engineering bridge focused purely on remediation, regular internal bulletins every 30 minutes for support and sales teams with customer-safe talking points, and clear hourly executive briefings with ETA, impact blast-radius, and root cause mitigation.",
    requiredConcepts: ["Separation of remediation stream from broadcast communications", "Consistent, predictable update cadences", "Actionable talking points for frontline teams"],
    acceptableAlternatives: ["Designating a dedicated incident communications commander", "Public status page updates with verifiable milestones"],
    criticalErrors: ["Speculating on causes publicly before verification", "Going silent for multiple hours while troubleshooting"],
  },
  {
    id: "comm-hard-2",
    category: "Communication",
    difficulty: "Hard",
    prompt: "Senior leadership announces an unexpected organizational restructuring that merges your department with another, causing team anxiety. How do you communicate with your team?",
    competencies: ["communication", "collaboration", "accountability"],
    rubric: rubricFor(["communication", "collaboration", "accountability"]),
    exampleStrongResponse: "I would hold an immediate team huddle to share known facts transparently while openly acknowledging uncertainties. I would validate their concerns, establish recurring 1-on-1 check-ins, and gather unanswered questions to address with executive leadership, maintaining focus on immediate team stability.",
    requiredConcepts: ["Transparent distinction between confirmed facts and pending decisions", "Empathetic acknowledgment of anxieties", "Channeling feedback and questions to leadership"],
    acceptableAlternatives: ["Creating a live FAQ document for the team", "Partnering with HR to clarify transition timelines"],
    criticalErrors: ["Spreading unverified rumors or personal resentment", "Dismissing team concerns as overreactions"],
  },
  {
    id: "comm-hard-3",
    category: "Communication",
    difficulty: "Hard",
    prompt: "Two principal architects are deadlocked on a foundational database migration strategy, stalling the entire release train. How do you break the impasse?",
    competencies: ["communication", "problemSolving", "collaboration"],
    rubric: rubricFor(["communication", "problemSolving", "collaboration"]),
    exampleStrongResponse: "I would establish an objective evaluation framework based on measurable criteria: latency, operational cost, migration risk, and team familiarity. I would invite both architects to score both approaches collaboratively, run a time-boxed 2-day proof of concept on contested benchmarks, and agree upfront to abide by the empirical results.",
    requiredConcepts: ["Objective scoring matrix agreed in advance", "Time-boxed empirical prototype or proof-of-concept", "Alignment on business criteria rather than personal preference"],
    acceptableAlternatives: ["Independent technical peer review from an outside architect", "Phased pilot testing in staging"],
    criticalErrors: ["Allowing the deadlock to persist indefinitely", "Overruling unilaterally without technical justification"],
  },

  // ==========================================
  // TEAMWORK (9 scenarios: 3 Easy, 3 Medium, 3 Hard)
  // ==========================================
  {
    id: "team-easy-1",
    category: "Teamwork",
    difficulty: "Easy",
    prompt: "A teammate is visibly overwhelmed with high-volume urgent customer tickets while your queue is light. How do you offer assistance constructively?",
    competencies: ["collaboration", "accountability"],
    rubric: rubricFor(["collaboration", "accountability"]),
    exampleStrongResponse: "I would reach out privately to ask what specific subset of tickets I could take off their plate. I would confirm with our team lead that my current responsibilities are covered, and then proactively pick up 5–10 tickets to balance the workload.",
    requiredConcepts: ["Proactive, respectful offer of specific help", "Coordination with team queue or lead", "Follow-through on transferred tasks"],
    acceptableAlternatives: ["Pairing on complex tickets to resolve them faster", "Documenting reusable templates for common inquiries"],
    criticalErrors: ["Taking over without asking and causing confusion", "Ignoring their struggle because it is not your assigned queue"],
  },
  {
    id: "team-easy-2",
    category: "Teamwork",
    difficulty: "Easy",
    prompt: "A new junior team member joins your sprint and is hesitant to ask questions during standup. How do you support their integration?",
    competencies: ["collaboration", "communication"],
    rubric: rubricFor(["collaboration", "communication"]),
    exampleStrongResponse: "I would set up a welcoming 1-on-1 coffee chat, share how I ramped up when I joined, and encourage them to ping me anytime with questions. I would offer to pair-program on their first sprint ticket to build their confidence.",
    requiredConcepts: ["Creating psychological safety and low-friction communication", "Pair programming or buddy mentorship", "Validating that asking questions is encouraged"],
    acceptableAlternatives: ["Walk through team documentation and glossary together", "Normalize making mistakes during onboarding"],
    criticalErrors: ["Assuming their silence means they understand everything", "Leaving them completely isolated to figure out codebase on their own"],
  },
  {
    id: "team-easy-3",
    category: "Teamwork",
    difficulty: "Easy",
    prompt: "Your team completed a major milestone, and leadership publicly praises you for the outcome. Several teammates did equal work. How do you respond?",
    competencies: ["collaboration", "accountability"],
    rubric: rubricFor(["collaboration", "accountability"]),
    exampleStrongResponse: "I would publicly reply thanking leadership while immediately highlighting the specific contributions of my teammates by name. I would explain how the outcome was a collective achievement and ensure all contributors receive proper organizational visibility.",
    requiredConcepts: ["Publicly sharing credit with specific peers by name", "Emphasizing collective effort", "Ensuring equal visibility with leadership"],
    acceptableAlternatives: ["Sending a follow-up email to leaders detailing team contributions", "Nominating peers for internal recognition awards"],
    criticalErrors: ["Accepting full sole credit silently", "Downplaying teammates' efforts"],
  },
  {
    id: "team-1",
    category: "Teamwork",
    difficulty: "Medium",
    prompt: "A key cross-functional team member is consistently unresponsive on Slack, and their unmerged PR is blocking the sprint release. How do you handle this?",
    competencies: ["collaboration", "communication", "accountability"],
    rubric: rubricFor(["collaboration", "communication", "accountability"]),
    exampleStrongResponse: "I would first reach out via a quick direct message or audio huddle to ask if they are blocked or overloaded. If still unreachable, I would inform the sprint lead, review whether another qualified engineer can review the PR, and agree on a transparent contingency plan to safeguard the release.",
    requiredConcepts: ["Inquire empathetically before assuming bad faith", "Direct communication check followed by timely escalation", "Contingency plan to keep team release on track"],
    acceptableAlternatives: ["Pair with team tech lead to review branch", "Adjust sprint scope transparently with product owner"],
    criticalErrors: ["Venting publicly in open team channels", "Force-merging unapproved code without authorization"],
  },
  {
    id: "team-med-2",
    category: "Teamwork",
    difficulty: "Medium",
    prompt: "You are working toward your individual performance goal, but your team's joint sprint deliverable is falling behind. How do you balance priorities?",
    competencies: ["collaboration", "planning", "accountability"],
    rubric: rubricFor(["collaboration", "planning", "accountability"]),
    exampleStrongResponse: "I prioritize the collective team deliverable over personal non-urgent metrics. I would communicate transparently with my manager about the trade-off, pitch in to unblock the team sprint, and reschedule my individual research tasks for the following sprint.",
    requiredConcepts: ["Prioritizing collective team outcome over individual metrics", "Transparent communication with manager about trade-off", "Conscious realignment of personal task timeline"],
    acceptableAlternatives: ["Negotiating reduced scope on individual deliverables", "Focusing team contribution on high-impact bottlenecks"],
    criticalErrors: ["Ignoring team failure to polish personal goals", "Silently dropping individual commitments without manager visibility"],
  },
  {
    id: "team-med-3",
    category: "Teamwork",
    difficulty: "Medium",
    prompt: "Your project team is distributed across four timezones, leading to delayed code reviews and disconnected standups. How do you improve team cohesion?",
    competencies: ["collaboration", "planning", "communication"],
    rubric: rubricFor(["collaboration", "planning", "communication"]),
    exampleStrongResponse: "I would propose shifting our workflow to asynchronous-first: structured PR descriptions with screen recordings, clear handoff notes at end-of-day, and rotating any live meeting times so no single timezone always bears early or late hours.",
    requiredConcepts: ["Asynchronous-first practices and documentation", "Structured handoff protocols", "Equitable rotation of live meeting windows"],
    acceptableAlternatives: ["Designating overlapping core collaboration hours", "Adopting asynchronous daily check-in bots"],
    criticalErrors: ["Forcing one timezone to attend late-night calls permanently", "Relying on ad-hoc real-time chat for critical decisions"],
  },
  {
    id: "team-hard-1",
    category: "Teamwork",
    difficulty: "Hard",
    prompt: "Following a failed major product launch, team morale is fractured with blaming between QA and engineering. As a senior teammate, how do you rebuild trust?",
    competencies: ["collaboration", "communication", "accountability"],
    rubric: rubricFor(["collaboration", "communication", "accountability"]),
    exampleStrongResponse: "I would facilitate a blameless retrospective focused strictly on process and system vulnerabilities rather than individuals. I would model accountability by acknowledging areas where engineering handoffs fell short, establish joint test-automation pairing between QA and devs, and define shared release gates.",
    requiredConcepts: ["Blameless retrospective methodology", "Modeling personal and functional accountability", "Joint cross-functional processes replacing silos"],
    acceptableAlternatives: ["Pairing engineering and QA on automated regression suites", "Implementing shared 'Definition of Done'"],
    criticalErrors: ["Participating in tribal finger-pointing", "Dismissing QA concerns as obstructionist"],
  },
  {
    id: "team-hard-2",
    category: "Teamwork",
    difficulty: "Hard",
    prompt: "Your team undergoes an influx of contractors who work very differently from full-time staff, causing quality disparities and resentment. How do you unify the team?",
    competencies: ["collaboration", "planning", "communication"],
    rubric: rubricFor(["collaboration", "planning", "communication"]),
    exampleStrongResponse: "I would advocate for treating all contributors as one unified team. I would establish shared quality standards, codify our automated linting and PR checklists, set up cross-pairing on initial sprints, and invite contractor input into our architecture discussions.",
    requiredConcepts: ["One-team mindset removing us-vs-them dynamic", "Codified objective quality standards", "Structured pairing and onboarding into conventions"],
    acceptableAlternatives: ["Clear documented contribution guidelines and linters", "Regular joint feedback check-ins"],
    criticalErrors: ["Creating second-class citizenship or exclusive side channels", "Ignoring poor quality until contract review"],
  },
  {
    id: "team-hard-3",
    category: "Teamwork",
    difficulty: "Hard",
    prompt: "Company-wide hiring and budget freezes leave your team understaffed for committed contractual deliverables. How do you maintain team sustainability and output?",
    competencies: ["collaboration", "planning", "accountability"],
    rubric: rubricFor(["collaboration", "planning", "accountability"]),
    exampleStrongResponse: "I would work with the team to conduct an honest capacity audit, identifying must-have commitments versus nice-to-haves. I would present this empirical capacity model to leadership to negotiate deselecting lower-value commitments, protecting the team from unsustainable burnout.",
    requiredConcepts: ["Data-driven capacity modeling", "Negotiating scope reduction with leadership", "Protecting team psychological and physical sustainability"],
    acceptableAlternatives: ["Phased delivery schedules negotiated with clients", "Automating repetitive toil to regain developer hours"],
    criticalErrors: ["Demanding team work continuous 70-hour weeks in silence", "Pretending commitments will be met while quality crumbles"],
  },

  // ==========================================
  // CONFLICT RESOLUTION (9 scenarios: 3 Easy, 3 Medium, 3 Hard)
  // ==========================================
  {
    id: "conflict-easy-1",
    category: "Conflict Resolution",
    difficulty: "Easy",
    prompt: "A colleague leaves terse, nitpicky comments on your pull request that feel personal. How do you respond?",
    competencies: ["communication", "collaboration"],
    rubric: rubricFor(["communication", "collaboration"]),
    exampleStrongResponse: "I would assume positive intent and avoid arguing in code comments. I would address the technical feedback objectively, and for anything ambiguous, schedule a quick 5-minute video call to talk through the suggestions collegially and align on conventions.",
    requiredConcepts: ["Assume positive intent and depersonalize code reviews", "Take contentious threads offline to voice/video", "Focus on technical merits and shared code standards"],
    acceptableAlternatives: ["Reference team style guide to settle technical points", "Ask lead to clarify team convention if ambiguity persists"],
    criticalErrors: ["Replying with passive-aggressive comments in the PR", "Rejecting their suggestions purely out of spite"],
  },
  {
    id: "conflict-easy-2",
    category: "Conflict Resolution",
    difficulty: "Easy",
    prompt: "Two colleagues double-book the team conference room and an argument breaks out over who gets priority. How do you help de-escalate?",
    competencies: ["collaboration", "problemSolving"],
    rubric: rubricFor(["collaboration", "problemSolving"]),
    exampleStrongResponse: "I would step in calmly and check the calendar booking timestamps. If one meeting requires in-room video hardware while the other is an internal check-in, I would suggest the appropriate room allocation, or help one group find an available open booth nearby.",
    requiredConcepts: ["Calm, objective tone to defuse tension", "Evaluating functional needs of both meetings", "Proposing an immediate alternative space"],
    acceptableAlternatives: ["Splitting the time slot if both are brief", "Moving one meeting to virtual"],
    criticalErrors: ["Joining the shouting match", "Arbitrarily kicking one team out without reason"],
  },
  {
    id: "conflict-easy-3",
    category: "Conflict Resolution",
    difficulty: "Easy",
    prompt: "You and a teammate disagree on which UI icon to use for a primary navigation button. How do you decide?",
    competencies: ["collaboration", "problemSolving"],
    rubric: rubricFor(["collaboration", "problemSolving"]),
    exampleStrongResponse: "I would propose consulting our existing design system first. If neither icon is explicitly codified, I would run a quick 5-person hallway usability test or check platform accessibility guidelines, agreeing to abide by user clarity rather than personal aesthetic preference.",
    requiredConcepts: ["Reference design system and standards first", "Use empirical user feedback or accessibility guidelines", "Commit to the decision once agreed"],
    acceptableAlternatives: ["Ask designated UI/UX design lead for ruling", "A/B test if traffic supports it"],
    criticalErrors: ["Refusing to ship the feature over an icon", "Changing the icon repeatedly behind each other's backs"],
  },
  {
    id: "conflict-med-1",
    category: "Conflict Resolution",
    difficulty: "Medium",
    prompt: "An engineering peer and a product manager are having a heated, emotional argument in a public Slack channel over a scope change. What do you do?",
    competencies: ["communication", "collaboration", "problemSolving"],
    rubric: rubricFor(["communication", "collaboration", "problemSolving"]),
    exampleStrongResponse: "I would send a polite message in the channel suggesting we move the discussion to a huddle to work out the details together. Privately, I would reach out to both individuals to de-escalate emotions and help reframe the debate around customer value and sprint feasibility.",
    requiredConcepts: ["Immediate intervention to move public argument to private forum", "Empathetic neutral de-escalation", "Reframing conflict around objective product/engineering trade-offs"],
    acceptableAlternatives: ["Alert the team engineering lead or manager to mediate", "Draft an objective options table for both parties to review"],
    criticalErrors: ["Taking sides publicly in the channel", "Egging on the confrontation with provocative remarks"],
  },
  {
    id: "conflict-med-2",
    category: "Conflict Resolution",
    difficulty: "Medium",
    prompt: "Your product manager insists on adding three new features to the sprint without moving the release deadline. Engineering says it is impossible. How do you resolve this?",
    competencies: ["problemSolving", "communication", "planning"],
    rubric: rubricFor(["problemSolving", "communication", "planning"]),
    exampleStrongResponse: "I would present an empirical capacity breakdown showing current velocity and sprint commitments. I would offer the PM three viable options: trade off three existing sprint tickets of equal size, phase the new features into a post-launch fast-follow, or adjust the release milestone with stakeholder buy-in.",
    requiredConcepts: ["Data-backed capacity presentation", "Offering constructive trade-off choices (scope vs time vs resources)", "Collaborative problem-solving rather than blunt refusal"],
    acceptableAlternatives: ["De-scoping features to MVP prototypes", "Estimating story points together to establish shared reality"],
    criticalErrors: ["Silently saying yes while knowing it will fail", "Dismissing the PM with hostility without showing trade-offs"],
  },
  {
    id: "conflict-med-3",
    category: "Conflict Resolution",
    difficulty: "Medium",
    prompt: "A peer feels you were assigned the high-profile feature work while they were stuck with maintenance bugs, and they have become resentful. How do you address this?",
    competencies: ["communication", "collaboration", "accountability"],
    rubric: rubricFor(["communication", "collaboration", "accountability"]),
    exampleStrongResponse: "I would invite them for a private 1-on-1 to listen openly to their feelings without getting defensive. I would offer to co-author or pair on the architectural design of the high-profile feature, and advocate with our manager to rotate maintenance responsibilities equitably in future sprints.",
    requiredConcepts: ["Listen non-defensively to their perspective", "Share knowledge and ownership on current feature", "Advocate for structural task rotation with team management"],
    acceptableAlternatives: ["Divide the high-profile epic into two parallel components", "Establish a rotating on-call/bug-triage schedule"],
    criticalErrors: ["Bragging about being chosen", "Telling them they are simply less qualified"],
  },
  {
    id: "conflict-hard-1",
    category: "Conflict Resolution",
    difficulty: "Hard",
    prompt: "Two senior department leads refuse to speak directly due to a past grievance, stalling an enterprise integration program. How do you facilitate collaboration?",
    competencies: ["communication", "problemSolving", "collaboration"],
    rubric: rubricFor(["communication", "problemSolving", "collaboration"]),
    exampleStrongResponse: "I would meet with each leader individually to understand their underlying concerns and constraints without taking sides. I would establish clear, written interface contracts and milestone agreements between their teams, creating an objective operating model that decouples progress from personal friction.",
    requiredConcepts: ["Individual discovery sessions to identify real constraints", "Decoupling technical interface contracts from personal dynamics", "Establishing structured, neutral governance checkpoints"],
    acceptableAlternatives: ["Involving executive sponsor to establish mandatory governance", "Designating working-level proxies to conduct technical alignment"],
    criticalErrors: ["Attempting forced group therapy in front of junior staff", "Ignoring the stall and letting delivery collapse"],
  },
  {
    id: "conflict-hard-2",
    category: "Conflict Resolution",
    difficulty: "Hard",
    prompt: "An external vendor fails to deliver a mission-critical API module on time, and their manager threatens litigation if you penalize their contract. How do you handle this?",
    competencies: ["problemSolving", "communication", "accountability"],
    rubric: rubricFor(["problemSolving", "communication", "accountability"]),
    exampleStrongResponse: "I would immediately engage legal and vendor management teams. I would compile strict, chronological documentation of the agreed Statement of Work, milestones, and notification logs. In communications with the vendor, I would remain strictly professional, factual, and focused on remediation paths.",
    requiredConcepts: ["Immediate escalation to Legal and Procurement", "Rigorous chronological documentation audit", "Professional, de-escalated communication adhering strictly to legal counsel"],
    acceptableAlternatives: ["Exploring alternative fallbacks while counsel handles negotiations", "Isolating vendor API surface behind mock adaptors"],
    criticalErrors: ["Making verbal commitments or emotional threats to the vendor", "Attempting to negotiate legal terms independently without counsel"],
  },
  {
    id: "conflict-hard-3",
    category: "Conflict Resolution",
    difficulty: "Hard",
    prompt: "A senior team member presents your prototype innovation at an all-hands meeting, claiming it entirely as their own creation. How do you address this intellectual property breach?",
    competencies: ["communication", "accountability", "collaboration"],
    rubric: rubricFor(["communication", "accountability", "collaboration"]),
    exampleStrongResponse: "I would gather my commit history, design docs, and timestamped communications. I would request a private meeting with the colleague to directly ask about the attribution omission. If they refuse to correct the record, I would present the documented timeline to my engineering manager for formal clarification.",
    requiredConcepts: ["Gather verifiable timestamped evidence before acting", "Direct professional 1-on-1 discussion first", "Escalation to management with documentation if uncorrected"],
    acceptableAlternatives: ["Requesting co-authorship on patent/publication filings", "Clarifying contributions factually in subsequent team demos"],
    criticalErrors: ["Publicly accusing them during the all-hands Q&A", "Vandalizing their code or sabotaging the project in retaliation"],
  },

  // ==========================================
  // ETHICAL DECISION-MAKING (9 scenarios: 3 Easy, 3 Medium, 3 Hard)
  // ==========================================
  {
    id: "ethic-easy-1",
    category: "Ethical Decision-Making",
    difficulty: "Easy",
    prompt: "You notice an accounting entry for client expense reimbursement was entered with an extra zero in your favor. How do you respond?",
    competencies: ["accountability"],
    rubric: rubricFor(["accountability"]),
    exampleStrongResponse: "I would immediately notify the finance/payroll department in writing, provide the original receipt and expense ID, and request the corrected adjustment before or during the next payroll cycle.",
    requiredConcepts: ["Immediate proactive notification to Finance", "Written audit trail with documentation", "Refusing to retain incorrect funds"],
    acceptableAlternatives: ["Notify direct manager and CC finance on the correction ticket"],
    criticalErrors: ["Staying silent and keeping the extra funds", "Waiting until an external audit discovers it"],
  },
  {
    id: "ethic-easy-2",
    category: "Ethical Decision-Making",
    difficulty: "Easy",
    prompt: "You accidentally overhear a manager discussing an upcoming confidential performance PIP for a mutual friend. The friend asks if you know anything. What do you say?",
    competencies: ["accountability", "communication"],
    rubric: rubricFor(["accountability", "communication"]),
    exampleStrongResponse: "I would maintain strict confidentiality and explain honestly that I cannot discuss or speculate on confidential personnel matters. I would encourage my friend to have an open, proactive check-in with their manager regarding their performance and growth expectations.",
    requiredConcepts: ["Upholding confidentiality of accidental information", "Refusing to breach private HR data", "Directing peer to speak directly with their manager"],
    acceptableAlternatives: ["Offering general emotional support without confirming rumors"],
    criticalErrors: ["Leaking the confidential PIP details to the friend", "Lying about policy while spreading the rumor to other peers"],
  },
  {
    id: "ethic-easy-3",
    category: "Ethical Decision-Making",
    difficulty: "Easy",
    prompt: "You accidentally paste an internal API test key into a public discussion forum while asking a debugging question. What immediate actions do you take?",
    competencies: ["accountability", "problemSolving"],
    rubric: rubricFor(["accountability", "problemSolving"]),
    exampleStrongResponse: "I would immediately revoke and rotate the API key in our credentials dashboard. I would then edit or delete the forum post, notify our security/DevOps team of the brief exposure, and verify through access logs whether any unauthorized requests were made.",
    requiredConcepts: ["Immediate revocation and key rotation", "Transparency with Security/DevOps team", "Log audit for unauthorized access during window"],
    acceptableAlternatives: ["Following company security incident runbook", "Submitting automated security vulnerability ticket"],
    criticalErrors: ["Just deleting the forum post without rotating the compromised key", "Hiding the incident hoping nobody noticed"],
  },
  {
    id: "ethic-med-1",
    category: "Ethical Decision-Making",
    difficulty: "Medium",
    prompt: "Leadership asks the team to bypass accessibility compliance testing (WCAG) to launch on time for an investor conference. How do you respond?",
    competencies: ["accountability", "problemSolving", "communication"],
    rubric: rubricFor(["accountability", "problemSolving", "communication"]),
    exampleStrongResponse: "I would explain the legal, reputational, and ethical risks of shipping non-accessible software. I would propose a focused sprint to remediate critical high-severity WCAG blockers for the primary user flow, and obtain executive sign-off for a binding remediation plan for remaining items within 14 days.",
    requiredConcepts: ["Highlight legal, ethical, and customer impact risks", "Provide practical risk mitigation (fix critical path first)", "Obtain formal recorded leadership accountability if phased"],
    acceptableAlternatives: ["Presenting automated audit reports showing specific blocker risks", "Deploying beta flag with accessibility notice for conference demo only"],
    criticalErrors: ["Silently skipping testing and faking compliance audits", "Defiantly walking off without offering solutions"],
  },
  {
    id: "ethic-med-2",
    category: "Ethical Decision-Making",
    difficulty: "Medium",
    prompt: "A vendor bidding for your team's software contract offers you an all-expenses-paid weekend conference pass and VIP dinner. How do you handle this offer?",
    competencies: ["accountability"],
    rubric: rubricFor(["accountability"]),
    exampleStrongResponse: "I would decline the personal gift and report the offer to my manager and procurement officer in accordance with our anti-bribery and conflict-of-interest policy. I would ensure all vendor evaluations remain strictly based on objective RFP scoring.",
    requiredConcepts: ["Decline personal gifts during active procurement", "Transparent reporting to management/procurement", "Recusing self from scoring if impartiality is compromised"],
    acceptableAlternatives: ["Clarifying company gift threshold policy in writing", "Redirecting vendor communication through procurement desk"],
    criticalErrors: ["Accepting the trip secretly", "Advocating for the vendor because of personal perks"],
  },
  {
    id: "ethic-med-3",
    category: "Ethical Decision-Making",
    difficulty: "Medium",
    prompt: "You are asked to tweak metric calculations in an investor presentation to make user churn appear significantly lower than actual figures. What do you do?",
    competencies: ["accountability", "communication"],
    rubric: rubricFor(["accountability", "communication"]),
    exampleStrongResponse: "I would decline to alter standard metric definitions to misrepresent facts. I would present the true data alongside an explanatory narrative that highlights ongoing retention initiatives and cohort improvements, ensuring leadership has credible, auditable figures.",
    requiredConcepts: ["Refusal to fabricate or manipulate financial/retention metrics", "Upholding verifiable, auditable reporting standards", "Providing constructive business context instead of false numbers"],
    acceptableAlternatives: ["Consulting internal compliance or legal officer", "Presenting industry-standard metric definitions (e.g. GAAP / SaaS standards)"],
    criticalErrors: ["Altering the formulas to conceal churn", "Signing off on fraudulent reports"],
  },
  {
    id: "ethic-hard-1",
    category: "Ethical Decision-Making",
    difficulty: "Hard",
    prompt: "You discover customer passwords and unmasked credit card numbers are being stored in plain text in legacy analytics logs. What is your response?",
    competencies: ["problemSolving", "accountability", "communication"],
    rubric: rubricFor(["problemSolving", "accountability", "communication"]),
    exampleStrongResponse: "I would immediately declare a high-severity security incident. I would stop the logging of sensitive fields immediately, secure and purge the exposed log archives under security supervision, alert data protection officers, and initiate required regulatory/customer notification protocols.",
    requiredConcepts: ["Immediate incident declaration", "Halting continuous leakage at the source", "Coordination with Security, Legal, and Data Protection Officers"],
    acceptableAlternatives: ["Rotating any affected client credentials", "Conducting full blast-radius investigation"],
    criticalErrors: ["Silently deleting files to hide the problem from regulators", "Ignoring it because it belongs to a legacy team"],
  },
  {
    id: "ethic-hard-2",
    category: "Ethical Decision-Making",
    difficulty: "Hard",
    prompt: "You uncover evidence that leadership is deliberately bypassing environmental emissions compliance in physical data centers to cut energy costs. What do you do?",
    competencies: ["accountability", "communication", "problemSolving"],
    rubric: rubricFor(["accountability", "communication", "problemSolving"]),
    exampleStrongResponse: "I would compile objective, factual documentation of the violations. I would report the issue through formal internal whistleblower or ethics hotline channels. If internal governance fails to act on severe unlawful activity, I would seek legal guidance on protected external regulatory disclosure.",
    requiredConcepts: ["Factual, timestamped documentation of non-compliance", "Utilizing formal internal ethics/whistleblower reporting mechanisms", "Understanding legal whistleblower protections and regulatory duties"],
    acceptableAlternatives: ["Reporting to independent board audit committee", "Consulting corporate ombudsman"],
    criticalErrors: ["Destroying evidence under pressure", "Publicly leaking confidential unverified data on social media"],
  },
  {
    id: "ethic-hard-3",
    category: "Ethical Decision-Making",
    difficulty: "Hard",
    prompt: "An executive directs you to reverse-engineer and incorporate proprietary algorithms from a former employer's codebase into your current company's product. What is your response?",
    competencies: ["accountability", "communication"],
    rubric: rubricFor(["accountability", "communication"]),
    exampleStrongResponse: "I would formally refuse to use proprietary code from a former employer, explaining that doing so violates intellectual property laws, non-disclosure agreements, and creates severe legal liability for our company. I would propose designing an independent, clean-room implementation from public specifications.",
    requiredConcepts: ["Clear refusal citing trade secret and NDA obligations", "Explaining corporate liability and risk to executive", "Proposing clean-room development based on public specs"],
    acceptableAlternatives: ["Involving internal legal counsel immediately to document refusal", "Licensing legitimate third-party solutions"],
    criticalErrors: ["Copying proprietary code into the repository", "Sharing former employer trade secrets"],
  },

  // ==========================================
  // PRIORITIZATION (9 scenarios: 3 Easy, 3 Medium, 3 Hard)
  // ==========================================
  {
    id: "prior-easy-1",
    category: "Prioritization",
    difficulty: "Easy",
    prompt: "You arrive at work with 25 unread emails, 3 direct Slack messages, and a planned 2-hour task due at noon. How do you structure your morning?",
    competencies: ["planning", "problemSolving"],
    rubric: rubricFor(["planning", "problemSolving"]),
    exampleStrongResponse: "I would spend 5 minutes scanning messages for true production emergencies. If none exist, I would protect my focus to complete the noon deliverable, communicate status, and then dedicate a focused 45-minute block in the afternoon to triage remaining emails.",
    requiredConcepts: ["Quick emergency scan versus reactive multitasking", "Time-blocking for scheduled commitments", "Batching lower-priority communications"],
    acceptableAlternatives: ["Updating Slack status to 'Focus time until noon'", "Delegating urgent ad-hoc queries to an on-call peer"],
    criticalErrors: ["Spending all morning replying to low-priority emails and missing the noon deadline", "Ignoring all communications completely for days"],
  },
  {
    id: "prior-easy-2",
    category: "Prioritization",
    difficulty: "Easy",
    prompt: "You are asked to choose between fixing a minor UI typo on the settings page or delivering an assigned sprint task. Which do you prioritize?",
    competencies: ["planning", "accountability"],
    rubric: rubricFor(["planning", "accountability"]),
    exampleStrongResponse: "I prioritize the committed sprint task that impacts user value. I would log the UI typo in our backlog with a quick screenshot so it can be batched with routine maintenance or addressed during sprint buffer time.",
    requiredConcepts: ["Honoring sprint commitments over ad-hoc micro-distractions", "Logging minor issues in backlog so they are not forgotten", "Batching minor fixes appropriately"],
    acceptableAlternatives: ["Fixing the typo only if the sprint task is completely done and verified"],
    criticalErrors: ["Dropping sprint commitments to fix trivial cosmetic bugs without communicating", "Refusing to record the typo anywhere"],
  },
  {
    id: "prior-easy-3",
    category: "Prioritization",
    difficulty: "Easy",
    prompt: "The team has a sprint retrospective scheduled during a crunch afternoon before an upcoming release. How do you handle the conflicting demand?",
    competencies: ["planning", "collaboration"],
    rubric: rubricFor(["planning", "collaboration"]),
    exampleStrongResponse: "I would consult the scrum master and team. If the release requires immediate focused testing, I would propose shortening the retro to a 20-minute targeted sync or rescheduling it to the morning immediately following the release.",
    requiredConcepts: ["Consulting team/facilitator instead of skipping unilaterally", "Evaluating immediate release risk vs retro value", "Rescheduling promptly so continuous improvement is preserved"],
    acceptableAlternatives: ["Collecting asynchronous retrospective feedback in a shared board"],
    criticalErrors: ["Silently skipping the retrospective without notifying anyone", "Canceling retrospectives permanently"],
  },
  {
    id: "prior-med-1",
    category: "Prioritization",
    difficulty: "Medium",
    prompt: "The engineering team wants to refactor legacy technical debt, while the product team wants three new features for an upcoming marketing campaign. How do you balance the roadmap?",
    competencies: ["problemSolving", "planning", "collaboration"],
    rubric: rubricFor(["problemSolving", "planning", "collaboration"]),
    exampleStrongResponse: "I would advocate for an agreed allocation model (e.g. 70% feature delivery, 20% technical debt, 10% bugs). I would link specific technical debt items to quantifiable business risks—such as checkout latency or deployment failure rates—so product leaders see the direct commercial value of stability.",
    requiredConcepts: ["Balanced allocation percentage model", "Quantifying technical debt in terms of business/customer risk", "Collaborative negotiation between product and engineering"],
    acceptableAlternatives: ["Focusing refactoring strictly on the modules touched by the new marketing features", "Running a dedicated technical hardening sprint"],
    criticalErrors: ["Refactoring without product alignment and missing campaign dates", "Completely ignoring technical debt until the system crashes"],
  },
  {
    id: "prior-med-2",
    category: "Prioritization",
    difficulty: "Medium",
    prompt: "An executive VP asks you directly in Slack to build an unplanned custom analytics export for their client meeting tomorrow. How do you triage this request?",
    competencies: ["communication", "planning", "accountability"],
    rubric: rubricFor(["communication", "planning", "accountability"]),
    exampleStrongResponse: "I would acknowledge the executive's urgency politely. I would check the level of effort, notify my product manager/lead of the incoming request, and outline what current sprint task would need to be paused to accommodate it, asking for alignment on the trade-off.",
    requiredConcepts: ["Courteous acknowledgment of executive request", "Involving direct lead/product manager", "Making trade-offs on current sprint commitments explicit"],
    acceptableAlternatives: ["Checking if an existing database query or BI dashboard can satisfy the need immediately", "Offering a simplified one-time script"],
    criticalErrors: ["Dropping all team commitments secretly to appease the executive", "Bluntly telling the VP it is not your job"],
  },
  {
    id: "prior-med-3",
    category: "Prioritization",
    difficulty: "Medium",
    prompt: "Cloud infrastructure spend exceeded budget by 30% this month. You must cut monthly costs quickly without compromising production resilience. Where do you start?",
    competencies: ["problemSolving", "planning"],
    rubric: rubricFor(["problemSolving", "planning"]),
    exampleStrongResponse: "I would audit resource utilization: right-sizing oversized staging environments, shutting down idle developer sandbox clusters overnight, deleting orphaned snapshots, and purchasing reserved instances for stable baseline workloads, preserving all production redundancy.",
    requiredConcepts: ["Targeting non-production waste first (staging, idle sandboxes)", "Preserving production resilience and SLA guarantees", "Utilizing reserved instances or savings plans for baseline workloads"],
    acceptableAlternatives: ["Optimizing expensive queries or cache layers", "Setting automated lifecycle policies on cloud storage buckets"],
    criticalErrors: ["Disabling production backups or failover regions to save money", "Cutting engineering tooling randomly without metrics"],
  },
  {
    id: "prior-hard-1",
    category: "Prioritization",
    difficulty: "Hard",
    prompt: "During a major holiday sale, you face three simultaneous crises: payment gateway degradation, internal inventory sync lag, and a reported security vulnerability in an open-source library. How do you triage?",
    competencies: ["problemSolving", "planning", "accountability"],
    rubric: rubricFor(["problemSolving", "planning", "accountability"]),
    exampleStrongResponse: "I would immediately triage by active customer and financial impact: 1) Payment gateway failure directly halts revenue and customer orders—assign primary incident crew to failover to backup gateway. 2) Security vulnerability—assess if exploitable remotely; if not under active exploit, patch within 12 hours. 3) Inventory sync—throttle non-essential queues and verify eventual consistency buffers.",
    requiredConcepts: ["Triage framework prioritizing active revenue/data loss over hypothetical risks", "Delegation across dedicated incident crews", "Clear operational communication and contingency fallbacks"],
    acceptableAlternatives: ["Invoking emergency incident command structure", "Switching payment to asynchronous processing if supported"],
    criticalErrors: ["Trying to fix everything alone without delegating", "Prioritizing minor documentation over payment gateway collapse"],
  },
  {
    id: "prior-hard-2",
    category: "Prioritization",
    difficulty: "Hard",
    prompt: "A key enterprise client that represents 40% of company revenue threatens to churn unless you cancel the roadmap and build bespoke proprietary features for them. How do you advise leadership?",
    competencies: ["problemSolving", "planning", "communication"],
    rubric: rubricFor(["problemSolving", "planning", "communication"]),
    exampleStrongResponse: "I would advise leadership to evaluate customer concentration risk versus long-term product viability. I would propose designing the requested capabilities as generalized platform extensions or plugin APIs that satisfy the client's business requirement while benefiting the broader customer base, avoiding becoming a single-client agency.",
    requiredConcepts: ["Evaluating customer concentration risk against platform roadmap", "Architecting bespoke requests as reusable platform capabilities", "Providing data-driven options to executive leadership"],
    acceptableAlternatives: ["Negotiating professional services pricing with partner implementation", "Offering high-touch configuration or API integrations"],
    criticalErrors: ["Completely surrendering core product roadmap to become a custom dev shop", "Bluntly ignoring the client and losing 40% of company revenue"],
  },
  {
    id: "prior-hard-3",
    category: "Prioritization",
    difficulty: "Hard",
    prompt: "You must sunset a legacy API relied upon by 50 external integrations within 90 days to meet compliance regulations. What is your deprecation and migration plan?",
    competencies: ["planning", "communication", "accountability"],
    rubric: rubricFor(["planning", "communication", "accountability"]),
    exampleStrongResponse: "I would build a phased 90-day deprecation program: Day 1–15: Direct outreach to all 50 partners with migration guides, code snippets, and SDK updates. Day 30–60: Weekly office hours and automated dashboard tracking partner migration progress. Day 75: 'Brownout' testing during off-peak hours to identify unmigrated clients before permanent shutdown.",
    requiredConcepts: ["Structured phased communication timeline", "Migration tooling, documentation, and office hours", "Brownout testing to discover silent dependencies before permanent shutoff"],
    acceptableAlternatives: ["Providing automated translation proxy layer during grace period", "High-touch support for top-tier partners"],
    criticalErrors: ["Shutting down API abruptly on day 90 with no prior warning", "Extending compliance deadline indefinitely and facing regulatory fines"],
  },
];

/**
 * Selects scenarios for an assessment.
 * Supports up to 5 scenarios (default: 5) and prefers the requested difficulty,
 * backfilling from other difficulties in the same category to guarantee the requested count.
 */
export function selectScenarios(
  category: string,
  count: number = 5,
  difficulty?: string,
  options?: { randomize?: boolean }
): WorkplaceScenario[] {
  if (!CATEGORIES.includes(category as CategoryType)) return [];

  // Clamp count between 1 and 5
  const requestedCount = Number.isFinite(count)
    ? Math.min(Math.max(Math.trunc(count), 1), 5)
    : 5;

  let pool: WorkplaceScenario[] = [];

  if (difficulty && ["Easy", "Medium", "Hard"].includes(difficulty)) {
    // Primary pool matches exact category and difficulty
    const exactMatches = SCENARIOS.filter(
      (s) => s.category === category && s.difficulty === difficulty
    );
    pool = [...exactMatches];

    // If pool has fewer than requestedCount, backfill from other difficulties in the same category
    if (pool.length < requestedCount) {
      const backfill = SCENARIOS.filter(
        (s) => s.category === category && s.difficulty !== difficulty
      );
      pool = [...pool, ...backfill];
    }
  } else if (difficulty && !["Easy", "Medium", "Hard"].includes(difficulty)) {
    return [];
  } else {
    // No difficulty specified: use all scenarios for the category
    pool = SCENARIOS.filter((s) => s.category === category);
  }

  if (pool.length === 0) return [];

  // Randomize pool if requested (default: true for variety)
  const shouldRandomize = options?.randomize ?? true;
  const eligible = [...pool];

  if (shouldRandomize && eligible.length > 1) {
    // Randomize while keeping exact difficulty matches ahead if difficulty was requested
    if (difficulty && ["Easy", "Medium", "Hard"].includes(difficulty)) {
      const exact = eligible.filter((s) => s.difficulty === difficulty);
      const others = eligible.filter((s) => s.difficulty !== difficulty);
      for (let i = exact.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [exact[i], exact[j]] = [exact[j]!, exact[i]!];
      }
      for (let i = others.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [others[i], others[j]] = [others[j]!, others[i]!];
      }
      eligible.length = 0;
      eligible.push(...exact, ...others);
    } else {
      for (let i = eligible.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [eligible[i], eligible[j]] = [eligible[j]!, eligible[i]!];
      }
    }
  }

  // Deduplicate by scenario ID
  const uniqueScenarios: WorkplaceScenario[] = [];
  const seenIds = new Set<string>();

  for (const scenario of eligible) {
    if (!seenIds.has(scenario.id)) {
      seenIds.add(scenario.id);
      uniqueScenarios.push(scenario);
      if (uniqueScenarios.length >= requestedCount) break;
    }
  }

  return uniqueScenarios;
}

export function scenarioForQuestion(question: string): WorkplaceScenario | undefined {
  const normalized = question.trim().toLowerCase();
  return SCENARIOS.find((s) => s.prompt.trim().toLowerCase() === normalized);
}
