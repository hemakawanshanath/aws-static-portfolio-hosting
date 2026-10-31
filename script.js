document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('scroll-progress');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main section[id]');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeLabel = themeToggle.querySelector('.theme-label');
    const themeColor = document.querySelector('meta[name="theme-color"]');

    const projectList = document.querySelector('#work .project-list');
    const createProjectCard = (project) => {
        const card = document.createElement('article');
        card.className = 'project-row';

        const copy = document.createElement('div');
        copy.className = 'project-copy';

        if (typeof project.type === 'string' && project.type.trim()) {
            const type = document.createElement('p');
            type.className = 'project-type';
            type.textContent = project.type;
            copy.append(type);
        }

        const title = typeof project.title === 'string' ? project.title : '';
        const heading = document.createElement('h3');
        heading.textContent = title;
        copy.append(heading);

        if (typeof project.description === 'string' && project.description) {
            const description = document.createElement('p');
            description.textContent = project.description;
            copy.append(description);
        }

        const technologies = Array.isArray(project.technologies)
            ? project.technologies.filter((technology) => typeof technology === 'string' && technology)
            : [];
        if (technologies.length) {
            const tags = document.createElement('ul');
            tags.className = 'tag-list';
            tags.setAttribute('aria-label', 'Technologies used');
            technologies.forEach((technology) => {
                const tag = document.createElement('li');
                tag.textContent = technology;
                tags.append(tag);
            });
            copy.append(tags);
        }

        card.append(copy);

        [
            {
                url: project.githubUrl,
                ariaLabel: `View the ${title || 'project'} project on GitHub`
            },
            {
                url: project.liveDemoUrl,
                ariaLabel: `View the ${title || 'project'} project live demo`
            }
        ].forEach(({ url: projectUrl, ariaLabel }) => {
            if (typeof projectUrl !== 'string') return;

            let url;
            try {
                url = new URL(projectUrl);
            } catch {
                url = null;
            }
            if (url && (url.protocol === 'https:' || url.protocol === 'http:')) {
                const link = document.createElement('a');
                link.className = 'project-mark';
                link.href = url.href;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.setAttribute('aria-label', ariaLabel);
                link.textContent = '↗';
                card.append(link);
            }
        });

        return card;
    };

    const loadProjects = async () => {
        try {
            const response = await fetch('data/projects.json');
            if (!response.ok) {
                throw new Error(`Projects request failed with status ${response.status}`);
            }

            const projects = await response.json();
            if (!Array.isArray(projects)) {
                throw new Error('Projects data must be a JSON array');
            }

            projectList.replaceChildren(...projects.map(createProjectCard));
        } catch (error) {
            console.error('Unable to load projects:', error);
            const message = document.createElement('p');
            message.setAttribute('role', 'alert');
            message.textContent = 'Projects are temporarily unavailable.';
            projectList.replaceChildren(message);
        } finally {
            projectList.setAttribute('aria-busy', 'false');
        }
    };

    loadProjects();

    const applyTheme = (theme) => {
        const isLight = theme === 'light';
        document.documentElement.dataset.theme = theme;
        themeIcon.textContent = isLight ? '☾' : '☀';
        themeLabel.textContent = isLight ? 'Dark' : 'Light';
        themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
        themeToggle.setAttribute('aria-pressed', String(isLight));
        themeColor.setAttribute('content', isLight ? '#f5f7f2' : '#07120a');
    };

    applyTheme(document.documentElement.dataset.theme || 'light');

    themeToggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });

    const closeMenu = () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    const updateScrollUI = () => {
        const scrollTop = window.scrollY;
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

        progressBar.style.width = `${progress}%`;
        navbar.classList.toggle('scrolled', scrollTop > 32);

        let currentSection = '';
        sections.forEach((section) => {
            if (scrollTop >= section.offsetTop - 140) currentSection = section.id;
        });

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
        });
    };

    hamburger.addEventListener('click', () => {
        const isOpen = navLinksContainer.classList.toggle('active');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navLinksContainer.classList.contains('active')) {
            closeMenu();
            hamburger.focus();
        }
    });

    window.addEventListener('scroll', updateScrollUI, { passive: true });
    updateScrollUI();

    // A local command toy, never a shell: input is only matched against this allowlist.
    const secretTrigger = document.getElementById('secret-trigger');
    const terminal = document.getElementById('secret-terminal');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    let secretClicks = 0;
    let lastSecretClick = 0;
    let previousOverflow = '';
    const printTerminal = (text, className = '') => {
        const line = document.createElement('p');
        line.textContent = text;
        line.className = className;
        terminalOutput.append(line);
        while (terminalOutput.childElementCount > 60) terminalOutput.firstElementChild.remove();
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };
    secretTrigger.addEventListener('click', () => {
        const now = Date.now();
        secretClicks = now - lastSecretClick > 4000 ? 1 : secretClicks + 1;
        lastSecretClick = now;
        if (secretClicks < 5 || terminal.open) return;
        secretClicks = 0;
        previousOverflow = document.body.style.overflow;
        terminalOutput.replaceChildren();
        printTerminal('Secret found. Curiosity looks good on you. 🌱\nType help to explore.');
        terminalInput.value = '';
        terminal.showModal();
        document.body.style.overflow = 'hidden';
        terminalInput.focus();
    });
    terminal.addEventListener('close', () => {
        document.body.style.overflow = previousOverflow;
        secretTrigger.focus({ preventScroll: true });
    });
    document.getElementById('terminal-close').addEventListener('click', () => terminal.close());
    document.getElementById('terminal-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const raw = terminalInput.value.trim();
        if (!raw) return;
        terminalInput.value = '';
        const command = raw.toLowerCase();
        printTerminal(`❯ ${raw}`, 'terminal-echo');
        const replies = {
            help: 'Try: whoami, about, projects, coffee, tea, sudo, clear, exit',
            whoami: 'Hemaka — still learning, always curious.',
            about: 'Information Systems undergraduate at UCSC.\nExploring cloud engineering, DevOps & emerging technologies.',
            projects: 'LiteCode — a collaborative university Android project.\nFind it in the Projects section.',
            coffee: 'Error: tea preferred. 🍵',
            tea: 'Brewing…\nTea ready. Ideas loading. 🍵',
            sudo: 'Nice try. Even here, you have to do your own homework. 😄'
        };
        if (command === 'clear') terminalOutput.replaceChildren();
        else if (command === 'exit') terminal.close();
        else if (Object.prototype.hasOwnProperty.call(replies, command)) printTerminal(replies[command]);
        else printTerminal('Command not found. Try help — curiosity has a manual.');
    });

    const contactForm = document.getElementById('contact-form');
    const messageBody = document.getElementById('message-body');
    const messageCount = document.getElementById('message-count');
    const messageStatus = document.getElementById('message-status');
    const copyMessage = document.getElementById('copy-message');
    copyMessage.hidden = false;
    messageBody.addEventListener('input', () => {
        messageCount.textContent = `${messageBody.value.length} / 1200`;
    });
    const prepareMessage = () => {
        const fields = new FormData(contactForm);
        return {
            subject: 'Portfolio enquiry',
            body: `Hi Hemaka,\n\n${fields.get('body').trim()}\n\n${fields.get('sender').trim()}\nReply to: ${fields.get('email').trim()}`
        };
    };
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!contactForm.reportValidity()) return;
        const { subject, body } = prepareMessage();
        window.location.href = `mailto:hemaka.amh@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        messageStatus.textContent = 'Your email app should open with a draft. Review it and press Send there. If it does not open, copy your message and email me directly.';
    });
    copyMessage.addEventListener('click', async () => {
        if (!contactForm.reportValidity()) return;
        const { subject, body } = prepareMessage();
        try {
            await navigator.clipboard.writeText(`To: hemaka.amh@gmail.com\nSubject: ${subject}\n\n${body}`);
            messageStatus.textContent = 'Message copied. Paste it into an email to hemaka.amh@gmail.com when you’re ready to send.';
        } catch {
            messageStatus.textContent = 'Copy is unavailable in this browser. You can select your message and copy it manually, or use Open email draft.';
        }
    });
});
