// All 108 questions across 6 modules
// Types: 'scale' | 'mcq' | 'text'

export const MODULES = [
  {
    id: 1,
    title: 'Current Reality Scan',
    description: 'Take an honest look at where you are right now in your career — your strengths, your gaps, and your day-to-day reality at work.',
    about: 'This module helps you understand how you are currently showing up at work. It helps you reflect on your current habits, work style, and the way you approach responsibility, initiative, and follow through.',
    whyItMatters: "You can't move forward without first understanding where you stand. This module helps you see your starting point clearly.",
    whatYouGetClarity: "How you currently show up at work, what's working, and what needs attention.",
    reportTitle: 'My Current Reality',
    questions: [
      // Page 1 — Q1-4 (scale)
      { id: 1,  page: 1, type: 'scale', text: 'I take responsibility for my work without needing repeated reminders.' },
      { id: 2,  page: 1, type: 'scale', text: 'I complete tasks on time.' },
      { id: 3,  page: 1, type: 'scale', text: 'I follow through properly once I commit to something.' },
      { id: 4,  page: 1, type: 'scale', text: 'I take initiative without always waiting for instructions.' },
      // Page 2 — Q5-8 (scale)
      { id: 5,  page: 2, type: 'scale', text: 'I keep my manager or team updated proactively.' },
      { id: 6,  page: 2, type: 'scale', text: 'When a problem comes up, I try to solve it instead of just reporting it.' },
      { id: 7,  page: 2, type: 'scale', text: 'I stay consistent in my effort and discipline.' },
      { id: 8,  page: 2, type: 'scale', text: 'I take ownership of outcomes, not just tasks.' },
      // Page 3 — Q9-12 (mixed)
      { id: 9,  page: 3, type: 'scale', text: 'I handle pressure well at work.' },
      { id: 10, page: 3, type: 'scale', text: 'I pay attention to quality in my work.' },
      { id: 11, page: 3, type: 'mcq',   text: 'Which of these describes you best at work?',
        options: ['I mostly wait for instructions', 'I do what is assigned and finish my tasks', 'I often take initiative and solve problems', 'I take strong ownership and think ahead'] },
      { id: 12, page: 3, type: 'mcq',   text: 'How do you usually respond when work becomes difficult?',
        options: ['I wait for help', 'I feel stressed and slow down', 'I try to manage and move ahead', 'I take charge and work through it'] },
      // Page 4 — Q13-16 (text)
      { id: 13, page: 4, type: 'text', text: 'What do you think are your top 3 strengths at work?', hint: 'Write in a few simple lines' },
      { id: 14, page: 4, type: 'text', text: 'What do you think are your top 3 growth areas at work?', hint: 'Be honest and specific' },
      { id: 15, page: 4, type: 'text', text: 'In what kind of work situations do you perform at your best?', hint: 'Short answers are fine' },
      { id: 16, page: 4, type: 'text', text: 'In what kind of work situations do you struggle the most?', hint: 'Reflect on your own experience' },
      // Page 5 — Q17-18 (text)
      { id: 17, page: 5, type: 'text', text: 'How do you think others at work experience you?', hint: 'Write what feels most true for you' },
      { id: 18, page: 5, type: 'text', text: 'What is one work habit you feel proud of?', hint: 'Write in a few simple lines' },
    ],
  },

  {
    id: 2,
    title: 'Inner Patterns',
    description: 'Explore the habits, reactions, and tendencies that shape how you work — some help you, some hold you back.',
    about: 'This module helps you reflect on what may be happening inside you that affects how you perform at work. Sometimes growth is slowed not by lack of skill, but by hesitation, fear, self doubt, or old patterns.',
    whyItMatters: 'Most of what drives our behaviour at work is invisible to us. Recognising your patterns is the first step to changing them.',
    whatYouGetClarity: 'The recurring patterns in how you think, react, and make decisions at work.',
    reportTitle: 'My Inner Patterns',
    questions: [
      // Page 1
      { id: 1,  page: 1, type: 'scale', text: 'I hesitate before taking initiative.' },
      { id: 2,  page: 1, type: 'scale', text: 'I worry about making mistakes.' },
      { id: 3,  page: 1, type: 'scale', text: 'I wait for clear direction before moving ahead.' },
      { id: 4,  page: 1, type: 'scale', text: 'I avoid difficult conversations at work.' },
      // Page 2
      { id: 5,  page: 2, type: 'scale', text: 'I doubt my ability in new or challenging situations.' },
      { id: 6,  page: 2, type: 'scale', text: 'I hold back my thoughts or ideas.' },
      { id: 7,  page: 2, type: 'scale', text: 'I take feedback personally.' },
      { id: 8,  page: 2, type: 'scale', text: 'I find it hard to stay confident when things go wrong.' },
      // Page 3 (mixed)
      { id: 9,  page: 3, type: 'scale', text: 'I sometimes avoid responsibility because I do not want extra pressure.' },
      { id: 10, page: 3, type: 'scale', text: 'I stay in my comfort zone more than I should.' },
      { id: 11, page: 3, type: 'mcq',   text: 'Which of these affects you the most at work?',
        options: ['Fear of mistakes', 'Waiting for approval', 'Lack of confidence', 'Overthinking', 'Avoiding responsibility', 'Difficulty speaking up'] },
      { id: 12, page: 3, type: 'mcq',   text: 'When you hold back at work, what is usually the reason?',
        options: ['I do not want to make mistakes', 'I am not fully confident', 'I do not want conflict', 'I feel it is not my place', 'I am unsure what to do'] },
      // Page 4
      { id: 13, page: 4, type: 'text', text: 'What kind of situations make you hesitate the most?', hint: 'Write in a few simple lines' },
      { id: 14, page: 4, type: 'text', text: 'What thoughts usually come into your mind when you feel stuck at work?', hint: 'Be honest and specific' },
      { id: 15, page: 4, type: 'text', text: 'What pattern in yourself do you feel may be slowing your growth?', hint: 'Short answers are fine' },
      { id: 16, page: 4, type: 'text', text: 'What do you avoid at work, even though you know you should deal with it?', hint: 'Reflect on your own experience' },
      // Page 5
      { id: 17, page: 5, type: 'text', text: 'What helps you feel stronger and more confident at work?', hint: 'Write what feels most true for you' },
      { id: 18, page: 5, type: 'text', text: 'What inner change would make the biggest difference to your growth?', hint: 'Write in a few simple lines' },
    ],
  },

  {
    id: 3,
    title: 'Professional Identity',
    description: 'Get clear on the kind of professional you want to be — not just your job title, but how you want to be known.',
    about: 'This module helps you get clear on the kind of professional you want to become. When you know who you want to be, your choices and actions become stronger and more aligned.',
    whyItMatters: 'When you know who you want to become, every decision at work gets easier. This is your professional compass.',
    whatYouGetClarity: 'Your values, your professional strengths, and the identity you want to build.',
    reportTitle: 'My Professional Identity',
    questions: [
      // Page 1
      { id: 1,  page: 1, type: 'scale', text: 'I have a clear picture of the kind of professional I want to become.' },
      { id: 2,  page: 1, type: 'scale', text: 'I know what I want to be known for at work.' },
      { id: 3,  page: 1, type: 'scale', text: 'I think about my long-term professional growth seriously.' },
      { id: 4,  page: 1, type: 'scale', text: 'I want to become someone who can be trusted with more responsibility.' },
      // Page 2
      { id: 5,  page: 2, type: 'scale', text: 'I am actively trying to build qualities that will help me grow.' },
      { id: 6,  page: 2, type: 'scale', text: 'I care about the professional reputation I am building.' },
      { id: 7,  page: 2, type: 'scale', text: 'I want to be seen as dependable and proactive.' },
      { id: 8,  page: 2, type: 'scale', text: 'I am clear about the strengths I want to build.' },
      // Page 3 (mixed)
      { id: 9,  page: 3, type: 'mcq',   text: 'Which quality matters most to you in your professional identity?',
        options: ['Dependability', 'Confidence', 'Leadership', 'Initiative', 'Expertise', 'Discipline'] },
      { id: 10, page: 3, type: 'text', text: 'What do you most want to be known for at work?', hint: 'Write in a few simple lines' },
      { id: 11, page: 3, type: 'text', text: 'What kind of professional do you want to become over the next 2 to 3 years?', hint: 'Be honest and specific' },
      { id: 12, page: 3, type: 'text', text: 'What qualities do you want people to trust you for?', hint: 'Short answers are fine' },
      // Page 4
      { id: 13, page: 4, type: 'text', text: 'What kind of reputation do you want to build?', hint: 'Reflect on your own experience' },
      { id: 14, page: 4, type: 'text', text: 'What strengths do you most want to develop?', hint: 'Write what feels most true for you' },
      { id: 15, page: 4, type: 'text', text: 'What does professional growth mean to you personally?', hint: 'Write in a few simple lines' },
      { id: 16, page: 4, type: 'text', text: 'What would make you feel proud of your professional journey?', hint: 'Be honest and specific' },
      // Page 5
      { id: 17, page: 5, type: 'text', text: 'What kind of contribution do you want to make through your work?', hint: 'Short answers are fine' },
      { id: 18, page: 5, type: 'text', text: 'If your manager described you in one strong sentence two years from now, what would you want that sentence to be?', hint: 'Reflect on your own experience' },
    ],
  },

  {
    id: 4,
    title: 'Goals and Priorities',
    description: 'Define what truly matters to you right now and set clear, practical goals that align with your professional identity.',
    about: 'This module helps you define what truly matters to you right now and set clear, practical goals that align with your professional identity.',
    whyItMatters: 'Clarity on goals creates momentum. Without clear priorities, energy gets scattered.',
    whatYouGetClarity: 'Your top goals, what to focus on, and what to stop giving energy to.',
    reportTitle: 'My Goals and Priorities',
    questions: [
      // Page 1
      { id: 1,  page: 1, type: 'scale', text: 'I am clear about what I want from my work life in the near future.' },
      { id: 2,  page: 1, type: 'scale', text: 'I have clear professional goals for the next 6 to 12 months.' },
      { id: 3,  page: 1, type: 'scale', text: 'I know what my top priorities should be right now.' },
      { id: 4,  page: 1, type: 'scale', text: 'I often feel scattered in my effort.' },
      // Page 2
      { id: 5,  page: 2, type: 'scale', text: 'I am able to focus on what matters most.' },
      { id: 6,  page: 2, type: 'scale', text: 'I connect my daily work to my growth goals.' },
      { id: 7,  page: 2, type: 'scale', text: 'I know which skills I need to develop next.' },
      { id: 8,  page: 2, type: 'scale', text: 'I take regular action toward my professional goals.' },
      // Page 3 (mixed)
      { id: 9,  page: 3, type: 'mcq',   text: 'Which area matters most to your growth right now?',
        options: ['Better performance', 'More confidence', 'Better communication', 'Stronger ownership', 'Skill development', 'Career growth'] },
      { id: 10, page: 3, type: 'text', text: 'Why does growth matter to you at this stage of your life?', hint: 'Write in a few simple lines' },
      { id: 11, page: 3, type: 'text', text: 'What do you want from your professional life over the next 1 to 2 years?', hint: 'Be honest and specific' },
      { id: 12, page: 3, type: 'text', text: 'What are your top 3 priorities right now?', hint: 'Short answers are fine' },
      // Page 4
      { id: 13, page: 4, type: 'text', text: 'What are your top 3 goals for the next 6 to 12 months?', hint: 'Reflect on your own experience' },
      { id: 14, page: 4, type: 'text', text: 'What skill or ability do you most need to strengthen?', hint: 'Write what feels most true for you' },
      { id: 15, page: 4, type: 'text', text: 'What is currently distracting you from what matters most?', hint: 'Write in a few simple lines' },
      { id: 16, page: 4, type: 'text', text: 'What do you need to stop giving time or energy to?', hint: 'Be honest and specific' },
      // Page 5
      { id: 17, page: 5, type: 'text', text: 'What kind of progress would make you feel you are moving in the right direction?', hint: 'Short answers are fine' },
      { id: 18, page: 5, type: 'text', text: 'What one area, if improved, would create the biggest positive change in your work life?', hint: 'Reflect on your own experience' },
    ],
  },

  {
    id: 5,
    title: 'Belief and Behaviour Shift',
    description: 'Identify the beliefs and behaviours that are limiting you, and choose new ones that support the professional you want to become.',
    about: 'This module helps you identify the beliefs and behaviours that need to change if you want to grow faster and become stronger at work.',
    whyItMatters: "Growth isn't just about doing more — it's about thinking differently. This module helps you upgrade your mindset.",
    whatYouGetClarity: 'Which beliefs to let go of, which new behaviours to adopt, and how to make the shift stick.',
    reportTitle: 'My Belief and Behaviour Shift',
    questions: [
      // Page 1
      { id: 1,  page: 1, type: 'scale', text: 'My thoughts affect the way I behave at work.' },
      { id: 2,  page: 1, type: 'scale', text: 'I notice when my own thinking is holding me back.' },
      { id: 3,  page: 1, type: 'scale', text: 'I am willing to change old habits that no longer help me.' },
      { id: 4,  page: 1, type: 'scale', text: 'I often make excuses instead of taking full responsibility.' },
      // Page 2
      { id: 5,  page: 2, type: 'scale', text: 'I delay action more than I should.' },
      { id: 6,  page: 2, type: 'scale', text: 'I communicate proactively when needed.' },
      { id: 7,  page: 2, type: 'scale', text: 'I am open to changing how I work.' },
      { id: 8,  page: 2, type: 'scale', text: 'I am serious about building better habits.' },
      // Page 3 (mixed)
      { id: 9,  page: 3, type: 'mcq',   text: 'Which belief do you think affects you the most?',
        options: ['I need constant direction', 'I am not ready yet', 'It is safer to stay quiet', 'I should avoid mistakes at all cost', 'I cannot do much from my current role', 'I do not need to change much'] },
      { id: 10, page: 3, type: 'text', text: 'What is one belief you need to let go of?', hint: 'Write in a few simple lines' },
      { id: 11, page: 3, type: 'text', text: 'What is one stronger belief you want to build?', hint: 'Be honest and specific' },
      { id: 12, page: 3, type: 'text', text: 'What behaviour do you need to stop?', hint: 'Short answers are fine' },
      // Page 4
      { id: 13, page: 4, type: 'text', text: 'What behaviour do you need to start?', hint: 'Reflect on your own experience' },
      { id: 14, page: 4, type: 'text', text: 'What good behaviour do you need to continue?', hint: 'Write what feels most true for you' },
      { id: 15, page: 4, type: 'text', text: 'When do you notice your weakest behaviour pattern the most?', hint: 'Write in a few simple lines' },
      { id: 16, page: 4, type: 'text', text: 'What behaviour change would create the biggest difference to your growth?', hint: 'Be honest and specific' },
      // Page 5
      { id: 17, page: 5, type: 'text', text: 'What kind of person do you need to become to live these new beliefs?', hint: 'Short answers are fine' },
      { id: 18, page: 5, type: 'text', text: 'What will help you stay consistent with these changes?', hint: 'Reflect on your own experience' },
    ],
  },

  {
    id: 6,
    title: '90 Day Growth Plan',
    description: 'Pull everything together into a practical, actionable roadmap for the next 90 days.',
    about: 'This module helps you turn insight into action. It helps you build a simple and practical 90 day roadmap for your growth.',
    whyItMatters: 'Insights without action fade quickly. This plan turns your reflections into real, trackable progress.',
    whatYouGetClarity: 'A clear, step-by-step plan with milestones you can follow after the workshop ends.',
    reportTitle: 'My 90 Day Growth Plan',
    questions: [
      // Page 1
      { id: 1,  page: 1, type: 'scale', text: 'I am ready to take action on what I have learned today.' },
      { id: 2,  page: 1, type: 'scale', text: 'I believe a focused 90 day plan can help me grow meaningfully.' },
      { id: 3,  page: 1, type: 'scale', text: 'I can stay committed to a few priorities if I am clear about them.' },
      { id: 4,  page: 1, type: 'scale', text: 'I review my progress regularly.' },
      // Page 2
      { id: 5,  page: 2, type: 'scale', text: 'I can build small habits with consistency.' },
      { id: 6,  page: 2, type: 'scale', text: 'I know what I need to do first after this workshop.' },
      { id: 7,  page: 2, type: 'scale', text: 'I am willing to stay disciplined for the next 90 days.' },
      { id: 8,  page: 2, type: 'scale', text: 'I can take ownership of my own professional growth.' },
      // Page 3 (text)
      { id: 9,  page: 3, type: 'text', text: 'What is your one major 90 day goal?', hint: 'Write in a few simple lines' },
      { id: 10, page: 3, type: 'text', text: 'What are your top 3 priorities for the next 90 days?', hint: 'Be honest and specific' },
      { id: 11, page: 3, type: 'text', text: 'What do you want to achieve in Month 1?', hint: 'Short answers are fine' },
      { id: 12, page: 3, type: 'text', text: 'What do you want to strengthen in Month 2?', hint: 'Reflect on your own experience' },
      // Page 4
      { id: 13, page: 4, type: 'text', text: 'What do you want to demonstrate or sustain in Month 3?', hint: 'Write what feels most true for you' },
      { id: 14, page: 4, type: 'text', text: 'What are your weekly commitments?', hint: 'Write in a few simple lines' },
      { id: 15, page: 4, type: 'text', text: 'What habits will support your growth?', hint: 'Be honest and specific' },
      { id: 16, page: 4, type: 'text', text: 'How will you review your progress every week?', hint: 'Short answers are fine' },
      // Page 5
      { id: 17, page: 5, type: 'text', text: 'What obstacle may affect your progress over the next 90 days?', hint: 'Reflect on your own experience' },
      { id: 18, page: 5, type: 'text', text: 'How will you respond if you lose momentum?', hint: 'Write what feels most true for you' },
    ],
  },
]

export const TOTAL_PAGES = 5
export const QUESTIONS_PER_PAGE = 4 // last page has 2
