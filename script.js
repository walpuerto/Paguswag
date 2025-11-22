// Sample project data
const projectsData = [
    {
        id: 1,
        name: "Cebu-Cordova Link Expressway Phase 2",
        department: "Public Works",
        status: "In Progress",
        progress: 75,
        budget: 15000000000,
        startDate: "2023-01-15",
        expectedCompletion: "2024-12-30",
        description: "Extension of the main expressway connecting Cebu and Cordova"
    },
    {
        id: 2,
        name: "Provincial Hospital Modernization",
        department: "Health",
        status: "In Progress",
        progress: 60,
        budget: 2500000000,
        startDate: "2023-03-01",
        expectedCompletion: "2024-08-15",
        description: "Upgrading medical equipment and facilities"
    },
    {
        id: 3,
        name: "Rural School Infrastructure Development",
        department: "Education",
        status: "Planning",
        progress: 25,
        budget: 800000000,
        startDate: "2024-01-01",
        expectedCompletion: "2025-06-30",
        description: "Building and renovating schools in rural areas"
    },
    {
        id: 4,
        name: "Senior Citizens Center Construction",
        department: "Social Services",
        status: "Completed",
        progress: 100,
        budget: 150000000,
        startDate: "2022-08-01",
        expectedCompletion: "2023-11-30",
        description: "New facility for senior citizen services and activities"
    },
    {
        id: 5,
        name: "Agricultural Irrigation System Upgrade",
        department: "Agriculture",
        status: "In Progress",
        progress: 45,
        budget: 1200000000,
        startDate: "2023-05-15",
        expectedCompletion: "2024-10-30",
        description: "Modernizing irrigation systems for better crop yield"
    },
    {
        id: 6,
        name: "Coastal Road Rehabilitation",
        department: "Public Works",
        status: "On Hold",
        progress: 30,
        budget: 3500000000,
        startDate: "2023-02-01",
        expectedCompletion: "2025-03-31",
        description: "Repairing and widening coastal roads"
    },
    {
        id: 7,
        name: "Digital Health Records System",
        department: "Health",
        status: "In Progress",
        progress: 80,
        budget: 300000000,
        startDate: "2023-06-01",
        expectedCompletion: "2024-04-30",
        description: "Implementing electronic health records across all health centers"
    },
    {
        id: 8,
        name: "Youth Sports Complex",
        department: "Social Services",
        status: "Planning",
        progress: 15,
        budget: 600000000,
        startDate: "2024-02-01",
        expectedCompletion: "2025-12-31",
        description: "Multi-sport facility for youth development programs"
    }
];

// Global variables
let filteredProjects = [...projectsData];
let currentSort = { column: null, direction: 'asc' };

// DOM Elements
const projectsTableBody = document.getElementById('projectsTableBody');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');
const departmentFilter = document.getElementById('departmentFilter');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderProjects();
    updateStatistics();
    setupEventListeners();
    
    // Add fade-in animation to main content
    document.querySelector('.main-content').classList.add('fade-in');
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Filter functionality
    statusFilter.addEventListener('change', handleFilter);
    departmentFilter.addEventListener('change', handleFilter);
    
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}

// Render projects table
function renderProjects() {
    if (filteredProjects.length === 0) {
        projectsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <h3>No projects found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </td>
            </tr>
        `;
        return;
    }
    
    projectsTableBody.innerHTML = filteredProjects.map(project => `
        <tr>
            <td>
                <strong>${project.name}</strong>
                <br>
                <small style="color: #666;">${project.description}</small>
            </td>
            <td>${project.department}</td>
            <td>
                <span class="status-badge status-${project.status.toLowerCase().replace(' ', '-')}">
                    ${project.status}
                </span>
            </td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${project.progress}%"></div>
                </div>
                <div class="progress-text">${project.progress}%</div>
            </td>
            <td>${formatCurrency(project.budget)}</td>
            <td>${formatDate(project.startDate)}</td>
            <td>${formatDate(project.expectedCompletion)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary" onclick="viewProject(${project.id})">View</button>
                    <button class="btn btn-secondary" onclick="editProject(${project.id})">Edit</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    applyFilters();
}

// Filter functionality
function handleFilter() {
    applyFilters();
}

// Apply all filters
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const statusFilterValue = statusFilter.value;
    const departmentFilterValue = departmentFilter.value;
    
    filteredProjects = projectsData.filter(project => {
        const matchesSearch = !searchTerm || 
            project.name.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.department.toLowerCase().includes(searchTerm);
            
        const matchesStatus = !statusFilterValue || project.status === statusFilterValue;
        const matchesDepartment = !departmentFilterValue || project.department === departmentFilterValue;
        
        return matchesSearch && matchesStatus && matchesDepartment;
    });
    
    renderProjects();
    updateStatistics();
}

// Update statistics
function updateStatistics() {
    const totalProjects = projectsData.length;
    const inProgressProjects = projectsData.filter(p => p.status === 'In Progress').length;
    const completedProjects = projectsData.filter(p => p.status === 'Completed').length;
    const totalBudget = projectsData.reduce((sum, project) => sum + project.budget, 0);
    
    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('inProgressProjects').textContent = inProgressProjects;
    document.getElementById('completedProjects').textContent = completedProjects;
    document.getElementById('totalBudget').textContent = formatCurrency(totalBudget);
}

// Mobile menu toggle
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    hamburger.classList.toggle('active');
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Project action functions (placeholders for future implementation)
function viewProject(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    alert(`Viewing project: ${project.name}\n\nThis would typically open a detailed project view.`);
}

function editProject(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    alert(`Editing project: ${project.name}\n\nThis would typically open an edit form.`);
}

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for better UX
function showLoading() {
    projectsTableBody.innerHTML = `
        <tr>
            <td colspan="8" class="loading">
                <p>Loading projects...</p>
            </td>
        </tr>
    `;
}

// Enhanced mobile menu animation
hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    
    // Animate hamburger lines
    const spans = this.querySelectorAll('span');
    if (this.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
    
    // Ctrl/Cmd + K focuses search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// Add search shortcut hint
searchInput.setAttribute('title', 'Press Ctrl+K to focus search');