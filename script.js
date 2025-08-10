document.addEventListener('DOMContentLoaded', () => {

    // --- Dinamik Header (Tüm sayfalarda çalışır) ---
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobil Menü (Tüm sayfalarda çalışır) ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = mobileNav.classList.toggle('is-active');
            hamburger.innerHTML = isActive ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
            lucide.createIcons();
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }
    
    // --- HİZMETLER KARUSELİ (Sadece index.html'de çalışır) ---
    const hizmetlerCarousel = document.querySelector('.hizmetler-carousel');
    if (hizmetlerCarousel) {
        const cards = hizmetlerCarousel.querySelectorAll('.service-card');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        const totalCards = cards.length;
        let currentIndex = 0;

        function updateCarousel() {
            cards.forEach((card, index) => {
                card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');
                let newIndex = index - currentIndex;
                
                if (newIndex < -Math.floor(totalCards / 2)) { newIndex += totalCards; }
                if (newIndex > Math.floor(totalCards / 2)) { newIndex -= totalCards; }

                switch (newIndex) {
                    case 0: card.classList.add('active'); break;
                    case 1: card.classList.add('next'); break;
                    case -1: card.classList.add('prev'); break;
                    case 2: card.classList.add('far-next'); break;
                    case -2: card.classList.add('far-prev'); break;
                    default: card.classList.add('hidden'); break;
                }
            });
        }

        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalCards;
                updateCarousel();
            });
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateCarousel();
            });
        }
        updateCarousel();
    }

    // --- Scroll Animasyonları (Statik sayfalarda çalışır) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal-up, .scale-in').forEach(el => observer.observe(el));


    // === SOHBET UYGULAMASI MANTIĞI (Sadece ogwyn.html'de çalışır) ===
    if (document.body.classList.contains('chat-app-body')) {
        const chatStartScreen = document.getElementById('chat-start-screen');
        const chatConversationArea = document.getElementById('chat-conversation-area');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const suggestionCards = document.querySelectorAll('.suggestion-card');
        const newChatBtn = document.querySelector('.new-chat-btn');
        const recentChatsList = document.getElementById('recent-chats-list');

        let chats = JSON.parse(localStorage.getItem('ogwyn_chats')) || [];
        let currentChatId = null;
        
        // Textarea yüksekliğini içeriğe göre ayarla
        chatInput.addEventListener('input', () => {
            chatInput.style.height = 'auto';
            chatInput.style.height = (chatInput.scrollHeight) + 'px';
        });

        const startChatScreen = () => {
            chatStartScreen.classList.remove('hidden');
            chatConversationArea.classList.add('hidden');
            chatConversationArea.innerHTML = ''; // Mesajları temizle
        };
        
        const startConversationScreen = () => {
            chatStartScreen.classList.add('hidden');
            chatConversationArea.classList.remove('hidden');
        };

        const sendMessage = async () => {
            const userMessage = chatInput.value.trim();
            if (userMessage === '') return;

            startConversationScreen();
            
            let isNewChat = currentChatId === null;
            if (isNewChat) {
                currentChatId = Date.now().toString();
                const newChat = {
                    id: currentChatId,
                    title: userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : ''),
                    messages: []
                };
                chats.unshift(newChat); // Yeni sohbeti en başa ekle
            }

            const currentChat = chats.find(chat => chat.id === currentChatId);
            currentChat.messages.push({ sender: 'user', content: userMessage });

            displayMessage(userMessage, 'user');
            chatInput.value = '';
            chatInput.style.height = 'auto';
            sendBtn.disabled = true;

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage }),
                });

                if (!response.ok) throw new Error('API isteği başarısız oldu');
                
                const data = await response.json();
                currentChat.messages.push({ sender: 'ai', content: data.reply });
                displayMessage(data.reply, 'ai');

            } catch (error) {
                console.error('Fetch error:', error);
                const errorMessage = 'Üzgünüm, bir sorun oluştu. Lütfen daha sonra tekrar deneyin.';
                currentChat.messages.push({ sender: 'ai', content: errorMessage });
                displayMessage(errorMessage, 'ai');
            } finally {
                localStorage.setItem('ogwyn_chats', JSON.stringify(chats));
                if (isNewChat) loadRecentChats(); // Sadece yeni sohbette listeyi yenile
                sendBtn.disabled = false;
                chatInput.focus();
            }
        };

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        suggestionCards.forEach(card => {
            card.addEventListener('click', () => {
                const promptText = card.querySelector('h4').textContent;
                chatInput.value = promptText;
                sendMessage();
            });
        });

        function displayMessage(message, sender) {
            const messageWrapper = document.createElement('div');
            messageWrapper.className = 'message-wrapper';

            const messageHeader = document.createElement('div');
            messageHeader.className = 'message-header';

            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';

            if (sender === 'user') {
                messageHeader.innerHTML = `<span>Siz</span>`;
                messageContent.innerText = message;
            } else {
                messageHeader.innerHTML = `<img src="images/logo.svg" alt="Ogwyn AI"><span>Ogwyn AI</span>`;
                messageContent.innerHTML = marked.parse(message);
            }
            
            messageWrapper.appendChild(messageHeader);
            messageWrapper.appendChild(messageContent);
            chatConversationArea.appendChild(messageWrapper);
            chatConversationArea.scrollTop = chatConversationArea.scrollHeight;
        }

        function loadRecentChats() {
            recentChatsList.innerHTML = '';
            chats.forEach(chat => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = chat.title;
                a.dataset.chatId = chat.id;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadChat(chat.id);
                });
                li.appendChild(a);
                recentChatsList.appendChild(li);
            });
        }

        function loadChat(chatId) {
            const chat = chats.find(c => c.id === chatId);
            if (!chat) return;

            currentChatId = chatId;
            startConversationScreen();
            chatConversationArea.innerHTML = '';
            chat.messages.forEach(msg => {
                displayMessage(msg.content, msg.sender);
            });
        }

        newChatBtn.addEventListener('click', () => {
            currentChatId = null;
            startChatScreen();
        });

        // Sayfa ilk yüklendiğinde geçmiş sohbetleri yükle
        loadRecentChats();
    }

    // Lucide ikonlarını oluştur
    lucide.createIcons();
});
