
(function () {
  'use strict';

  // ── Knowledge base ──────────────────────────────────────────────────────────
  const GURU_RESPONSES = [
    {
      keywords: ['jee', 'joint entrance'],
      reply: '📐 <strong>JEE Main 2026</strong> covers Physics, Chemistry & Mathematics from Class 11 & 12. edHills offers a complete JEE Masterclass with 500+ hours of live classes, 50+ mock tests, and IIT-mentored faculty. <a href="jee-course-details.html" style="color:#facc15">View JEE Course →</a>'
    },
    {
      keywords: ['neet', 'medical', 'biology'],
      reply: '🧬 <strong>NEET UG 2026</strong> focuses on Physics, Chemistry & Biology. Our NEET batch includes NCERT-based revision, 45-day crash courses & detailed diagram sessions. <a href="neet-course-details.html" style="color:#facc15">View NEET Course →</a>'
    },
    {
      keywords: ['cuet', 'central university', 'du', 'bhu'],
      reply: '🎓 <strong>CUET 2026</strong> is the single-window for DU, BHU, JNU & 250+ universities. We cover Language, Domain Subjects & General Test with hybrid learning and 5000+ MCQs. <a href="cuet-course-details.html" style="color:#facc15">View CUET Course →</a>'
    },
    {
      keywords: ['ssc', 'government job', 'cgl', 'chsl'],
      reply: '🏛️ <strong>SSC Exams</strong> like CGL & CHSL require mastery of Quant, Reasoning, English & GK. Our SSC batch has 200+ hours of content with government job-focused strategy. <a href="ssc-course-details.html" style="color:#facc15">View SSC Course →</a>'
    },
    {
      keywords: ['fee', 'price', 'cost', 'scholarship', 'discount'],
      reply: '💰 edHills offers <strong>Rankers\' Scholarships</strong> for meritorious students! Fees vary by course. Register today to lock in early-bird pricing. <a href="login.html" style="color:#facc15">Create Account →</a>'
    },
    {
      keywords: ['syllabus', 'topics', 'chapters'],
      reply: '📚 You can find complete, updated syllabi for all exams here: <a href="jee-syllabus.html" style="color:#facc15">JEE</a> · <a href="neet-syllabus.html" style="color:#facc15">NEET</a> · <a href="cuet-syllabus.html" style="color:#facc15">CUET</a> · <a href="board-syllabus.html" style="color:#facc15">Board Exams</a>'
    },
    {
      keywords: ['test', 'mock', 'practice', 'test series'],
      reply: '📝 Our <strong>Test Series</strong> is designed on the latest NTA/CBSE pattern with detailed analytics and rank predictions. <a href="test-series.html" style="color:#facc15">Explore Test Series →</a>'
    },
    {
      keywords: ['free', 'material', 'pdf', 'resource', 'notes'],
      reply: '🎁 edHills provides <strong>Free Resources</strong> including Previous Year Papers, Cut-offs, Exam Patterns, Counselling calendars & JEE Weightage Analysis. <a href="free-resources.html" style="color:#facc15">Access Free Resources →</a>'
    },
    {
      keywords: ['update', 'news', 'notification', 'batch', 'announcement'],
      reply: '🔔 Stay updated with latest batch launches, exam alerts, and platform upgrades on our Updates page. <a href="updates.html" style="color:#facc15">View Updates →</a>'
    },
    {
      keywords: ['login', 'register', 'account', 'signup', 'sign up'],
      reply: '👤 You can create your edHills student account or login here: <a href="login.html" style="color:#facc15">Student Portal →</a>. After login, access your personal dashboard with progress tracking and enrolled courses!'
    },
    {
      keywords: ['dashboard', 'progress', 'enrolled'],
      reply: '📊 Your <strong>Student Dashboard</strong> shows enrolled courses, progress charts, daily schedule, and AI-powered analytics. <a href="student-dashboard.html" style="color:#facc15">Go to Dashboard →</a>'
    },
    {
      keywords: ['contact', 'support', 'help', 'email'],
      reply: '📞 Reach out to us at <strong>info@edhills.com</strong> or visit our Support Center. Our team is available Mon–Sat, 9 AM – 7 PM IST.'
    },
    {
      keywords: ['store', 'book', 'merchandise', 'study material', 'buy'],
      reply: '🛍️ Visit the edHills Store for branded merchandise, printed study materials & tech accessories for students! <a href="store.html" style="color:#facc15">Visit Store →</a>'
    },
    {
      keywords: ['hello', 'hi', 'hey', 'namaste', 'namaskar'],
      reply: '🙏 <strong>Namaste!</strong> I\'m <strong>Guru Ji</strong>, your AI learning companion at edHills. Ask me anything about courses (JEE, NEET, CUET, SSC), syllabus, fees, or study tips!'
    },
    {
      keywords: ['thank', 'thanks', 'dhanyawad', 'shukriya'],
      reply: '🙏 You\'re most welcome! Keep studying hard. Remember — <em>"Success is the sum of small efforts repeated daily."</em> All the best! 🌟'
    },
    {
      keywords: ['tips', 'study', 'strategy', 'prepare', 'crack'],
      reply: '💡 <strong>Top Study Tips from Guru Ji:</strong><br>1. Understand concepts, don\'t just memorize.<br>2. Solve PYQs daily — Pattern recognition is key.<br>3. Revise weekly with short notes.<br>4. Take mock tests under real exam conditions.<br>5. Sleep 7-8 hrs & stay consistent. You\'ve got this! 🔥'
    }
  ];

  const DEFAULT_REPLY = '🤔 I didn\'t quite catch that! Try asking about our <strong>courses</strong> (JEE, NEET, CUET, SSC), <strong>syllabus</strong>, <strong>fees</strong>, <strong>test series</strong>, or <strong>free resources</strong>. I\'m here to help! 🙏';

  // ── Widget HTML ─────────────────────────────────────────────────────────────
  const WIDGET_HTML = `
<div id="guru-widget">
  <!-- FAB Button -->
  <div id="guru-fab" title="Chat with AI Guru Ji" aria-label="Open AI Guru Ji chatbot" role="button" tabindex="0">
    <div class="guru-fab-inner">
      <span class="guru-fab-icon">🧑‍🏫</span>
      <span class="guru-fab-pulse"></span>
    </div>
    <div class="guru-fab-label">Guru Ji</div>
  </div>

  <!-- Chat Panel -->
  <div id="guru-panel" role="dialog" aria-label="AI Guru Ji Chatbox" aria-hidden="true">
    <!-- Header -->
    <div class="guru-header">
      <div class="guru-header-left">
        <div class="guru-avatar">🧑‍🏫</div>
        <div>
          <div class="guru-name">AI Guru Ji</div>
          <div class="guru-status"><span class="guru-online-dot"></span> Online · edHills Assistant</div>
        </div>
      </div>
      <div class="guru-header-actions">
        <button id="guru-clear" title="Clear chat" aria-label="Clear chat">🗑️</button>
        <button id="guru-close" title="Close chat" aria-label="Close chat">✕</button>
      </div>
    </div>

    <!-- Messages -->
    <div id="guru-messages" role="log" aria-live="polite"></div>

    <!-- Quick Suggestions -->
    <div id="guru-suggestions">
      <button class="guru-chip" data-msg="Tell me about JEE courses">📐 JEE</button>
      <button class="guru-chip" data-msg="Tell me about NEET coaching">🧬 NEET</button>
      <button class="guru-chip" data-msg="What free resources do you have?">🎁 Free Materials</button>
      <button class="guru-chip" data-msg="Show me the test series">📝 Test Series</button>
    </div>

    <!-- Input -->
    <div class="guru-input-bar">
      <input id="guru-input" type="text" placeholder="Ask Guru Ji anything…" autocomplete="off" maxlength="300" aria-label="Type your message" />
      <button id="guru-send" aria-label="Send message">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
    <div class="guru-footer-branding">Powered by <strong>edHills AI</strong> · India's Learning Platform</div>
  </div>
</div>`;

  // ── Widget CSS ───────────────────────────────────────────────────────────────
  const WIDGET_CSS = `
#guru-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99999;
  font-family: 'Outfit', 'Segoe UI', sans-serif;
}
@media (max-width: 900px) {
  #guru-widget { bottom: 85px; right: 15px; }
}

/* FAB */
#guru-fab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  user-select: none;
}
.guru-fab-inner {
  width: 62px;
  height: 62px;
  background: linear-gradient(135deg, #0e2f69, #1746a2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 28px rgba(14,47,105,0.45);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 3px solid #facc15;
}
#guru-fab:hover .guru-fab-inner {
  transform: scale(1.1);
  box-shadow: 0 12px 35px rgba(14,47,105,0.6);
}
.guru-fab-icon { font-size: 28px; line-height: 1; }
.guru-fab-pulse {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 14px;
  height: 14px;
  background: #22c55e;
  border-radius: 50%;
  border: 2px solid white;
  animation: guruPulse 2s infinite;
}
@keyframes guruPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.7; }
}
.guru-fab-label {
  background: linear-gradient(135deg, #0e2f69, #1746a2);
  color: #facc15;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 10px rgba(14,47,105,0.3);
  border: 1.5px solid rgba(250,204,21,0.4);
}

/* Panel */
#guru-panel {
  position: absolute;
  bottom: 90px;
  right: 0;
  width: 360px;
  max-height: 560px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(14,47,105,0.2), 0 0 0 1px rgba(14,47,105,0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: scale(0.85) translateY(20px);
  transform-origin: bottom right;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease;
}
#guru-panel.guru-open {
  transform: scale(1) translateY(0);
  opacity: 1;
  pointer-events: all;
}
@media (max-width: 420px) {
  #guru-panel { width: calc(100vw - 30px); right: 0; bottom: 85px; }
}

/* Header */
.guru-header {
  background: linear-gradient(135deg, #0e2f69 0%, #1746a2 100%);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.guru-header-left { display: flex; align-items: center; gap: 12px; }
.guru-avatar {
  width: 46px;
  height: 46px;
  background: rgba(250,204,21,0.15);
  border: 2px solid #facc15;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.guru-name { color: #facc15; font-weight: 700; font-size: 16px; }
.guru-status { color: rgba(255,255,255,0.8); font-size: 11px; display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.guru-online-dot {
  width: 8px; height: 8px;
  background: #22c55e;
  border-radius: 50%;
  display: inline-block;
  animation: guruPulse 2s infinite;
}
.guru-header-actions { display: flex; gap: 8px; }
.guru-header-actions button {
  background: rgba(255,255,255,0.12);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.guru-header-actions button:hover { background: rgba(255,255,255,0.25); }

/* Messages */
#guru-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
}
#guru-messages::-webkit-scrollbar { width: 4px; }
#guru-messages::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

.guru-msg {
  display: flex;
  gap: 8px;
  align-items: flex-end;
  animation: guruMsgIn 0.35s ease forwards;
  opacity: 0;
}
@keyframes guruMsgIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.guru-msg.guru-user { flex-direction: row-reverse; }
.guru-msg-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  background: #f0f4ff;
  border: 1.5px solid #e2e8f0;
}
.guru-msg.guru-bot .guru-msg-avatar { background: linear-gradient(135deg,#0e2f69,#1746a2); border-color: #0e2f69; }
.guru-bubble {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 13.5px;
  line-height: 1.55;
  word-break: break-word;
}
.guru-msg.guru-bot .guru-bubble {
  background: #f0f4ff;
  color: #1e293b;
  border-bottom-left-radius: 4px;
}
.guru-msg.guru-user .guru-bubble {
  background: linear-gradient(135deg, #0e2f69, #1746a2);
  color: white;
  border-bottom-right-radius: 4px;
}
.guru-msg-time {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 4px;
  text-align: right;
}
.guru-msg.guru-bot .guru-msg-time { text-align: left; }

/* Typing indicator */
.guru-typing .guru-bubble {
  background: #f0f4ff;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
}
.guru-dot {
  width: 7px; height: 7px;
  background: #94a3b8;
  border-radius: 50%;
  animation: guruTyping 1.2s ease infinite;
}
.guru-dot:nth-child(2) { animation-delay: 0.2s; }
.guru-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes guruTyping {
  0%, 80%, 100% { transform: scale(1); opacity: 0.5; }
  40% { transform: scale(1.3); opacity: 1; }
}

/* Quick chips */
#guru-suggestions {
  display: flex;
  gap: 7px;
  padding: 8px 14px;
  overflow-x: auto;
  flex-shrink: 0;
  scrollbar-width: none;
}
#guru-suggestions::-webkit-scrollbar { display: none; }
.guru-chip {
  background: #f0f4ff;
  border: 1.5px solid #c7d7f8;
  color: #0e2f69;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 13px;
  border-radius: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.2s;
}
.guru-chip:hover { background: #0e2f69; color: #facc15; border-color: #0e2f69; }

/* Input */
.guru-input-bar {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid #f1f5f9;
  flex-shrink: 0;
  background: white;
}
#guru-input {
  flex: 1;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  background: #f8fafc;
  color: #1e293b;
}
#guru-input:focus { border-color: #1746a2; background: white; }
#guru-send {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #0e2f69, #1746a2);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  flex-shrink: 0;
}
#guru-send:hover { transform: scale(1.05); box-shadow: 0 5px 15px rgba(14,47,105,0.3); }
#guru-send:active { transform: scale(0.95); }

.guru-footer-branding {
  text-align: center;
  font-size: 10px;
  color: #94a3b8;
  padding: 0 14px 10px;
  flex-shrink: 0;
}
.guru-footer-branding strong { color: #0e2f69; }
`;

  // ── Logic ────────────────────────────────────────────────────────────────────
  function getTime() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  function getAnswer(text) {
    const lower = text.toLowerCase();
    for (const item of GURU_RESPONSES) {
      if (item.keywords.some(k => lower.includes(k))) {
        return item.reply;
      }
    }
    return DEFAULT_REPLY;
  }

  function appendMsg(html, type, container) {
    const div = document.createElement('div');
    div.className = `guru-msg guru-${type}`;

    const avatarEmoji = type === 'bot' ? '🧑‍🏫' : '🙋';
    div.innerHTML = `
      <div class="guru-msg-avatar">${avatarEmoji}</div>
      <div>
        <div class="guru-bubble">${html}</div>
        <div class="guru-msg-time">${getTime()}</div>
      </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
  }

  function showTyping(container) {
    const div = document.createElement('div');
    div.className = 'guru-msg guru-bot guru-typing';
    div.innerHTML = `
      <div class="guru-msg-avatar">🧑‍🏫</div>
      <div class="guru-bubble">
        <span class="guru-dot"></span>
        <span class="guru-dot"></span>
        <span class="guru-dot"></span>
      </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div;
  }

  function sendMessage(text, messagesEl) {
    if (!text.trim()) return;
    appendMsg(text, 'user', messagesEl);

    // Show typing for a natural delay
    const typingEl = showTyping(messagesEl);
    const delay = 800 + Math.random() * 600;

    setTimeout(() => {
      typingEl.remove();
      appendMsg(getAnswer(text), 'bot', messagesEl);
    }, delay);
  }

  function init() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = WIDGET_CSS;
    document.head.appendChild(style);

    // Inject HTML
    const wrapper = document.createElement('div');
    wrapper.innerHTML = WIDGET_HTML;
    document.body.appendChild(wrapper.firstElementChild);

    const fab = document.getElementById('guru-fab');
    const panel = document.getElementById('guru-panel');
    const messagesEl = document.getElementById('guru-messages');
    const input = document.getElementById('guru-input');
    const sendBtn = document.getElementById('guru-send');
    const closeBtn = document.getElementById('guru-close');
    const clearBtn = document.getElementById('guru-clear');
    const chips = document.querySelectorAll('.guru-chip');

    let isOpen = false;

    function openPanel() {
      panel.classList.add('guru-open');
      panel.setAttribute('aria-hidden', 'false');
      isOpen = true;
      input.focus();
      // Show welcome message if empty
      if (messagesEl.children.length === 0) {
        setTimeout(() => {
          appendMsg('🙏 <strong>Namaste!</strong> I\'m <strong>Guru Ji</strong>, your AI learning companion at edHills!<br><br>Ask me about our courses, syllabus, fees, test series, or study tips. Main aapki poori madad karoonga! 🚀', 'bot', messagesEl);
        }, 300);
      }
    }

    function closePanel() {
      panel.classList.remove('guru-open');
      panel.setAttribute('aria-hidden', 'true');
      isOpen = false;
    }

    fab.addEventListener('click', () => isOpen ? closePanel() : openPanel());
    fab.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); isOpen ? closePanel() : openPanel(); } });
    closeBtn.addEventListener('click', closePanel);

    clearBtn.addEventListener('click', () => {
      messagesEl.innerHTML = '';
      setTimeout(() => {
        appendMsg('✨ Chat cleared! Ask me anything about edHills courses, exams, or study tips. 🙏', 'bot', messagesEl);
      }, 100);
    });

    sendBtn.addEventListener('click', () => {
      const val = input.value.trim();
      if (val) { sendMessage(val, messagesEl); input.value = ''; }
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const val = input.value.trim();
        if (val) { sendMessage(val, messagesEl); input.value = ''; }
      }
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const msg = chip.dataset.msg;
        if (!isOpen) openPanel();
        setTimeout(() => {
          sendMessage(msg, messagesEl);
        }, isOpen ? 0 : 400);
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (isOpen && !document.getElementById('guru-widget').contains(e.target)) {
        closePanel();
      }
    });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
