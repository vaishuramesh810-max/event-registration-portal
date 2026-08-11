/**
 * SparkFest 2026 - Client Application Script (app.js)
 * Implements interactive front-facing features and state coordination.
 */

// ==========================================
// 1. SparkDb - Local Storage Database Manager
// ==========================================
window.SparkDb = {
    keys: {
        events: 'sf_events',
        registrations: 'sf_registrations',
        announcements: 'sf_announcements',
        winners: 'sf_winners'
    },

    init() {
        if (!localStorage.getItem(this.keys.events)) {
            localStorage.setItem(this.keys.events, JSON.stringify([
                {
                    id: "ev-solo-dance",
                    name: "Street Dance Solo",
                    category: "music-dance",
                    capacity: 30,
                    desc: "Showcase your individual style, locking, popping, hip-hop, or contemporary. Time limit: 3 minutes. Bring your track on a USB drive.",
                    day: "Day 1",
                    time: "10:00 AM - 12:00 PM",
                    venue: "Main Arena",
                    coordinator: "Alice (+1 555-1234)",
                    registeredCount: 3
                },
                {
                    id: "ev-battle-bands",
                    name: "Battle of Bands",
                    category: "music-dance",
                    capacity: 10,
                    desc: "A battle for the ultimate band title! Bring your original songs or cover hits. Time limit: 15 minutes. Drum kit is provided.",
                    day: "Day 2",
                    time: "2:00 PM - 5:00 PM",
                    venue: "Open Air Theater",
                    coordinator: "Bob (+1 555-5678)",
                    registeredCount: 2
                },
                {
                    id: "ev-canvas-painting",
                    name: "Canvas Painting",
                    category: "fine-arts",
                    capacity: 40,
                    desc: "Create magic on canvas! Theme will be announced on the spot. Canvas and basic acrylic paints are provided.",
                    day: "Day 1",
                    time: "11:00 AM - 1:00 PM",
                    venue: "Art Studio",
                    coordinator: "Charlie (+1 555-9012)",
                    registeredCount: 4
                },
                {
                    id: "ev-street-play",
                    name: "Street Play (Nukkad Natak)",
                    category: "theater-drama",
                    capacity: 15,
                    desc: "Make an impact with street theater! Perform plays based on social themes. Maximum team size: 12. No microphones allowed.",
                    day: "Day 2",
                    time: "10:00 AM - 1:00 PM",
                    venue: "College Quadrangle",
                    coordinator: "David (+1 555-3456)",
                    registeredCount: 1
                },
                {
                    id: "ev-debate",
                    name: "Debate Competition",
                    category: "literary",
                    capacity: 24,
                    desc: "Engage in intellectual warfare! Topics will cover technology, society, and ethics. Format: Parliamentary debate.",
                    day: "Day 3",
                    time: "11:00 AM - 1:30 PM",
                    venue: "Seminar Hall 1",
                    coordinator: "Emma (+1 555-7890)",
                    registeredCount: 0
                },
                {
                    id: "ev-hackfest",
                    name: "Hackfest 2026",
                    category: "gaming-coding",
                    capacity: 50,
                    desc: "24-hour coding sprint. Design, develop, and present a working prototype solving modern environmental challenges.",
                    day: "Day 1",
                    time: "09:00 AM onwards",
                    venue: "Lab 3, Tech Block",
                    coordinator: "Frank (+1 555-2345)",
                    registeredCount: 5
                },
                {
                    id: "ev-cosplay",
                    name: "Cosplay Walk & Fashion Show",
                    category: "fashion",
                    capacity: 20,
                    desc: "Walk the ramp in your custom designs or bring your favorite anime/gaming character to life with cosplay!",
                    day: "Day 3",
                    time: "4:00 PM - 7:00 PM",
                    venue: "Main Auditorium",
                    coordinator: "Grace (+1 555-6789)",
                    registeredCount: 2
                }
            ]));
        }

        if (!localStorage.getItem(this.keys.registrations)) {
            localStorage.setItem(this.keys.registrations, JSON.stringify([
                {
                    id: "SF-89A1B",
                    name: "John Doe",
                    email: "john.doe@techinst.edu",
                    phone: "1234567890",
                    college: "Tech Institute of Engineering",
                    category: "music-dance",
                    eventId: "ev-solo-dance",
                    eventName: "Street Dance Solo",
                    status: "APPROVED",
                    createdAt: new Date().toISOString()
                },
                {
                    id: "SF-34B7C",
                    name: "Jane Smith",
                    email: "janesmith@artscollege.org",
                    phone: "9876543210",
                    college: "Arts & Humanities College",
                    category: "fine-arts",
                    eventId: "ev-canvas-painting",
                    eventName: "Canvas Painting",
                    status: "PENDING APPROVAL",
                    createdAt: new Date().toISOString()
                },
                {
                    id: "SF-56C9D",
                    name: "Alex Johnson",
                    email: "alexj@coders.edu",
                    phone: "5551234567",
                    college: "State Tech University",
                    category: "gaming-coding",
                    eventId: "ev-hackfest",
                    eventName: "Hackfest 2026",
                    status: "APPROVED",
                    createdAt: new Date().toISOString()
                }
            ]));
        }

        if (!localStorage.getItem(this.keys.announcements)) {
            localStorage.setItem(this.keys.announcements, JSON.stringify([
                {
                    id: "ann-1",
                    content: "Registrations for Hackfest 2026 are closing tonight at 11:59 PM. Complete your team registrations soon!",
                    timestamp: new Date(Date.now() - 3600000).toLocaleString(),
                    unread: true
                },
                {
                    id: "ann-2",
                    content: "Street Play (Nukkad Natak) venue has been updated to College Quadrangle to support a larger crowd capacity.",
                    timestamp: new Date(Date.now() - 7200000).toLocaleString(),
                    unread: true
                },
                {
                    id: "ann-3",
                    content: "SparkFest 2026 is officially open! Explore events and generate your digital entry pass today.",
                    timestamp: new Date(Date.now() - 86400000).toLocaleString(),
                    unread: false
                }
            ]));
        }

        if (!localStorage.getItem(this.keys.winners)) {
            localStorage.setItem(this.keys.winners, JSON.stringify([
                {
                    id: "win-hackfest",
                    eventId: "ev-hackfest",
                    eventName: "Hackfest 2026",
                    gold: { name: "Team ByteSized", college: "State Tech University" },
                    silver: { name: "Code Runners", college: "National Coding Inst" },
                    bronze: { name: "Dev Divas", college: "Womens College of Science" }
                }
            ]));
        }
    },

    getData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    },

    setData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        // Trigger a custom event to notify components of changes
        window.dispatchEvent(new CustomEvent('sparkdb-update', { detail: { key, data } }));
    },

    // CRUD helpers
    getEvents() { return this.getData(this.keys.events); },
    saveEvents(events) { this.setData(this.keys.events, events); },
    
    getRegistrations() { return this.getData(this.keys.registrations); },
    saveRegistrations(regs) { this.setData(this.keys.registrations, regs); },

    getAnnouncements() { return this.getData(this.keys.announcements); },
    saveAnnouncements(ann) { this.setData(this.keys.announcements, ann); },

    getWinners() { return this.getData(this.keys.winners); },
    saveWinners(winners) { this.setData(this.keys.winners, winners); }
};

