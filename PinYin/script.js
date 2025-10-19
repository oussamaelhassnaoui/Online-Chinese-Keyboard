// Pinyin to Chinese conversion functionality
// Using CC-CEDICT dictionary for comprehensive conversion

document.addEventListener('DOMContentLoaded', function() {
    const pinyinInput = document.getElementById('pinyin-input');
    const convertButton = document.getElementById('convert-btn');
    const chineseOutput = document.getElementById('chinese-output');
    const copyButton = document.getElementById('copy-btn');
    const googleButton = document.getElementById('google-btn');
    const youtubeButton = document.getElementById('youtube-btn');
    const verticalSuggestions = document.getElementById('vertical-suggestions');
    const verticalSuggestionsList = document.getElementById('vertical-suggestions-list');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Load the CC-CEDICT dictionary
    let cedict = {};
    
    // Check for saved theme preference or default to light theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
    
    // Theme toggle functionality with enhanced transition
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Add transition class for smooth theme switching
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
        
        // Update theme icon with animation
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.textContent = '☀️';
            themeIcon.style.transform = 'rotate(180deg)';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.textContent = '🌙';
            themeIcon.style.transform = 'rotate(0deg)';
            localStorage.setItem('theme', 'light');
        }
        
        // Add animation to the icon
        themeIcon.style.transition = 'transform 0.3s ease, font-size 0.3s ease';
    });
    
    // Fetch the dictionary file
    fetch('cedict.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Dictionary file not found');
            }
            return response.json();
        })
        .then(data => {
            cedict = data;
            console.log(`Loaded CC-CEDICT with ${Object.keys(cedict).length} entries`);
            // Update the instructions to show that the full dictionary is loaded
            const instructions = document.querySelector('.instructions ul');
            if (instructions) {
                instructions.innerHTML = `
                    <li>Type Pinyin with tone numbers (e.g., "ni3 hao3")</li>
                    <li>Or type Pinyin without tones (e.g., "ni hao")</li>
                    <li>Supports ${Object.keys(cedict).length.toLocaleString()} Chinese words and phrases</li>
                    <li>Powered by the CC-CEDICT dictionary</li>
                    <li>Real-time suggestions as you type</li>
                `;
            }
        })
        .catch(error => {
            console.error('Failed to load CC-CEDICT dictionary:', error);
            // Show error to user with instructions for running locally
            chineseOutput.innerHTML = `
                <p class="placeholder">
                    Dictionary loading failed. This is normal when opening the file directly.<br>
                    For full functionality, please run with a local server:<br>
                    1. Open terminal in this folder<br>
                    2. Run: node server.js<br>
                    3. Visit: http://localhost:8000<br>
                    <br>
                    Using limited vocabulary for now.
                </p>
            `;
            
            // Provide a basic fallback dictionary
            cedict = {
                "ni": ["你 (you)", "泥 (mud)", "铌 (niobium)", "伱 (you, informal)", "㝵 (to obtain)"],
                "hao": ["好 (good)", "号 (number)", "毫 (milli-)", "郝 (surname)"],
                "wo": ["我 (I, me)", "窝 (nest)", "挝 (to beat)", "倭 (dwarf, Japan)"],
                "men": ["们 (plural suffix)", "门 (door)", "闷 (depressed)"],
                "zhong": ["中 (middle)", "种 (type)", "重 (heavy)"],
                "guo": ["国 (country)", "过 (to pass)", "果 (fruit)"],
                "shi": ["是 (to be)", "十 (ten)", "时 (time)"],
                "jie": ["界 (world)", "结 (to tie)", "姐 (elder sister)"],
                "ai": ["爱 (love)", "艾 (moxa)", "碍 (to hinder)"],
                "xie": ["谢 (to thank)", "些 (some)", "鞋 (shoes)"],
                "dui": ["对 (correct)", "队 (team)", "堆 (pile)"],
                "bu": ["不 (not)", "布 (cloth)", "步 (step)"],
                "qi": ["七 (seven)", "起 (to rise)", "气 (air)"],
                "mei": ["没 (not have)", "美 (beautiful)", "煤 (coal)"],
                "guan": ["关 (to close)", "管 (pipe)", "官 (official)"],
                "xi": ["西 (west)", "洗 (to wash)", "戏 (game)"],
                "qing": ["请 (please)", "情 (feeling)", "清 (clear)"],
                "wen": ["问 (to ask)", "文 (text)", "温 (warm)"],
                "jiao": ["叫 (to call)", "教 (to teach)", "觉 (to sleep)"],
                "bei": ["北 (north)", "被 (by)", "背 (back)"],
                "jing": ["京 (capital)", "经 (pass through)", "精 (essence)"],
                "shang": ["上 (up)", "商 (merchant)", "伤 (wound)"],
                "hai": ["海 (sea)", "还 (still)", "孩 (child)"],
                // Multi-syllable phrases - these should take priority
                "woaini": ["我爱你 (I love you)"],
                "wo ai ni": ["我爱你 (I love you)"],
                "ni hao": ["你好 (hello)"],
                "xiexie": ["谢谢 (thank you)"],
                "xie xie": ["谢谢 (thank you)"],
                "duibuqi": ["对不起 (sorry)"],
                "dui bu qi": ["对不起 (sorry)"],
                "meiguanxi": ["没关系 (it's okay)"],
                "mei guan xi": ["没关系 (it's okay)"],
                "qingwen": ["请问 (excuse me)"],
                "qing wen": ["请问 (excuse me)"],
                "wojiao": ["我叫 (my name is)"],
                "wo jiao": ["我叫 (my name is)"],
                "zhongguo": ["中国 (China)"],
                "zhong guo": ["中国 (China)"],
                "beijing": ["北京 (Beijing)"],
                "bei jing": ["北京 (Beijing)"],
                "shanghai": ["上海 (Shanghai)"],
                "shang hai": ["上海 (Shanghai)"]
            };
        });
    
    // Function to normalize Pinyin by removing spaces and tone marks
    function normalizePinyin(pinyin) {
        return pinyin.toLowerCase().replace(/\s+/g, ' ').replace(/[0-9]/g, '');
    }
    
    // Function to extract Chinese characters and meaning from dictionary entry
    function parseDictionaryEntry(entry) {
        // Entry format: "汉字 (meaning)"
        const match = entry.match(/^([^\s\(]+)\s*\(([^)]+)\)/);
        if (match) {
            return {
                chinese: match[1],
                pinyin: '', // We don't have pinyin in this format
                meaning: match[2]
            };
        }
        // Fallback if format is different
        const parts = entry.split(' ');
        return {
            chinese: parts[0] || entry,
            pinyin: '',
            meaning: parts.slice(1).join(' ').replace(/[()]/g, '') || 'No meaning available'
        };
    }
    
    // Function to find suggestions for each syllable in the input
    function findSyllableSuggestions(input) {
        const normalized = normalizePinyin(input).trim();
        if (!normalized) return [];
        
        // Split the input into syllables
        const syllables = normalized.split(' ');
        const suggestions = [];
        
        // For each syllable, find suggestions
        for (let i = 0; i < syllables.length; i++) {
            const syllable = syllables[i];
            const syllableSuggestions = [];
            
            // Look for exact matches first
            if (cedict[syllable]) {
                for (const entry of cedict[syllable]) {
                    const parsed = parseDictionaryEntry(entry);
                    syllableSuggestions.push({
                        key: syllable,
                        chinese: parsed.chinese,
                        pinyin: syllable,
                        meaning: parsed.meaning
                    });
                }
            }
            
            // If we don't have enough suggestions, look for partial matches
            if (syllableSuggestions.length < 5) {
                const keys = Object.keys(cedict);
                for (const key of keys) {
                    if (key.startsWith(syllable) && key !== syllable && syllableSuggestions.length < 5) {
                        for (const entry of cedict[key]) {
                            const parsed = parseDictionaryEntry(entry);
                            syllableSuggestions.push({
                                key: key,
                                chinese: parsed.chinese,
                                pinyin: key,
                                meaning: parsed.meaning
                            });
                            if (syllableSuggestions.length >= 5) break;
                        }
                    }
                    if (syllableSuggestions.length >= 5) break;
                }
            }
            
            // If still no suggestions, add a placeholder
            if (syllableSuggestions.length === 0) {
                syllableSuggestions.push({
                    key: syllable,
                    chinese: `[${syllable}]`,
                    pinyin: syllable,
                    meaning: 'No suggestions found'
                });
            }
            
            suggestions.push({
                syllable: syllable,
                position: i,
                options: syllableSuggestions.slice(0, 5) // Limit to 5 options per syllable
            });
        }
        
        return suggestions;
    }
    
    // Function to display syllable suggestions vertically in the output area
    function displaySyllableSuggestions(suggestions) {
        if (suggestions.length === 0) {
            verticalSuggestions.classList.add('hidden');
            return;
        }
        
        verticalSuggestionsList.innerHTML = '';
        
        // Create a section for each syllable
        suggestions.forEach((syllableGroup, index) => {
            const section = document.createElement('div');
            section.className = 'syllable-section';
            
            const header = document.createElement('h4');
            header.textContent = `Syllable ${index + 1}: "${syllableGroup.syllable}"`;
            header.style.marginBottom = '10px';
            header.style.color = '#c00';
            section.appendChild(header);
            
            const optionsList = document.createElement('ul');
            optionsList.style.listStyle = 'none';
            optionsList.style.padding = '0';
            optionsList.style.margin = '0 0 20px 0';
            optionsList.style.display = 'flex';
            optionsList.style.flexDirection = 'column';
            optionsList.style.gap = '8px';
            
            syllableGroup.options.forEach((option, optionIndex) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="chinese-char">${option.chinese}</span>
                    <span class="pinyin">[${option.pinyin}]</span>
                    <span class="meaning">${option.meaning}</span>
                `;
                li.style.padding = '12px 15px';
                li.style.background = '#f9f9f9';
                li.style.borderRadius = '6px';
                li.style.cursor = 'pointer';
                li.style.transition = 'all 0.2s ease';
                li.style.display = 'flex';
                li.style.flexDirection = 'column';
                li.style.border = '1px solid #eee';
                
                li.addEventListener('click', () => {
                    // Replace the syllable in the input with the selected character
                    replaceSyllableWithCharacter(syllableGroup.position, option.chinese);
                    // Hide suggestions
                    verticalSuggestions.classList.add('hidden');
                    // Trigger conversion
                    convertInput();
                });
                
                // Add hover effect
                li.addEventListener('mouseenter', () => {
                    li.style.background = '#e3f2fd';
                    li.style.transform = 'translateX(5px)';
                    li.style.borderColor = '#2196F3';
                });
                
                li.addEventListener('mouseleave', () => {
                    li.style.background = '#f9f9f9';
                    li.style.transform = 'translateX(0)';
                    li.style.borderColor = '#eee';
                });
                
                optionsList.appendChild(li);
            });
            
            section.appendChild(optionsList);
            verticalSuggestionsList.appendChild(section);
        });
        
        verticalSuggestions.classList.remove('hidden');
    }
    
    // Function to replace a syllable with a character in the input
    function replaceSyllableWithCharacter(position, character) {
        const inputText = pinyinInput.value.trim();
        const syllables = inputText.split(/\s+/);
        
        // Replace the syllable at the specified position with the character
        if (position < syllables.length) {
            syllables[position] = character;
        }
        
        // Join the syllables back together
        pinyinInput.value = syllables.join(' ');
        pinyinInput.focus();
    }
    
    // Function to convert Pinyin to Chinese using phrase matching
    function convertPinyinToChinese(pinyin) {
        // Normalize input: convert to lowercase and remove extra spaces
        const normalized = normalizePinyin(pinyin).trim();
        
        // First, check if the entire phrase exists as a multi-syllable entry
        if (cedict[normalized]) {
            // Return the first entry's Chinese characters
            const firstEntry = cedict[normalized][0];
            const chineseChars = firstEntry.split(' ')[0];
            return chineseChars;
        }
        
        // Handle multi-line input by processing each line separately
        const lines = normalized.split('\n');
        const convertedLines = [];
        
        for (const line of lines) {
            const cleanLine = line.trim().replace(/\s+/g, ' ');
            if (!cleanLine) {
                convertedLines.push('');
                continue;
            }
            
            // Split by spaces to get individual phrases
            const phrases = cleanLine.split(' ');
            const convertedPhrases = [];
            
            for (const phrase of phrases) {
                const cleanPhrase = normalizePinyin(phrase);
                if (!cleanPhrase) continue;
                
                // Try to find the best match using longest match first
                let result = '';
                let i = 0;
                
                while (i < cleanPhrase.length) {
                    let matched = false;
                    
                    // Try to match the longest possible phrases first
                    const sortedKeys = Object.keys(cedict).sort((a, b) => b.length - a.length);
                    
                    for (const key of sortedKeys) {
                        if (i + key.length <= cleanPhrase.length && 
                            cleanPhrase.substring(i, i + key.length) === key) {
                            // Take the first entry and extract just the Chinese characters
                            const firstEntry = cedict[key][0];
                            const chineseChars = firstEntry.split(' ')[0];
                            result += chineseChars;
                            i += key.length;
                            matched = true;
                            break;
                        }
                    }
                    
                    // If no match found, try syllable matching with our fallback dictionary
                    if (!matched) {
                        // Try common syllables
                        const syllables = ['a', 'o', 'e', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er',
                                          'ba', 'pa', 'ma', 'fa', 'da', 'ta', 'na', 'la', 'ga', 'ka', 'ha', 'za', 'ca', 'sa',
                                          'zha', 'cha', 'sha', 'ra',
                                          'bi', 'pi', 'mi', 'di', 'ti', 'ni', 'li', 'gi', 'ki', 'hi', 'ji', 'qi', 'xi',
                                          'bo', 'po', 'mo', 'fo', 'de', 'te', 'ne', 'le', 'ge', 'ke', 'he', 'ze', 'ce', 'se',
                                          'zhe', 'che', 'she', 're',
                                          'bu', 'pu', 'mu', 'fu', 'du', 'tu', 'nu', 'lu', 'gu', 'ku', 'hu', 'zu', 'cu', 'su',
                                          'zhu', 'chu', 'shu', 'ru',
                                          'wa', 'ya', 'wu', 'yu', 'we', 'ye', 'wo', 'yo', 'wa', 'ya',
                                          'bai', 'pai', 'mai', 'dai', 'tai', 'nai', 'lai', 'gai', 'kai', 'hai', 'zai', 'cai', 'sai',
                                          'zhai', 'chai', 'shai',
                                          'bei', 'pei', 'mei', 'fei', 'dei', 'tei', 'nei', 'lei', 'gei', 'kei', 'hei', 'zei', 'sei',
                                          'zhei', 'shei',
                                          'bao', 'pao', 'mao', 'dao', 'tao', 'nao', 'lao', 'gao', 'kao', 'hao', 'zao', 'cao', 'sao',
                                          'zhao', 'chao', 'shao', 'rao',
                                          'ban', 'pan', 'man', 'fan', 'dan', 'tan', 'nan', 'lan', 'gan', 'kan', 'han', 'zan', 'can', 'san',
                                          'zhan', 'chan', 'shan', 'ran',
                                          'bang', 'pang', 'mang', 'fang', 'dang', 'tang', 'nang', 'lang', 'gang', 'kang', 'hang', 'zang', 'cang', 'sang',
                                          'zhang', 'chang', 'shang', 'rang',
                                          'bia', 'pia', 'mia', 'dia', 'nia', 'lia', 'jia', 'qia', 'xia',
                                          'bie', 'pie', 'mie', 'die', 'tie', 'nie', 'lie', 'jie', 'qie', 'xie',
                                          'biao', 'piao', 'miao', 'diao', 'tiao', 'niao', 'liao', 'jiao', 'qiao', 'xiao',
                                          'bin', 'pin', 'min', 'nin', 'lin', 'jin', 'qin', 'xin',
                                          'bing', 'ping', 'ming', 'ding', 'ting', 'ling', 'jing', 'qing', 'ying',
                                          'wu', 'du', 'tu', 'nu', 'lu', 'gu', 'ku', 'hu', 'zu', 'cu', 'su', 'ru',
                                          'ai', 'uai', 'ao', 'iao', 'ou', 'iou',
                                          'an', 'ian', 'uan', 'van',
                                          'ang', 'iang', 'uang',
                                          'eng', 'ing', 'ying',
                                          'ong', 'iong',
                                          'er', 'n', 'ng', 'm'];
                        
                        let syllableMatched = false;
                        // Sort by length descending to match longer syllables first
                        const sortedSyllables = syllables.sort((a, b) => b.length - a.length);
                        
                        for (const syllable of sortedSyllables) {
                            if (i + syllable.length <= cleanPhrase.length && 
                                cleanPhrase.substring(i, i + syllable.length) === syllable) {
                                // Check if syllable exists in dictionary
                                if (cedict[syllable]) {
                                    const firstEntry = cedict[syllable][0];
                                    const chineseChars = firstEntry.split(' ')[0];
                                    result += chineseChars;
                                    i += syllable.length;
                                    syllableMatched = true;
                                    break;
                                }
                            }
                        }
                        
                        if (!syllableMatched) {
                            // If still no match, just move one character forward
                            result += cleanPhrase[i];
                            i++;
                        }
                    }
                }
                
                convertedPhrases.push(result);
            }
            
            convertedLines.push(convertedPhrases.join(' '));
        }
        
        return convertedLines.join('\n');
    }
    
    // Function to convert the current input
    function convertInput() {
        const inputText = pinyinInput.value.trim();
        
        if (inputText) {
            addConversionAnimation();
            
            // Simulate processing time for better UX
            setTimeout(() => {
                const chineseText = convertPinyinToChinese(inputText);
                chineseOutput.innerHTML = `<p>${chineseText}</p>`;
                removeConversionAnimation();
                addResultAnimation();
            }, 100);
        } else {
            chineseOutput.innerHTML = '<p class="placeholder">Please enter some Pinyin text</p>';
            addResultAnimation();
        }
    }
    
    // Function to add conversion animation
    function addConversionAnimation() {
        chineseOutput.classList.add('converting');
    }
    
    // Function to remove conversion animation
    function removeConversionAnimation() {
        chineseOutput.classList.remove('converting');
    }
    
    // Function to add result animation
    function addResultAnimation() {
        chineseOutput.classList.add('result-enter');
        setTimeout(() => {
            chineseOutput.classList.remove('result-enter');
        }, 400);
    }
    
    // Copy button functionality
    copyButton.addEventListener('click', function() {
        const textToCopy = chineseOutput.innerText.trim();
        if (textToCopy && !textToCopy.includes('Chinese characters will appear here') && !textToCopy.includes('Please enter some Pinyin text')) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Show visual feedback
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                    alert('Failed to copy text. Please try again.');
                });
        } else {
            alert('No text to copy');
        }
    });
    
    // Google search button functionality
    googleButton.addEventListener('click', function() {
        const textToSearch = chineseOutput.innerText.trim();
        if (textToSearch && !textToSearch.includes('Chinese characters will appear here') && !textToSearch.includes('Please enter some Pinyin text')) {
            const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(textToSearch)}`;
            window.open(googleUrl, '_blank');
        } else {
            alert('No text to search');
        }
    });
    
    // YouTube search button functionality
    youtubeButton.addEventListener('click', function() {
        const textToSearch = chineseOutput.innerText.trim();
        if (textToSearch && !textToSearch.includes('Chinese characters will appear here') && !textToSearch.includes('Please enter some Pinyin text')) {
            const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(textToSearch)}`;
            window.open(youtubeUrl, '_blank');
        } else {
            alert('No text to search');
        }
    });
    
    // Event listener for the convert button
    convertButton.addEventListener('click', convertInput);
    
    // Real-time suggestion system in output area
    let suggestionTimeout;
    pinyinInput.addEventListener('input', function() {
        clearTimeout(suggestionTimeout);
        suggestionTimeout = setTimeout(() => {
            const inputText = pinyinInput.value.trim();
            
            if (inputText) {
                const suggestions = findSyllableSuggestions(inputText);
                displaySyllableSuggestions(suggestions);
            } else {
                verticalSuggestions.classList.add('hidden');
            }
            
            // Also update the conversion in real-time
            convertInput();
        }, 200); // Debounce for better performance
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(event) {
        if (!pinyinInput.contains(event.target) && !verticalSuggestions.contains(event.target)) {
            verticalSuggestions.classList.add('hidden');
        }
    });
});