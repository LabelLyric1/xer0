const state = {
        darkMode: !0,
        currentTheme: "default",
        selectedUtility: null,
        isSearching: !1,
        developerMode: !1,
        leavingDestination: "",
        downloadDestination: "",
        downloadDestination2: "",
        particlesEnabled: !0,
        mouseX: 0,
        mouseY: 0
    },
    persistent = ["darkMode", "currentTheme", "developerMode", "particlesEnabled"];

function saveState() {
    persistent.forEach(e => {
        localStorage.setItem(e, JSON.stringify(state[e]))
    })
}
persistent.forEach(e => {
    let t = localStorage.getItem(e);
    if (null !== t) try {
        state[e] = JSON.parse(t)
    } catch {
        state[e] = t
    }
});
const tylerAlbums = {
        igor: {
            id: "easter-egg-igor",
            keywords: ["igor"],
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sUsRwKCPARS2yTH68zI3ZrvcV9caP2.png"
        },
        "flower boy": {
            id: "easter-egg-flower-boy",
            keywords: ["flower boy", "flowerboy"],
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jgjaSW1T9E65BAeBUvhvF6eKu4vYNA.png"
        },
        chromakopia: {
            id: "easter-egg-chromakopia",
            keywords: ["chromakopia"],
            image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-vA8eT4Ukh4dISUZv8Qq24gn4KVravB.png"
        }
    },
    themeToggle = document.getElementById("theme-toggle"),
    settingsBtn = document.getElementById("settings-btn"),
    versionsBtn = document.getElementById("versions-btn"),
    searchInput = document.getElementById("search-input"),
    platformFilter = document.getElementById("platform-filter"),
    categoryFilter = document.getElementById("category-filter"),
    utilityCards = document.querySelectorAll(".utility-card"),
    gridLines = document.getElementById("grid-lines"),
    lucide = window.lucide || {
        createIcons() {}
    };

function initializeEventListeners() {
    themeToggle.addEventListener("click", toggleTheme), settingsBtn.addEventListener("click", () => showModal("settings-modal")), versionsBtn.addEventListener("click", () => {
        showModal("versions-modal"), startVersionCountdown(), startVersionsModalTypewriter()
    }), searchInput.addEventListener("input", handleSearch), searchInput.addEventListener("focus", stopTypewriter), searchInput.addEventListener("blur", startTypewriterIfEmpty), platformFilter.addEventListener("change", handleFilters), categoryFilter.addEventListener("change", handleFilters), utilityCards.forEach(e => {
        e.addEventListener("click", () => {
            let t = e.dataset.utility,
                a = e.dataset.category.split(" ").includes("malware");
            handleUtilityClick(t, a)
        })
    }), document.querySelectorAll(".modal-close").forEach(e => {
        e.addEventListener("click", e => {
            let t = e.target.closest(".modal");
            hideModal(t.id)
        })
    }), document.querySelectorAll(".modal").forEach(e => {
        e.addEventListener("click", t => {
            t.target === e && hideModal(e.id)
        })
    }), document.querySelectorAll(".theme-btn").forEach(e => {
        e.addEventListener("click", () => {
            document.querySelectorAll(".theme-btn").forEach(e => e.classList.remove("theme-active")), e.classList.add("theme-active"), state.currentTheme = e.dataset.theme, saveState(), applyTheme(state.currentTheme)
        })
    }), document.getElementById("color-picker").addEventListener("change", e => {
        state.currentTheme = "custom", saveState(), applyTheme(state.currentTheme, e.target.value)
    }), document.getElementById("custom-color-btn").addEventListener("click", () => {
        let e = document.getElementById("color-picker"),
            t = document.getElementById("custom-color-btn");
        document.querySelectorAll(".theme-btn").forEach(e => e.classList.remove("theme-active")), t.classList.add("active"), state.currentTheme = "custom", saveState(), applyTheme(state.currentTheme, e.value)
    }), document.querySelectorAll(".toggle-switch").forEach(e => {
        "developer-toggle" === e.id ? state.developerMode && e.classList.toggle("toggle-active") : "particles-toggle" === e.id && state.particlesEnabled && e.classList.toggle("toggle-active"), e.addEventListener("click", () => {
            e.classList.toggle("toggle-active"), "developer-toggle" === e.id ? (state.developerMode = e.classList.contains("toggle-active"), saveState()) : "particles-toggle" === e.id && (state.particlesEnabled = e.classList.contains("toggle-active"), saveState(), state.particlesEnabled ? initParticleEffects() : clearParticles())
        })
    })
}

