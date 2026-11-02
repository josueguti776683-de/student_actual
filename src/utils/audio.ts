/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let speechTimeoutId: any = null;

/**
 * Stop any current speech synthesis and clear safety timeouts.
 */
export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (speechTimeoutId) {
    clearTimeout(speechTimeoutId);
    speechTimeoutId = null;
  }
}

/**
 * Speak text in US/UK English with a custom speaking rate.
 */
export function speakTextWithRate(text: string, rate: number, onEndCallback?: () => void) {
  stopSpeaking();

  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("Speech synthesis not supported in this browser.");
    if (onEndCallback) {
      onEndCallback();
    }
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate; // Custom speaking rate (e.g. 1.0 for normal, 0.55 for slow)
    utterance.pitch = 1;

    let resolved = false;

    const finish = () => {
      if (resolved) return;
      resolved = true;
      if (speechTimeoutId) {
        clearTimeout(speechTimeoutId);
        speechTimeoutId = null;
      }
      if (onEndCallback) {
        onEndCallback();
      }
    };

    utterance.onend = () => {
      finish();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis notice:", e.error || e);
      finish();
    };

    // Safety timeout: longer timeout for slow rate or longer texts
    const timeoutDuration = Math.max(15000, (text.split(" ").length * 1500) / rate);
    speechTimeoutId = setTimeout(() => {
      console.warn("Speech synthesis timed out, forcing completion callback.");
      stopSpeaking();
      finish();
    }, timeoutDuration);

    setTimeout(() => {
      try {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.warn("Failed to execute speak():", err);
        finish();
      }
    }, 50);
  } catch (error) {
    console.warn("Failed to invoke speakText:", error);
    if (onEndCallback) {
      onEndCallback();
    }
  }
}

/**
 * Speak text in US/UK English with a safety backup timeout.
 */
export function speakText(text: string, onEndCallback?: () => void) {
  stopSpeaking();

  if (typeof window === "undefined" || !window.speechSynthesis) {
    console.warn("Speech synthesis not supported in this browser.");
    if (onEndCallback) {
      // Execute callback immediately if speech is not supported
      onEndCallback();
    }
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;

    let resolved = false;

    const finish = () => {
      if (resolved) return;
      resolved = true;
      if (speechTimeoutId) {
        clearTimeout(speechTimeoutId);
        speechTimeoutId = null;
      }
      if (onEndCallback) {
        onEndCallback();
      }
    };

    utterance.onend = () => {
      finish();
    };

    utterance.onerror = (e) => {
      // Use console.warn instead of console.error to avoid telemetry flagging it as a fatal app error
      console.warn("Speech synthesis notice:", e.error || e);
      finish();
    };

    // Safety timeout: dynamic speech time based on text length + margin (min 8s)
    const timeoutDuration = Math.max(8000, text.split(" ").length * 1500);
    speechTimeoutId = setTimeout(() => {
      console.warn("Speech synthesis timed out, forcing completion callback.");
      stopSpeaking();
      finish();
    }, timeoutDuration);

    // Short delay before speaking to prevent browser queue collision after stopSpeaking/cancel
    setTimeout(() => {
      try {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.warn("Failed to execute speak():", err);
        finish();
      }
    }, 50);
  } catch (error) {
    console.warn("Failed to invoke speakText:", error);
    if (onEndCallback) {
      onEndCallback();
    }
  }
}
