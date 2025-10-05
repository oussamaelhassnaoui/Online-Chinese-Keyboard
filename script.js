document.addEventListener('DOMContentLoaded', () => {
    const keyboardContainer = document.getElementById('keyboard');
    const secondaryKeyboardContainer = document.getElementById('secondary-keyboard');
    const textInput = document.getElementById('text-input');
    const copyBtn = document.getElementById('copy-btn');
    const googleSearchBtn = document.getElementById('google-search-btn');
    const youtubeSearchBtn = document.getElementById('youtube-search-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');

    const keyboardLayout = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'delete'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ];

    const secondaryKeyboardLayout = [
        ['ai', 'an', 'ang', 'ao', 'e', 'ei', 'en', 'eng', 'er', 'i'],
        ['ia', 'ian', 'iang', 'iao', 'ie', 'in', 'ing', 'iong', 'iu', 'ong'],
        ['ou', 'u', 'ua', 'uai', 'uan', 'uang', 'ue', 'ui', 'un', 'uo', 'ü']
    ];

    // Theme switcher
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeToggleBtn.textContent = '☀️ Light Mode';
        } else {
            themeToggleBtn.textContent = '🌙 Dark Mode';
        }
    } else {
        themeToggleBtn.textContent = '🌙 Dark Mode';
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.body.removeAttribute('data-theme');
            document.documentElement.removeAttribute('data-theme');
            localStorage.removeItem('theme');
            themeToggleBtn.textContent = '🌙 Dark Mode';
        } else {
            document.body.setAttribute('data-theme', 'dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️ Light Mode';
        }
    });

    // Main Keyboard
    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');
        row.forEach(key => {
            const keyDiv = document.createElement('div');
            keyDiv.classList.add('key');

            if (key === 'delete') {
                keyDiv.textContent = 'Delete';
                keyDiv.classList.add('key-special');
                keyDiv.addEventListener('click', () => {
                    textInput.value = textInput.value.slice(0, -1);
                    textInput.focus();
                    updateSearchLinks();
                    // Visual feedback
                    keyDiv.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        keyDiv.style.transform = '';
                    }, 100);
                });
            } else if (key === 'enter') {
                keyDiv.textContent = 'Enter';
                keyDiv.classList.add('key-special', 'key-enter');
                keyDiv.addEventListener('click', () => {
                    textInput.value += '\n';
                    textInput.focus();
                    updateSearchLinks();
                    // Visual feedback
                    keyDiv.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        keyDiv.style.transform = '';
                    }, 100);
                });
            } else {
                const englishChar = document.createElement('span');
                englishChar.classList.add('english-char');
                englishChar.textContent = key;

                const chineseChar = document.createElement('span');
                chineseChar.classList.add('chinese-char');
                chineseChar.textContent = pinyins[key] ? pinyins[key].chars[0] : '';

                keyDiv.appendChild(englishChar);
                keyDiv.appendChild(chineseChar);

                keyDiv.addEventListener('click', () => {
                    if (pinyins[key]) {
                        textInput.value += pinyins[key].chars;
                        textInput.focus();
                        updateSearchLinks();
                        // Visual feedback
                        keyDiv.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            keyDiv.style.transform = '';
                        }, 100);
                    }
                });
            }

            keyDiv.classList.add('fade-in');
            rowDiv.appendChild(keyDiv);
        });
        keyboardContainer.appendChild(rowDiv);
    });

    // Secondary Keyboard
    secondaryKeyboardLayout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('keyboard-row');
        row.forEach(pinyinKey => {
            const pinyinData = secondaryPinyins.find(p => p.pinyin === pinyinKey);
            if (pinyinData) {
                const keyDiv = document.createElement('div');
                keyDiv.classList.add('key', 'key-secondary');

                const pinyinChar = document.createElement('span');
                pinyinChar.classList.add('pinyin-char');
                pinyinChar.textContent = pinyinData.pinyin;

                const chineseChar = document.createElement('span');
                chineseChar.classList.add('chinese-char');
                chineseChar.textContent = pinyinData.char;

                keyDiv.appendChild(pinyinChar);
                keyDiv.appendChild(chineseChar);

                keyDiv.addEventListener('click', () => {
                    textInput.value += pinyinData.char;
                    textInput.focus();
                    updateSearchLinks();
                    // Visual feedback
                    keyDiv.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        keyDiv.style.transform = '';
                    }, 100);
                });

                keyDiv.classList.add('fade-in');
                rowDiv.appendChild(keyDiv);
            }
        });
        secondaryKeyboardContainer.appendChild(rowDiv);
    });

    textInput.addEventListener('input', updateSearchLinks);

    function updateSearchLinks() {
        const query = encodeURIComponent(textInput.value);
        googleSearchBtn.href = `https://www.google.com/search?q=${query}`;
        youtubeSearchBtn.href = `https://www.youtube.com/results?search_query=${query}`;
    }

    copyBtn.addEventListener('click', () => {
        if (textInput.value) {
            navigator.clipboard.writeText(textInput.value)
                .then(() => {
                    // Visual feedback
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = 'Copied!';
                    copyBtn.style.backgroundColor = '#28a745';
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                        copyBtn.style.backgroundColor = '';
                    }, 1500);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy text!');
                });
        } else {
            alert('Nothing to copy!');
        }
    });

    // Initial update in case there is text in the input from the start
    updateSearchLinks();
});