function initMouseTracking() {
    document.addEventListener("mousemove", e => {
        if (state.mouseX = e.clientX, state.mouseY = e.clientY, gridLines) {
            let t = state.mouseX / window.innerWidth * 20 - 10,
                a = state.mouseY / window.innerHeight * 20 - 10;
            gridLines.style.transform = `translate(${t}px, ${a}px)`
        }
    })
}

function toggleTheme(e) {
    !0 != e && (state.darkMode = !state.darkMode, saveState()), document.body.classList.toggle("dark-theme", state.darkMode), document.body.classList.toggle("light-theme", !state.darkMode);
    let t = themeToggle.querySelector("[data-lucide]"),
        a = themeToggle.querySelector("span:last-child");
    state.darkMode ? (t.setAttribute("data-lucide", "moon"), a.textContent = "Dark") : (t.setAttribute("data-lucide", "sun"), a.textContent = "Light"), void 0 !== lucide && lucide.createIcons && lucide.createIcons()
}

function applyTheme(e, t = null) {
    let a = document.documentElement,
        n = {
            default: "#3b82f6",
            blue: "#2563eb",
            purple: "#7c3aed",
            pink: "#ec4899",
            green: "#059669",
            orange: "#ea580c"
        },
        l = t || n[e] || n.default;
    a.style.setProperty("--primary-color", l), a.style.setProperty("--primary-hover", adjustBrightness(l, -20)), a.style.setProperty("--primary-light", hexToRgba(l, .1)), a.style.setProperty("--primary-border", hexToRgba(l, .3))
}

function hexToRgba(e, t) {
    let a = Number.parseInt(e.slice(1, 3), 16),
        n = Number.parseInt(e.slice(3, 5), 16),
        l = Number.parseInt(e.slice(5, 7), 16);
    return `rgba(${a}, ${n}, ${l}, ${t})`
}

function adjustBrightness(e, t) {
    let a = Number.parseInt(e.replace("#", ""), 16),
        n = Math.round(2.55 * t),
        l = (a >> 16) + n,
        i = (a >> 8 & 255) + n,
        s = (255 & a) + n;
    return "#" + (16777216 + (l < 255 ? l < 1 ? 0 : l : 255) * 65536 + (i < 255 ? i < 1 ? 0 : i : 255) * 256 + (s < 255 ? s < 1 ? 0 : s : 255)).toString(16).slice(1)
}

function showModal(e) {
    let t = document.getElementById(e);
    t && (t.classList.remove("hidden"), setTimeout(() => t.classList.add("show"), 10), document.body.style.overflow = "hidden")
}

function hideModal(e) {
    let t = document.getElementById(e);
    t && (t.classList.remove("show"), setTimeout(() => {
        t.classList.add("hidden"), document.body.style.overflow = ""
    }, 300))
}

function handleSearch(e) {
    let t = e.target.value.toLowerCase();
    state.isSearching = t.length > 0, checkForEasterEggs(t), filterUtilities()
}

function checkForEasterEggs(e) {
    Object.values(tylerAlbums).forEach(e => {
        let t = document.getElementById(e.id);
        t && t.classList.add("hidden")
    }), Object.values(tylerAlbums).forEach(t => {
        if (t.keywords.some(t => e.includes(t))) {
            let a = document.getElementById(t.id);
            a && (a.classList.remove("hidden"), setTimeout(() => {
                a.classList.add("hidden")
            }, 1e4))
        }
    })
}

