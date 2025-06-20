class ScrambleTyped {
  constructor(el, options) {
    this.target = typeof el === "string" ? document.querySelector(el) : el;
    this.text = options.text || this.target.innerText;
    this.useStartTrigger = options.useStartTrigger || false;
    this.typeSpeed = options.typeSpeed !== undefined ? options.typeSpeed : 50;
    this.scrambleDuration =
      options.scrambleDuration !== undefined ? options.scrambleDuration : 500;
    this.scrambleSpeed =
      options.scrambleSpeed !== undefined ? options.scrambleSpeed : 100;
    this.scrambleClasses = options.scrambleClasses || [];
    this.charset =
      options.charset ||
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    this.preserveSpaces = options.preserveSpaces || false;
    this.restoreOnEnd =
      options.restoreOnEnd !== undefined ? options.restoreOnEnd : true;

    this.#useNodes = this.target.childNodes.length > 0;
    // callbacks
    this.onStart = options.onStart || null;
    this.onEnd = options.onEnd || null;

    // init
    this.#init();
  }
  #innerds = "";
  #model = null;
  #useNodes = false;
  #isRunning = false;
  #currentIndex = 0;
  #charSpanMap = [];
  #init() {
    this.#currentIndex = 0;
    this.#innerds = this.target.innerHTML;
    this.#model = this.target.cloneNode(true);
    if (this.#useNodes) {
      this.#createTextList();
    } else {
      this.target.innerHTML = "";
    }
    if (!this.useStartTrigger) this.start();
  }
  #addScrambleClasses(el) {
    this.scrambleClasses.forEach((c) => {
      el.classList.add(c);
    });
  }
  #removeScrambleClasses(el) {
    this.scrambleClasses.forEach((c) => {
      el.classList.remove(c);
    });
  }
  #scrambleChar(finalChar, span) {
    if (this.preserveSpaces && /\s/.test(finalChar)) {
      this.#removeScrambleClasses(span);
      span.textContent = finalChar;
      return;
    }
    const startTime = Date.now();

    const scramble = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= this.scrambleDuration) {
        span.textContent = finalChar;
        this.#removeScrambleClasses(span);
        return;
      }

      const randomChar =
        this.charset[Math.floor(Math.random() * this.charset.length)];
      span.textContent = randomChar;
      setTimeout(scramble, this.scrambleSpeed);
    };

    scramble();
  }

  #typeNodes() {
    if (this.#currentIndex >= this.#charSpanMap.length) return;

    const char = this.#charSpanMap[this.#currentIndex].char;
    const span = this.#charSpanMap[this.#currentIndex].span;
    this.#addScrambleClasses(span);
    //this.target.appendChild(span);
    this.#scrambleChar(char, span);

    this.#currentIndex++;
    setTimeout(() => this.#typeNodes(), this.typeSpeed);
  }
  #typeSimple() {
    if (this.#currentIndex >= this.text.length) return;

    const char = this.text[this.#currentIndex];
    const span = document.createElement("span");
    this.#addScrambleClasses(span);
    this.target.appendChild(span);
    this.#scrambleChar(char, span);

    this.#currentIndex++;
    setTimeout(() => this.#typeSimple(), this.typeSpeed);
  }
  #end() {
    if (this.restoreOnEnd) {
      if (this.#useNodes) {
        this.target.innerHTML = this.#innerds;
      } else {
        console.log("restoring");
        this.target.innerHTML = this.text;
      }
    }

    this.#isRunning = false;
    if (this.onEnd && typeof this.onEnd === "function") {
      this.onEnd();
    }
  }
  #textSplit(el) {
    const span = document.createElement("span");
    const text = el.nodeValue;
    el.nodeValue = "";

    [...text].forEach((character) => {
      const charSpan = document.createElement("span");
      span.appendChild(charSpan);
      this.#charSpanMap.push({ span: charSpan, char: character });
    });
    return span;
  }
  #createTextList() {
    this.#traverse(this.target);
  }
  #traverse(el) {
    if (!el) return;
    else if (el.nodeType === Node.TEXT_NODE) return;
    else {
      const children = Array.from(el.childNodes);
      children.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()) {
          const span = this.#textSplit(child);
          el.replaceChild(span, child);
        } else {
          this.#traverse(child);
        }
      });
    }
  }

  // public methods
  start() {
    if (this.#isRunning) {
      return;
    }
    const fullDuration = this.#useNodes
      ? this.#charSpanMap.length * this.typeSpeed + this.scrambleDuration
      : this.text.length * this.typeSpeed + this.scrambleDuration;
    setTimeout(() => {
      this.#end();
    }, fullDuration + 200);

    if (this.onStart && typeof this.onStart === "function") {
      this.onStart();
    }
    this.#isRunning = true;
    if (this.#useNodes) this.#typeNodes();
    else this.#typeSimple();
  }
}

export default ScrambleTyped;
