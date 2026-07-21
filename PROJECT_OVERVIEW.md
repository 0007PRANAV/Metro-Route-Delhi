# MetroRoute Delhi – Project Overview

## What is MetroRoute Delhi?

MetroRoute Delhi is a mobile-friendly website that helps people quickly check the status of Delhi Metro stations during temporary disruptions (such as protests, maintenance, major events, security restrictions, festivals, or other situations that affect travel).

Instead of searching through multiple social media posts or messages, users can search for a station and instantly see its current status and the best available alternative.

---

## Goal

Build a simple, reliable, and fast platform that tells users whether they can use a particular metro station and, if not, provides suitable alternatives.

---

# Version 1 (MVP)

The first version will include:

* Search any metro station
* Open / Closed / Limited status
* Suggested alternative station(s)
* Reason for disruption (when available)
* Last updated timestamp
* Mobile-friendly design

---

# How It Works

The website uses two separate datasets.

## 1. Station Database (Permanent)

This contains information that rarely changes:

* Station name
* Metro line(s)
* Coordinates
* Interchange information

This data will be stored in `stations.json`.

---

## 2. Disruption Database (Frequently Updated)

This contains temporary information:

* Station name
* Status (Open / Closed / Limited)
* Reason
* Alternative station(s)
* Last updated timestamp

This data will be stored in `disruptions.json`.

When a user searches for a station, the website combines information from both datasets and displays the result.

---

# Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Data

* JSON files (`stations.json` and `disruptions.json`)

### Version Control

* Git + GitHub

### Hosting

* GitHub Pages or Vercel

### Future Technologies

* Leaflet.js (interactive map)
* React
* Firebase/Supabase (admin dashboard)
* Python (automation scripts and future backend)

---

# Team Structure

## Member 1 – Project Lead 

## responsibilities:

1. Define project goals and roadmap
2. Coordinate the team and track progress
3. Manage the GitHub repository
4. Design and maintain the project data structure
5. Verify data accuracy before publishing
6. Test new features before release
7. Maintain project documentation
8. Contribute to frontend and JavaScript development
9. Develop Python automation scripts as the project grows

---

## Member 2 – Frontend Developer

Responsibilities:

* Build website pages
* Responsive mobile design
* HTML and CSS implementation
* Improve user experience and interface
* Ensure accessibility and clean layout

---

## Member 3 – Frontend & JavaScript Developer

Responsibilities:

* Implement station search
* Display search results
* Fetch and process JSON data
* Build filters and dynamic website functionality
* Optimize website performance

---

## Member 4 – Data & Infrastructure Developer

Responsibilities:

* Prepare and maintain station database
* Maintain disruption database
* Deploy the website
* Configure hosting
* Integrate future map functionality
* Assist with testing and debugging

---

# Development Workflow

1. Design the feature.
2. Assign the task.
3. Develop the feature.
4. Test functionality.
5. Review changes.
6. Merge into the main project.
7. Deploy updates.

---

# Future Features

* Interactive metro map
* Hindi and English language support
* Best alternate route suggestions
* User notifications for station updates
* Admin dashboard for trusted contributors
* Offline/PWA support
* Accessibility information (lifts, ramps, etc.)
* Event-based filtering (maintenance, festival, weather, security restrictions, etc.)

---

# Long-Term Vision

MetroRoute Delhi aims to become a reusable transit information platform for Delhi rather than a website for a single event. It should help users navigate metro disruptions caused by maintenance, festivals, security restrictions, weather, public gatherings, or any other temporary service changes.

---

# Important Note

MetroRoute Delhi is an independent student-built project and is **not affiliated with or endorsed by DMRC**.

Information displayed on the platform should always be manually verified before publication. Every disruption entry should include a timestamp indicating when it was last updated so users can judge the reliability and freshness of the information.

---

# Initial Milestone (Version 1)

* Build the website interface.
* Create the station database.
* Create the disruption database.
* Implement station search.
* Display station status and suggested alternatives.
* Deploy the website publicly.
* Test on desktop and mobile devices.

Once Version 1 is stable, additional features will be added incrementally.
