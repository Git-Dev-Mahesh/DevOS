const commands = {

    help() {
        return `
            Available Commands

            help        Show all commands
            about       About me
            projects    View my projects
            skills      My technical skills
            certificates View certificates
            contact     Contact information
            clear       Clear terminal
            `;
    },

    about() {
        return `
            Mahesh Milan

            Software Engineer
            Full Stack Developer
            Cloud Enthusiast
            `;
    },

    projects() {
        return `
            Featured Projects

            • Explore Sri Lanka
            • DevOS Portfolio
            `;
    },

    skills() {
        return `
            HTML
            CSS
            JavaScript
            Azure
            Git
            `;
    },

    certificates() {
        return `
            Microsoft Azure
            IBM Full Stack
            More coming soon...
            `;
    },

    contact() {
        return `
        Email:
        mahesh@email.com
        `;
    },

    clear() {

        return "__CLEAR__";

    }
};