// Initialize database
window.SparkDb.init();

// ==========================================
// 2. Interactive Page Dynamics & Components
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements Cache
    const mainHeader = document.getElementById('main-header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navItems = document.querySelectorAll('.nav-item');
    const typingTextEl = document.getElementById('typing-text');
    const announcementsListView = document.getElementById('announcements-list-view');
    const eventSearchInput = document.getElementById('event-search-input');
    const categoryFilterChips = document.getElementById('category-filter-chips');
    const eventsGridView = document.getElementById('events-grid-view');
    const scheduleDayTabs = document.getElementById('schedule-day-tabs');
    const timelineScheduleView = document.getElementById('timeline-schedule-view');
    const galleryFilterChips = document.getElementById('gallery-filter-chips');
    const galleryGridView = document.getElementById('gallery-grid-view');
    const galleryLightbox = document.getElementById('gallery-lightbox');
    const lightboxImageElement = document.getElementById('lightbox-image-element');
    const lightboxCaptionText = document.getElementById('lightbox-caption-text');
    const btnCloseLightbox = document.getElementById('btn-close-lightbox');
    const eventDetailModal = document.getElementById('event-detail-modal');
    const closeEventDetailModalBtn = document.getElementById('close-event-detail-modal-btn');
    const eventDetailInjectedContent = document.getElementById('event-detail-injected-content');
    const regForm = document.getElementById('event-registration-form');
    const regCategorySelect = document.getElementById('reg-category');
    const regEventSelect = document.getElementById('reg-event');
    const ticketGeneratorModal = document.getElementById('ticket-generator-modal');
    const btnCloseTicketModal = document.getElementById('btn-close-ticket-modal');
    const btnPrintTicket = document.getElementById('btn-print-ticket');
    const faqAccordion = document.getElementById('faq-accordion-group');
    const siteContactForm = document.getElementById('site-contact-form');

    // 2.1 Header Scroll & Mobile Hamburger
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
        
        // Active Nav Highlighter
        let currentSec = 'home';
        document.querySelectorAll('section').forEach(sec => {
            const top = sec.offsetTop - 120;
            const height = sec.offsetHeight;
            if (window.scrollY >= top && window.scrollY < top + height) {
                currentSec = sec.getAttribute('id');
            }
        });
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSec}`) {
                item.classList.add('active');
            }
        });
    });

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 2.2 Particle Canvas Background Animation
    initParticles();

    // 2.3 Hero Section Typing Animation
    initTypewriter();

    // 2.4 Hero Countdown Timer
    initCountdown();

    // 2.5 Dynamic Counter Stats
    initStats();

    // 2.6 Announcements Board
    renderAnnouncements();

    // 2.7 Interactive Event Directory
    initEventBrowser();

    // 2.8 Timeline Schedule
    initTimeline();

    // 2.9 Image Gallery Desk
    initGallery();

    // 2.10 Registration Dropdowns & Ticket Generator
    initRegistrationFlow();

    // 2.11 Collapsible FAQs Accordion
    initFAQs();

    // 2.12 Contact Feedbacks
    initContactForm();

    // Re-render callback whenever local database undergoes updates
    window.addEventListener('sparkdb-update', () => {
        renderAnnouncements();
        renderEvents();
        renderTimeline();
        renderWinners();
        updateStatsCounters();
        updateRegistrationDropdown();
    });

    // Initial render of Winners (since it loads from DB)
    renderWinners();

    // ==========================================
    // Function Definitions
    // ==========================================

    // Dynamic particle field animation inside hero canvas
    function initParticles() {
        const parent = document.getElementById('hero-particles-canvas');
        if (!parent) return;
        
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        parent.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = parent.offsetWidth;
        let height = canvas.height = parent.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = parent.offsetWidth;
            height = canvas.height = parent.offsetHeight;
        });

        const particles = [];
        const particleCount = 60;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(236, 72, 153, 0.4)'
            });
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Draw subtle connecting lines
                for (let j = idx + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 100) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist/100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });

            requestAnimationFrame(animate);
        }
        animate();
    }

    // Typing effect on Hero
    function initTypewriter() {
        if (!typingTextEl) return;
        const phrases = ["Unleash Your Creativity", "Ignite Your Passion", "Register for Battle of Bands", "Coding, Music & Performing Arts"];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let delay = 100;

        function type() {
            const current = phrases[phraseIdx];
            if (isDeleting) {
                typingTextEl.textContent = current.substring(0, charIdx - 1);
                charIdx--;
                delay = 50;
            } else {
                typingTextEl.textContent = current.substring(0, charIdx + 1);
                charIdx++;
                delay = 120;
            }

            if (!isDeleting && charIdx === current.length) {
                isDeleting = true;
                delay = 2000; // Pause at full word
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                delay = 500; // Pause before typing next word
            }

            setTimeout(type, delay);
        }
        type();
    }

    // Event countdown clock
    function initCountdown() {
        const daysVal = document.getElementById('days-val');
        const hoursVal = document.getElementById('hours-val');
        const minVal = document.getElementById('min-val');
        const secVal = document.getElementById('sec-val');
        
        if (!daysVal) return;

        // Set target starts in 10 days from first page load
        let targetTime = localStorage.getItem('sf_countdown_target');
        if (!targetTime) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 10);
            targetTime = futureDate.getTime();
            localStorage.setItem('sf_countdown_target', targetTime);
        } else {
            targetTime = parseInt(targetTime);
        }

        function updateClock() {
            const now = Date.now();
            const diff = targetTime - now;

            if (diff <= 0) {
                document.getElementById('timer-display').innerHTML = '<h3 style="color: var(--secondary)">SparkFest is Live!</h3>';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            daysVal.textContent = days.toString().padStart(2, '0');
            hoursVal.textContent = hours.toString().padStart(2, '0');
            minVal.textContent = mins.toString().padStart(2, '0');
            secVal.textContent = secs.toString().padStart(2, '0');
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    // Animates count stats in Hero panel
    function initStats() {
        updateStatsCounters(true); // pass true to trigger count-up animation
    }

    function updateStatsCounters(animate = false) {
        const cEvents = document.getElementById('counter-events');
        const cParticipants = document.getElementById('counter-participants');
        const cColleges = document.getElementById('counter-colleges');
        const cPrizes = document.getElementById('counter-prizes');

        if (!cEvents) return;

        const events = window.SparkDb.getEvents();
        const regs = window.SparkDb.getRegistrations();
        const approvedRegs = regs.filter(r => r.status === 'APPROVED');
        
        const totalEvents = events.length;
        const totalParticipants = 120 + approvedRegs.length;
        
        // Compute unique colleges
        const colleges = new Set(approvedRegs.map(r => r.college.toLowerCase()));
        const totalColleges = 14 + colleges.size;
        const totalPrizes = 75000; // Worth in local currency equivalent

        if (animate) {
            animateValue(cEvents, 0, totalEvents, 1200);
            animateValue(cParticipants, 0, totalParticipants, 1200);
            animateValue(cColleges, 0, totalColleges, 1200);
            animateValue(cPrizes, 0, totalPrizes, 1500, '$', '+');
        } else {
            cEvents.textContent = totalEvents;
            cParticipants.textContent = totalParticipants;
            cColleges.textContent = totalColleges;
            cPrizes.textContent = `$${totalPrizes.toLocaleString()}+`;
        }
    }

    function animateValue(obj, start, end, duration, prefix = '', suffix = '') {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            if (prefix === '$') {
                obj.textContent = prefix + current.toLocaleString() + suffix;
            } else {
                obj.textContent = current + suffix;
            }
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Injects announcments view
    function renderAnnouncements() {
        if (!announcementsListView) return;
        const items = window.SparkDb.getAnnouncements();

        if (items.length === 0) {
            announcementsListView.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">No updates available.</div>';
            return;
        }

        announcementsListView.innerHTML = items.map(ann => `
            <div class="announcement-item ${ann.unread ? 'unread' : ''}" data-id="${ann.id}">
                <div class="announcement-icon">
                    <i class="fa-solid ${ann.unread ? 'fa-envelope-open-text' : 'fa-circle-check'}"></i>
                </div>
                <div class="announcement-body">
                    <div class="announcement-text">${escapeHtml(ann.content)}</div>
                    <span class="announcement-time">${ann.timestamp}</span>
                </div>
            </div>
        `).join('');

        // Bind clicks to read them
        announcementsListView.querySelectorAll('.announcement-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                const list = window.SparkDb.getAnnouncements();
                const idx = list.findIndex(a => a.id === id);
                if (idx !== -1 && list[idx].unread) {
                    list[idx].unread = false;
                    window.SparkDb.saveAnnouncements(list);
                }
            });
        });
    }

    // Dynamic Category Filter Chips & Event search
    let activeCategory = 'all';
    function initEventBrowser() {
        if (!categoryFilterChips || !eventsGridView) return;

        categoryFilterChips.addEventListener('click', (e) => {
            const chip = e.target.closest('.category-chip');
            if (!chip) return;

            categoryFilterChips.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeCategory = chip.dataset.category;
            renderEvents();
        });

        eventSearchInput.addEventListener('keyup', renderEvents);
        renderEvents();
    }

    function getGradientByCategory(cat) {
        const gradients = {
            'music-dance': 'linear-gradient(135deg, #6366f1, #ec4899)',
            'fine-arts': 'linear-gradient(135deg, #ec4899, #f59e0b)',
            'theater-drama': 'linear-gradient(135deg, #06b6d4, #6366f1)',
            'literary': 'linear-gradient(135deg, #10b981, #06b6d4)',
            'fashion': 'linear-gradient(135deg, #db2777, #f59e0b)',
            'gaming-coding': 'linear-gradient(135deg, #06b6d4, #10b981)'
        };
        return gradients[cat] || 'linear-gradient(135deg, #6366f1, #06b6d4)';
    }

    function getFriendlyCategoryName(cat) {
        const catMap = {
            'music-dance': 'Music & Dance',
            'fine-arts': 'Fine Arts',
            'theater-drama': 'Theater & Drama',
            'literary': 'Literary',
            'fashion': 'Fashion Show',
            'gaming-coding': 'Tech & Gaming'
        };
        return catMap[cat] || cat;
    }

    function renderEvents() {
        if (!eventsGridView) return;

        const events = window.SparkDb.getEvents();
        const search = eventSearchInput.value.toLowerCase().trim();

        const filtered = events.filter(ev => {
            const matchesCat = activeCategory === 'all' || ev.category === activeCategory;
            const matchesSearch = ev.name.toLowerCase().includes(search) || 
                                  ev.desc.toLowerCase().includes(search) || 
                                  (ev.coordinator && ev.coordinator.toLowerCase().includes(search));
            return matchesCat && matchesSearch;
        });

        if (filtered.length === 0) {
            eventsGridView.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No events matched your criteria.</div>`;
            return;
        }

        eventsGridView.innerHTML = filtered.map(ev => {
            const slotsLeft = ev.capacity - (ev.registeredCount || 0);
            return `
                <div class="event-card glass-panel" data-id="${ev.id}">
                    <div class="event-card-img" style="background: ${getGradientByCategory(ev.category)}; display: flex; align-items: center; justify-content: center; position: relative;">
                        <span class="event-category-badge">${getFriendlyCategoryName(ev.category)}</span>
                        <i class="fa-solid ${getIconByCategory(ev.category)}" style="font-size: 4rem; opacity: 0.15; color: #fff;"></i>
                    </div>
                    <div class="event-card-body">
                        <h3 class="event-card-title">${escapeHtml(ev.name)}</h3>
                        <p class="event-card-desc">${escapeHtml(ev.desc)}</p>
                        
                        <ul class="event-card-meta">
                            <li><i class="fa-solid fa-calendar"></i> ${ev.day}</li>
                            <li><i class="fa-solid fa-clock"></i> ${ev.time}</li>
                            <li><i class="fa-solid fa-location-dot"></i> ${ev.venue}</li>
                            <li><i class="fa-solid fa-user-tie"></i> ${ev.coordinator || 'Council'}</li>
                            <li><i class="fa-solid fa-chair"></i> Slots remaining: <strong>${slotsLeft > 0 ? slotsLeft : 'FULL'}</strong></li>
                        </ul>

                        <div class="event-card-actions">
                            <button class="btn btn-secondary btn-sm btn-rules-view" data-id="${ev.id}">View Rules</button>
                            <button class="btn btn-primary btn-sm btn-register-link" data-id="${ev.id}" data-cat="${ev.category}" ${slotsLeft <= 0 ? 'disabled' : ''}>
                                ${slotsLeft > 0 ? 'Register' : 'Closed'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Modal triggers
        eventsGridView.querySelectorAll('.btn-rules-view').forEach(btn => {
            btn.addEventListener('click', () => showEventDetails(btn.dataset.id));
        });

        // Fast Registration Linker
        eventsGridView.querySelectorAll('.btn-register-link').forEach(btn => {
            btn.addEventListener('click', () => {
                const eventId = btn.dataset.id;
                const category = btn.dataset.cat;
                
                // Select category in dropdown
                regCategorySelect.value = category;
                updateRegistrationDropdown();
                
                // Select event in dropdown
                regEventSelect.value = eventId;
                
                // Scroll down
                const regSection = document.getElementById('register');
                if (regSection) {
                    regSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    function getIconByCategory(cat) {
        const icons = {
            'music-dance': 'fa-music',
            'fine-arts': 'fa-palette',
            'theater-drama': 'fa-masks-theater',
            'literary': 'fa-pen-nib',
            'fashion': 'fa-shirt',
            'gaming-coding': 'fa-laptop-code'
        };
        return icons[cat] || 'fa-sparkles';
    }

    // Modal show handler
    function showEventDetails(id) {
        if (!eventDetailModal || !eventDetailInjectedContent) return;
        const events = window.SparkDb.getEvents();
        const ev = events.find(e => e.id === id);
        if (!ev) return;

        const slotsLeft = ev.capacity - (ev.registeredCount || 0);

        eventDetailInjectedContent.innerHTML = `
            <div style="background: ${getGradientByCategory(ev.category)}; height: 120px; border-radius: 12px; margin-bottom: 24px; display: flex; align-items: center; padding: 24px;">
                <span class="event-category-badge" style="position: static; margin-right: 16px;">${getFriendlyCategoryName(ev.category)}</span>
                <h2 style="margin: 0; font-size: 1.8rem; text-shadow: 0 4px 10px rgba(0,0,0,0.3);">${escapeHtml(ev.name)}</h2>
            </div>
            
            <div style="padding: 10px 0;">
                <h4 style="margin-bottom: 8px; color: var(--secondary);">Event Rules & Guidelines</h4>
                <p style="color: var(--text-primary); font-size: 0.95rem; margin-bottom: 24px; line-height: 1.6;">
                    ${escapeHtml(ev.desc)}
                </p>

                <h4 style="margin-bottom: 8px; color: var(--secondary);">Coordinators & Schedule</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                    <div class="glass-panel" style="padding: 12px; font-size: 0.85rem;">
                        <strong>Timeline:</strong><br>
                        ${ev.day} (${ev.time})
                    </div>
                    <div class="glass-panel" style="padding: 12px; font-size: 0.85rem;">
                        <strong>Venue Point:</strong><br>
                        ${ev.venue}
                    </div>
                    <div class="glass-panel" style="padding: 12px; font-size: 0.85rem;">
                        <strong>Lead Organizer:</strong><br>
                        ${ev.coordinator || 'Student Council'}
                    </div>
                    <div class="glass-panel" style="padding: 12px; font-size: 0.85rem;">
                        <strong>Slots Availability:</strong><br>
                        ${slotsLeft} / ${ev.capacity} remaining
                    </div>
                </div>

                <div style="text-align: right; margin-top: 16px;">
                    <button class="btn btn-secondary modal-cancel-trigger" style="margin-right: 12px;">Close</button>
                    <button class="btn btn-primary modal-reg-link" data-id="${ev.id}" data-cat="${ev.category}" ${slotsLeft <= 0 ? 'disabled' : ''}>
                        ${slotsLeft > 0 ? 'Register Now' : 'Slots Filled'}
                    </button>
                </div>
            </div>
        `;

        eventDetailModal.classList.add('active');

        // Close bindings
        eventDetailInjectedContent.querySelector('.modal-cancel-trigger').addEventListener('click', () => {
            eventDetailModal.classList.remove('active');
        });

        // Fast Registration Linker inside Modal
        eventDetailInjectedContent.querySelector('.modal-reg-link').addEventListener('click', () => {
            eventDetailModal.classList.remove('active');
            
            // Populate category select
            regCategorySelect.value = ev.category;
            updateRegistrationDropdown();
            
            // Populate event select
            regEventSelect.value = ev.id;
            
            // Scroll to register
            const regSection = document.getElementById('register');
            if (regSection) {
                regSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (closeEventDetailModalBtn) {
        closeEventDetailModalBtn.addEventListener('click', () => {
            eventDetailModal.classList.remove('active');
        });
    }

    // 2.8 Timeline Schedule Manager
    let activeDay = 'Day 1';
    function initTimeline() {
        if (!scheduleDayTabs || !timelineScheduleView) return;

        scheduleDayTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.schedule-tab');
            if (!tab) return;

            scheduleDayTabs.querySelectorAll('.schedule-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeDay = tab.dataset.day;
            renderTimeline();
        });

        renderTimeline();
    }

    function renderTimeline() {
        if (!timelineScheduleView) return;
        const events = window.SparkDb.getEvents();

        // Filter events of the day
        const dayEvents = events.filter(ev => ev.day === activeDay);

        // Sort by start times (roughly speaking based on name or index, let's keep array order)
        if (dayEvents.length === 0) {
            timelineScheduleView.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px;">No events scheduled for this day.</div>';
            return;
        }

        timelineScheduleView.innerHTML = dayEvents.map((ev, idx) => {
            const side = idx % 2 === 0 ? 'left' : 'right';
            
            // Compute a realistic status badge
            let statusClass = 'status-upcoming';
            let statusText = 'Upcoming';
            
            // Let's hardcode some completed ones to look like a live event
            if (ev.id === 'ev-canvas-painting' && activeDay === 'Day 1') {
                statusClass = 'status-completed';
                statusText = 'Completed';
            } else if (ev.id === 'ev-hackfest' && activeDay === 'Day 1') {
                statusClass = 'status-live';
                statusText = 'Live Now';
            }

            return `
                <div class="timeline-item ${side}">
                    <div class="timeline-content glass-panel">
                        <span class="timeline-time">${ev.time}</span>
                        <h3 class="timeline-title">${escapeHtml(ev.name)}</h3>
                        <div class="timeline-venue">
                            <i class="fa-solid fa-map-location-dot"></i> ${ev.venue}
                        </div>
                        <span class="timeline-status ${statusClass}">
                            <i class="fa-solid ${statusText === 'Live Now' ? 'fa-spinner fa-spin' : (statusText === 'Completed' ? 'fa-check-circle' : 'fa-clock')}"></i>
                            ${statusText}
                        </span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 2.9 Gallery Renderer with data URI SVG representations
    const GALLERY_ITEMS = [
        { title: "Solo Dance Ramp", tag: "performance" },
        { title: "Street Art Showcase", tag: "exhibition" },
        { title: "Opening Ceremony Crowd", tag: "crowd" },
        { title: "Rock Band Performance", tag: "performance" },
        { title: "Exhibition Galleries", tag: "exhibition" },
        { title: "Grand Arena Lightshow", tag: "crowd" },
        { title: "Theater Play (Drama)", tag: "performance" },
        { title: "Digital Drawing Hub", tag: "exhibition" }
    ];

    function initGallery() {
        if (!galleryFilterChips || !galleryGridView) return;

        let activeTag = 'all';

        galleryFilterChips.addEventListener('click', (e) => {
            const chip = e.target.closest('.category-chip');
            if (!chip) return;

            galleryFilterChips.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeTag = chip.dataset.galleryTag;
            renderGalleryItems(activeTag);
        });

        // Close Lightbox
        if (btnCloseLightbox) {
            btnCloseLightbox.addEventListener('click', () => {
                galleryLightbox.classList.remove('active');
            });
            galleryLightbox.addEventListener('click', (e) => {
                if (e.target === galleryLightbox) {
                    galleryLightbox.classList.remove('active');
                }
            });
        }

        renderGalleryItems('all');
    }

    function renderGalleryItems(tagFilter) {
        if (!galleryGridView) return;

        const filtered = GALLERY_ITEMS.filter(item => tagFilter === 'all' || item.tag === tagFilter);

        galleryGridView.innerHTML = filtered.map((item, idx) => {
            // Generate a data URI SVG representation of a placeholder image
            const svgString = `
                <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
                    <defs>
                        <linearGradient id="grad-${idx}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#07050f;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#1e1b4b;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grad-${idx})" />
                    <circle cx="200" cy="130" r="50" fill="url(#grad-${idx})" stroke="#6366f1" stroke-width="1.5" opacity="0.3"/>
                    <path d="M 120,220 L 200,140 L 280,220" fill="none" stroke="#6366f1" stroke-width="2" opacity="0.4" />
                    <text x="50%" y="240" font-family="'Outfit', sans-serif" font-weight="700" font-size="16" fill="#ffffff" text-anchor="middle" letter-spacing="1">
                        ${item.title.toUpperCase()}
                    </text>
                    <text x="50%" y="260" font-family="'Inter', sans-serif" font-size="11" fill="#9ca3af" text-anchor="middle" opacity="0.8">
                        Category: ${item.tag.toUpperCase()}
                    </text>
                </svg>
            `;
            const svgEncoded = btoa(unescape(encodeURIComponent(svgString)));
            const imgSrc = `data:image/svg+xml;base64,${svgEncoded}`;

            return `
                <div class="gallery-item" data-src="${imgSrc}" data-caption="${escapeHtml(item.title)}">
                    <img src="${imgSrc}" alt="${escapeHtml(item.title)}">
                    <div class="gallery-overlay">
                        <span class="gallery-tag">${item.tag}</span>
                        <div class="gallery-caption">${escapeHtml(item.title)}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Bind clicks for Lightbox
        galleryGridView.querySelectorAll('.gallery-item').forEach(el => {
            el.addEventListener('click', () => {
                const src = el.dataset.src;
                const caption = el.dataset.caption;
                
                lightboxImageElement.src = src;
                lightboxCaptionText.textContent = caption;
                galleryLightbox.classList.add('active');
            });
        });
    }

    // 2.10 Registration Flow
    function initRegistrationFlow() {
        if (!regCategorySelect || !regEventSelect || !regForm) return;

        regCategorySelect.addEventListener('change', updateRegistrationDropdown);
        updateRegistrationDropdown();

        // Handle Registration submits
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const college = document.getElementById('reg-college').value.trim();
            const category = regCategorySelect.value;
            const eventId = regEventSelect.value;

            if (!name || !email || !phone || !college || !category || !eventId) {
                alert('Please fill in all required fields.');
                return;
            }

            const events = window.SparkDb.getEvents();
            const eventIdx = events.findIndex(ev => ev.id === eventId);
            if (eventIdx === -1) {
                alert('Invalid Event selection.');
                return;
            }

            // Check slots remaining
            const targetEvent = events[eventIdx];
            const slotsLeft = targetEvent.capacity - (targetEvent.registeredCount || 0);
            if (slotsLeft <= 0) {
                alert('Sorry, the registration limit for this event has been reached.');
                return;
            }

            // Increment count
            targetEvent.registeredCount = (targetEvent.registeredCount || 0) + 1;
            window.SparkDb.saveEvents(events);

            // Generate Registration
            const ticketId = 'SF-' + Math.random().toString(36).substring(2, 7).toUpperCase();
            const newReg = {
                id: ticketId,
                name,
                email,
                phone,
                college,
                category,
                eventId,
                eventName: targetEvent.name,
                status: 'PENDING APPROVAL',
                createdAt: new Date().toISOString()
            };

            const regs = window.SparkDb.getRegistrations();
            regs.push(newReg);
            window.SparkDb.saveRegistrations(regs);

            // Show Ticket modal
            renderTicket(newReg);
            
            // Reset Form
            regForm.reset();
            updateRegistrationDropdown();
        });

        // Close ticket modal
        if (btnCloseTicketModal) {
            btnCloseTicketModal.addEventListener('click', () => {
                ticketGeneratorModal.classList.remove('active');
            });
        }

        // Print ticket simulation
        if (btnPrintTicket) {
            btnPrintTicket.addEventListener('click', () => {
                window.print();
            });
        }
    }

    function updateRegistrationDropdown() {
        if (!regCategorySelect || !regEventSelect) return;
        const category = regCategorySelect.value;

        if (!category) {
            regEventSelect.innerHTML = '<option value="" disabled selected>Select category first</option>';
            regEventSelect.disabled = true;
            return;
        }

        const events = window.SparkDb.getEvents();
        const filtered = events.filter(e => e.category === category);

        if (filtered.length === 0) {
            regEventSelect.innerHTML = '<option value="" disabled>No events available in this category</option>';
            regEventSelect.disabled = true;
            return;
        }

        regEventSelect.innerHTML = filtered.map(ev => {
            const slotsLeft = ev.capacity - (ev.registeredCount || 0);
            const isFull = slotsLeft <= 0;
            return `<option value="${ev.id}" ${isFull ? 'disabled' : ''}>${ev.name} ${isFull ? '(FULL)' : `(${slotsLeft} slots remaining)`}</option>`;
        }).join('');

        // Set default select if not preselected
        regEventSelect.disabled = false;
    }

    // Ticket Generator Rendering
    function renderTicket(reg) {
        if (!ticketGeneratorModal) return;

        document.getElementById('ticket-participant-name').textContent = reg.name;
        document.getElementById('ticket-id-val').textContent = '#' + reg.id;
        document.getElementById('ticket-event-name').textContent = reg.eventName;
        document.getElementById('ticket-category-name').textContent = getFriendlyCategoryName(reg.category);
        document.getElementById('ticket-college-name').textContent = reg.college;
        
        const badge = document.getElementById('ticket-status-val');
        badge.className = ''; // Reset
        badge.classList.add('badge-status');

        if (reg.status === 'APPROVED') {
            badge.classList.add('badge-approved');
            badge.textContent = 'APPROVED PASS';
        } else if (reg.status === 'REJECTED') {
            badge.classList.add('badge-rejected');
            badge.textContent = 'REJECTED';
        } else {
            badge.classList.add('badge-pending');
            badge.textContent = 'PENDING APPROVAL';
        }

        // Draw Canvas QR pattern
        const box = document.getElementById('ticket-qr-box');
        if (box) {
            box.innerHTML = '';
            const canvas = document.createElement('canvas');
            canvas.width = 68;
            canvas.height = 68;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            box.appendChild(canvas);
            
            const qrctx = canvas.getContext('2d');
            qrctx.fillStyle = '#ffffff';
            qrctx.fillRect(0, 0, 68, 68);
            
            qrctx.fillStyle = '#000000';
            // Draw dummy QR anchors
            qrctx.fillRect(2, 2, 16, 16);
            qrctx.fillStyle = '#ffffff';
            qrctx.fillRect(5, 5, 10, 10);
            qrctx.fillStyle = '#000000';
            qrctx.fillRect(7, 7, 6, 6);

            qrctx.fillRect(50, 2, 16, 16);
            qrctx.fillStyle = '#ffffff';
            qrctx.fillRect(53, 5, 10, 10);
            qrctx.fillStyle = '#000000';
            qrctx.fillRect(55, 7, 6, 6);

            qrctx.fillRect(2, 50, 16, 16);
            qrctx.fillStyle = '#ffffff';
            qrctx.fillRect(5, 53, 10, 10);
            qrctx.fillStyle = '#000000';
            qrctx.fillRect(7, 55, 6, 6);

            // Populate random noise
            for (let x = 20; x < 48; x += 4) {
                for (let y = 2; y < 66; y += 4) {
                    if (Math.random() > 0.45) {
                        qrctx.fillRect(x, y, 3, 3);
                    }
                }
            }
            for (let x = 2; x < 20; x += 4) {
                for (let y = 20; y < 48; y += 4) {
                    if (Math.random() > 0.45) {
                        qrctx.fillRect(x, y, 3, 3);
                    }
                }
            }
            for (let x = 48; x < 66; x += 4) {
                for (let y = 20; y < 66; y += 4) {
                    if (Math.random() > 0.45) {
                        qrctx.fillRect(x, y, 3, 3);
                    }
                }
            }
        }

        ticketGeneratorModal.classList.add('active');
    }

    // 2.11 Accordion FAQs
    function initFAQs() {
        if (!faqAccordion) return;

        faqAccordion.addEventListener('click', (e) => {
            const btn = e.target.closest('.faq-question');
            if (!btn) return;

            const item = btn.closest('.faq-item');
            const isActive = item.classList.contains('active');

            // Close all
            faqAccordion.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.faq-answer').style.maxHeight = '0';
            });

            if (!isActive) {
                item.classList.add('active');
                const ans = item.querySelector('.faq-answer');
                ans.style.maxHeight = ans.scrollHeight + 'px';
            }
        });
    }

    // 2.12 Contact Feedbacks
    function initContactForm() {
        if (!siteContactForm) return;

        siteContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const msg = document.getElementById('contact-msg').value;

            if (!name || !email || !msg) return;

            // Show Toast Alert
            const toast = document.createElement('div');
            toast.className = 'glass-panel';
            toast.style.position = 'fixed';
            toast.style.bottom = '30px';
            toast.style.right = '30px';
            toast.style.background = 'rgba(16, 185, 129, 0.95)';
            toast.style.border = '1px solid #10b981';
            toast.style.color = '#fff';
            toast.style.padding = '16px 24px';
            toast.style.borderRadius = '12px';
            toast.style.zIndex = '3000';
            toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${escapeHtml(name)}</strong>! Your query has been logged.`;

            document.body.appendChild(toast);
            siteContactForm.reset();

            setTimeout(() => {
                toast.style.transition = 'opacity 0.5s';
                toast.style.opacity = '0';
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        });
    }

    // Render Winners Hall of fame cards
    function renderWinners() {
        const grid = document.getElementById('winners-grid-view');
        if (!grid) return;

        const list = window.SparkDb.getWinners();

        if (list.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 20px;">Event champions will be declared soon. Stay tuned!</div>';
            return;
        }

        grid.innerHTML = list.map(win => `
            <div class="winner-card glass-panel" id="card-${win.id}">
                <div class="winner-event">${escapeHtml(win.eventName)}</div>
                <div class="winner-podium">
                    <div class="podium-spot second">
                        <div class="podium-avatar"><i class="fa-solid fa-medal" style="color: #cbd5e1;"></i></div>
                        <span class="podium-rank">2nd</span>
                        <div class="podium-name">${escapeHtml(win.silver.name)}</div>
                        <div class="podium-college">${escapeHtml(win.silver.college)}</div>
                    </div>
                    <div class="podium-spot first">
                        <div class="podium-avatar"><i class="fa-solid fa-crown" style="color: var(--gold);"></i></div>
                        <span class="podium-rank">1st</span>
                        <div class="podium-name" style="font-weight: 800; font-size: 0.95rem;">${escapeHtml(win.gold.name)}</div>
                        <div class="podium-college">${escapeHtml(win.gold.college)}</div>
                    </div>
                    <div class="podium-spot third">
                        <div class="podium-avatar"><i class="fa-solid fa-medal" style="color: #b45309;"></i></div>
                        <span class="podium-rank">3rd</span>
                        <div class="podium-name">${escapeHtml(win.bronze.name)}</div>
                        <div class="podium-college">${escapeHtml(win.bronze.college)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Utility escape html characters
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
