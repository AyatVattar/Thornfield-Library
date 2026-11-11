/* =========================================================
   about.js — THORNFIELD LIBRARY
   FAQ accordion
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const faqItems = document.querySelectorAll(".about-faq-item");

    faqItems.forEach(function (item) {

        const button = item.querySelector(".about-faq-question");

        if (!button) return;

        button.addEventListener("click", function () {

            const isOpen = item.classList.contains("is-open");

            // Close all FAQ items
            faqItems.forEach(function (otherItem) {
                otherItem.classList.remove("is-open");

                const otherButton = otherItem.querySelector(
                    ".about-faq-question"
                );

                if (otherButton) {
                    otherButton.setAttribute("aria-expanded", "false");
                }
            });

            // Open the selected item
            if (!isOpen) {
                item.classList.add("is-open");
                button.setAttribute("aria-expanded", "true");
            }

        });

    });

});