document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.getElementById('openBtn');
    const envelopeContainer = document.getElementById('envelopeContainer');
    const invitationCard = document.getElementById('invitationCard');
    const customizeBtn = document.getElementById('customizeBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const modal = document.getElementById('customizeModal');
    const closeBtn = document.querySelector('.close');
    const customizeForm = document.getElementById('customizeForm');
    const flowerFallContainer = document.getElementById('flowerFallContainer');

    // Envelope opening functionality
    openBtn.addEventListener('click', function() {
        // Hide envelope and show invitation card
        envelopeContainer.style.display = 'none';
        invitationCard.style.display = 'block';
        
        // Add some sparkle effect when envelope opens
        createSparkles();
        
        // Start butterfly animation
        startButterflyAnimation();

        // Start continuous flower falling
        startFlowerFall();

        // Launch confetti burst (library-based)
        triggerConfetti();
    });



    // Butterfly animation function
    function startButterflyAnimation() {
        // Single butterfly is already in HTML, no need to create additional ones
        console.log('Butterfly animation started');
    }

    // Flower falling animation
    let flowerIntervalId;
    let flowerSpawnTarget;
    function startFlowerFall() {
        // Use a layer inside the invitation card so petals are behind text/images
        const cardEl = document.querySelector('.invitation-card');
        if (!cardEl) return;

        let targetLayer = cardEl.querySelector('.card-flower-layer');
        if (!targetLayer) {
            targetLayer = document.createElement('div');
            targetLayer.className = 'card-flower-layer';
            const content = cardEl.querySelector('.card-content');
            if (content) {
                cardEl.insertBefore(targetLayer, content);
            } else {
                cardEl.appendChild(targetLayer);
            }
        }
        flowerSpawnTarget = targetLayer;

        // Prevent duplicate intervals
        if (flowerIntervalId) return;

        // Initial burst
        for (let i = 0; i < 12; i++) {
            setTimeout(spawnFlowerPetal, i * 120);
        }
        // Continuous spawning
        flowerIntervalId = setInterval(() => {
            const batch = Math.floor(Math.random() * 3) + 1; // 1-3
            for (let i = 0; i < batch; i++) spawnFlowerPetal();
        }, 600);
    }

    function spawnFlowerPetal() {
        const targetLayer = flowerSpawnTarget || document.querySelector('.invitation-card .card-flower-layer') || flowerFallContainer;
        if (!targetLayer) return;

        const petal = document.createElement('img');
        petal.src = 'flower.png';
        petal.alt = 'flower petal';
        petal.className = 'flower-petal';

        // Randomize size, position, drift, duration (card-relative)
        const rect = targetLayer.getBoundingClientRect();
        const size = 14 + Math.random() * 18; // 14-32 px
        const startX = Math.random() * rect.width;
        const driftX = (Math.random() * 120 - 60); // -60 to 60 px by mid, doubles by end
        const duration = 8 + Math.random() * 6; // 8-14s
        const scale = 0.8 + Math.random() * 0.6; // 0.8-1.4

        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${startX}px`;
        petal.style.setProperty('--start-x', '0px');
        petal.style.setProperty('--drift-x', `${driftX}px`);
        petal.style.setProperty('--fall-duration', `${duration}s`);
        petal.style.setProperty('--scale', scale);

        setTimeout(() => {
            targetLayer.appendChild(petal);
            petal.addEventListener('animationend', () => {
                petal.remove();
            });
        }, Math.random() * 200);
    }

    // Baby photo upload functionality
    const babyPhotoPlaceholder = document.querySelector('.baby-photo-placeholder');
    
    babyPhotoPlaceholder.addEventListener('click', function() {
        // Create a hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Clear the placeholder content
                    babyPhotoPlaceholder.innerHTML = '';
                    
                    // Create and add the image
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Baby Photo';
                    babyPhotoPlaceholder.appendChild(img);
                    
                    // Add class to style the photo
                    babyPhotoPlaceholder.classList.add('has-photo');
                    
                    // Show success message
                    showMessage('फोटो सफलतापूर्वक अपलोड गरियो!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Trigger file selection
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    });

    // Sparkle effect function
    function createSparkles() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.innerHTML = '✨';
                sparkle.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${Math.random() * window.innerHeight}px;
                    font-size: 24px;
                    pointer-events: none;
                    z-index: 1000;
                    animation: sparkleAnim 1s ease-out forwards;
                `;
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    document.body.removeChild(sparkle);
                }, 1000);
            }, i * 100);
        }
    }

    // Modal functionality (guarded if elements exist)
    if (customizeBtn && modal) {
        customizeBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    if (modal) {
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Form submission
    if (customizeForm) customizeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const babyName = document.getElementById('babyName').value;
        const parentsNames = document.getElementById('parentsNames').value;
        const eventDate = document.getElementById('eventDate').value;
        const eventTime = document.getElementById('eventTime').value;
        const venueAddress = document.getElementById('venueAddress').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const contactEmail = document.getElementById('contactEmail').value;

        // Update card content
        if (babyName) {
            document.querySelector('.baby-name').textContent = babyName;
        }
        
        if (parentsNames) {
            document.querySelector('.parents').textContent = parentsNames;
        }
        
        if (eventDate) {
            const formattedDate = formatDate(eventDate);
            document.querySelector('.info-item:nth-child(1) .info-value').textContent = formattedDate;
        }
        
        if (eventTime) {
            const formattedTime = formatTime(eventTime);
            document.querySelector('.info-item:nth-child(2) .info-value').textContent = formattedTime;
        }
        
        if (venueAddress) {
            document.querySelector('.venue-item .info-value').textContent = venueAddress;
        }
        
        if (contactNumber || contactEmail) {
            let contactText = '';
            if (contactNumber && contactEmail) {
                contactText = `${contactNumber} | ${contactEmail}`;
            } else if (contactNumber) {
                contactText = contactNumber;
            } else if (contactEmail) {
                contactText = contactEmail;
            }
            document.querySelector('.contact-details').textContent = contactText;
        }

        // Close modal
        modal.style.display = 'none';
        
        // Show success message
        showMessage('कार्ड सफलतापूर्वक अपडेट गरियो!', 'success');
    });

    // Download functionality
    if (downloadBtn) downloadBtn.addEventListener('click', function() {
        // Hide controls temporarily for screenshot
        const controls = document.querySelector('.controls');
        if (controls) controls.style.display = 'none';
        
        // Use html2canvas to capture the card
        if (typeof html2canvas !== 'undefined') {
            html2canvas(document.querySelector('.invitation-card')).then(canvas => {
                const link = document.createElement('a');
                link.download = 'annaprashan-invitation.png';
                link.href = canvas.toDataURL();
                link.click();
                
                // Show controls again
                 if (controls) controls.style.display = 'flex';
                showMessage('कार्ड डाउनलोड गरियो!', 'success');
            });
        } else {
            // Fallback: prompt user to take screenshot
             if (controls) controls.style.display = 'flex';
            showMessage('कृपया आफैले स्क्रिनशट लिनुहोस् (Ctrl+Shift+S)', 'info');
        }
    });

    // Helper functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return date.toLocaleDateString('ne-NP', options);
    }

    function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'बजे' : 'बजे';
        const displayHour = hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    function showMessage(message, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        if (type === 'success') {
            messageDiv.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
        } else if (type === 'info') {
            messageDiv.style.background = 'linear-gradient(135deg, #2196f3, #1976d2)';
        }
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);
    }

    // Add CSS animations for messages and sparkles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes sparkleAnim {
            0% { transform: scale(0) rotate(0deg); opacity: 1; }
            50% { transform: scale(1) rotate(180deg); opacity: 1; }
            100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Confetti effect: localized burst; can target an element or explicit coords
    function launchConfettiBurstFrom(anchorEl, overrideX, overrideY) {
        let startX = (typeof overrideX === 'number') ? overrideX : undefined;
        let startY = (typeof overrideY === 'number') ? overrideY : undefined;
        if (!startX || !startY) {
            if (anchorEl) {
                const rect = anchorEl.getBoundingClientRect();
                startX = rect.left + rect.width / 2;
                startY = rect.top + rect.height / 2;
            } else {
                startX = window.innerWidth / 2;
                startY = window.innerHeight / 2;
            }
        }

        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = ['#ff0000', '00cc00', '#0066ff', '#000000', '#ffffff', '#ffff1a', '#ff66cc', 'ff6600', '#00ffff', '#99ff66'];
        const pieces = 36; // smaller, softer burst
        const gravity = 1200; // px/s^2
        const drag = 0.0008; // simple air resistance

        const particles = [];
        for (let i = 0; i < pieces; i++) {
            const el = document.createElement('div');
            el.className = 'confetti';
            el.style.animation = 'none'; // disable CSS animation, we animate via JS

            const size = 6 + Math.random() * 8; // 6-14px
            const color = colors[Math.floor(Math.random() * colors.length)];
            const isCircle = Math.random() > 0.5;
            el.style.width = `${size}px`;
            el.style.height = `${size}px`;
            el.style.background = color;
            el.style.borderRadius = isCircle ? '50%' : '2px';
            // initialize at center via transform; we animate via JS
            el.style.transform = `translate3d(${startX}px, ${startY}px, 0) rotate(${Math.random()*360}deg)`;

            container.appendChild(el);

            // Launch angles mostly upward with some spread
            const angle = (-90 + (Math.random() * 60 - 30)) * (Math.PI / 180); // -120° to -60°
            const speed = 260 + Math.random() * 240; // px/s
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed; // negative (up)
            const rotation = Math.random() * 360;
            const rotationSpeed = (Math.random() * 360 - 180); // deg/s

            particles.push({ el, x: startX, y: startY, vx, vy, rotation, rotationSpeed, size });
        }

        let lastTs = performance.now();
        const endTime = lastTs + 2200; // ~2.2s animation

        function frame(now) {
            const dt = (now - lastTs) / 1000; // seconds
            lastTs = now;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                // simple physics
                p.vy += gravity * dt;
                p.vx *= (1 - drag * (dt * 1000));
                p.vy *= (1 - drag * (dt * 1000));
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.rotation += p.rotationSpeed * dt;

                p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rotation}deg)`;
                p.el.style.opacity = '1';

                if (p.y > window.innerHeight + 50) {
                    p.el.remove();
                    particles.splice(i, 1);
                }
            }

            if (now < endTime && particles.length) {
                requestAnimationFrame(frame);
            } else {
                // Cleanup remaining nodes
                particles.forEach(p => p.el.remove());
                container.remove();
            }
        }
        requestAnimationFrame(frame);
    }

    // Confetti Effect (library-based as requested)
    function triggerConfetti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#00cc00', '#0066ff', '#000000', '#ffffff', '#ffff1a', '#ff66cc', '#ff6600', '#00ffff', '#99ff66']
            });
        } else {
            // Fallback to previous custom burst from center
            launchConfettiBurstFrom(null, window.innerWidth / 2, window.innerHeight / 2);
        }
    }
});
