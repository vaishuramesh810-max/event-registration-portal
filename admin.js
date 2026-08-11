/**
 * SparkFest 2026 - Administrative Control Script (admin.js)
 * Implements dashboard metrics, CRUD editing, approvals, announcements, and results publishing.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Portals & Login elements
    const adminLoginBtn = document.getElementById('nav-admin-login-btn');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const closeAdminLoginBtn = document.getElementById('close-admin-login-btn');
    const adminCredentialsForm = document.getElementById('admin-credentials-form');
    const adminPinInput = document.getElementById('admin-pin');
    const loginErrorMsg = document.getElementById('login-error-msg');
    
    // Dashboard Core
    const adminDashboardModal = document.getElementById('admin-dashboard-modal');
    const btnCloseAdminDashboard = document.getElementById('btn-close-admin-dashboard');
    const adminDashboardSidebar = document.getElementById('admin-dashboard-sidebar');
    const adminPanelsContainer = document.getElementById('admin-panels-container');
    
    // Events CRUD elements
    const dbEventsListBody = document.getElementById('db-events-list-body');
    const btnOpenCreateEventModal = document.getElementById('btn-open-create-event-modal');
    const adminEventFormModal = document.getElementById('admin-event-form-modal');
    const closeAdminEventFormModalBtn = document.getElementById('close-admin-event-form-modal-btn');
    const adminEventCrudForm = document.getElementById('admin-event-crud-form');
    const adminEventFormTitle = document.getElementById('admin-event-form-title');
    const crudEventIdInput = document.getElementById('crud-event-id');
    
    // Registrations elements
    const dbRegistrationsListBody = document.getElementById('db-registrations-list-body');
    const adminRegSearch = document.getElementById('admin-reg-search');
    const adminRegFilterEvent = document.getElementById('admin-reg-filter-event');
    
    // Winners publish elements
    const publishWinnersForm = document.getElementById('publish-winners-form');
    const winnerSelectEvent = document.getElementById('winner-select-event');
    
    // Announcements elements
    const dispatchAnnouncementForm = document.getElementById('dispatch-announcement-form');
    const announcementContentInput = document.getElementById('announcement-content-input');
    const dbAnnouncementsListBody = document.getElementById('db-announcements-list-body');

    // ==========================================
    // 1. Admin Login & Authorization Hooks
    // ==========================================
    if (adminLoginBtn && adminLoginModal) {
        adminLoginBtn.addEventListener('click', () => {
            adminLoginModal.classList.add('active');
            loginErrorMsg.style.display = 'none';
            adminPinInput.value = '';
            adminPinInput.focus();
        });
    }

    if (closeAdminLoginBtn) {
        closeAdminLoginBtn.addEventListener('click', () => {
            adminLoginModal.classList.remove('active');
        });
    }

    if (adminCredentialsForm) {
        adminCredentialsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const passcode = adminPinInput.value.trim();

            if (passcode === 'admin123') {
                // Hide login
                adminLoginModal.classList.remove('active');
                loginErrorMsg.style.display = 'none';
                
                // Show dashboard SPA
                adminDashboardModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Stop background scrolling
                
                // Initialize Dashboard Tables
                initDashboardData();
            } else {
                loginErrorMsg.style.display = 'block';
                adminPinInput.value = '';
                adminPinInput.focus();
            }
        });
    }

    if (btnCloseAdminDashboard) {
        btnCloseAdminDashboard.addEventListener('click', () => {
            adminDashboardModal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scroll
        });
    }

    // ==========================================
    // 2. SPA Tab Routing inside Dashboard
    // ==========================================
    if (adminDashboardSidebar) {
        adminDashboardSidebar.addEventListener('click', (e) => {
            const btn = e.target.closest('.sidebar-nav-btn');
            if (!btn) return;

            adminDashboardSidebar.querySelectorAll('.sidebar-nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tabName = btn.dataset.tab;
            adminPanelsContainer.querySelectorAll('.dashboard-panel').forEach(p => p.classList.remove('active'));
            
            const targetPanel = document.getElementById(`panel-${tabName}`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            // Specific tab entry actions
            if (tabName === 'overview') {
                renderOverviewMetrics();
            } else if (tabName === 'events-crud') {
                renderEventsCrudTable();
            } else if (tabName === 'registrations') {
                populateRegistrationsDropdown();
                renderRegistrationsTable();
            } else if (tabName === 'winners-publish') {
                populateWinnersEventDropdown();
            } else if (tabName === 'announcements') {
                renderAnnouncementsCrudList();
            }
        });
    }

    // ==========================================
    // 3. Database / Core Load Functions
    // ==========================================
    function initDashboardData() {
        renderOverviewMetrics();
        renderEventsCrudTable();
        populateRegistrationsDropdown();
        renderRegistrationsTable();
        populateWinnersEventDropdown();
        renderAnnouncementsCrudList();
    }

    // Tab 1: Overview Metrics
    function renderOverviewMetrics() {
        const dbStatRegistrations = document.getElementById('db-stat-registrations');
        const dbStatEvents = document.getElementById('db-stat-events');
        const dbStatApproved = document.getElementById('db-stat-approved');
        const dbStatPending = document.getElementById('db-stat-pending');

        if (!dbStatRegistrations) return;

        const events = window.SparkDb.getEvents();
        const regs = window.SparkDb.getRegistrations();
        
        const approvedCount = regs.filter(r => r.status === 'APPROVED').length;
        const pendingCount = regs.filter(r => r.status === 'PENDING APPROVAL').length;

        dbStatRegistrations.textContent = regs.length;
        dbStatEvents.textContent = events.length;
        dbStatApproved.textContent = approvedCount;
        dbStatPending.textContent = pendingCount;
    }

    // Tab 2: Manage Events CRUD Table
    function renderEventsCrudTable() {
        if (!dbEventsListBody) return;
        const events = window.SparkDb.getEvents();

        if (events.length === 0) {
            dbEventsListBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No events found. Click Add Event to create one.</td></tr>';
            return;
        }

        dbEventsListBody.innerHTML = events.map(ev => `
            <tr data-id="${ev.id}">
                <td style="font-weight:600; color:var(--text-white);">${escapeHtml(ev.name)}</td>
                <td style="text-transform: capitalize;">${escapeHtml(ev.category).replace('-', ' & ')}</td>
                <td>${ev.day} (${ev.time})</td>
                <td>${ev.venue}</td>
                <td>${ev.registeredCount || 0} / ${ev.capacity}</td>
                <td>
                    <button class="btn btn-secondary btn-sm edit-event-btn" data-id="${ev.id}" style="padding:4px 8px; font-size:0.75rem; border-radius:4px; margin-right:6px;"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn btn-primary btn-sm delete-event-btn" data-id="${ev.id}" style="padding:4px 8px; font-size:0.75rem; border-radius:4px; background:#ef4444;"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `).join('');

        // Bind Buttons
        dbEventsListBody.querySelectorAll('.edit-event-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                openEventForm(btn.dataset.id);
            });
        });

        dbEventsListBody.querySelectorAll('.delete-event-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteEvent(btn.dataset.id);
            });
        });
    }

    // Add / Edit Modal CRUD Controllers
    if (btnOpenCreateEventModal) {
        btnOpenCreateEventModal.addEventListener('click', () => {
            openEventForm();
        });
    }

    if (closeAdminEventFormModalBtn) {
        closeAdminEventFormModalBtn.addEventListener('click', () => {
            adminEventFormModal.classList.remove('active');
        });
    }

    function openEventForm(id = null) {
        adminEventCrudForm.reset();
        loginErrorMsg.style.display = 'none';

        if (id) {
            // Edit Mode
            adminEventFormTitle.textContent = "Edit Event Entry";
            crudEventIdInput.value = id;
            
            const events = window.SparkDb.getEvents();
            const ev = events.find(e => e.id === id);
            if (ev) {
                document.getElementById('crud-event-name').value = ev.name;
                document.getElementById('crud-event-category').value = ev.category;
                document.getElementById('crud-event-capacity').value = ev.capacity;
                document.getElementById('crud-event-desc').value = ev.desc;
                document.getElementById('crud-event-day').value = ev.day;
                document.getElementById('crud-event-time').value = ev.time;
                document.getElementById('crud-event-venue').value = ev.venue;
                document.getElementById('crud-event-coordinator').value = ev.coordinator || '';
            }
        } else {
            // Create Mode
            adminEventFormTitle.textContent = "Add New Event";
            crudEventIdInput.value = '';
        }

        adminEventFormModal.classList.add('active');
    }

    if (adminEventCrudForm) {
        adminEventCrudForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const id = crudEventIdInput.value;
            const name = document.getElementById('crud-event-name').value.trim();
            const category = document.getElementById('crud-event-category').value;
            const capacity = parseInt(document.getElementById('crud-event-capacity').value);
            const desc = document.getElementById('crud-event-desc').value.trim();
            const day = document.getElementById('crud-event-day').value;
            const time = document.getElementById('crud-event-time').value.trim();
            const venue = document.getElementById('crud-event-venue').value.trim();
            const coordinator = document.getElementById('crud-event-coordinator').value.trim();

            if (!name || !category || isNaN(capacity) || !desc || !day || !time || !venue) {
                alert('Please fill out all mandatory fields.');
                return;
            }

            const events = window.SparkDb.getEvents();

            if (id) {
                // Update
                const idx = events.findIndex(e => e.id === id);
                if (idx !== -1) {
                    events[idx] = {
                        ...events[idx],
                        name,
                        category,
                        capacity,
                        desc,
                        day,
                        time,
                        venue,
                        coordinator
                    };
                }
            } else {
                // Insert
                const newId = 'ev-' + Math.random().toString(36).substring(2, 7);
                events.push({
                    id: newId,
                    name,
                    category,
                    capacity,
                    desc,
                    day,
                    time,
                    venue,
                    coordinator,
                    registeredCount: 0
                });
            }

            window.SparkDb.saveEvents(events);
            adminEventFormModal.classList.remove('active');
            renderEventsCrudTable();
            renderOverviewMetrics();
        });
    }

    function deleteEvent(id) {
        if (!confirm('Are you sure you want to delete this event? All registered entries will remain in history.')) return;
        const events = window.SparkDb.getEvents();
        const filtered = events.filter(e => e.id !== id);
        window.SparkDb.saveEvents(filtered);
        renderEventsCrudTable();
        renderOverviewMetrics();
    }

    // Tab 3: Participant Registrations Panel
    if (adminRegSearch) {
        adminRegSearch.addEventListener('keyup', renderRegistrationsTable);
    }
    if (adminRegFilterEvent) {
        adminRegFilterEvent.addEventListener('change', renderRegistrationsTable);
    }

    function populateRegistrationsDropdown() {
        if (!adminRegFilterEvent) return;
        const events = window.SparkDb.getEvents();
        adminRegFilterEvent.innerHTML = '<option value="all">All Events</option>' + 
            events.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
    }

    function renderRegistrationsTable() {
        if (!dbRegistrationsListBody) return;

        const regs = window.SparkDb.getRegistrations();
        const search = adminRegSearch.value.toLowerCase().trim();
        const eventFilter = adminRegFilterEvent.value;

        const filtered = regs.filter(r => {
            const matchesEvent = eventFilter === 'all' || r.eventId === eventFilter;
            const matchesSearch = r.id.toLowerCase().includes(search) ||
                                  r.name.toLowerCase().includes(search) ||
                                  r.email.toLowerCase().includes(search) ||
                                  r.college.toLowerCase().includes(search);
            return matchesEvent && matchesSearch;
        });

        if (filtered.length === 0) {
            dbRegistrationsListBody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">No matching registrations found.</td></tr>';
            return;
        }

        dbRegistrationsListBody.innerHTML = filtered.map(r => `
            <tr>
                <td style="font-family:monospace; font-weight:700; color:var(--gold);">#${r.id}</td>
                <td>
                    <strong>${escapeHtml(r.name)}</strong><br>
                    <span style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(r.email)} | ${r.phone}</span>
                </td>
                <td style="font-size:0.85rem;">${escapeHtml(r.college)}</td>
                <td>${escapeHtml(r.eventName)}</td>
                <td>
                    <span class="badge-status ${r.status === 'APPROVED' ? 'badge-approved' : (r.status === 'REJECTED' ? 'badge-rejected' : 'badge-pending')}">
                        ${r.status}
                    </span>
                </td>
                <td>
                    ${r.status === 'PENDING APPROVAL' ? `
                        <button class="btn btn-secondary btn-sm approve-reg-btn" data-id="${r.id}" style="padding:4px 8px; font-size:0.75rem; border-radius:4px; border-color:#10b981; color:#10b981;"><i class="fa-solid fa-check"></i> Approve</button>
                        <button class="btn btn-primary btn-sm reject-reg-btn" data-id="${r.id}" style="padding:4px 8px; font-size:0.75rem; border-radius:4px; background:#ef4444;"><i class="fa-solid fa-xmark"></i> Reject</button>
                    ` : `
                        <button class="btn btn-secondary btn-sm delete-reg-btn" data-id="${r.id}" style="padding:4px 8px; font-size:0.75rem; border-radius:4px; border-color:var(--border-color); color:var(--text-muted);"><i class="fa-solid fa-trash"></i> Clear</button>
                    `}
                </td>
            </tr>
        `).join('');

        // Bind action triggers
        dbRegistrationsListBody.querySelectorAll('.approve-reg-btn').forEach(btn => {
            btn.addEventListener('click', () => updateRegistrationStatus(btn.dataset.id, 'APPROVED'));
        });

        dbRegistrationsListBody.querySelectorAll('.reject-reg-btn').forEach(btn => {
            btn.addEventListener('click', () => updateRegistrationStatus(btn.dataset.id, 'REJECTED'));
        });

        dbRegistrationsListBody.querySelectorAll('.delete-reg-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteRegistration(btn.dataset.id));
        });
    }

    function updateRegistrationStatus(id, newStatus) {
        const regs = window.SparkDb.getRegistrations();
        const idx = regs.findIndex(r => r.id === id);
        
        if (idx !== -1) {
            regs[idx].status = newStatus;
            
            // Adjust Event count if rejecting (decrement registeredCount)
            if (newStatus === 'REJECTED') {
                const events = window.SparkDb.getEvents();
                const evIdx = events.findIndex(e => e.id === regs[idx].eventId);
                if (evIdx !== -1 && events[evIdx].registeredCount > 0) {
                    events[evIdx].registeredCount--;
                    window.SparkDb.saveEvents(events);
                }
            }

            window.SparkDb.saveRegistrations(regs);
            renderRegistrationsTable();
            renderOverviewMetrics();
        }
    }

    function deleteRegistration(id) {
        if (!confirm('Remove registration entry?')) return;
        const regs = window.SparkDb.getRegistrations();
        const filtered = regs.filter(r => r.id !== id);
        window.SparkDb.saveRegistrations(filtered);
        renderRegistrationsTable();
        renderOverviewMetrics();
    }

    // Tab 4: Winners Declaration Manager
    function populateWinnersEventDropdown() {
        if (!winnerSelectEvent) return;
        const events = window.SparkDb.getEvents();
        winnerSelectEvent.innerHTML = '<option value="" disabled selected>Select event...</option>' + 
            events.map(e => `<option value="${e.id}">${e.name}</option>`).join('');
    }

    if (publishWinnersForm) {
        publishWinnersForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const eventId = winnerSelectEvent.value;
            const w1Name = document.getElementById('w1-name').value.trim();
            const w1College = document.getElementById('w1-college').value.trim();
            const w2Name = document.getElementById('w2-name').value.trim();
            const w2College = document.getElementById('w2-college').value.trim();
            const w3Name = document.getElementById('w3-name').value.trim();
            const w3College = document.getElementById('w3-college').value.trim();

            if (!eventId || !w1Name || !w1College || !w2Name || !w2College || !w3Name || !w3College) {
                alert('Please complete all placements details.');
                return;
            }

            const events = window.SparkDb.getEvents();
            const targetEvent = events.find(e => e.id === eventId);
            if (!targetEvent) return;

            const winners = window.SparkDb.getWinners();
            
            // Check if already published for this event
            const existIdx = winners.findIndex(w => w.eventId === eventId);
            const winnerEntry = {
                id: existIdx !== -1 ? winners[existIdx].id : 'win-' + Math.random().toString(36).substring(2, 7),
                eventId,
                eventName: targetEvent.name,
                gold: { name: w1Name, college: w1College },
                silver: { name: w2Name, college: w2College },
                bronze: { name: w3Name, college: w3College }
            };

            if (existIdx !== -1) {
                winners[existIdx] = winnerEntry;
            } else {
                winners.push(winnerEntry);
            }

            window.SparkDb.saveWinners(winners);
            alert('Hall of Fame winners updated successfully!');
            publishWinnersForm.reset();
        });
    }

    // Tab 5: Broadcast Live Alerts Ticker
    if (dispatchAnnouncementForm) {
        dispatchAnnouncementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = announcementContentInput.value.trim();
            if (!content) return;

            const list = window.SparkDb.getAnnouncements();
            list.unshift({
                id: 'ann-' + Math.random().toString(36).substring(2, 7),
                content,
                timestamp: new Date().toLocaleString(),
                unread: true
            });

            window.SparkDb.saveAnnouncements(list);
            announcementContentInput.value = '';
            renderAnnouncementsCrudList();
        });
    }

    function renderAnnouncementsCrudList() {
        if (!dbAnnouncementsListBody) return;
        const list = window.SparkDb.getAnnouncements();

        if (list.length === 0) {
            dbAnnouncementsListBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:var(--text-muted);">No broadcasts sent.</td></tr>';
            return;
        }

        dbAnnouncementsListBody.innerHTML = list.map(a => `
            <tr>
                <td>${a.timestamp}</td>
                <td>${escapeHtml(a.content)}</td>
                <td>
                    <button class="btn btn-primary btn-sm delete-ann-btn" data-id="${a.id}" style="padding:4px 8px; font-size:0.75rem; border-radius:4px; background:#ef4444;"><i class="fa-solid fa-trash"></i> Remove</button>
                </td>
            </tr>
        `).join('');

        dbAnnouncementsListBody.querySelectorAll('.delete-ann-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteAnnouncement(btn.dataset.id);
            });
        });
    }

    function deleteAnnouncement(id) {
        if (!confirm('Remove announcement broadcast?')) return;
        const list = window.SparkDb.getAnnouncements();
        const filtered = list.filter(a => a.id !== id);
        window.SparkDb.saveAnnouncements(filtered);
        renderAnnouncementsCrudList();
    }

    // Utility escape HTML
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
