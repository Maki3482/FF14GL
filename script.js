const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  animateProgressBars();
  hydrateChartItems();
  setupFaq();
  setupForm();
});

function setupNavigation() {
  const header = qs(".site-header");
  const toggle = qs(".nav-toggle");
  const navLinks = qsa(".site-nav a");

  if (!header || !toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

  navLinks.forEach((link) =>
    link.addEventListener("click", () => {
      header.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

function animateProgressBars() {
  const bars = qsa(".progress-bar");
  if (!bars.length) return;

  const runAnimation = () => {
    bars.forEach((bar) => {
      const value = parseInt(bar.dataset.value || "0", 10);
      const sanitized = Math.max(0, Math.min(100, value));
      bar.style.setProperty("--fill", `linear-gradient(135deg, #36d1dc, #5b86e5)`);
      bar.style.setProperty("--fill-shadow", `0 8px 24px rgba(86, 204, 242, 0.35)`);
      bar.classList.add("ready");
      bar.style.setProperty("--width", sanitized + "%");
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(bars[0]);
  } else {
    runAnimation();
  }
}

function hydrateChartItems() {
  qsa(".chart__item").forEach((item) => {
    const value = Number(item.dataset.value || 0);
    const scale = Math.max(0, Math.min(100, value)) / 100;
    const accent = item.dataset.label === "失误率" ? "255, 122, 122" : "86, 204, 242";
    item.style.setProperty(
      "--bar-gradient",
      `linear-gradient(90deg, rgba(${accent}, 0.2), rgba(${accent}, 0.75))`
    );
    const indicator = document.createElement("span");
    indicator.className = "chart__indicator";
    indicator.style.width = `${Math.max(12, scale * 100)}%`;
    item.appendChild(indicator);
  });
}

function setupFaq() {
  qsa(".faq__item").forEach((item) => {
    const button = qs(".faq__toggle", item);
    if (!button) return;
    button.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      button.textContent = isOpen ? "收起" : "展开";
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

function setupForm() {
  const form = qs(".cta__form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = qs("input[type='email']", form);
    const teamSize = qs("select", form);
    const goal = qs("textarea", form);

    const summary = [
      email?.value ? `联系方式：${email.value}` : "",
      teamSize?.value ? `团队规模：${teamSize.value}` : "",
      goal?.value ? `近期目标：${goal.value}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    alert(
      summary
        ? `已收到预约信息：\n${summary}\n\n我们的支援官会在 24 小时内联系你。`
        : "已收到预约信息，我们的支援官会在 24 小时内联系你。"
    );

    form.reset();
  });
}