function handleFilters() {
    filterUtilities()
}

function filterUtilities() {
    let e = searchInput.value.toLowerCase(),
        t = platformFilter.value,
        a = categoryFilter.value,
        n = !1;
    utilityCards.forEach(l => {
        l.dataset.utility;
        let i = l.dataset.category.split(" "),
            s = l.getElementsByClassName("utility-name")[0].textContent,
            o = l.getElementsByClassName("utility-description")[0].textContent,
            r = !e || s.toLowerCase().includes(e) || o.toLowerCase().includes(e),
            d = "all" === t || l.dataset.platform === t,
            c = !0;
        "all" !== a && (c = i.includes(a));
        let g = r && d && c;
        g && (n = !0), l.style.display = g ? "block" : "none"
    }), document.getElementsByClassName("no-results-found")[0].style = n ? "display:none;" : "display:block;"
}

function stopTypewriter() {
    state.isSearching = !0
}

function startTypewriterIfEmpty() {
    searchInput.value || (state.isSearching = !1, startSearchTypewriter())
}

function startTypewriterEffects() {
    startSearchTypewriter(), startSubtitleTypewriter()
}

function startSearchTypewriter() {
    if (state.isSearching) return;
    let e = [];
    utilityCards.forEach(t => {
        e.push(t.getElementsByClassName("utility-name")[0].textContent.trim() + "?")
    });
    let t = 0,
        a = 0,
        n = !1;
    ! function l() {
        if (state.isSearching || searchInput === document.activeElement) return;
        let i = e[t];
        n ? (searchInput.placeholder = i.substring(0, a - 1), a--) : (searchInput.placeholder = i.substring(0, a + 1), a++);
        let s = n ? 50 : 100;
        n || a !== i.length ? n && 0 === a && (n = !1, t = (t + 1) % e.length, s = 500) : (s = 2e3, n = !0), setTimeout(l, s)
    }()
}

function startSubtitleTypewriter() {
    let e = document.getElementById("security-subtitle"),
        t = "Security made simple.",
        a = 0,
        n = !1;
    e.textContent = "", setTimeout(function l() {
        if (n) {
            if (e.textContent = t.substring(0, a - 1), 0 == --a) {
                n = !1, setTimeout(l, 500);
                return
            }
            setTimeout(l, 50)
        } else a < t.length ? (e.textContent += t.charAt(a), a++, setTimeout(l, 100)) : setTimeout(() => {
            n = !0, l()
        }, 2e3)
    }, 1e3)
}

function startVersionsModalTypewriter() {
    let e = document.getElementById("modal-versions-title"),
        t = "Roblox Versions",
        a = 0;
    if (e) {
        function n() {
            a < t.length && (e.textContent += t.charAt(a), a++, setTimeout(n, 100))
        }
        e.textContent = "", setTimeout(n, 300)
    }
}

function handleUtilityClick(e, t) {
    state.selectedUtility = e, t && !state.developerMode ? showMalwareWarning() : showUtilityModal(e)
}

function showMalwareWarning() {
    document.getElementById("threat-type").textContent = "Not Specified", showModal("malware-warning-modal")
}

function showUtilityModal(e) {
    let t = `${e}-modal`;
    showModal(t)
}

function closeMalwareWarning() {
    hideModal("malware-warning-modal")
}

function continueToMalware() {
    hideModal("malware-warning-modal"), state.selectedUtility && showUtilityModal(state.selectedUtility)
}
document.addEventListener("DOMContentLoaded", () => {
    void 0 !== lucide && lucide.createIcons && lucide.createIcons(), initializeEventListeners(), startTypewriterEffects(), initParticleEffects(), addHoverEffects(), applyTheme(state.currentTheme), initMouseTracking()
}), state.darkMode || toggleTheme(!0);
const verifiedSites = ["https://www.roblox.com", "https://roblox.com", "https://rdd.latte.to", "https://www.xbox.com", "https://apps.apple.com", "https://play.google.com", "https://pulsery.net", "https://ublockorigin.com"],
    verifiedIcon = document.getElementById("verified-icon");

