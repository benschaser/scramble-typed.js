
class ScrambleTyped {
    constructor(el, options) {
        this.target = typeof el === 'string' ? document.querySelector(el) : el;
        this.text = options.text || this.target.innerText;
        this.useStartTrigger = options.useStartTrigger || false;
        this.typeSpeed = options.typeSpeed || 50;
        this.scrambleDuration = options.scrambleDuration  || 500;
        this.scrambleSpeed = options.scrambleSpeed || 100;
        this.scrambleClasses = options.scrambleClasses || [];
        this.charset = options.charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        this.preserveSpaces = options.preserveSpaces || false;
        this.restoreOnEnd = options.restoreOnEnd || true;

        // callbacks
        this.onStart = options.onStart || null;
        this.onEnd = options.onEnd || null;

        // init
        this.#init();
    }
    #innerds = "";
    #isRunning = false;
    #init() {
        this.currentIndex = 0;
        this.#innerds = this.target.innerHTML;
        this.target.innerText = "";
        if (!this.useStartTrigger) this.start();
    }
    #addScrambleClasses(el) {
        this.scrambleClasses.forEach(c => {
            el.classList.add(c);
        });
    }
    #removeScrambleClasses(el) {
        this.scrambleClasses.forEach(c => {
            el.classList.remove(c);
        });
    }
    #scrambleChar(finalChar, span) {
        if (this.preserveSpaces && finalChar === ' ') {
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

            const randomChar = this.charset[Math.floor(Math.random() * this.charset.length)];
            span.textContent = randomChar;
            setTimeout(scramble, this.scrambleSpeed);
        };

        scramble();
    }

    #type() {
        if (this.currentIndex >= this.text.length) return;

        const char = this.text[this.currentIndex];
        const span = document.createElement('span');
        this.#addScrambleClasses(span);
        this.target.appendChild(span);
        this.#scrambleChar(char, span);

        this.currentIndex++;
        setTimeout(() => (this.#type()), this.typeSpeed);
    }
    #end() {
        if (this.restoreOnEnd) {
            this.target.innerHTML = this.text;
        }
        this.#isRunning = false;
        if (this.onEnd && typeof this.onEnd === 'function') {
            this.onEnd();
        }
    }

    // public methods
    start() {
        if (this.#isRunning) {
            return;
        }
        const fullDuration = (this.text.length * this.typeSpeed) + (this.scrambleDuration);
        setTimeout(() => {
            this.#end(); 
        }, (fullDuration + 200));
        
        if (this.onStart && typeof this.onStart === 'function') {
            this.onStart();
        }
        this.#isRunning = true;
    	this.#type();
    }
}

//export default ScrambleTyped;