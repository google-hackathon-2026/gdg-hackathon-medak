# INSIGHTS — Key Findings for Winning the Hackathon

Unique, high-signal insights discovered during research. Updated continuously.

---

## From Discovery Agent: Disability Landscape
- **Cognitive accessibility and elderly digital exclusion are the SAME problem from different angles** — an AI simplification layer hits both
- Serbia: 43% of elderly don't use internet, 90% of those who do can't use e-government
- Cognitive tools are the fastest-growing AT segment (10.5% CAGR)
- The "hidden" population (undiagnosed MCI, age-related decline, low digital literacy) is 3-7x larger than official disability counts
- AAC devices cost $5-15K and run at 10 WPM vs 150 WPM speech — massive gap

## From Discovery Agent: Sensory Pain Points
- 94.8% of top 1M websites fail WCAG accessibility — the web is fundamentally broken for disabled users
- AI image descriptions hallucinate — Be My Eyes + GPT-4 is good but not reliable for safety-critical scenarios
- Multi-speaker real-time captioning is the #1 unsolved hearing problem
- Deaf-blind population has virtually ZERO AI assistants designed for them
- JAWS screen reader costs $1,000/year — cost barrier is real

## Critical Evaluation Insight
- **blind-realtime-scene scored 29/40 YELLOW** — massive impact (9) and great demo (9) BUT innovation only 5/10. Google, ChatGPT, Meta Ray-Ban already ship real-time video narration. This is the MOST CROWDED space in AI accessibility. Multiple hackathon teams have done this before.
- **Lesson: high-impact ≠ innovative.** To win, we need a problem where the solution ISN'T already shipping as a consumer product. Look for problems where AI is the unlock but nobody has built it yet.
- **Multi-agent was marginal** for blind-realtime — Gemini Live API handles 70-80% solo. Best problems will NATURALLY decompose into agents.

## P02 Senior Voice Agent — First GREEN (33/40)
- **Serbian local angle is a WEAPON** — hackathon is IN BELGRADE, judges are Serbian, every one of them has a baka/deda affected
- Phone call on speakerphone = theatrical demo moment with zero imagination required
- Multi-agent is natural: voice orchestrator + healthcare agent + gov agent + banking agent
- Binary risk: does Gemini handle Serbian elderly speech? Test this FIRST.
- 610K directly affected in Serbia alone. Commissioner for Protection of Equality publicly warned about digital exclusion.
- Multiple payers: Serbian gov (eHealth Strategy 2022-2026), EU grants, UNFPA, telecoms

## P06 AAC Speed — Tied for GREEN (33/40)
- **Highest tech execution score (8/10)** — 4 agents with genuinely different domains (CV, speech, LLM, user model)
- No hackathon project found combining multimodal context → sentence prediction for AAC. WIDE OPEN.
- Stephen Hawking angle: "What if we approached from context, not prediction?" — killer pitch line
- 97M people need AAC globally, 65-100K in Serbia with ZERO localized tools
- Google's SpeakFaster (Nature 2024) proved the approach but used only text context — adding camera/scene is novel
- Risk: multimodal fusion latency (<500ms budget is tight)

## 🏆 P11 Autism Meltdown — NEW #1 PROBLEM (34/40)
- **Only problem to score 8+ on BOTH innovation AND tech execution**
- Adult-first framing: every competitor targets children/caregivers. NOBODY builds for autistic adults managing themselves.
- 50-70% of autistic people have alexithymia (can't recognize own emotions) — AI literally makes the invisible accessible
- JAMA 2023: 80% AUROC predicting behavior 3 min ahead. The SCIENCE is proven.
- 78M autistic adults, 25x more likely to attempt suicide
- Zero competitors in adult self-management space
- Theme fit 9.5/10: "your body knows before your mind" is the perfect "impossible before AI" moment
- Phone sensors (mic, accelerometer, GPS) are standard Android APIs — no special hardware needed
- Natural multi-agent: each sensor modality is an independent agent with different sampling rates

## Judge Psychology
- Mix of engineers and academics — need BOTH technical depth AND real-world impact
- CTO judge (Efimind) will care about business viability
- Belgrade university TAs will appreciate local/Serbian relevance
- Senior engineer from SFEIR (France) will look for engineering quality
- The ADK + A2A workshop today primed judges to appreciate multi-agent architecture done well
