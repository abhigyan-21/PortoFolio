# Architecture Diagram

This is a client-side React portfolio application built with Vite. The runtime is composed of a page shell, a GSAP-driven hero scene, and an interactive handheld interface backed by local JavaScript data.

## Application Architecture

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
~~~mermaid
flowchart TD
    subgraph ClientLayer["Client Layer"]
        Browser["Web Browser"]
    end
    subgraph PresentationLayer["Presentation Layer"]
        ReactApp["React Application"]
        HeroScene["GSAP Hero Scene"]
        Handheld["Handheld Portfolio UI"]
    end
    subgraph DataLayer["Local Data Layer"]
        ProjectData["Project Data Modules"]
        StaticAssets["Static Assets"]
    end
    subgraph BuildLayer["Build and Delivery"]
        Vite["Vite Dev Server and Build"]
    end

    Browser -->|"renders and interacts with"| ReactApp
    ReactApp -->|"composes"| HeroScene
    HeroScene -->|"contains"| Handheld
    Handheld -->|"reads"| ProjectData
    ReactApp -->|"loads"| StaticAssets
    Vite -->|"bundles and serves"| ReactApp
~~~

### Technology Stack Summary

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Application | React | 19.2.8 | Component-based UI rendering |
| Build | Vite | 8.2.2 | Development server and production bundling |
| Animation | GSAP | 3.15.0 | Scroll-linked scene animation and media handling |
| Language | JavaScript | ES modules | Application and data module implementation |
| Styling | CSS | Native | Responsive layout, device styling, and visual presentation |
| Quality | ESLint | 10.9.0 | Static analysis and code-quality checks |

### Data Storage & External Services

The application has no database, cache, message broker, or backend API. Portfolio content is stored in local JavaScript modules under `src/data`, while assets are bundled from the source and public directories. External links are limited to user-facing outbound destinations such as GitHub, LinkedIn, email, and demo URLs.

### Key Architectural Decisions

- Uses a single-page React composition with Vite for lightweight client-side delivery.
- Keeps portfolio content in local data modules rather than introducing a server or persistence layer.
- Uses GSAP with `ScrollTrigger` for the pinned, scroll-driven hero experience and native browser events for handheld controls.

## Component Relationships

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
~~~mermaid
flowchart LR
    subgraph cPresentation["Presentation"]
        cMain["main.jsx"]
        cApp["App"]
        cNavigation["Navigation"]
        cHeroScene["HeroScene"]
        cHeroCopy["HeroCopy"]
        cHandheld["Handheld"]
        cPortfolioUI["PortfolioUI"]
    end
    subgraph cBusiness["Portfolio Behavior"]
        cHomeScreen["HomeScreen"]
        cProjectsScreen["ProjectsScreen"]
        cSimpleScreen["SimpleScreen"]
    end
    subgraph cData["Data Modules"]
        cProjects["projects.js"]
        cCertifications["certifications.js"]
        cExperience["expirience.js"]
    end
    subgraph cInfrastructure["Infrastructure"]
        cGsap["GSAP and ScrollTrigger"]
        cBrowserEvents["Browser Events"]
        cCss["CSS Stylesheets"]
    end

    cMain -->|"mounts"| cApp
    cApp -->|"renders"| cNavigation
    cApp -->|"renders"| cHeroScene
    cHeroScene -->|"renders"| cHeroCopy
    cHeroScene -->|"renders"| cHandheld
    cHeroScene -->|"animates with"| cGsap
    cHandheld -->|"renders"| cPortfolioUI
    cHandheld -->|"dispatches controls"| cBrowserEvents
    cPortfolioUI -->|"renders"| cHomeScreen
    cPortfolioUI -->|"renders"| cProjectsScreen
    cPortfolioUI -->|"renders"| cSimpleScreen
    cProjectsScreen -->|"reads"| cProjects
    cSimpleScreen -.->|"contains current inline content"| cCertifications
    cSimpleScreen -.->|"contains current inline content"| cExperience
    cApp -.->|"loads"| cCss
    cHeroScene -.->|"uses"| cBrowserEvents
    cHandheld -.->|"receives"| cBrowserEvents
~~~

### Component Inventory

| Component | Layer | Type | Responsibility |
|---|---|---|---|
| `main.jsx` | Presentation | Entry point | Creates the React root and mounts `App` in `StrictMode` |
| `App` | Presentation | Application shell | Loads global styles and composes `Navigation` with `HeroScene` |
| `Navigation` | Presentation | Navigation component | Renders the wordmark, social links, resume link, and menu control |
| `HeroScene` | Presentation | Scene component | Owns the pinned hero scene and GSAP scroll animation lifecycle |
| `HeroCopy` | Presentation | Content component | Renders the hero identity, role, actions, and scroll cue |
| `Handheld` | Presentation | Interactive component | Renders the retro device and translates physical controls into browser events |
| `PortfolioUI` | Portfolio Behavior | State container | Manages active screen, selection, keyboard input, and console control events |
| `HomeScreen` | Portfolio Behavior | Screen component | Lists the available portfolio sections and selection state |
| `ProjectsScreen` | Portfolio Behavior | Screen component | Lists projects and renders selected project details and links |
| `SimpleScreen` | Portfolio Behavior | Screen component | Renders the static tech stack, experience, certification, about, and contact screens |
| `projects.js` | Data Modules | Data module | Provides project metadata, technologies, years, and outbound links |
| `certifications.js` | Data Modules | Data module | Stores certification data for portfolio content |
| `expirience.js` | Data Modules | Data module | Stores experience data for portfolio content |
| GSAP and ScrollTrigger | Infrastructure | Animation library | Drives responsive scroll-linked transforms and scene transitions |
| Browser Events | Infrastructure | Event channel | Carries handheld button commands from `Handheld` to `PortfolioUI` |
| CSS stylesheets | Infrastructure | Styling layer | Defines the page, scene, handheld, and responsive presentation |