function showLeavingModal(e) {
    e = e || "https://example.com";
    try {
        let t = new URL(e),
            a = t.origin;
        document.getElementById("leaving-destination").textContent = a, verifiedSites.includes(a) ? verifiedIcon.classList.remove("hidden") : verifiedIcon.classList.add("hidden"), state.leavingDestination = e, showModal("leaving-modal")
    } catch (n) {
        verifiedIcon.classList.add("hidden"), document.getElementById("leaving-destination").textContent = e, showModal("leaving-modal")
    }
}

function hideLeavingModal() {
    hideModal("leaving-modal")
}

function continueLeavingModal() {
    hideModal("leaving-modal"), window.open(state.leavingDestination, "_blank")
}

function showDownloadModal(e, t) {
    state.downloadDestination = e, state.downloadDestination2 = t, showModal("download-modal")
}

function continueDownloadModal(e) {
    hideModal("download-modal"), 0 === e ? showLeavingModal(state.downloadDestination) : 1 === e && showLeavingModal(state.downloadDestination2)
}

function startVersionCountdown() {
    let e = document.getElementById("countdown"),
        t = 29,
        a = setInterval(() => {
            t--, e && (e.textContent = t), t <= 0 && (t = 29);
            let n = document.getElementById("versions-modal");
            n.classList.contains("show") || clearInterval(a)
        }, 1e3)
}

function initParticleEffects() {
    if (!state.particlesEnabled) return;
    let e = document.getElementById("particle-effects");
    if (!e) return;
    let t = setInterval(() => {
        state.particlesEnabled ? function t() {
            if (!state.particlesEnabled) return;
            let a = document.createElement("div");
            a.className = "particle", a.style.left = 100 * Math.random() + "%", a.style.top = 100 * Math.random() + "%", a.style.animationDelay = 6 * Math.random() + "s", a.style.animationDuration = 3 * Math.random() + 3 + "s", e.appendChild(a), setTimeout(() => {
                a.parentNode && a.remove()
            }, 6e3)
        }() : clearInterval(t)
    }, 500)
}

function clearParticles() {
    let e = document.getElementById("particle-effects");
    e && (e.innerHTML = "")
}

function addHoverEffects() {
    document.querySelectorAll(".utility-card, .stat-card, .platform-card").forEach(e => {
        e.addEventListener("mouseenter", function() {
            this.style.transform = "translateY(-6px) scale(1.02)", this.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }), e.addEventListener("mouseleave", function() {
            this.style.transform = "translateY(0) scale(1)"
        })
    })
}
document.addEventListener("keydown", e => {
    "Escape" === e.key && document.querySelectorAll(".modal.show").forEach(e => {
        hideModal(e.id)
    })
});
const observerOptions = {
        threshold: .1,
        rootMargin: "0px 0px -50px 0px"
    },
    observer = new IntersectionObserver(e => {
        e.forEach(e => {
            e.isIntersecting && (e.target.style.opacity = "1", e.target.style.transform = "translateY(0)")
        })
    }, observerOptions);
document.querySelectorAll(".utility-card, .stat-card, .platform-card").forEach(e => {
    e.style.opacity = "0", e.style.transform = "translateY(20px)", e.style.transition = "opacity 0.6s ease, transform 0.6s ease", observer.observe(e)
}), window.showLeavingModal = showLeavingModal, window.hideLeavingModal = hideLeavingModal, window.continueLeavingModal = continueLeavingModal, window.closeMalwareWarning = closeMalwareWarning, window.continueToMalware = continueToMalware;
