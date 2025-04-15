// Support Page Handler
class SupportPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupSearchFunctionality();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
    }

    setupSearchFunctionality() {
        const searchInput = document.getElementById('searchFAQ');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }

    handleSearch(query) {
        query = query.toLowerCase().trim();
        const accordionItems = document.querySelectorAll('.accordion-item');

        accordionItems.forEach(item => {
            const question = item.querySelector('.accordion-button').textContent.toLowerCase();
            const answer = item.querySelector('.accordion-body').textContent.toLowerCase();
            const isMatch = question.includes(query) || answer.includes(query);

            // Show/hide accordion items based on search
            item.style.display = query === '' || isMatch ? 'block' : 'none';

            // Expand matching items
            if (isMatch && query !== '') {
                const collapse = item.querySelector('.accordion-collapse');
                const button = item.querySelector('.accordion-button');
                if (collapse && button) {
                    collapse.classList.add('show');
                    button.classList.remove('collapsed');
                }
            }
        });

        // Show "no results" message if needed
        this.toggleNoResults(query);
    }

    toggleNoResults(query) {
        let noResultsDiv = document.getElementById('noResults');
        const visibleItems = document.querySelectorAll('.accordion-item[style="display: block"]');

        if (query && visibleItems.length === 0) {
            if (!noResultsDiv) {
                noResultsDiv = document.createElement('div');
                noResultsDiv.id = 'noResults';
                noResultsDiv.className = 'alert alert-info mt-3';
                noResultsDiv.innerHTML = `
                    <i class="fas fa-info-circle"></i>
                    No matching FAQs found. Please try different keywords or 
                    <a href="contact.html">contact us</a> for assistance.
                `;
                document.getElementById('faqAccordion').after(noResultsDiv);
            }
        } else if (noResultsDiv) {
            noResultsDiv.remove();
        }
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('.support-categories a');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offset = 100; // Adjust for fixed header
                    const targetPosition = targetSection.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active link
                    this.setActiveLink(link);
                }
            });
        });
    }

    setupActiveNavigation() {
        // Track scroll position to update active section
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    handleScroll() {
        const sections = ['faq', 'resources', 'guidelines', 'emergency'];
        const offset = 150; // Adjust this value based on your header height

        // Find the current section
        let currentSection = sections[0];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const sectionTop = section.offsetTop - offset;
                if (window.scrollY >= sectionTop) {
                    currentSection = sectionId;
                }
            }
        });

        // Update active link
        const activeLink = document.querySelector(`.support-categories a[href="#${currentSection}"]`);
        if (activeLink) {
            this.setActiveLink(activeLink);
        }
    }

    setActiveLink(activeLink) {
        // Remove active class from all links
        document.querySelectorAll('.support-categories a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current link
        activeLink.classList.add('active');
    }
}

// Initialize support page functionality
document.addEventListener('DOMContentLoaded', () => {
    window.supportPage = new SupportPage();

    // Add print functionality
    const printButtons = document.querySelectorAll('.print-guidelines');
    printButtons.forEach(button => {
        button.addEventListener('click', () => {
            window.print();
        });
    });
});

// Add responsive table functionality
document.querySelectorAll('table').forEach(table => {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-responsive';
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
});

// Add tooltip initialization
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));