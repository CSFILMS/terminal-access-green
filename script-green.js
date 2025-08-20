document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password');
  const msg = document.getElementById('msg');
  const prompt = document.getElementById('prompt');
  const boot = document.getElementById('boot');
  const video = document.getElementById('video');

  const correctPassword = 'A$$ANGE';

  const accessGrantedSequence = [
    'ACCESS GRANTED',
    'DECRYPTING PAYLOAD...',
    'LOADING VIDEO MODULE',
    'EXECUTION AUTHORIZED'
  ];

  const accessDeniedMessages = [
    'ACCESS DENIED',
    'UNAUTHORIZED ATTEMPT LOGGED',
    'INVALID KEY SEQUENCE',
    'SECURITY PROTOCOL ENGAGED',
    'FINGERPRINT MISMATCH'
  ];

  function scrambleText(element, finalText, callback) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let iteration = 0;
    const scrambled = finalText.split('');

    const interval = setInterval(() => {
      const display = scrambled.map((char, i) => {
        if (i < iteration) return finalText[i];
        return chars[Math.floor(Math.random() * chars.length)];
      });
      element.textContent = display.join('');
      if (iteration >= finalText.length) {
        clearInterval(interval);
        element.textContent = finalText;
        if (callback) callback();
      }
      iteration++;
    }, 15);
  }

  function runSequence(lines, element, delay = 300, done) {
    let i = 0;
    function next() {
      if (i < lines.length) {
        scrambleText(element, lines[i], () => setTimeout(next, delay));
        i++;
      } else if (done) done();
    }
    next();
  }

  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const attempt = passwordInput.value;
      if (attempt === correctPassword) {
        passwordInput.style.display = 'none';
        runSequence(accessGrantedSequence, msg, 300, () => {
          video.style.display = 'block';
          video.play();
        });
      } else {
        const denial = accessDeniedMessages[Math.floor(Math.random() * accessDeniedMessages.length)];
        scrambleText(msg, denial, () => { passwordInput.value = ''; });
      }
    }
  });

  const bootSequence = [
    '[OK] BIOS checksum verified',
    '[OK] Bootloader decrypted',
    '[OK] Neural access bridge initialized',
    '[OK] Proxy tunnels established',
    '[OK] Identity hash resolved',
    '[WARN] Clearance level: REDACTED'
  ];

  runSequence(bootSequence, boot, 300, () => {
    scrambleText(prompt, '> ENTER AUTHORIZATION PASSWORD:');
  });

  // ---- GLOW TOGGLE & COLOR SWITCHING ----
  const terminalElements = [boot, prompt, msg, passwordInput];
  let glowEnabled = true;
  let colorIndex = 1;
  const colors = ['#808080', '#00FF00', '#66FF66']; // gray, pure green, soft green

  function updateColors() {
    terminalElements.forEach(el => {
      el.style.color = colors[colorIndex];
      el.style.textShadow = glowEnabled
        ? `0 0 2px ${colors[colorIndex]}, 0 0 12px ${colors[colorIndex]}`
        : 'none';
    });
    passwordInput.style.caretColor = colors[colorIndex];
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'g' || e.key === 'G') {
      glowEnabled = !glowEnabled;
      updateColors();
    } else if (['1','2','3'].includes(e.key)) {
      colorIndex = parseInt(e.key) - 1;
      updateColors();
    }
  });

  // initial color setup
  updateColors();
});
