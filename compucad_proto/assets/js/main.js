import { Scroll3DPerspective } from './scroll3DPerspective.mjs';

const titleEl = document.querySelector('div.site_title'),
    offset = titleEl.getBoundingClientRect().height;

new Scroll3DPerspective(
    document.querySelector('div.three_d_context'),
    80,
    50,
    offset,
    () => {
        if (!titleEl.classList.contains('sticky')) {
            titleEl.classList.add('sticky');
        }
    },
    () => {
        if (titleEl.classList.contains('sticky')) {
            titleEl.classList.remove('sticky');
        }
    });

