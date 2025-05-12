
class ScrambleTyped {
    constructor(el, options) {
        this.el = typeof el === 'string' ? document.querySelector(el) : el;
        this.text = options.text || this.el.innerText;
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
        this.onEnd = options.onComplete || null;

        this.currentIndex = 0;
        this.el.innerText = "";
        if (!this.useStartTrigger) this.start();
    }

    //for future development
    #processNode(node, parentEl) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            for (const char of text) {
                const span = document.createElement('span');
                parentEl.appendChild(span);
                this.#scrambleChar(char, span);
            }
        }
        else if (node.nodeType === Node.ELEMENT_NODE) {
            const el = document.createElement(node.tagName);
            for (const attr of node.attributes) {
                el.setAttribute(attr.name, attr.value);
            }
            parentEl.appendChild(el);
            for (const child of node.childNodes) {
                this.#processNode(child, el);
            }
        }
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
        this.el.appendChild(span);
        this.#scrambleChar(char, span);

        this.currentIndex++;
        setTimeout(() => (this.#type()), this.typeSpeed);
    }

    // public methods
    start() {
        const fullDuration = (this.text.length * this.typeSpeed) + (this.scrambleDuration);
        if (this.restoreOnEnd) {
            setTimeout(() => {
                this.el.innerHTML = this.text;
            }, (fullDuration + 100));
        }
        if (this.onComplete && typeof this.onComplete === 'function') {
            setTimeout(() => {
                this.onComplete();
            }, (fullDuration + 100));
        }
        if (this.onStart && typeof this.onStart === 'function') {
            this.onStart();
        }
    	this.#type();
    }
}

module.exports = ScrambleTyped