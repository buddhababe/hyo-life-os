(function () {
  const LOCK_KEY = "hyo-life-os-lock-v1";
  const SESSION_KEY = "hyo-life-os-unlocked-v1";
  const ITERATIONS = 160000;

  function bytesToBase64(bytes) {
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  function base64ToBytes(base64) {
    const binary = atob(base64);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  }

  async function deriveHash(passphrase, salt) {
    const encoded = new TextEncoder().encode(passphrase);
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoded,
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: ITERATIONS,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );
    return bytesToBase64(new Uint8Array(bits));
  }

  function hasLock() {
    return Boolean(localStorage.getItem(LOCK_KEY));
  }

  function isUnlocked() {
    return hasLock() && sessionStorage.getItem(SESSION_KEY) === "true";
  }

  function isValidPin(pin) {
    return /^\d{4}$/.test(pin || "");
  }

  async function setLock(passphrase) {
    if (!isValidPin(passphrase)) {
      throw new Error("잠금 PIN은 숫자 4자리여야 합니다.");
    }
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const hash = await deriveHash(passphrase, salt);
    localStorage.setItem(
      LOCK_KEY,
      JSON.stringify({
        version: 1,
        kdf: "PBKDF2-SHA256",
        iterations: ITERATIONS,
        salt: bytesToBase64(salt),
        hash
      })
    );
    sessionStorage.setItem(SESSION_KEY, "true");
  }

  async function unlock(passphrase) {
    if (!isValidPin(passphrase)) {
      throw new Error("잠금 PIN은 숫자 4자리입니다.");
    }
    const raw = localStorage.getItem(LOCK_KEY);
    if (!raw) {
      sessionStorage.setItem(SESSION_KEY, "true");
      return true;
    }
    const lock = JSON.parse(raw);
    const hash = await deriveHash(passphrase, base64ToBytes(lock.salt));
    if (hash !== lock.hash) {
      throw new Error("암호가 맞지 않습니다.");
    }
    sessionStorage.setItem(SESSION_KEY, "true");
    return true;
  }

  function lockNow() {
    if (hasLock()) {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

  function clearLock() {
    localStorage.removeItem(LOCK_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }

  window.LifeAuth = {
    hasLock,
    isUnlocked,
    setLock,
    unlock,
    lockNow,
    clearLock
  };
})();
